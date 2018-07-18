import * as talentRepository from "../persistence/talent-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as enhancer from "../enhancer";
import * as notifier from "../notifier";
import * as entityType from "../types/entity-type";

export async function get(params) {
  const dbTalent = await talentRepository.tryGet(params.id, false);
  return dbTalent ? mapper.mapResponse(dbTalent) : null;
}

export async function getForEdit(params) {
  return await talentRepository.tryGet(params.id, true);
}

export async function createOrUpdate(params) {
  let talent = normaliser.normaliseCreateOrUpdateTalentRequest(params);
  validator.validateCreateOrUpdateTalentRequest(talent);
  talent = await enhancer.enhanceDescription(talent);
  const dbTalent = mapper.mapCreateOrUpdateTalentRequest(talent);
  await talentRepository.createOrUpdate(dbTalent);
  const response = mapper.mapResponse(dbTalent);
  await notifier.indexEntity(response, entityType.TALENT);
  return response;
}

export async function getNextId(lastId) {
  return await talentRepository.getNextId(lastId);
}
