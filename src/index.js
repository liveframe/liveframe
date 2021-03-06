'use strict';

const Video = require('./FrameCapture.js').default;
const Audio = require('./AudioCapture.js').default;

class LiveFrame {
    video = null;
    audio = null;
    domain = 'https://liveframe.io';

    constructor(config) {
        this._options = config.options;
        this._token = config.token;

        this.video = new Video({
            domain: this.domain,
            token: config.token,
            streamable: this._options.streams,
            interval: config.options.interval.video,
            width: config.options.constraints.width,
            quality: config.options.constraints.quality
        });

        let audioEnabled = this._options.streams.includes('audio') ? true : false;
        this.audio = new Audio({
            domain: this.domain,
            token: config.token,
            enabled: audioEnabled,
            interval: 5000 //config.options.interval.audio
        });
    }
    start() {
        fetch(`${this.domain}/api/rtc/record`, {
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
        fetch(`${this.domain}/api/rtc/complete`, {
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