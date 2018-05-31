import elasticsearch from "elasticsearch";

export default class ESClient {
  constructor(host, log = "error") {
    this._client = new elasticsearch.Client({ host, log });
  }
  search(params) {
    return this._client.search(params);
  }
}
