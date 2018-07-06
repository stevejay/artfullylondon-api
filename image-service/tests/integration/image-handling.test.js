import request from "request-promise-native";
import uuidv4 from "uuid/v4";
import delay from "delay";
import * as authUtils from "../utils/authentication";
import * as dynamodbUtils from "../utils/dynamodb";
import * as s3Utils from "../utils/s3";
import * as imageType from "../../src/image-type";
import MockJwksServer from "../utils/mock-jwks-server";
jest.setTimeout(60000);

const ORIGINAL_BUCKET_NAME = "artfullylondon-development-original-images";
const RESIZED_BUCKET_NAME = "artfullylondon-development-resized-images";
const ITERATION_LOG_TABLE_NAME =
  "artfullylondon-development-image-iteration-log";
const IMAGE_TABLE_NAME = "artfullylondon-development-image";

const IMAGE_QUERY = `
  query Image($id: ID!) {
    image(id: $id) {
      image {
        id
        imageType
        sourceUrl
        mimeType
        width
        height
        dominantColor
        ratio
        resizeVersion
        modifiedDate
      }
    }
  }
`;

const IMAGE_MUTATION = `
  mutation AddImage($id: ID!, $type: ImageTypeEnum!, $url: String!) {
    addImage(input: { id: $id, type: $type, url: $url }) {
      image {
        id
        imageType
        sourceUrl
        mimeType
        width
        height
        dominantColor
        ratio
        resizeVersion
        modifiedDate
      }
    }
  }
`;

const REPROCESS_ALL_IMAGES_MUTATION = `
  mutation ReprocessAllImages {
    reprocessAllImages {
      iteration {
        actionId
        iterationId
      }
    }
  }
`;

describe("image handling", () => {
  const mockJwksServer = new MockJwksServer();

  beforeAll(async () => {
    mockJwksServer.start(3021);
    await dynamodbUtils.truncateIterationLogTable(ITERATION_LOG_TABLE_NAME);
    await dynamodbUtils.truncateTable(IMAGE_TABLE_NAME);
    await s3Utils.createBucket(ORIGINAL_BUCKET_NAME);
    await s3Utils.createBucket(RESIZED_BUCKET_NAME);
  });

  afterAll(async () => {
    mockJwksServer.stop();
    await s3Utils.deleteBucket(ORIGINAL_BUCKET_NAME);
    await s3Utils.deleteBucket(RESIZED_BUCKET_NAME);
  });

  it("should reject getting metadata for a non-existent image", async () => {
    const result = await request({
      uri: "http://localhost:3016/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: IMAGE_QUERY,
        variables: { id: "aa111111222222223333333344444444" }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        image: null
      },
      errors: [
        expect.objectContaining({
          message: expect.stringContaining("Entity Not Found")
        })
      ]
    });
  });

  it("should add an image", async () => {
    const imageId = uuidv4().replace(/-/g, "");
    const sourceUrl =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/599px-Shakespeare.jpg";
    const expectedImageData = {
      imageType: imageType.TALENT,
      id: imageId,
      mimeType: "image/jpeg",
      sourceUrl,
      width: 599,
      height: 767,
      dominantColor: "393127",
      resizeVersion: 5
    };

    let result = await request({
      uri: "http://localhost:3016/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: IMAGE_MUTATION,
        variables: {
          id: imageId,
          type: imageType.TALENT,
          url: sourceUrl
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        addImage: {
          image: expect.objectContaining(expectedImageData)
        }
      }
    });

    result = await request({
      uri: "http://localhost:3016/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: IMAGE_QUERY,
        variables: { id: imageId }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        image: {
          image: expect.objectContaining(expectedImageData)
        }
      }
    });

    result = await request({
      uri: "http://localhost:3016/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: REPROCESS_ALL_IMAGES_MUTATION
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        reprocessAllImages: {
          iteration: expect.objectContaining({
            actionId: "IterateImages"
          })
        }
      }
    });

    await delay(8000);
    const logs = await dynamodbUtils.getAllIterationLogs(
      ITERATION_LOG_TABLE_NAME
    );

    expect(logs.length).toEqual(1);
    expect(logs[0]).toEqual(
      expect.objectContaining({
        actionId: "IterateImages",
        completed: true,
        errors: []
      })
    );
  });
});
