exports.up = pgm => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    year: {
      type: 'INTEGER',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('albums')
}
