export default function(handler) {
  return (event, context, cb) => {
    Promise.resolve(handler(event, context))
      .then(res => cb(null, res))
      .catch(cb);
  };
}
