# Artfully London API

The main back-end code for the Artfully London website. An example of a GraphQL back-end implemented entirely using AWS Lambda nanoservices, written in Node.js and deployed using the Serverless framework.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

The Artfully London website allows a user to search and view current and upcoming art-related events in London. There is also an admin website for creating and editing the site data.

This repository contains the API that supports this functionality. It is composed of multiple AWS Lambda nanoservices that have been logically grouped together into the following microservices:

- Data Service - Serves the sitemap file and static data required by the public or admin websites
- Event Service - CRUD operations for the event, event series, talent and venue entities, stored using DynamoDB
- Image Service - Transcoding of event, event series, talent and venue images
- Search Service - Indexing and searching of the API entities using Elasticsearch
- Tag Service - CRUD operations for the types of event tags (medium, style, geo and audience), stored using DynamoDB
- User Service - CRUD operations for the watches and preferences the users have, stored using DynamoDB
- GraphQL Service - Stitches together all the above services so that there is a single GraphQL service for the entire system. There are two GraphQL endpoints, one for the services required by the public site (Data, Search and User) and one for the services required by the admin site (Data, Event, Image, Search and Tag).

### Authentication

Admin user authentication is handled using AWS Cognito while public user authentication is handled using Auth0. (Passwordless authentication was required for public users and AWS Cognito does not support that authentication method, as of June 2018.)

## Development

### Prerequisites

In order to run and develop the code locally, you need to install the following software:

- [Imagemagick](https://www.imagemagick.org/script/index.php) - Used for image querying and resizing in the Image Service (instructions below)
- [LocalStack](https://localstack.cloud/) - Used for running DynamoDB and Elasticsearch locally (instructions below)

You also need to run Redis somehow. One option is to run it locally, while another is to use a managed Redis service such as [RedisLabs](https://redislabs.com/).

#### Imagemagick

On Windows, install a [Windows binary release](https://www.imagemagick.org/script/download.php) of Imagemagick. Make sure to tick the 'Install legacy utilities' installer option.

#### LocalStack

On Windows, you can follow these steps to install and run LocalStack:

1.  Clone the LocalStack repo
1.  Cd into that clone
1.  Run the command `export COMPOSE_CONVERT_WINDOWS_PATHS=1` (because of [this issue](https://github.com/docker/for-win/issues/1829))
1.  Run the command `docker-compose up`

#### Authentication

When running the services locally, Cognito authentication is disabled. When running on a different environment, you need to have created a Cognito user pool for it. The instructions to do that are [here](https://stackoverflow.com/a/45253010).

When running the User Service on any environment, you need to have created an Auth0 passwordless authentication account.

### Running a Service

Each service requires an `env.yml` file to exist that is populated with the appropriate values for the enviroment being run or deployed. The root directory for each service contains an `env.template.yml` file that should be copied, renamed to `env.yml` and populated appropriately. Three environments are assumed:

- Development - The services are run locally using [serverless-offline](https://github.com/dherault/serverless-offline) and LocalStack
- Staging - The services are deployed to and run on AWS
- Production - The services are deployed to and run on AWS

The `env.template.yml` contains the required values for the Development environment when those values are not secrets. Values with the text `<INSERT>` need to be replaced.

#### Localhost Ports

- 3010 Data Service
- 3011 Tag Service
- 3012 User Service
- 3013 Search Service
- 3014 Event Service
- 3015 GraphQL Service
- 3016 Image Service
- 3019 Mock SNS Listener
- 3021 Mock JWKS Server

### Troubleshooting

#### Port Conflicts on Windows

Use the following process to check what software is already running on a given port:

1.  Run the command `netstat -a -n -o`
1.  In the command output, get PID from the last column and check for it in the Details section of the Windows Task Manager.

#### Checking Dynamodb Local

```
aws dynamodb list-tables --endpoint-url http://localhost:4569
aws dynamodb delete-table --endpoint-url http://localhost:4569 --table-name artfullylondon-development-preferences
```

## Todo

- Add AWS Cognito serverless configuration to the serverless files? (I think serverless supports AWS Cognito configuration now. Problem is it is not needed locally.)
- See about CORS origin restrictions for getting images from resized and original S3 buckets.
- DLQs: https://serverless.com/framework/docs/providers/aws/guide/functions/
- IfNoneMatch bad string problem when sending etag in request.
- Upgrade apollo-server-lambda to latest when release candidate finalised.
- Sort out graphql-service graphql dependency.
- Improve graphql validation to be able to partially replace the legacy validation.
- Remove redis.
- GraphQL info links:
  - Useful regex /[^\w{}]+/g
  - Database request batching https://github.com/facebook/dataloader
  - https://www.apollographql.com/engine
- Fix Jest not reporting correct line numbers (transpilation issue).
- Look into using [joi](https://github.com/hapijs/joi) or [yup](https://www.npmjs.com/package/yup) for validation.
- Change from dynamodb to postgres.

## Info

- [Using nvm in Windows](https://github.com/coreybutler/nvm-windows)
- [Git creds manager in Windows](https://github.com/Microsoft/Git-Credential-Manager-for-Windows)

## License

[MIT](LICENSE)
