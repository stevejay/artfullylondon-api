import elasticsearch from "elasticsearch";
import jsonfile from "jsonfile";
import path from "path";

export default class ESTestClient {
  constructor(host, pathToMappingsDir) {
    this._client = new elasticsearch.Client({ host, log: "error" });
    this._pathToMappingsDir = pathToMappingsDir;
  }
  async deleteIndex(index) {
    if (await this._client.indices.exists({ index })) {
      await this._client.indices.delete({ index });
    }
  }
  async createIndex(index) {
    await this.deleteIndex(index);
    const body = jsonfile.readFileSync(
      path.join(this._pathToMappingsDir, `${index}.json`)
    );
    await this._client.indices.create({ index, body });
  }
  async indexDocument(index, document) {
    await this._client.create({
      index,
      type: "doc",
      id: document.id,
      body: document,
      refresh: "true"
    });
  }
}
