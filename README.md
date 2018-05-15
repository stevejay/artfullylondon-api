# Artfully London API

This is the back-end code for the Artfully London website.
I built it using Node.js AWS Lambdas, grouped as logical microservices and deployed
using the Serverless framework.

## Prerequisites

1. Install `yarn` globally.

2. Copy the various `env.template.yml` files as `env.yml`
(in the same directories) and populate the values appropriately.

3. Each service can be tested and deployed by cd'ing into it's
director and running the appropriate yarn commands (as listed in
the `package.json` file for the service).

## Todo

- Improve the AWS Cognito serverless configuration. (I think serverless 
supports AWS Cognito configuration now.)

## Info

- [nvm on Windows](https://github.com/coreybutler/nvm-windows)

## License

[MIT](LICENSE)
