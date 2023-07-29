const Hapi = require('@hapi/hapi')
const albums = require('./api/albums')
const songs = require('./api/songs')
const AlbumsService = require('./services/postgres/AlbumsService')
const SongsService = require('./services/postgres/SongsService')
const Validator = require('./validator')

require('dotenv').config()

const init = async () => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: albums,
      options: { service: albumsService, validator: Validator }
    },
    {
      plugin: songs,
      options: { service: songsService, validator: Validator }
    }
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
