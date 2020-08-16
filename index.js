'strict';

const LiveFrame = {};

Object.defineProperties(LiveFrame, {
    video: {
        value: require('./lib/FrameCapture.js')
    },
    audio: {
        value: require('./lib/AudioCapture.js')
    }
});

module.exports = LiveFrame;