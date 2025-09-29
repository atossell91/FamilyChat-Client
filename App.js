import { SocketWrapper } from "./SocketWrapper.js";
import { MessageTypes } from "./MessageTypes.js";

class App {
    constructor() {
        this.Connection = null;

        this.nameElem = document.getElementById("name");
        this.messageElem = document.getElementById("message");
        this.targetElem = document.getElementById("target");

        this.btnSend = document.getElementById("btn-send");
        this.btnConnect = document.getElementById("btn-connect");
        this.btnClose = document.getElementById("btn-close");

        this.messageArea = document.getElementById("message-area");

        this.btnSend.addEventListener("click", ()=>{ this.SendMessage(); });
        this.btnConnect.addEventListener("click", ()=>{ this.Connect(); });
        this.btnClose.addEventListener("click", ()=>{ this.CloseSocket(); });
    }

    Run() {}

    CloseSocket() {
        this.Connection.Close();
    }

    Connect() {
        if (this.nameElem.value === "") {
            console.log("Name Element is empty!");
            return;
        }

        this.Connection = new SocketWrapper("localhost", 5178, "/ws", "Ant");

        this.Connection.addEventListener("MessageReceived", (event)=>{ this.HandleMessage(event) });
    }

    CreateMessageBubble(messageType, messageData) {
        const elem = document.createElement("div");
        
        const className = messageType === "user" ? "message-bubble-self" : "message-bubble-other";
        elem.setAttribute("class", "message-bubble " + className);

        elem.innerText = messageData;

        return elem;
    }

    HandleMessage(ev) {
        //console.log(ev.detail.Name);
        const msgelem = this.CreateMessageBubble("other", ev.detail.Message);
        this.messageArea.appendChild(msgelem);
    }

    PushMessage() {
        const msgStr = this.messageElem.value;
        this.messageElem.value = "";
        const elem = this.CreateMessageBubble("self", msgStr);

        this.messageArea.appendChild(elem);
    }

    SendMessage() {
        if (this.Connection === null || !this.Connection.IsActive() || this.messageElem.value === "") {
            console.log("The connection is bad, or there is no data to send");
            return;
        }

        const nameStr = this.nameElem.value;
        const msgStr = this.messageElem.value;
        const obj = {
            Name: nameStr,
            Message: msgStr,
            Target: ["Ant"],
            Type: MessageTypes.Chat,
        };
        this.Connection.SendObject(obj);

        this.PushMessage();
    }
}

export { App }