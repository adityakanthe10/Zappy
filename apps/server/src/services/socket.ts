import {Server} from "socket.io";

class SocketService{

    private _io: Server;

    constructor(){
        console.log("Init socket service");
        this._io = new Server();
    }

    get io(){
        return this._io
    }
}

// singleton pattern
const socketservice = new SocketService();
export default socketservice;
export const getSocket= () => socketservice.io;