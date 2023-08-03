exports.up = pgm => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'playlists(id)',
      onDelete: 'cascade'
    },
    user_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('collaborations')
}
