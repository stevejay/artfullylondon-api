# Artfully London API

The main back-end code for the Artfully London website. An example of a back-end implemented entirely using AWS Lambda nanoservices, all written in Node.js and deployed using the Serverless framework.

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

### Authentication

Admin user authentication is handled using AWS Cognito while public user authentication is handled using Auth0. (Passwordless authentication was required for public users and AWS Cognito does not support that authentication method, as of June 2018.)

### Caching

Etags are used in the Event Service to support caching in the browser. The Etag value for an entity request is calculated when it is returned. The value is stored in Redis for recall when a subsequent request with an Etag is made.

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

### Troubleshooting

#### Port Conflicts on Windows

Use the following process to check what software is already running on a given port:

1.  Run the command `netstat -a -n -o`
1.  In the command output, get PID from the last column and check for it in the Details section of the Windows Task Manager.

## Todo

- Add AWS Cognito serverless configuration to the serverless files? (I think serverless supports AWS Cognito configuration now. Problem is it is not needed locally.)
- Do I need to add cloudwatch:PutMetricData permission?
- Is there an encoding issue with params in lambda integration when using serverless local?
- See about CORS origin restrictions for getting images from resized and original S3 buckets.
- Delete the staging table 'artfullylondon-development-iteration-log'
- Improve error handling on iterators.
- Do full validation of entities to index that are received by search service?
- Check further on the search service integration test flakiness.
- Update launch settings.

## Info

- [Using nvm in Windows](https://github.com/coreybutler/nvm-windows)
- [Git creds manager in Windows](https://github.com/Microsoft/Git-Credential-Manager-for-Windows)

## License

[MIT](LICENSE)
