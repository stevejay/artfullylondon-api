import * as talentRepository from "../persistence/talent-repository";
import * as entityType from "../types/entity-type";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as entityEnhancer from "../entity/enhancer";
import * as indexer from "../indexer";
// const etag = require("../lambda/etag");

export async function getTalent(params) {
  const talent = await talentRepository.getTalent(params.id, false);
  return { entity: mapper.mapToPublicFullResponse(talent) };
}

export async function getTalentForEdit(params) {
  const talent = await talentRepository.getTalent(params.id, true);
  return { entity: talent };
}

export async function getTalentMulti(params) {
  const talents = await talentRepository.getTalentMulti(params.ids);
  return { entities: talents.map(mapper.mapToPublicSummaryResponse) };
}

export async function createOrUpdateTalent(params) {
  params = normaliser.normaliseCreateTalentRequest(params);
  validator.validateCreateTalentRequest(params);
  params = entityEnhancer.addDescriptionFromWikipedia(params);
  const talent = mapper.mapCreateOrUpdateTalentRequest(params);
  await talentRepository.createOrUpdateTalent(talent);
  await indexer.indexEntity(talent);
  // const publicResponse = mapper.mapToPublicFullResponse(talent);
  // await etag.writeETagToRedis(
  //   "talent/" + dbItem.id,
  //   JSON.stringify({ entity: publicResponse })
  // );
  return { entity: talent };
}
