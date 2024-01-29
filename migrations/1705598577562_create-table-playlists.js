/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      onDelete: 'cascade',
      notNull: true,
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
  pgm.createIndex('playlists', 'owner');
};

exports.down = (pgm) => {
  pgm.dropIndex('playlists', 'owner');
  pgm.dropTable('playlists');
};
