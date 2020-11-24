const Pusher = require('pusher-js');
const EventEmitter = require('eventemitter3');

class FrameCapture {
    _streamConnected = true;
    _isPaused = false;
    _streams = [];
    _running = false;
    _endpoint = 'https://liveframe.io/api/rtc/saveImage';

    constructor(config) {
        this._bearer = config.token;
        this._width = parseInt(config.width) ?? 720;
        this._interval = parseInt(config.interval) ?? 1000;
        this._streamable = config.streamable ?? [];

        this.createCanvasElement();
        this.event = new EventEmitter();

        // this.connect();
    }

    createCanvasElement = () => {
        this._canvas = document.createElement('canvas');
        this._canvas.style.display = 'none';
        this._canvas.style.marginRight = '-10000px';
        this._canvas.id = 'capture';

        document.body.appendChild(this._canvas);
    }
    addStream = newStream => {
        if (! this._streamable.find(stream => stream == newStream.type)){
            return false;
        }

        let index = this._streams.findIndex(stream => stream.type == newStream.type);
        if (index > -1) {
            this._streams[index] = newStream;
        } else {
            this._streams.push(newStream);
        }
    }
    start = () => {
        this._running = true;
        this.emit('started');

        setInterval(() => {
            if (this._isPaused) return;

            this.send();
        }, this._interval);
    }
    isRunning = () => {
        return this._running;
    }
    send = () => {
        this._streams.forEach(async stream => {
            let frame = await this.capture(stream.type);
            let data = {
                "image": frame,
                "source": stream.type,
                "timestamp": Date.now(),
            }
            fetch(this._endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this._bearer,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.log(error));
        });
    }
    capture = async (type) => {
        let source = await this._streams.find(stream => stream.type == type);
        return await source.stream.grabFrame().then(bitmap => {
            this._canvas.width = bitmap.width
            this._canvas.height = bitmap.height

            this._canvas.getContext('2d').drawImage(bitmap, 0, 0, this._canvas.width, this._canvas.height)
            return this._canvas.toDataURL('image/jpeg', 0.6).split(',')[1]
        });
    }
    pause = () => {
        this._isPaused = true;
    }
    stop = () => {
        this._isPaused = true;
    }
    resume = () => {
        this._isPaused = false;
    }
    setTimeInterval = (interval) => {
        this._interval = interval;
    }
    width = () => {
        return this._width;
    }

    emit = event => {
        this.event.emit(event);
    }

    connect() {
        Pusher.Runtime.createXHR = function () {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            return xhr;
        };
        let pusher = new Pusher('2e3b0ca7e12489ecc3a4', { 
            cluster: 'us2',
            authEndpoint: `https://liveframe.io.test/api/rtc/pusher/${this._bearer.substr(-10, 10)}`,
            auth: {
                headers: {
                    'Authorization': 'Bearer ' + this._bearer,
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        });
        let channel = pusher.subscribe('presence-' + this._bearer.substr(-10, 10));
        channel.bind('event', data => console.log(data));
    }
    // setStreamConnectedStatus = (callback, connected = false) => {
    //     this._streamConnected = connected;
    //     this._interval = !connected ? 10000 : this._defaultInterval;

    //     if( !this._running ) callback()
    // }
}

export default FrameCapture;