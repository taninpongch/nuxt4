import { IManaLibProvider } from './contracts/IManaLibProvider'
import { ManaLibProvider } from './ManaLibProvider';

console.log("Welcome from ManaLib");

var baseUrl = "http://localhost:9000";
var socket: WebSocket;
var socketMapper: Map<string, any> = new Map<string, any>();
var environment = new Promise<any>((res, rej) => { environmentresolver = res });
var environmentresolver: any;
var pageid = new Promise<any>((res, rej) => { pageidResolver = res });
var pageidResolver: any;
var setupConnectToMana = new Promise((resolve, reject) => {
    socketReadyResolver = resolve;
    socketReadyRejector = reject;
});
var socketReadyResolver: any;
var socketReadyRejector: any;

setupEnvironment();

if ((<any>window).pageId) {
    pageidResolver((<any>window).pageId)
} else {
    (<any>window).setPageId = (pageId: string) => {
        pageidResolver(pageId);
    }
}

async function getPageid(): Promise<any> { return pageid }

export async function setupEnvironment() {
    var contextresult = await whoamI();

    if (contextresult.mode == "undefine") {
        pageidResolver("");
    }
    else if (contextresult.mode == "playground") {
        setTimeout(async () => {
            if (!pageid) {
                var getpageid = (await (await fetch(`${baseUrl}/mdev/getpageid`, { method: "POST" })).json()).pageId;
                pageidResolver(getpageid);
            }
        }, 300);
    }

    var pageid = await getPageid();

    try {
        await setupWebsocket(`ws://${contextresult.host}/mana`, pageid);
    } catch (ex) { }

    environmentresolver({ pageid: pageid, mode: contextresult.mode, host: contextresult.host });
}

function setupWebsocket(url: string, pageid: string): Promise<any> {
    var loopCounting = 0;
    var retry = setInterval(
        () => {
            let data = JSON.stringify({ Id: pageid, IsMContent: true });
            console.log("Sending socket to Mana:", data);
            socket.send(data);
            loopCounting++;
            if (loopCounting == 20) {
                clearInterval(retry);
                socketReadyRejector();
            }
        }
        , 100);

    socket = new WebSocket(url);
    socket.onmessage = (event) => {
        console.log("WebSocket message received:", JSON.stringify(event.data));
        var data = JSON.parse(event.data);

        if (data.PageId) {
            clearInterval(retry);
            socketReadyResolver(data.PageId);
        }
        switch (data.Action?.toLocaleLowerCase()) {
            case "submit".toLocaleLowerCase(): {
                if (socketMapper.has(data.ButtonId)) {
                    socketMapper.get(data.ButtonId)(data);
                }
                break;
            }
            case "typeinput".toLocaleLowerCase(): {
                if (socketMapper.has(data.InputId)) {
                    socketMapper.get(data.InputId)(data);
                }
                break;
            }
            case "submitselection".toLocaleLowerCase(): {
                if (socketMapper.has(data.PageId)) {
                    socketMapper.get(data.PageId)(data);
                }
                break;
            }
            case "takefacialmasterphoto".toLocaleLowerCase(): {
                if (socketMapper.has(data.PageId)) {
                    socketMapper.get(data.PageId)(data);
                }
                break;
            }
            case "browsephoto".toLocaleLowerCase(): {
                if (socketMapper.has(data.PageId)) {
                    socketMapper.get(data.PageId)(data);
                }
                break;
            }
            case "updategps".toLocaleLowerCase(): {
                if (socketMapper.has(data.PageId)) {
                    socketMapper.get(data.PageId)(data);
                }
                break;
            }
            default: break;
        }
    };

    socket.onerror = (err) => {
        console.error("WebSocket error:", err);
    };

    socket.onopen = () => {
        console.log("WebSocket connected");
    };

    // socket.onclose = (event) => {
    //     console.warn("WebSocket closed: ", event);
    //     setupWebsocket(url, pageid);
    // };

    return setupConnectToMana;
}

async function whoamI(): Promise<any> {
    try {
        return await (await fetch(`${baseUrl}/mapp/whoareyou`, { method: "POST" })).json();
    }
    catch {
        return { mode: "undefine", host: "" };
    }
}

export async function getManaContext(): Promise<IManaLibProvider> {
    var env = await getEnvirontment();
    return new ManaLibProvider(`http://${env.host}`, env.pageid, socketMapper);
}

export async function getEnvirontment(): Promise<any> {
    return environment;
}

export async function registerSocketmapper(id: string, callback: (data: any) => void) {
    socketMapper.set(id, callback);
}