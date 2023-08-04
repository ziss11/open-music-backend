const autoBind = require('auto-bind')

class AlbumsHandler {
  constructor (albumsService, storageService, validator) {
    this._albumsService = albumsService
    this._storageService = storageService
    this._validator = validator

    autoBind(this)
  }

  async postAlbumHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)

    const albumId = await this._albumsService.addAlbum(request.payload)
    const response = h.response({
      status: 'success',
      data: { albumId }
    })

    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    const { album, songs } = await this._albumsService.getAlbumById(id)

    return h.response({
      status: 'success',
      data: { album: { ...album, songs } }
    })
  }

  async putAlbumByIdHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)

    const { id } = request.params

    await this._albumsService.editAlbumById(id, request.payload)

    return h.response({
      status: 'success',
      message: 'Album berhasil diperbarui'
    })
  }

  async deleteAlbumByIdHandler (request, h) {
    const { id } = request.params

    await this._albumsService.deleteAlbumById(id)

    return h.response({
      status: 'success',
      message: 'Album berhasil dihapus'
    })
  }

  async postUploadCoverHandler (request, h) {
    const { cover } = request.payload
    this._validator.validateAlbumCoverHeaders(cover.hapi.headers)

    const { id } = request.params

    const filename = await this._storageService.writeFile(cover, cover.hapi)
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/{id}/covers/${filename}`
    await this._albumsService.addAlbumCover(id, coverUrl)

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    })

    response.code(201)
    return response
  }
}

module.exports = AlbumsHandler
