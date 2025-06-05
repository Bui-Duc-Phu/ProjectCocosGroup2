const EventEmitter = require('events');

class Emitter {
    constructor() {
        this.emitter = new EventEmitter();
        this.emitter.setMaxListeners(100);
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

    registerEventMap(eventMap) {
        if (this.emitter) {
            for (const [event, listener] of Object.entries(eventMap)) {
                this.emitter.on(event, listener);
            }
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
        }
    }
}

const instance = new Emitter();

module.exports = instance;