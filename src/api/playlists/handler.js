const autoBind = require('auto-bind')

class PlaylistsHandler {
  constructor (playlistsService, songsService, validator) {
    this._playlistsService = playlistsService
    this._songsService = songsService
    this._validator = validator

    autoBind(this)
  }

  async postPlaylistHandler (request, h) {
    this._validator.validatePostPlaylistPayload(request.payload)

    const { id: owner } = request.auth.credentials
    const { name } = request.payload

    const playlistId = await this._playlistsService.addPlaylist(name, owner)

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: { playlistId }
    })

    response.code(201)
    return response
  }

  async getPlaylistsHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._playlistsService.getPlaylists(credentialId)
    return h.response({
      status: 'success',
      data: { playlists }
    })
  }

  async deletePlaylistHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistOwner(id, credentialId)
    await this._playlistsService.deletePlaylistById(id)

    return h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus'
    })
  }

  async postSongToPlaylistHandler (request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload)
    const { id: credentialId } = request.auth.credentials

    const { songId } = request.payload
    await this._songsService.getSongById(songId)

    const { id: playlistId } = request.params

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._playlistsService.addSongToPlaylist(playlistId, songId)

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu kedalam playlist'
    })

    response.code(201)
    return response
  }

  async getSongsInPlaylistHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistOwner(id, credentialId)
    const { playlist, songs } = await this._playlistsService.getSongsInPlaylist(id)

    return h.response({
      status: 'success',
      data: { playlist: { ...playlist, songs } }
    })
  }

  async deleteSongInPlaylistHandler (request, h) {
    this._validator.validateDeletePlaylistSongPayload(request.payload)
    const { id: credentialId } = request.auth.credentials

    const { songId } = request.payload
    await this._songsService.getSongById(songId)

    const { id: playlistId } = request.params
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._playlistsService.deleteSongInPlaylist(playlistId, songId)

    return h.response({
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist'
    })
  }
}

module.exports = PlaylistsHandler
