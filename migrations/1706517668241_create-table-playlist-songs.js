/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
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
  });
  pgm.createIndex('playlist_songs', 'playlist_id');
  pgm.createIndex('playlist_songs', 'song_id');
};

exports.down = (pgm) => {
  pgm.dropIndex('playlist_songs', 'playlist_id');
  pgm.dropIndex('playlist_songs', 'song_id');
  pgm.dropTable('playlist_songs');
};
