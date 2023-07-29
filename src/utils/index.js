const filterSongData = ({ id, title, performer }) => ({
  id, title, performer
})

const filterSongDataIfNotNull = ({ id, title, performer }) => {
  return { id, title, performer }
}

const filterAlbumData = ({ id, name, year }) => ({
  id, name, year
})

module.exports = {
  filterAlbumData,
  filterSongDataIfNotNull,
  filterSongData
}
