import { IMonetaryValue } from "./IMonetaryValue";
import { IShippingAddress } from "./IShippingAddress";

export interface IManaLibProvider {
    getUrl(host: string, pathAndQuery: string): string;
    getUrl(pathAndQuery: string): string;
    showOptionDlg(flow: string, mode: string, selection?: any, button1?: string, button2?: string, size?: string): Promise<any>;
    getDefaultSelection(): Promise<any>;
    visit(path: string): void;
    visit(subscriptionid: string, path: string): void;
    toAmount(value: IMonetaryValue): number;
    toText(value: IMonetaryValue, format?: string): string;
    getDateText(date: any, format?: string): string;
    takeFacialMasterPhoto(): Promise<any>;
    getGpsAddress(): Promise<any>;
    setGpsAddress(address: IShippingAddress): Promise<any>;
    browsePhoto(): Promise<any>;
    browsePhoto(attachid: string): Promise<any>;
    getPhotoInfo(attachid: string): Promise<any>;
    deletePhotoInfo(attachid: string): Promise<any>;
    saveImage(content: any, name?:string): Promise<any>;
    updateGps(callback: (data: any) => void): void;
}