exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    year: {
      type: 'INTEGER',
      notNull: true
    },
    performer: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    genre: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    duration: {
      type: 'INTEGER'
    },
    album_id: {
      type: 'VARCHAR(30)'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('songs')
}
