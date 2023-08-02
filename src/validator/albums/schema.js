const Joi = require('joi')

const currentYear = new Date().currentYear

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1990).max(currentYear).required()
})

module.exports = { AlbumPayloadSchema }
