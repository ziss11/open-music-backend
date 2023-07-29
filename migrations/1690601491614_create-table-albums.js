/* eslint-disable camelcase */

exports.shorthands = undefined

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
      type: 'NUMERIC',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('albums')
}
