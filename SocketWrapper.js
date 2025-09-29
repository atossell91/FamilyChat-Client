import { MessageTypes } from "./MessageTypes.js";

class SocketWrapper extends EventTarget {
    constructor(host, port, path="/", userid) {
        super();
        const uri = this.CreateUri(host, port, path);
        this.socket = new WebSocket(uri);
        this.user = userid;

        this.socket.addEventListener("message", (event)=>{ this.DispatchMessageEvent(event) });

        this.socket.addEventListener("open", ()=> {
            this.SendObject({
                Name: this.user,
                Message: "CONNECT",
                Target: [],
                Type: MessageTypes.Connection,
            });
        });
    }

    CreateUri(host, port, path="/") {
        return "ws://" + host + ":" + port + path;
    }

    DispatchMessageEvent(event) {
        const data = JSON.parse([event["data"]]);
        this.dispatchEvent(new CustomEvent("MessageReceived", {
            detail: data
        }));
    }

    SendObject(object) {
        const msg = JSON.stringify(object);
        this.socket.send(msg);
    }

    IsActive() {
        return this.socket !== null && this.socket.readyState === 1;
    }

    Close() {
        this.socket.close();
    }
}

export { SocketWrapper }