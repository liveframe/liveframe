'use strict';

const Video = require('./FrameCapture.js').default;
const Audio = require('./AudioCapture.js').default;

class LiveFrame {
    video = null;
    audio = null;

    constructor(config) {
        this._options = config.options;
        this._token = config.token;

        if (this._options.streams.includes('webcam', 'screenshare')) {
            this.video = new Video({
                token: config.token,
                interval: config.options.interval.video,
                // width: config.options.constraints.width,
                quality: config.options.constraints.quality
            });
        }

        if (this._options.streams.includes('audio')) {
            this.audio = new Audio({
                token: config.token,
                interval: config.options.interval.audio
            });
        }
    }
    start() {
        fetch('https://liveframe.io.test/api/rtc/record', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this._token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(response => response.json())
        .then(() => {
            if (this.video) this.video.start();
            if (this.audio) this.audio.start();

            return true;
        })
        .catch(error => {
            console.log(error)
            return false;
        });
    }
    stop() {
        if (this.video) this.video.stop();
        if (this.audio) this.audio.stop();
        fetch(`https://liveframe.io.test/api/rtc/complete`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this._token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    }
}

export default LiveFrame;