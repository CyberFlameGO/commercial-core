# @guardian/commercial-core

[![npm (scoped)](https://img.shields.io/npm/v/@guardian/commercial-core)](https://www.npmjs.com/package/@guardian/commercial-core)
[![ES version](https://badgen.net/badge/ES/2020/cyan)](https://tc39.es/ecma262/2020/)
[![npm type definitions](https://img.shields.io/npm/types/@guardian/commercial-core)](https://www.typescriptlang.org/)
[![Coverage Status](https://coveralls.io/repos/github/guardian/commercial-core/badge.svg?branch=main)](https://coveralls.io/github/guardian/commercial-core?branch=main)

> Guardian advertising business logic

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Installation](#installation)
  - [Bundling](#bundling)
- [Development](#development)
  - [Requirements](#requirements)
  - [Releasing](#releasing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

[![Generic badge](https://img.shields.io/badge/google-chat-259082.svg)](https://chat.google.com/room/AAAAPL2MBvE)

```bash
yarn add @guardian/commercial-core
```

or

```bash
npm install @guardian/commercial-core
```

### Bundling

This package uses `ES2020`.

If your target environment does not support that, make sure you transpile this package when bundling your application.

## Development

### Requirements

1. [Node 14](https://nodejs.org/en/download/) ([nvm][] or [fnm][] recommended)
2. [Yarn](https://classic.yarnpkg.com/en/docs/install/)

[nvm]: https://github.com/nvm-sh/nvm
[fnm]: https://github.com/Schniz/fnm

### Releasing

Changes are automatically released to NPM.

The `main` branch on GitHub is analysed by [semantic-release](https://semantic-release.gitbook.io/) after every push.

If a commit message follows the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0), semantic-release can determine what types of changes are included in that commit.

If necessary, it will then automatically release a new, [semver](https://semver.org/)-compliant version of the package to NPM.

#### Pull requests

Try to write PR titles in the conventional commit format, and [squash and merge](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-request-merges#squash-and-merge-your-pull-request-commits) when merging. That way your PR will trigger a release when you merge it (if necessary).
