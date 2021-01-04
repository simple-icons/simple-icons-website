# Contributing to Simple Icons Website

Simple Icons welcomes contributions and corrections. Before contributing, please make sure you have read the guidelines below. If you decide to contribute anything, please do the following:

1. Fork this repository
1. Create [a new branch][github flow] from the latest `develop`
1. Start hacking on the new branch
1. Commit and push to the new branch
1. Make a pull request

If you want to request an icon, please [open an issue here][new icon request].

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
| `npm run serve` | Serve the files in the `_site/` directory. |
| `npm run test` | Run the test suites for the website. |

[github flow]: https://guides.github.com/introduction/flow/
[new icon request]: https://github.com/simple-icons/simple-icons/issues/new?labels=new+icon&template=icon_request.md
[NodeJS]: https://nodejs.org/en/download/
