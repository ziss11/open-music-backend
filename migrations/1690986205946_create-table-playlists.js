exports.up = pgm => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('playlists')
}
