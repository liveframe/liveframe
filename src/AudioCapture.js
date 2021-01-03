class AudioCapture {
    _running = false;
    _finished = false;

    constructor(config) {
        this._bearer = config.token;
        this._endpoint = `${config.domain}/api/rtc/saveAudio`;
        this._interval = config.interval ?? 5000;
        this._enabled = config.enabled ?? false;

        this.createElement();
    }
    createElement = () => {
        this._audio = document.createElement('audio');
        this._audio.muted = true;
        this._audio.style.display = 'none';
        this._audio.style.marginRight = '-10000px';

        document.body.appendChild(this._audio);
    }
    addStream = stream => {
        if (! this._enabled){
            return false;
        }

        this._audio.srcObject = stream;
        this._audio.onloadedmetadata = () => {
            this._audio.play();
        };

    }
    start = () => {
        this._running = true;

        let chunks = [];
        let recorder = new MediaRecorder(this._audio.srcObject, { type: 'audio/ogg; codecs=opus' });

        recorder.ondataavailable = e => chunks.push(e.data)
        recorder.start(100);

        setInterval(() => {
            if (this._finished) {
                recorder.state == 'recording' ? recorder.stop() : '';
                return false;
            }

            let audioBlob = new Blob(chunks.splice(0,chunks.length), {'type': recorder.mimeType});

            if (this._running) {
                this.send(audioBlob);
            }
        }, this._interval);
    }
    pause = () => {
        this._running = false;
    }
    stop = () => {
        this._finished = true;
    }
    resume = () => {
        this._running = true;
    }
    isPaused = () => {
        return this._running;
    }
    send = chunk => {
        console.log(chunk);
        var reader = new FileReader();
        reader.readAsDataURL(chunk); 
        reader.onloadend = () => {
            var base64data = reader.result;
            let data = {
                "blob": base64data,
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
        }
    }
}

export default AudioCapture;