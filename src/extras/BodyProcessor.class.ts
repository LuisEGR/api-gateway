import { EventEmitter } from "events";
import {smallJSON} from '../extras/smallJson';
export class BodyProcessor extends EventEmitter {
    public ready: boolean = false;
    private body: string = '';
    constructor() {
        super();
    }

    public save(chunk: any) {
        if (!this.body) this.body = '';
        this.body += chunk.toString();
    }

    public getBody() {
            try {
                const data = JSON.parse(this.body);
                return JSON.stringify(data, smallJSON, 4);
            } catch (e) {
                return this.body.slice(0, 150) + "\n...";
            }
    }
}


// class MyEmitter extends EventEmitter {}

// const myEmitter = new BodyProcessor();
// myEmitter.on('ready', () => {
//   console.log('an event occurred!');
// });
// myEmitter.end();
