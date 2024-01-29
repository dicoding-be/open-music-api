/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
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
    song_id: {
      type: 'VARCHAR(50)',
      references: 'songs(id)',
      onDelete: 'cascade',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      onDelete: 'cascade',
      notNull: true,
    },
    action: {
      type: 'TEXT',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMP WITH TIME ZONE',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
  });
  pgm.createIndex('playlist_song_activities', 'playlist_id');
  pgm.createIndex('playlist_song_activities', 'song_id');
  pgm.createIndex('playlist_song_activities', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropIndex('playlist_song_activities', 'playlist_id');
  pgm.dropIndex('playlist_song_activities', 'song_id');
  pgm.dropIndex('playlist_song_activities', 'user_id');
  pgm.dropTable('playlist_song_activities');
};
