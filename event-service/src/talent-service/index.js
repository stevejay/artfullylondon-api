import * as talentRepository from "../persistence/talent-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as enhancer from "../enhancer";
import * as notifier from "../notifier";

export async function get(params) {
  const dbTalent = await talentRepository.get(params.id, false);
  return mapper.mapResponse(dbTalent);
}

export async function getForEdit(params) {
  return await talentRepository.get(params.id, true);
}

export async function createOrUpdate(params) {
  let talent = normaliser.normaliseCreateOrUpdateTalentRequest(params);
  validator.validateCreateOrUpdateTalentRequest(talent);
  talent = await enhancer.enhanceDescription(talent);
  const dbTalent = mapper.mapCreateOrUpdateTalentRequest(talent);
  await talentRepository.createOrUpdate(dbTalent);
  await notifier.indexEntity(mapper.mapToPublicFullResponse(dbTalent));
  return mapper.mapResponse(dbTalent);
}

export async function getNextId(lastId) {
  return await talentRepository.getNextId(lastId);
}
