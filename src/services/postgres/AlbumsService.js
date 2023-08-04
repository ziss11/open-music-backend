const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { filterSongData } = require('../../utils')

class AlbumsService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addAlbum ({ name, year }) {
    const id = `album-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year]
    }

    const result = await this._pool.query(query)
    const successId = result.rows[0].id

    if (!successId) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return successId
  }

  async getAlbumById (id) {
    const query = {
      text: `SELECT a.name, a.year, a.cover_url, s.id, s.title, s.performer
            FROM albums a LEFT JOIN songs s ON a.id=s.album_id WHERE a.id=$1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    const { name, year, cover_url: coverUrl } = result.rows[0]

    const albumResult = { id, name, year, coverUrl }
    const songsResult = result.rows.map(filterSongData)

    return {
      album: albumResult,
      songs: songsResult.length !== 1 || songsResult[0].id != null ? songsResult : []
    }
  }

  async editAlbumById (id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
      values: [name, year, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
    }
  }

  async addAlbumCover (id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover_url=$2 WHERE id=$1 RETURNING id',
      values: [id, coverUrl]
    }

    const result = await this._pool.query(query)
    const successId = result.rows[0].id

    if (!successId) {
      throw new InvariantError('Cover album gagal ditambahkan')
    }
  }

  async verifyAlbumLike (userId, albumId) {
    const query = {
      text: 'SELECT * FROM album_likes WHERE user_id=$1 AND album_id=$2',
      values: [userId, albumId]
    }

    const result = await this._pool.query(query)

    if (result.rowCount) {
      throw new InvariantError('Anda belum menyukai album ini')
    }
  }

  async addAlbumLike (userId, albumId) {
    const id = `like-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menyukai album')
    }

    this._cacheService.delete(`album_likes:${albumId}`)
  }

  async deleteAlbumLike (userId, albumId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE user_id=$1 AND album_id=$2 RETURNING id',
      values: [userId, albumId]
    }

    await this._pool.query(query)
    this._cacheService.delete(`album_likes:${albumId}`)
  }

  async getAlbumLikes (albumId) {
    try {
      const result = await this._cacheService.get(`album_likes:${albumId}`)
      return {
        header: 'cache',
        likes: Number(result)
      }
    } catch (error) {
      const query = {
        text: 'SELECT * FROM album_likes WHERE album_id=$1',
        values: [albumId]
      }

      const result = await this._pool.query(query)
      await this._cacheService.set(`album_likes:${albumId}`, result.rowCount)
      return { likes: result.rowCount }
    }
  }
}

module.exports = AlbumsService
