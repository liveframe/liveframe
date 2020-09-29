'use strict';

const Video = require('./FrameCapture.js').default;
const Audio = require('./AudioCapture.js').default;

class LiveFrame {
    video = null;
    audio = null;

    constructor(config) {
        this.#options = config.options;

        if (this.#options.includes('webcam', 'screenshare')) {
            this.video = new Video({
                token: config.token,
                interval: config.interval.video,
                // width: config.constraints.width,
                quality: config.constraints.quality
            });
        }

        if (this.#options.includes('audio')) {
            this.audio = new Audio({
                token: config.token,
                interval: config.interval.audio
            });
        }
    }
    start() {
        if (this.video) this.video.start();
        if (this.audio) this.audio.start();
    }
    stop() {
        if (this.video) this.video.stop();
        if (this.audio) this.audio.stop();
    }
}

export default LiveFrame;