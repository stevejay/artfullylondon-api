import * as log from "loglevel";
import VError from "verror";

export default function(serviceFunc) {
  return function(event, context, cb) {
    Promise.all(
      (event.Records || []).map(async record => {
        const message = JSON.parse(record.Sns.Message);
        return await serviceFunc(message);
      })
    )
      .then(() => {
        cb(null, { ok: true });
      })
      .catch(err => {
        const errMessage = `Error in SNS handler: ${
          err.message
        }. Event: ${JSON.stringify(event.Records)}`;
        log.error(errMessage);
        cb(new VError(err, errMessage));
      });
  };
}
