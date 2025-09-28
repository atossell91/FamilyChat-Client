class MessageTypes {
    static None = 0; // 0
    static Chat = 1 << 0; // 1
    static Connection = 1 << 1; // 2
}

Object.freeze(MessageTypes);

export { MessageTypes }