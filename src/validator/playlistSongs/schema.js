const Joi = require('joi');

const PostPlaylistSongSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeletePlaylistSongSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PostPlaylistSongSchema, DeletePlaylistSongSchema };
