exports.up = pgm => {
  pgm.addColumn('songs', {
    playlist_id: {
      type: 'VARCHAR(30)',
      references: 'playlists(id)',
      onDelete: 'cascade'
    }
  })
  pgm.sql("INSERT INTO users (id, username, password, fullname) VALUES ('old_songs', 'old_songs', 'old_songs', 'old_songs')")
  pgm.sql("INSERT INTO playlists (id, name, owner) VALUES ('old_songs', 'old_songs', 'old_songs')")
  pgm.sql("UPDATE songs SET playlist_id='old_songs' WHERE playlist_id IS NULL")
}

exports.down = pgm => {
  pgm.sql("UPDATE songs SET playlist_id=NUll WHERE playlist_id='old_songs'")
  pgm.sql("DELETE FROM playlists WHERE id='old_songs'")
  pgm.sql("DELETE FROM users WHERE id='old_songs'")
  pgm.dropColumn('songs', 'playlist_id')
}
