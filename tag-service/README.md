# Tag Service

## Development

Run three console windows, starting them in this order:

1.  Dynamodb Local - `yarn run local:install` then `yarn run local:dynamodb`
1.  Tag service - `yarn run local:service` (wait until it says 'Offline listening on [some local url]', not just 'Watching for changes ...')
1.  Testing - `yarn test` for unit tests, and `yarn run test:integration` for integration tests

Any time you need to add or remove packages using yarn, you need to stop all the above tasks, and then afterwards rerun the above.
