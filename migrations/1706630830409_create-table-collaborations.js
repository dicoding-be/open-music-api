/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: 'playlists(id)',
      onDelete: 'cascade',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      onDelete: 'cascade',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP WITH TIME ZONE',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createIndex('collaborations', 'playlist_id');
  pgm.createIndex('collaborations', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropIndex('collaborations', 'playlist_id');
  pgm.dropIndex('collaborations', 'user_id');
  pgm.dropTable('collaborations');
};
