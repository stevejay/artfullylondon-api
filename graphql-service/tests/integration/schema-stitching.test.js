import request from "request-promise-native";
import MockService from "../utils/mock-service";
jest.setTimeout(60000);

const DATA_SERVICE_QUERY = `
{
  heroImage {
    name
    dominantColor
    label
  }
}
`;

const DATA_SERVICE_RESPONSE = {
  data: {
    heroImage: {
      name: "shoreditch-graffiti",
      dominantColor: "#2e2d27",
      label: "Graffiti in Shoreditch"
    }
  }
};

const TAG_SERVICE_QUERY = `
{
  tags(tagType: GEO) {
    nodes { label }
  }
}
`;

const TAG_SERVICE_RESPONSE = {
  data: {
    tags: {
      nodes: [
        {
          label: "germany"
        }
      ]
    }
  }
};

const USER_SERVICE_QUERY = `
{
  preferences {
    emailFrequency
  }
}
`;

const USER_SERVICE_RESPONSE = {
  data: {
    preferences: {
      emailFrequency: "DAILY"
    }
  }
};

const SEARCH_SERVICE_QUERY = `
{
  entityCount {
    results {
      entityType
      count
    }
  }
}
`;

const SEARCH_SERVICE_RESPONSE = {
  data: {
    entityCount: {
      results: [{ count: 2, entityType: "EVENT" }]
    }
  }
};

const EVENT_SERVICE_QUERY = `
{
  eventSeries(id: "aaaaa") {
    notes
  }
}
`;

const EVENT_SERVICE_RESPONSE = {
  data: {
    eventSeries: {
      notes: "Stand-up poetry"
    }
  }
};

const IMAGE_SERVICE_QUERY = `
{
  image(id: "aaaa") {
    image {
      width
    }
  }
}
`;

const IMAGE_SERVICE_RESPONSE = {
  data: {
    image: {
      image: {
        width: 250
      }
    }
  }
};

describe("admin interface schema stitching", () => {
  const mockTagService = new MockService();
  const mockDataService = new MockService();
  const mockSearchService = new MockService();
  const mockEventService = new MockService();
  const mockImageService = new MockService();

  beforeEach(() => {
    mockTagService.start(3011);
    mockDataService.start(3010);
    mockSearchService.start(3013);
    mockEventService.start(3014);
    mockImageService.start(3016);
  });

  afterEach(() => {
    mockTagService.stop();
    mockDataService.stop();
    mockSearchService.stop();
    mockEventService.stop();
    mockImageService.stop();
  });

  it("should have stitched in the tag service to the admin interface", async () => {
    mockTagService.setResponseBody(TAG_SERVICE_RESPONSE);
    const result = await request({
      uri: "http://localhost:3015/admin/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: "Bearer aaaaaaaaaaaaaaaa" },
      body: { query: TAG_SERVICE_QUERY },
      timeout: 30000,
      resolveWithFullResponse: true
    });
    expect(result.headers).toEqual(
      expect.objectContaining({
        "access-control-allow-credentials": "true",
        "access-control-allow-origin": "*"
      })
    );
    expect(result.body).toEqual(TAG_SERVICE_RESPONSE);
    expect(mockTagService.lastHeaders).toEqual(
      expect.objectContaining({
        authorization: "Bearer aaaaaaaaaaaaaaaa"
      })
    );
  });

  it("should have stitched in the data service to the admin interface", async () => {
    mockDataService.setResponseBody(DATA_SERVICE_RESPONSE);
    const result = await request({
      uri: "http://localhost:3015/admin/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: "Bearer aaaaaaaaaaaaaaaa" },
      body: { query: DATA_SERVICE_QUERY },
      timeout: 30000
    });
    expect(result).toEqual(DATA_SERVICE_RESPONSE);
  });

  it("should have stitched in the search service to the admin interface", async () => {
    mockSearchService.setResponseBody(SEARCH_SERVICE_RESPONSE);
    const result = await request({
      uri: "http://localhost:3015/admin/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: "Bearer aaaaaaaaaaaaaaaa" },
      body: { query: SEARCH_SERVICE_QUERY },
      timeout: 30000
    });
    expect(result).toEqual(SEARCH_SERVICE_RESPONSE);
  });

  it("should have stitched in the event service to the admin interface", async () => {
    mockEventService.setResponseBody(EVENT_SERVICE_RESPONSE);
    const result = await request({
      uri: "http://localhost:3015/admin/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: "Bearer aaaaaaaaaaaaaaaa" },
      body: { query: EVENT_SERVICE_QUERY },
      timeout: 30000
    });
    expect(result).toEqual(EVENT_SERVICE_RESPONSE);
    expect(mockEventService.lastHeaders).toEqual(
      expect.objectContaining({
        authorization: "Bearer aaaaaaaaaaaaaaaa"
      })
    );
  });

  it("should have stitched in the image service to the admin interface", async () => {
    mockImageService.setResponseBody(IMAGE_SERVICE_RESPONSE);
    const result = await request({
      uri: "http://localhost:3015/admin/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: "Bearer aaaaaaaaaaaaaaaa" },
      body: { query: IMAGE_SERVICE_QUERY },
      timeout: 30000
    });
    expect(result).toEqual(IMAGE_SERVICE_RESPONSE);
    expect(mockImageService.lastHeaders).toEqual(
      expect.objectContaining({
        authorization: "Bearer aaaaaaaaaaaaaaaa"
      })
    );
  });
});

describe("public interface schema stitching", () => {
  const mockDataService = new MockService();
  const mockUserService = new MockService();
  const mockSearchService = new MockService();

  beforeEach(() => {
    mockDataService.start(3010);
    mockUserService.start(3012);
    mockSearchService.start(3013);
  });

  afterEach(() => {
    mockDataService.stop();
    mockUserService.stop();
    mockSearchService.stop();
  });

  it("should have stitched in the data service to the public interface", async () => {
    mockDataService.setResponseBody(DATA_SERVICE_RESPONSE);
    const result = await request({
      uri: "http://localhost:3015/public/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: "Bearer aaaaaaaaaaaaaaaa" },
      body: { query: DATA_SERVICE_QUERY },
      timeout: 30000
    });
    expect(result).toEqual(DATA_SERVICE_RESPONSE);
  });

  it("should have stitched in the user service to the public interface", async () => {
    mockUserService.setResponseBody(USER_SERVICE_RESPONSE);
    const result = await request({
      uri: "http://localhost:3015/public/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: "Bearer aaaaaaaaaaaaaaaa" },
      body: { query: USER_SERVICE_QUERY },
      timeout: 30000
    });
    expect(result).toEqual(USER_SERVICE_RESPONSE);
  });

  it("should have stitched in the search service to the public interface", async () => {
    mockSearchService.setResponseBody(SEARCH_SERVICE_RESPONSE);
    const result = await request({
      uri: "http://localhost:3015/public/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: "Bearer aaaaaaaaaaaaaaaa" },
      body: { query: SEARCH_SERVICE_QUERY },
      timeout: 30000
    });
    expect(result).toEqual(SEARCH_SERVICE_RESPONSE);
  });
});
