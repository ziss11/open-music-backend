const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { filterSongData } = require('../../utils')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class PlaylistsService {
  constructor (collaborationsService) {
    this._pool = new Pool()
    this._collaborationsService = collaborationsService
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id=$1',
      values: [id]
    }

    const result = await this._pool.query(query)
    const playlist = result.rows[0]

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    if (owner !== playlist.owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  async verifyPlaylistAccess (id, owner) {
    try {
      await this.verifyPlaylistOwner(id, owner)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }

      try {
        await this._collaborationsService.verifyCollaborator(id, owner)
      } catch {
        throw error
      }
    }
  }

  async addPlaylist (name, owner) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
      LEFT JOIN users ON users.id=playlists.owner
      LEFT JOIN collaborations ON collaborations.playlist_id=playlists.id
      WHERE playlists.owner=$1 OR collaborations.user_id=$1
      GROUP BY playlists.id,users.username`,
      values: [owner]
    }

    const result = await this._pool.query(query)
    return result.rows
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id=$1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }
  }

  async addSongToPlaylist (playlistId, songId) {
    const query = {
      text: 'UPDATE songs SET playlist_id=$1 WHERE id=$2 RETURNING id',
      values: [playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu kedalam playlist')
    }
  }

  async getSongsInPlaylist (playlistId) {
    const query = {
      text: `SELECT playlists.name, users.username, 
        songs.id, songs.title, songs.performer FROM playlists 
        LEFT JOIN users ON users.id=playlists.owner 
        LEFT JOIN songs ON songs.playlist_id=playlists.id 
        WHERE playlists.id=$1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Playlist ini belum memiliki daftar lagu')
    }

    const { name, username } = result.rows[0]

    const playlistResult = { id: playlistId, name, username }
    const songsResult = result.rows.map(filterSongData)

    return {
      playlist: playlistResult,
      songs: songsResult.length !== 1 || songsResult[0].id != null ? songsResult : []
    }
  }

  async deleteSongInPlaylist (playlistId, songId) {
    const query = {
      text: 'UPDATE songs SET playlist_id=NULL WHERE id=$1 AND playlist_id=$2 RETURNING id',
      values: [songId, playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist. Id tidak ditemukan')
    }
  }
}

module.exports = PlaylistsService
