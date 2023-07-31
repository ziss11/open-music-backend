exports.up = pgm => {
  pgm.addConstraint('songs', 'fk_songs_album_id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)'
    }
  })
}

exports.down = pgm => {
  pgm.dropConstraint('orders', 'fk_songs_album_id')
}
