import * as talentRepository from "../persistence/talent-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as entityEnhancer from "../entity/enhancer";
import * as notifier from "../notifier";
import * as cache from "../cache";

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
  params = normaliser.normaliseCreateOrUpdateTalentRequest(params);
  validator.validateCreateOrUpdateTalentRequest(params);
  params = await entityEnhancer.addDescriptionFromWikipedia(params);
  const dbTalent = mapper.mapCreateOrUpdateTalentRequest(params);
  await talentRepository.createOrUpdateTalent(dbTalent);
  const responseTalent = mapper.mapToPublicFullResponse(dbTalent);
  await notifier.indexEntity(responseTalent);
  await cache.storeEntityEtag(responseTalent);
  return { entity: dbTalent };
}
