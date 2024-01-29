const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumsService');
const AlbumValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongService = require('./services/postgres/SongsService');
const SongValidator = require('./validator/songs');

const playlists = require('./api/playlists');
const PlaylistService = require('./services/postgres/PlaylistsService');
const PlaylistValidator = require('./validator/playlists');

const playlistSongs = require('./api/playlistSongs');
const PlaylistSongService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongValidator = require('./validator/playlistSongs');

const users = require('./api/users');
const UserService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const registerPlugins = async (server) => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const playlistService = new PlaylistService();
  const playlistSongService = new PlaylistSongService();
  const usersService = new UserService();
  const authenticationsService = new AuthenticationsService();

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        service: playlistSongService,
        validator: PlaylistSongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);
};

module.exports = registerPlugins;
