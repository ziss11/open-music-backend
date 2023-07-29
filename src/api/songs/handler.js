const autoBind = require('auto-bind')

class SongsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postSongHandler (request, h) {
    this._validator.validateSongPayload(request.payload)
    const { title, year, genre, performer, duration, albumId } = request.payload

    const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })
    const response = h.request({
      status: 'success',
      data: { songId }
    })

    response.code(201)
    return response
  }

  async getSongsHandler (request, h) {
    const songs = await this._service.getSongs()
    return h.response({
      status: 'success',
      data: {
        songs
      }
    })
  }

  async getSongByIdHandler (request, h) {
    const { id } = request.params
    const song = await this._service.getSongById(id)

    return h.request({
      status: 'success',
      data: { song }
    })
  }

  async putSongByIdHandler (request, h) {
    this._validator.validateSongPayload(request.payload)

    const { id } = request.param
    const { title, year, genre, performer, duration, albumId } = request.payload

    await this._service.editSongById(id, { title, year, genre, performer, duration, albumId })

    return h.response({
      status: 'success',
      message: 'Song berhasil diperbarui'
    })
  }

  async deleteSongByIdHandler (request, h) {
    const { id } = request.param

    await this._service.deleteSongById(id)

    return h.response({
      status: 'success',
      message: 'Song berhasil dihapus'
    })
  }
}

module.exports = SongsHandler
