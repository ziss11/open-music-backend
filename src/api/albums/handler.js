const autoBind = require('auto-bind')

class AlbumsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postAlbumHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { name, year } = request.payload

    const albumId = await this._service.addAlbum({ name, year })
    const response = h.request({
      status: 'success',
      data: { albumId }
    })

    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    const album = await this._service.getAlbumById(id)

    return h.request({
      status: 'success',
      data: { album }
    })
  }

  async putAlbumByIdHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)

    const { id } = request.param
    const { name, year } = request.payload

    await this._service.editAlbumById(id, { name, year })

    return h.response({
      status: 'success',
      message: 'Album berhasil diperbarui'
    })
  }

  async deleteAlbumByIdHandler (request, h) {
    const { id } = request.param

    await this._service.deleteAlbumById(id)

    return h.response({
      status: 'success',
      message: 'Album berhasil dihapus'
    })
  }
}

module.exports = AlbumsHandler
