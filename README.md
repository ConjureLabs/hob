# Hob

Hob (short for Hobgoblin) does chores in the background, helping your app run smoothly.

Hob is a framework of frameworks, and can be used to do the following:

- :white_check_mark: run [next.js](https://github.com/zeit/next.js) apps w/ express servers
- :white_check_mark: lint checks
- :white_check_mark: structured client assets

## Setup

```sh
npm install --save @conjurelabs/hob
```

or

```sh
yarn add @conjurelabs/hob
```

## Dev

`hob dev`

`dev` runs your dev environment.

It will transpile certain things, reset the db if you want, and then start up the express serve

## Start

`hob start`

Runs the app, meant for Production.

It does not transpile or otherwise prepare the app, since it should be pre-built.

## Compiling

`hob compile`

Similar to `hob build`, but does not fire `next build`, and does not minify or munge any transpiled code.

## Building

`hob build`

`build` is meant to generate production-ready builds. This will:

1. transpile styles
2. generate client config
3. [`next build`](https://github.com/zeit/next.js#production-deployment)

## Lints

`hob lint`

This will run lints and coding style checks on your project. It uses defaults set by Hob.

You can override the defaults by adding the following to your project's root dir:

- `.eslintrc`
- `.jscsrc`
