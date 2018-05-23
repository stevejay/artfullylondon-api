"use strict";

const request = require("request-promise-native");
const wikipedia = require("./wikipedia");

const linksWithWikipedia = [
  { type: "Wikipedia", url: "https://en.wikipedia.org/wiki/Rabbit" }
];

describe("wikipedia", () => {
  describe("getDescription", () => {
    afterEach(() => {
      request.get.restore();
    });

    it("should get a wikipedia description", done => {
      const entity = {
        description: null,
        descriptionCredit: null,
        links: linksWithWikipedia
      };

      const path =
        "/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Rabbit&exchars=4000";

      sinon.stub(request, "get").callsFake((url, options) => {
        try {
          // 'https://en.wikipedia.org' + path, { json: true }
          expect(url).eql("https://en.wikipedia.org" + path);
          expect(options).eql({ json: true });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve({
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
      });

      wikipedia
        .getDescription(
          entity.description,
          entity.descriptionCredit,
          entity.links
        )
        .then(result => {
          expect(result).toEqual({
            content: "<p>Rabbits are small mammals in the family Leporidae.</p>"
          });
          done();
        })
        .catch(err => done(err));
    });

    it("should get the first paragraph of a wikipedia description", done => {
      const entity = {
        description: null,
        descriptionCredit: null,
        links: linksWithWikipedia
      };

      const path =
        "/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Rabbit&exchars=4000";

      sinon.stub(request, "get").callsFake((url, options) => {
        try {
          // 'https://en.wikipedia.org' + path, { json: true }
          expect(url).eql("https://en.wikipedia.org" + path);
          expect(options).eql({ json: true });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve({
          batchcomplete: "",
          query: {
            pages: {
              "26573": {
                pageid: 26573,
                ns: 0,
                title: "Rabbit",
                extract:
                  "Rabbits are small mammals in the family.\nThey are fun."
              }
            }
          }
        });
      });

      wikipedia
        .getDescription(
          entity.description,
          entity.descriptionCredit,
          entity.links
        )
        .then(result => {
          expect(result).toEqual({
            content: "<p>Rabbits are small mammals in the family.</p>"
          });
          done();
        })
        .catch(err => done(err));
    });

    it("should handle a response with no pages", done => {
      const entity = {
        description: null,
        descriptionCredit: null,
        links: linksWithWikipedia
      };

      const path =
        "/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Rabbit&exchars=4000";

      sinon.stub(request, "get").callsFake((url, options) => {
        try {
          // 'https://en.wikipedia.org' + path, { json: true }
          expect(url).eql("https://en.wikipedia.org" + path);
          expect(options).eql({ json: true });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve({
          batchcomplete: "",
          query: {
            pages: {}
          }
        });
      });

      wikipedia
        .getDescription(
          entity.description,
          entity.descriptionCredit,
          entity.links
        )
        .then(result => {
          expect(result).toEqual({});
          done();
        })
        .catch(err => done(err));
    });

    it("should not overwrite an existing description", () => {
      const entity = {
        description: "not empty",
        descriptionCredit: "some credit",
        links: linksWithWikipedia
      };

      sinon.stub(request, "get").callsFake(() => {
        return Promise.reject(
          new Error("request.get should not have been invoked")
        );
      });

      const result = wikipedia.getDescription(
        entity.description,
        entity.descriptionCredit,
        entity.links
      );
      expect(result).toEqual({ content: "not empty", credit: "some credit" });
    });

    it("should not return a description if there is no wikipedia link", () => {
      const entity = {
        description: "",
        descriptionCredit: "some credit",
        links: [{ type: "Homepage", url: "https://test.com" }]
      };

      sinon.stub(request, "get").callsFake(() => {
        return Promise.reject(
          new Error("request.get should not have been invoked")
        );
      });

      const result = wikipedia.getDescription(entity.description, entity.links);
      expect(result).toEqual({});
    });

    it("should not return a description if there is no final component in the wikipedia url", () => {
      const entity = {
        description: null,
        links: [
          { type: "Wikipedia", url: "https://en.wikipedia.org/wiki/Rabbit/" }
        ]
      };

      sinon.stub(request, "get").callsFake(() => {
        return Promise.reject(
          new Error("request.get should not have been invoked")
        );
      });

      const result = wikipedia.getDescription(entity.description, entity.links);
      expect(result).toEqual({});
    });
  });
});
