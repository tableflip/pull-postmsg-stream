# pull-postmsg-stream

[![Build Status](https://travis-ci.org/tableflip/pull-postmsg-stream.svg?branch=master)](https://travis-ci.org/tableflip/pull-postmsg-stream)
[![dependencies Status](https://david-dm.org/tableflip/pull-postmsg-stream/status.svg)](https://david-dm.org/tableflip/pull-postmsg-stream)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Pull streams over `window.postMessage`

It provides the two parts of a [through stream](https://github.com/pull-stream/pull-stream/blob/master/docs/spec.md#through-streams): a source stream and a sink stream that can be used together to stream data over `window.postMessage`.

## Install

```sh
npm install pull-postmsg-stream
```

## Usage

To use `pull-postmsg-stream` you need two window objects. One of the window objects _has_ the data, the other _wants_ the data. Under the hood, `pull-postmsg-stream` uses [`postmsg-rpc`](https://github.com/tableflip/postmsg-rpc). If you're not familiar with it, it's a good idea to read up on how it works before continuing!

In the first window (the one that _has_ the data):

```js
const pull = require('pull-stream')
const PMS = require('pull-postmsg-stream')

pull(
  pull.values([/* your data */]),
  PMS.sink('read', {/* options passed to postmsg-rpc expose */})
)
```

In the second window (the one that _wants_ the data):

```js
const pull = require('pull-stream')
const PMS = require('pull-postmsg-stream')

pull(
  PMS.source('read', {/* options passed to postmsg-rpc caller */}),
  pull.collect(console.log) // Collects and logs out your data
)
```

1. The window that _wants_ the data calls `PMS.sink`, which **exposes** a function called "read" and returns a pull stream sink
2. The window that _has_ the data calls `PMS.source`, which creates a **caller** function for "read" and returns a pull stream source
3. In the window that _wants_ the data, the `pull(...)` pipeline starts the flow of data from the `PMS.source` stream
4. When data is requested, the `PMS.source` stream calls the exposed "read" function in the window that _has_ the data
5. This causes the `PMS.sink` stream in the window that _has_ the data to pull out of `pull.values` and return it all the way back to `pull.collect` in the window that _wants_ the data

See the [example](example) for complete code.

### Example

To build and run the [example](example), run the following in your terminal:

```sh
git clone https://github.com/tableflip/pull-postmsg-stream.git
cd pull-postmsg-stream
npm install
npm run example
```

Then open your browser at `http://localhost:3000`

## API

### `PMS.sink(readFnName, options)`

Creates a new [sink stream](https://github.com/pull-stream/pull-stream/blob/master/docs/spec.md#sink-streams) for exposing data to be pulled over `postMessage`.

* `readFnName` - the name of the function that `postmsg-rpc` will expose for a `PMS.source` stream to read from
* `options` - options passed directly to `postmsg-rpc` `expose`, see [docs here](https://github.com/tableflip/postmsg-rpc#exposefuncname-func-options)

Note that if you're going to create multiple streams, you'll need to generate a new `readFnName` for each stream and somehow communicate that to your other window so that it can create a `PMS.source` that reads from the correct place.

### `PMS.source(readFnName, options)`

Creates a new [source stream](https://github.com/pull-stream/pull-stream/blob/master/docs/spec.md#source-streams) for pulling data over `postMessage`.

* `readFnName` - the same name that was passed to `PMS.sink`, allowing the source to read from the sink
* `options` - options passed directly to `postmsg-rpc` `caller`, see [docs here](https://github.com/tableflip/postmsg-rpc#callerfuncname-options)

## Contribute

Feel free to dive in! [Open an issue](https://github.com/tableflip/pull-postmsg-stream/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
