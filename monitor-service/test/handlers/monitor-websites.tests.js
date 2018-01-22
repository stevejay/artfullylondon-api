'use strict';

// const sinon = require('sinon');
// const monitorWebsitesHandler = require('../../handlers/monitor-websites');
// const proxyHandlerRunner = require('./handler-runner');
// const ses = require('../../lib/ses');

// describe('monitor-websites.handler', () => {
//     afterEach(() => {
//         if (ses.sendEmail.restore) { ses.sendEmail.restore(); }
//     });

//     it('should create a response', done => {
//         sinon.stub(ses, 'sendEmail', () => {
//             return Promise.resolve();
//         });

//         const expected = {
//             statusCode: 200,
//             headers: {
//                 'Access-Control-Allow-Credentials': true,
//                 'Access-Control-Allow-Origin': '*'
//             },
//             body: {
//                 result: {
//                     reminders: [],
//                     monitors: [
//                         {
//                             site: 'Saatchi Gallery',
//                             detected: false
//                         }
//                     ]
//                 }
//             }
//         };

//         proxyHandlerRunner(monitorWebsitesHandler.handler, null, expected, done);
//     }).timeout(5000);
// });
