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

const collaborations = require('./api/collaborations');
const CollaborationService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const registerPlugins = async (server) => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const usersService = new UserService();
  const collaborationService = new CollaborationService(usersService);
  const playlistService = new PlaylistService(collaborationService);
  const playlistSongService = new PlaylistSongService(playlistService, songService);
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
        songService,
        playlistService,
        playlistSongService,
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
    {
      plugin: collaborations,
      options: {
        collaborationService,
        playlistService,
        userService: usersService,
        validator: CollaborationsValidator,
      },
    },
  ]);
};

module.exports = registerPlugins;
