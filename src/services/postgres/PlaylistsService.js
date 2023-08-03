const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { filterSongData } = require('../../utils')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async addPlaylist ({ name, owner }) {
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

  async getPlaylists () {
    const query = `SELECT playlists.id, playlists.name, users.username 
                    FROM playlists LEFT JOIN users ON users.id=playlists.owner`

    const result = await this._pool.query(query)
    return result.rows
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id=$1 RETURNING id',
      values: [id]
    }

    const result = await this._pool(query)

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }
  }

  async addSongToPlaylist ({ playlistId, songId }) {
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
        songs.id AS song_id, songs.title, songs.performer FROM playlists 
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

    const playlistResult = { playlistId, name, username }
    const songsResult = result.rows.map(filterSongData)

    return {
      album: playlistResult,
      songs: songsResult.length !== 1 || songsResult[0].id != null ? songsResult : []
    }
  }

  async deleteSongInPlaylist ({ playlistId, songId }) {
    const query = {
      text: 'UPDATE songs SET playlist_id=NULL WHERE id=$1 AND playlist_id=$2 RETURNING id',
      values: [songId, playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus lagu dari playlist')
    }
  }
}

module.exports = PlaylistsService
