import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { environment, mockData } from '../test-env';

export class ServerMock {
    private currentServer;
    private mockDefault = [
        http.get(`http://${environment.localHostUrl}/mapp/optiondlg`, ({ request, params, cookies }) => {
            const data = { selection: mockData.defaultSelection };
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json(data, status);
        }),
        http.post(`http://${environment.localHostUrl}/mapp/buttons/show`, ({ request, params, cookies }) => {
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json({}, status);
        }),
        http.post(`http://${environment.localHostUrl}/mapp/buttons/hide`, ({ request, params, cookies }) => {
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json({}, status);
        }),
        http.post(`http://${environment.localHostUrl}/mapp/optiondlg`, ({ request, params, cookies }) => {
            const data = { pageId: environment.optionDlgPageId };
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json(data, status);
        }),
        http.post(`http://${environment.localHostUrl}/mapp/takeFacialMasterPhoto`, ({ request, params, cookies }) => {
            const data = { pageId: environment.cameraPageId };
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json(data, status);
        }),
        http.post(`http://${environment.localHostUrl}/mapp/browsePhoto`, ({ request, params, cookies }) => {
            const data = { pageId: environment.browsePageId };
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json(data, status);
        }),
        http.get(`http://${environment.localHostUrl}/mapp/gps`, ({ request, params, cookies }) => {
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json(mockData.MockGpsAddressReturn, status);
        }),
        http.put(`http://${environment.localHostUrl}/mapp/gps`, ({ request, params, cookies }) => {
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json({}, status);
        }),
            http.post(`http://${environment.localHostUrl}/mapp/saveImage`, ({ request, params, cookies }) => {
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json(mockData.SaveImageReturn, status);
        }),
    ];

    private mockModePlayground = [
        http.post(`http://${environment.localHostUrl}/mapp/whoareyou`, ({ request, params, cookies }) => {
            const data = { mode: environment.playgroundMode, host: environment.localHostUrl };
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json(data, status);
        }),
        http.post(`http://${environment.localHostUrl}/mdev/getpageid`, ({ request, params, cookies }) => {
            const data = { pageId: environment.playgroundpageId };
            const status = { status: 200, statusText: 'OK' };
            return HttpResponse.json(data, status);
        }),
    ];

    public StartMockServer(mode: keyof ModeType) {
        switch (mode) {
            case "mana":
                {
                }
            case "playground":
                {
                    this.currentServer = setupServer(...this.mockModePlayground.concat(this.mockDefault));
                    this.currentServer.listen();
                }
            case "undefine":
            default:
                {
                    this.currentServer = setupServer(...this.mockDefault);
                }
        }
    }

    public ResetServer() {
        this.currentServer.resetHandlers();
    }

    public StopServer() {
        this.currentServer.close();
    }
}

interface ModeType {
    mana;
    playground;
    undefine;
}

