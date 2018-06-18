# Artfully London API

This is the back-end code for the Artfully London website. I built it using Node.js AWS Lambdas, grouped as logical microservices and deployed using the Serverless framework.

## LocalStack

1.  Clone
1.  CD into the cloned repo
1.  If on Windows, run `export COMPOSE_CONVERT_WINDOWS_PATHS=1` (because of [this issue](https://github.com/docker/for-win/issues/1829))
1.  Run `docker-compose up`

### Port Conflicts on Windows

1.  `netstat -a -n -o`
1.  Get PID from last column and check for it in the Details section in Task Manager.

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

- Improve the AWS Cognito serverless configuration. (I think serverless
  supports AWS Cognito configuration now.)

## Issues

- Docker on Windows: https://github.com/docker/for-win/issues/1829
  Use Git Bash:

```
set COMPOSE_CONVERT_WINDOWS_PATHS=1
docker-compose down && docker-compose up -d
```

## Info

- [nvm on Windows](https://github.com/coreybutler/nvm-windows)
- [Git creds manager on Windows](https://github.com/Microsoft/Git-Credential-Manager-for-Windows)

## License

[MIT](LICENSE)
