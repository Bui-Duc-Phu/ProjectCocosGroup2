const EventEmitter = require('events');

class Emitter {
    constructor() {
        this.emitter = new EventEmitter();
    }

    emit(...args) {
        if (this.emitter) {
            this.emitter.emit(...args);
        }
    }

    registerEvent(event, listener) {
        if (this.emitter) {
            this.emitter.on(event, listener);
        }
    }

    registerOnce(event, listener) {
        if (this.emitter) {
            this.emitter.once(event, listener);
        }
    }

    removeEvent(event, listener) {
        if (this.emitter) {
            this.emitter.removeListener(event, listener);
        }
    }

    destroy() {
        if (this.emitter) {
            this.emitter.removeAllListeners();
            this.emitter = null;
        }
    }
}

const instance = new Emitter();

module.exports = instance;