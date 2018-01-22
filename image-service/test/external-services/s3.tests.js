'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const sinon = require('sinon');
const expect = require('chai').expect;
const s3 = require('../../lib/external-services/s3');

describe('s3', () => {
  afterEach(() => {
    AWS.S3.restore && AWS.S3.restore();
    fs.writeFile.restore && fs.writeFile.restore();
  });

  describe('getObjectFromS3', () => {
    it('should get an object from s3', done => {
      const mockGetObject = sinon.stub().callsFake(params => {
        expect(params).to.eql({
          Bucket: 'somebucket',
          Key: 'somekey',
        });

        return { promise: () => Promise.resolve({ Body: 'the-data' }) };
      });

      sinon.stub(AWS, 'S3').callsFake(() => ({ getObject: mockGetObject }));

      sinon.stub(fs, 'writeFile').callsFake((filePath, data, cb) => {
        expect(filePath).to.eql('/foo');
        expect(data).to.eql('the-data');
        cb();
      });

      s3
        .getObjectFromS3('somebucket', 'somekey', '/foo')
        .then(() => done())
        .catch(done);
    });
  });
});
