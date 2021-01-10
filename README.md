# LiveFrame JS Client

Send user streams to the LiveFrame service.

## Installation

Require the package using npm:

```bash
npm i @liveframe/liveframe
```

## Usage

```js
import LiveFrame from 'liveframe';

const liveframe = new LiveFrame({
    token: token,
    options: options
});

liveframe.video.addStream({
    type: type,
    stream: new ImageCapture(stream_track),
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](./LICENSE.md)