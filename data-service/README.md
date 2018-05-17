# Data Service

## Prerequisites

The file `env.yml` must exist in the service's root directory and be populated. Refer to the file `env.template.yml` for its required content.

## Testing

### Integration Testing

Start the service running locally using `yarn run offline`. This will run the service against the development Elasticsearch instance specified in `./env.yml`. You can then run `yarn run test:integration` to run the service's integration tests.
