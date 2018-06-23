import * as entityRepository from "./entity-repository";
import dynamodb from "./dynamodb";

export const TALENT_TABLE_NAME = process.env.SERVERLESS_TALENT_TABLE_NAME;

export async function getTalent(id, consistentRead) {
  return await entityRepository.get(TALENT_TABLE_NAME, id, consistentRead);
}

export async function getTalentMulti(ids) {
  const response = await dynamodb.batchGet({
    RequestItems: {
      [TALENT_TABLE_NAME]: {
        Keys: ids.map(id => ({ id })),
        ProjectionExpression:
          "id, #s, firstNames, lastName, talentType, commonRole, images",
        ExpressionAttributeNames: {
          "#s": "status"
        }
      }
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  return response.Responses[TALENT_TABLE_NAME];
}

export async function createOrUpdateTalent(talent) {
  await entityRepository.write(TALENT_TABLE_NAME, talent);
}

export async function getNextTalent(lastId) {
  return await entityRepository.getNextEntity(TALENT_TABLE_NAME, lastId);
}
