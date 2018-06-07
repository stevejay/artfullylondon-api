# Data Service

## Dependencies

This service has the following external service dependencies:

* Elasticsearch

## Prerequisites

The file `env.yml` must exist in the service's root directory and be populated. Refer to the file `env.template.yml` for its required content.

## Testing

To run the service locally:

1.  Have [localstack](https://github.com/localstack/localstack) running.
1.  Start the service using the command `yarn run local`.

You can then use the command `yarn run test:integration` to run the service's integration tests.

## Deployment

Use the following command, replacing the stage with `staging` or `production`:

```
yarn run deploy --stage=STAGE
```
