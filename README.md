# Artfully London API

This is the back-end code for the Artfully London website. I built it using Node.js AWS Lambdas, grouped as logical microservices and deployed using the Serverless framework.

## Prerequisites

1.  Install `yarn` globally.

2.  Copy the various `env.template.yml` files as `env.yml`
    (in the same directories) and populate the values appropriately.

3.  Each service can be tested and deployed by cd'ing into it's
    director and running the appropriate yarn commands (as listed in
    the `package.json` file for the service).

## Cognito user authentication

[Instructions here.](https://stackoverflow.com/a/45253010)

## Todo

* Improve the AWS Cognito serverless configuration. (I think serverless
  supports AWS Cognito configuration now.)
* Try this for localstack: https://store.docker.com/community/images/localstack/localstack

## Issues

* Docker on Windows: https://github.com/docker/for-win/issues/1829
  Use Git Bash:

```
set COMPOSE_CONVERT_WINDOWS_PATHS=1
docker-compose down && docker-compose up -d
```

## Info

* [nvm on Windows](https://github.com/coreybutler/nvm-windows)
* [Git creds manager on Windows](https://github.com/Microsoft/Git-Credential-Manager-for-Windows)

## License

[MIT](LICENSE)
