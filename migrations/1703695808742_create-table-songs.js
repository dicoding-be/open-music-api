/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: 'albums(id)',
      onDelete: 'cascade',
      default: 'unknown',
      notNull: false,
    },
    created_at: {
      type: 'TIMESTAMP WITH TIME ZONE',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
    updated_at: {
      type: 'TIMESTAMP WITH TIME ZONE',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
  });
  // Menambahkan indeks pada kolom album_id untuk meningkatkan performa
  pgm.createIndex('songs', 'album_id');
};

exports.down = (pgm) => {
  // Menghapus indeks sebelum menghapus tabel
  pgm.dropIndex('songs', 'album_id');
  pgm.dropTable('songs');
};
