const InvariantError = require('../exceptions/InvariantError')
const { AlbumPayloadSchema, SongPayloadSchema } = require('./schema')

module.exports = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}
