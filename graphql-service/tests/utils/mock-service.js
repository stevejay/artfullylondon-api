import destroyable from "server-destroy";
import http from "http";
import Koa from "koa";

export default class {
  constructor() {
    this._app = null;
    this._server = null;
    this._response = null;
    this._lastHeaders = null;
  }
  start(port) {
    this._app = new Koa();
    this._app.use(ctx => {
      this._lastHeaders = ctx.headers;
      ctx.response.type = "application/json";
      ctx.response.body = this._response;
    });
    this._server = http.createServer(this._app.callback());
    this._server.listen(port);
    destroyable(this._server);
  }
  setResponseBody(response) {
    this._response = response;
  }
  get lastHeaders() {
    return this._lastHeaders;
  }
  stop() {
    this._server.destroy();
    this._server = null;
    this._app = null;
    this._response = null;
  }
}
