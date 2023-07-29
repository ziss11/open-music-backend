const filterSongData = ({ id, title, performer }) => ({
  id, title, performer
})

const filterAlbumData = ({ id, name, year }) => ({
  id, name, year
})

module.exports = { filterAlbumData, filterSongData }
