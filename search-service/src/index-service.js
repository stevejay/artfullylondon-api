import * as validator from "./validator";
import * as indexer from "./indexer";

export async function indexDocument(request) {
  validator.validateIndexDocumentRequest(request);
  await indexer.index(request);
  return { acknowledged: true };
}
