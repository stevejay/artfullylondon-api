module.exports.sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });
