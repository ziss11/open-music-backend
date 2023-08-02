const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { filterSongData } = require('../../utils')

class AlbumsService {
  constructor () {
    this._pool = new Pool()
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
      text: `SELECT a.name, a.year, s.id, s.title, s.performer
            FROM albums a LEFT JOIN songs s ON a.id=s.album_id WHERE a.id=$1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    const { name, year } = result.rows[0]

    const albumResult = { id, name, year }
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
}

module.exports = AlbumsService
