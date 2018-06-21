import _ from "lodash";

export function mapGetEntityMultiRequest(params) {
  return {
    ...params,
    ids: _.isEmpty(params.ids)
      ? []
      : _.isString(params.ids)
        ? params.ids.split(",")
        : params.ids
  };
}
