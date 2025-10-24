import { Client, Server as SocketServer } from 'mock-socket';
import { environment } from '../test-env';

export class SocketMock {
    private fakeURL = environment.fakeSocketURL;
    private mockSockertServer;
    private resolver;
    private SocketInstance = new Promise<Client>((res, rej) => {
        this.resolver = res;
    });

    public GetSocketClient(): Promise<Client> {
        return this.SocketInstance;
    };

    public StartSocket() {
        this.mockSockertServer = new SocketServer(this.fakeURL);
        this.mockSockertServer.on('connection', socket => {
            console.log("connection");
            this.resolver(socket);
        });
    }
}
