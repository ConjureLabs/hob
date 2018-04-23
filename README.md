<kbd>hob</kbd>

![](https://media0.giphy.com/media/FD3of7ehZt4li/giphy.gif)

Hob (short for Hobgoblin) does chores in the background, helping your app run smoothly. Usually.

Hob is a framework of frameworks, to enforce an opinionated setup on Conjure projects.

### Setup

```sh
npm install --save @conjurelabs/hob
```

or

```sh
yarn add @conjurelabs/hob
```

### Dev

`hob dev`

`dev` runs your dev environment.

It will transpile certain things, reset the db if you want, and then start up the express server.

### Building

`hob build`

`build` is meant to generate production-ready builds. This will:

1. transpile styles
2. generate client config
3. [`next build`](https://github.com/zeit/next.js#production-deployment)

### Compiling

`hob compile`

Similar to `hob build`, but does not fire `next build`, and does not minify or munge any transpiled code.

### Lints

`hob lint`

This will run lints and coding style checks on your project. It uses defaults set by Hob.

You can override the defaults by adding the following to your project's root dir:

- `.eslintrc`
- `.jscsrc`
