const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };
    await this._service.sendMessage(
      'export:playlists',
      JSON.stringify(message),
    );
    return h.response({
      status: 'success',
      message: 'Your request is being processed',
    }).code(201);
  }
}

module.exports = ExportsHandler;
