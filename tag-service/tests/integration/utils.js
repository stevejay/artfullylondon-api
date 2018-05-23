exports.EDITOR_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY29nbml0bzp1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ._ANmL9jse6JQCwQJumzBEH6omY7OjFFSFYJdS5wdeZE";

exports.READONLY_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY29nbml0bzp1c2VybmFtZSI6InJlYWRvbmx5IiwiaWF0IjoxNTE2MjM5MDIyfQ.muh1Jbhv-kBuwZ3pNeDNh8_53iGvs25EwPCAvcvgaWQ";

exports.createIdForTag = function() {
  const NS_PER_SEC = 1e9;
  const time = process.hrtime();
  return `${time[0] * NS_PER_SEC + time[1]}`;
};

exports.sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });
