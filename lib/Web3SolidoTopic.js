"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Web3SolidoTopic {
    constructor() {
        this.next = [];
    }
    topic(value) {
        this.next = [...this.next, value];
        return this;
    }
    or(value) {
        this.next = [...this.next, value];
        return this;
    }
    and(value) {
        this.next = [[...this.next, value]];
        return this;
    }
    get() {
        return this.next;
    }
}
exports.Web3SolidoTopic = Web3SolidoTopic;
