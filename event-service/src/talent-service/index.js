import * as talentRepository from "../persistence/talent-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as enhancer from "../enhancer";
import * as entityType from "../types/entity-type";
import * as notifier from "../notifier";
import * as cacher from "../cacher";

export async function get(params) {
  const talent = await talentRepository.get(params.id, false);
  return { entity: mapper.mapToPublicFullResponse(talent) };
}

export async function getForEdit(params) {
  const talent = await talentRepository.get(params.id, true);
  return { entity: talent };
}

export async function getMulti(params) {
  const talents = await talentRepository.getMulti(params.ids);
  return { entities: talents.map(mapper.mapToPublicSummaryResponse) };
}

export async function createOrUpdate(params) {
  params = normaliser.normaliseCreateOrUpdateTalentRequest(params);
  validator.validateCreateOrUpdateTalentRequest(params);
  params = await enhancer.enhanceDescription(params);
  const dbTalent = mapper.mapCreateOrUpdateTalentRequest(params);
  await talentRepository.createOrUpdate(dbTalent);
  await notifier.indexEntity(mapper.mapToPublicFullResponse(dbTalent));
  await cacher.clearEntityEtag(entityType.TALENT, dbTalent.id);
  return { entity: dbTalent };
}

export async function getNextId(lastId) {
  return await talentRepository.getNextId(lastId);
}
