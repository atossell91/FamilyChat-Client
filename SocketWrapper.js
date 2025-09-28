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
                Target: "None",
                Type: MessageTypes.Connection,
            });
        });
    }

    CreateUri(host, port, path="/") {
        return "ws://" + host + ":" + port + path;
    }

    DispatchMessageEvent(event) {
        this.dispatchEvent(new CustomEvent("MessageReceived", event));
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