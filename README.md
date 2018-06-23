# Artfully London API

The main back-end code for the Artfully London website. An example of a back-end implemented entirely from AWS Lambda nanoservices, all written in Node.js and deployed using the Serverless framework.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

The Artfully London website allows a user to search and view current and upcoming art-related events in London. There is also an admin website for creating and editing the site data.

This repository contains the API that supports this functionality. It is composed of multiple AWS Lambda nanoservices that have been logically grouped into the following microservices:

- Data Service - Serves the sitemap file and static data required by the public or admin websites
- Event Service - CRUD operations for the event, event series, talent and venue entities, stored using DynamoDB
- Image Service - Transcoding of event, event series, talent and venue images
- Search Service - Indexing and searching of the API entities, implemented using Elasticsearch
- Tag Service - CRUD operations for the types of event tags (medium, style, geo and audience), stored using DynamoDB
- User Service - CRUD operations for the watches and preferences the users have, stored using DynamoDB

### Authentication

Admin user authentication is handled using AWS Cognito. Public user authentication is instead handled using Auth0 as passwordless authentication was required for public users and AWS Cognito does not support that authentication method (as of June 2018).

### Caching

Etags are used in the Event Service to support caching in the browser. The Etag value for an entity request is calculated when it is returned. The value is stored in Redis for recall when a subsequent request is made.

## Development

### Prerequisites

In order to run and develop the code locally, you need to install the following software:

- [Imagemagick](https://www.imagemagick.org/script/index.php) - Used for image querying and resizing in the Image Service
- [LocalStack](https://localstack.cloud/) - Used for running DynamoDB and Elasticsearch locally.

You also need to run Redis somehow. One option is to run it locally, another is to use a managed Redis service such as [RedisLabs](https://redislabs.com/).

#### Imagemagick

On Windows, install a [Windows binary release](https://www.imagemagick.org/script/download.php of Imagemagick. Make sure you tick the 'Install legacy utilities' installer option.

#### LocalStack

On Windows, you can follow these steps to install and run LocalStack:

1.  Clone the LocalStack repo
1.  CD into that clone
1.  Run the command `export COMPOSE_CONVERT_WINDOWS_PATHS=1` (because of [this issue](https://github.com/docker/for-win/issues/1829))
1.  Run the command `docker-compose up`

### Running a Service

Each service requires an `env.yml` file to exist that is populated with the appropriate values for the enviroment being run/deployed. The root directory for each service contains an `env.template.yml` file that should be copied, renamed to `env.yml` and populated appropriately. Three environments are assumed:

- Development - Run locally
- Staging - Deployed to and run on AWS
- Production - Deployed to and run on AWS

The `env.template.yml` contains the required values for the Development environment when those values are not secrets. Values with the text `<INSERT>` need to be replaced.

### Troubleshooting

###~ Port Conflicts on Windows

Use the following process to check what software is already running on a given port:

1.  Run the command `netstat -a -n -o`
1.  In the command output, get PID from the last column and check for it in the Details section of the Windows Task Manager.

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
- Outer describe(s) on every test file
- Add XRay tracing to every service
- do I need to add cloudwatch:PutMetricData permission?
- encoding issue with params in lambda integration?

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
