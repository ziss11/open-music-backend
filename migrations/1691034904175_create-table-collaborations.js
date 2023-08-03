exports.up = pgm => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(30)',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(30)',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('collaborations')
}
