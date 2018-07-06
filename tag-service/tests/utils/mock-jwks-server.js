import destroyable from "server-destroy";
import http from "http";
import Koa from "koa";
import * as authUtils from "./authentication";

export default class {
  constructor() {
    this._app = null;
    this._server = null;
  }
  start(port) {
    this._app = new Koa();
    this._app.use(ctx => {
      ctx.response.type = "application/json";
      ctx.response.body = authUtils.getJWKSet();
    });
    this._server = http.createServer(this._app.callback());
    this._server.listen(port);
    destroyable(this._server);
  }
  stop() {
    this._server.destroy();
    this._server = null;
    this._app = null;
  }
}
