# Contributing to Simple Icons Website

Simple Icons welcomes contributions and corrections. Before contributing, please make sure you have read the guidelines below. If you decide to contribute anything, please do the following:

1. Fork this repository
1. Create [a new branch][github flow] from the latest `develop`
1. Start hacking on the new branch
1. Commit and push to the new branch
1. Make a pull request

If you want to request an icon, please [open an issue here][new icon request].

## Table of contents

* [Local development](#local-development)
  * [Development commands](#development-commands)
  * [Using Docker](#using-docker)

## Local Development

* Make sure you have [NodeJS] installed. At least version 12.16.0 is required.
* Install the dependencies using `$ npm install`.
* Build the website using `$ npm run build`.
* Serve the website using `$ npm run serve`.
* Connect to the website in your browser via the _"Running at"_ provided by the output of this command, e.g. http://localhost:8080/

### Development commands

The repository defines the following commands that can be used for development purposes.

| Command | Purpose |
| :---- | :---- |
| `npm run build` | Build the website for production purposes. |
| `npm run build:dev` | Build the website for development purposes. |
| `npm run build:watch` | Continuously build the website for development purposes. |
| `npm run clean` | Remove all generated files from the repository. |
| `npm run format` | Format the source code of the project. |
| `npm run lint` | Lint the source code of the project. |
| `npm run serve` | Serve the files in the `_site/` directory. |
| `npm run serve:watch` | Run `build:watch` and `serve` in parallel. |
| `npm run test` | Run all unit test suites. |
| `npm run test:all` | Run all unit & end-to-end test suites. |
| `npm run test:e2e` | Run all end-to-end test suites. |
| `npm run test:unit` | Run all unit test suites. |
| `npm run locale` | Update translations files located at `locales/`. |

### Using Docker

You can build a Docker image for this project from the Dockerfile. This image can be used to instantiate a container serving the simple-icons website. If you attach the container to the project folder local changes will be reflected by the this webserver.

```bash
# Navigate to the project root
$ cd simple-icons-website

# Build the Docker image for the simple-icons-website (if you haven't yet)
$ docker build . -t simple-icons/website

# Start a container running `npm run serve:watch` in the background. The value
# of the --volume option ensures local changes in /public folder are reflected
# by the webserver
$ docker run -d -p 8080:8080 --rm --volume $PWD/public:/website/public --name simple-icons-webserver simple-icons/website

# Inspect the server logs
$ docker logs simple-icons-webserver

# Stop the server (and delete the container)
$ docker stop simple-icons-webserver
```

Alternatively, you can use it to create a container and attach to it. This would allow you to use it as a development environment.

```bash
# Start a container and attach a shell
$ docker run -it --entrypoint "/bin/ash" --name simple-icons-website-dev simple-icons/website

# Do anything you want, e.g. linting the source code
/website$ npm run lint

# Remove the container when you don't need it anymore
$ docker rm simple-icons-website-dev
```

[github flow]: https://guides.github.com/introduction/flow/
[new icon request]: https://github.com/simple-icons/simple-icons/issues/new?labels=new+icon&template=icon_request.yml&title=Request%3A+
[NodeJS]: https://nodejs.org/en/download/
