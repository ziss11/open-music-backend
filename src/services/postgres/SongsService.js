const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const { getSpesificSongData } = require('../../utils')
const NotFoundError = require('../../exceptions/NotFoundError')
const InvariantError = require('../../exceptions/InvariantError')

class SongsService {
  constructor () {
    this._pool = new Pool()
  }

  async addSong ({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId]
    }

    const result = await this._pool.query(query)
    const successId = result.rows[0].id

    if (!successId) {
      throw new InvariantError('Song gagal ditambahkan')
    }

    return successId
  }

  async getSongs () {
    const result = await this._pool.query('SELECT * FROM songs')
    return result.rows.map(getSpesificSongData)
  }

  async getSongById (id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id=$1',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan')
    }
    return result.rows[0]
  }

  async editSongById (id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title=$1 year=$2 genre=$3 performer=$4 duration=$5 albumId=$6 WHERE id=$7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id]
    }

    const result = await this._pool.query(query)

    if (result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    }
  }

  async deleteSongById (id) {
    const query = {
      text: 'DELETE FROM songs id=$1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan')
    }
  }
}

module.exports = SongsService
