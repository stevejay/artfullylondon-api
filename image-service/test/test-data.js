'use strict';

exports.NORMAL_ADMIN_USER_JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiY29nbml0bzp1c2VybmFtZSI6IlN0ZXZlIn0.zD8h7GMwyhBnY4ijQzmBaTl57wscAWKCyBuvCOMVRCA';

exports.READONLY_ADMIN_USER_JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiY29nbml0bzp1c2VybmFtZSI6InJlYWRvbmx5In0.aaZzxJqSbSOIv9nD6lonRr81Hym-OBeslJ2EK3iSu9w';

exports.NORMAL_ADMIN_USER_REQUEST_HEADERS = {
  Authorization: exports.NORMAL_ADMIN_USER_JWT_TOKEN,
};

exports.NORMAL_RESPONSE_HEADERS = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
};
