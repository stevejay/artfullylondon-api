import * as request from "request-promise-native";
import * as wikipedia from "./wikipedia";

const linksWithWikipedia = [
  { type: "Wikipedia", url: "https://en.wikipedia.org/wiki/Rabbit" }
];

describe("getDescription", () => {
  it("should get a wikipedia description", async () => {
    const entity = {
      description: null,
      descriptionCredit: null,
      links: linksWithWikipedia
    };

    const path =
      "/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Rabbit&exchars=4000";

    request.get = jest.fn().mockResolvedValue({
      batchcomplete: "",
      query: {
        pages: {
          "26573": {
            pageid: 26573,
            ns: 0,
            title: "Rabbit",
            extract: "Rabbits are small mammals in the family Leporidae...."
          }
        }
      }
    });

    const result = await wikipedia.getDescription(
      entity.description,
      entity.descriptionCredit,
      entity.links
    );

    expect(result).toEqual({
      content: "<p>Rabbits are small mammals in the family Leporidae.</p>"
    });

    expect(request.get).toHaveBeenCalledWith(
      "https://en.wikipedia.org" + path,
      { json: true }
    );
  });

  it("should get the first paragraph of a wikipedia description", async () => {
    const entity = {
      description: null,
      descriptionCredit: null,
      links: linksWithWikipedia
    };

    const path =
      "/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Rabbit&exchars=4000";

    request.get = jest.fn().mockResolvedValue({
      batchcomplete: "",
      query: {
        pages: {
          "26573": {
            pageid: 26573,
            ns: 0,
            title: "Rabbit",
            extract: "Rabbits are small mammals in the family.\nThey are fun."
          }
        }
      }
    });

    const result = await wikipedia.getDescription(
      entity.description,
      entity.descriptionCredit,
      entity.links
    );

    expect(result).toEqual({
      content: "<p>Rabbits are small mammals in the family.</p>"
    });

    expect(request.get).toHaveBeenCalledWith(
      "https://en.wikipedia.org" + path,
      { json: true }
    );
  });

  it("should handle a response with no pages", async () => {
    const entity = {
      description: null,
      descriptionCredit: null,
      links: linksWithWikipedia
    };

    const path =
      "/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Rabbit&exchars=4000";

    request.get = jest.fn().mockResolvedValue({
      batchcomplete: "",
      query: {
        pages: {}
      }
    });

    const result = await wikipedia.getDescription(
      entity.description,
      entity.descriptionCredit,
      entity.links
    );

    expect(result).toEqual({});

    expect(request.get).toHaveBeenCalledWith(
      "https://en.wikipedia.org" + path,
      { json: true }
    );
  });

  it("should not overwrite an existing description", async () => {
    const entity = {
      description: "not empty",
      descriptionCredit: "some credit",
      links: linksWithWikipedia
    };

    request.get = jest.fn();

    const result = await wikipedia.getDescription(
      entity.description,
      entity.descriptionCredit,
      entity.links
    );

    expect(result).toEqual({ content: "not empty", credit: "some credit" });
    expect(request.get).not.toHaveBeenCalled();
  });

  it("should not return a description if there is no wikipedia link", async () => {
    const entity = {
      description: "",
      descriptionCredit: "some credit",
      links: [{ type: "Homepage", url: "https://test.com" }]
    };

    request.get = jest.fn();

    const result = await wikipedia.getDescription(
      entity.description,
      entity.links
    );

    expect(result).toEqual({});
    expect(request.get).not.toHaveBeenCalled();
  });

  it("should not return a description if there is no final component in the wikipedia url", async () => {
    const entity = {
      description: null,
      links: [
        { type: "Wikipedia", url: "https://en.wikipedia.org/wiki/Rabbit/" }
      ]
    };

    request.get = jest.fn();

    const result = await wikipedia.getDescription(
      entity.description,
      entity.links
    );

    expect(result).toEqual({});
    expect(request.get).not.toHaveBeenCalled();
  });
});
