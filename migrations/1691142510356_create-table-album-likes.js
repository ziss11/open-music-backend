exports.up = pgm => {
  pgm.createTable('album_likes', {
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
    album_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'albums(id)',
      onDelete: 'cascade'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('album_likes')
}
