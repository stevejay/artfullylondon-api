import * as wikipediaEnhancer from "./wikipedia-enhancer";
import * as linkType from "../types/link-type";

const WIKIPEDIA_LINK = {
  type: linkType.WIKIPEDIA,
  url: "https://en.wikipedia.org/wiki/Rabbit"
};

describe("createWikipediaUrl", () => {
  test.each([
    [{ links: [] }, null],
    [{}, null],
    [{ links: [WIKIPEDIA_LINK], description: "Some description" }, null],
    [
      { links: [WIKIPEDIA_LINK] },
      "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Rabbit&exchars=1200"
    ]
  ])("%o should create url %s", (params, expected) => {
    const result = wikipediaEnhancer.createWikipediaUrl(params);
    expect(result).toEqual(expected);
  });
});

describe("parseWikipediaResponse", () => {
  test.each([
    [{}, null],
    [
      {
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
      },
      {
        description:
          "<p>Rabbits are small mammals in the family Leporidae.</p>",
        descriptionCredit: "Wikipedia"
      }
    ]
  ])("%o should parse to %o", (response, expected) => {
    const result = wikipediaEnhancer.parseWikipediaResponse(response);
    expect(result).toEqual(expected);
  });
});
