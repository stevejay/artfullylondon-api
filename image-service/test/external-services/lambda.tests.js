'use strict';

const AWS = require('aws-sdk');
const sinon = require('sinon');
const expect = require('chai').expect;
const lambda = require('../../lib/external-services/lambda');

describe('lambda', () => {
  afterEach(() => {
    AWS.Lambda.restore && AWS.Lambda.restore();
  });

  describe('invoke', () => {
    it('should handle invoking a lambda that returns a valid result', done => {
      const mockInvoke = sinon.stub().callsFake((params, cb) => {
        expect(params).to.eql({
          FunctionName: 'SomeFunction',
          Payload: '{"name":"foo"}',
        });

        cb(null, { StatusCode: 200, Payload: '{"id":"result-1"}' });
      });

      sinon.stub(AWS, 'Lambda').callsFake(() => ({ invoke: mockInvoke }));

      lambda
        .invoke('SomeFunction', { name: 'foo' })
        .then(result => {
          expect(result).to.eql({ id: 'result-1' });
          done();
        })
        .catch(done);
    });

    it('should handle invoking a lambda that returns a result with an error message', done => {
      const mockInvoke = sinon.stub().callsFake((params, cb) => {
        expect(params).to.eql({
          FunctionName: 'SomeFunction',
          Payload: '{"name":"foo"}',
        });

        cb(null, {
          StatusCode: 200,
          Payload: '{"errorMessage":"deliberate error"}',
        });
      });

      sinon.stub(AWS, 'Lambda').callsFake(() => ({ invoke: mockInvoke }));

      lambda
        .invoke('SomeFunction', { name: 'foo' })
        .then(() => {
          done(new Error('should have got an error'));
        })
        .catch(err => {
          done(
            err.message === 'deliberate error'
              ? null
              : new Error('wrong error message')
          );
        });
    });

    it('should handle invoking a lambda that returns a result with a non-200 status code', done => {
      const mockInvoke = sinon.stub().callsFake((params, cb) => {
        expect(params).to.eql({
          FunctionName: 'SomeFunction',
          Payload: '{"name":"foo"}',
        });

        cb(null, {
          StatusCode: 500,
          Payload: '{"bar":"bat"}',
        });
      });

      sinon.stub(AWS, 'Lambda').callsFake(() => ({ invoke: mockInvoke }));

      lambda
        .invoke('SomeFunction', { name: 'foo' })
        .then(() => {
          done(new Error('should have got an error'));
        })
        .catch(err => {
          done(
            err.message ===
              'SomeFunction failed: {"StatusCode":500,"Payload":"{\\"bar\\":\\"bat\\"}"}'
              ? null
              : new Error('wrong error message: ' + err.message)
          );
        });
    });

    it('should handle invoking a lambda that returns no result', done => {
      const mockInvoke = sinon.stub().callsFake((params, cb) => {
        expect(params).to.eql({
          FunctionName: 'SomeFunction',
          Payload: '{"name":"foo"}',
        });

        cb(null, null);
      });

      sinon.stub(AWS, 'Lambda').callsFake(() => ({ invoke: mockInvoke }));

      lambda
        .invoke('SomeFunction', { name: 'foo' })
        .then(() => {
          done(new Error('should have got an error'));
        })
        .catch(err => {
          done(
            err.message === 'SomeFunction failed: null'
              ? null
              : new Error('wrong error message: ' + err.message)
          );
        });
    });

    it('should handle invoking a lambda that returns an error', done => {
      const mockInvoke = sinon.stub().callsFake((params, cb) => {
        expect(params).to.eql({
          FunctionName: 'SomeFunction',
          Payload: '{"name":"foo"}',
        });

        cb(new Error('deliberate error'));
      });

      sinon.stub(AWS, 'Lambda').callsFake(() => ({ invoke: mockInvoke }));

      lambda
        .invoke('SomeFunction', { name: 'foo' })
        .then(() => {
          done(new Error('should have got an error'));
        })
        .catch(err => {
          done(
            err.message === 'deliberate error'
              ? null
              : new Error('wrong error message: ' + err.message)
          );
        });
    });
  });
});
