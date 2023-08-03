exports.up = pgm => {
  pgm.createTable('activities', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade'
    },
    playlist_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'playlists(id)',
      onDelete: 'cascade'
    },
    song_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'songs(id)',
      onDelete: 'cascade'
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    time: {
      type: 'TEXT',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('activities')
}
