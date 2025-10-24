import { IManaLibProvider } from './contracts/IManaLibProvider';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { IMonetaryValue } from './contracts/IMonetaryValue';
import { ShippingAddress } from './contracts/IShippingAddress';

TimeAgo.addLocale(en);

export class ManaLibProvider implements IManaLibProvider {
  private baseUrl: string;
  private pageId: string;
  private socketMapper: Map<string, any>;

  constructor(baseUrl: string, pageId: string, optionDialogMapper: Map<string, Promise<any>>) {
    this.baseUrl = baseUrl;
    this.pageId = pageId;
    this.socketMapper = optionDialogMapper;
  }

  public getUrl(host: string, pathAndQuery: string): string;

  public getUrl(pathAndQuery: string): string;

  getUrl(arg1: string, arg2?: string): string {
    if (arg1.startsWith('/')) arg1 = arg1.substring(1);
    if (arg2?.startsWith('/')) arg2 = arg2?.substring(1);

    if (arg2) {
      var host = arg1;
      var pathAndQuery = arg2;
      if (!host && !pathAndQuery) {
        return "";
      }
      else if (host == "local.onmana.app") {
        if (pathAndQuery.startsWith("api/")) pathAndQuery = pathAndQuery.replace("api/", `api/${this.pageId}/`)
        return `${this.baseUrl}/${pathAndQuery}`;
      }
      else {
        var startWithHttp = host?.startsWith("https://") || host?.startsWith("http://");
        if (startWithHttp) {
          var errorTxt = "getutl must not start with http:// or https://";
          console.error(errorTxt);
          return errorTxt;
        }
        else return `https://${host}/${pathAndQuery}`;
      }
    } else {
      var pathAndQuery = arg1;

      if (!pathAndQuery) {
        return "";
      }

      if (pathAndQuery.startsWith("api/")) pathAndQuery = pathAndQuery.replace("api/", `api/${this.pageId}/`)

      return `${this.baseUrl}/${pathAndQuery}`;
    }
  }

  public async showOptionDlg(flow: string, mode: string, selection?: any, button1?: string, button2?: string, size?: string): Promise<any> {
    var url = this.getUrl(`mapp/optiondlg`);
    var showoptiondlgresult = await fetch(url, {
      method: 'POST',
      headers: {
        "PageId": this.pageId
      },
      body: JSON.stringify({
        "flow": flow,
        "mode": mode,
        "selection": selection,
        "button1": button1,
        "button2": button2,
        "size": size
      }),
    });

    var dlgId = (await showoptiondlgresult.json()).pageId;
    var resolver: any;
    var result = new Promise<any>((res, rej) => { resolver = res });
    this.socketMapper.set(dlgId, (data: any) => {
      var result = { isCancel: data.IsCancel, selection: JSON.parse(data.Selection) }
      resolver(result)
    });
    return await result;
  }

  public async getDefaultSelection(): Promise<any> {
    var url = this.getUrl(`mapp/optiondlg`);
    var showoptiondlgresult = await fetch(url, {
      method: 'GET',
      headers: {
        "PageId": this.pageId
      }
    });

    var json = await showoptiondlgresult.json();
    return JSON.parse(json.selection);
  }

  public visit(path: string): void;

  public visit(subscriptionid: string, path: string): void;

  visit(arg1: string, arg2?: string): void {
    var url: string;

    if (arg2) {
      const subscriptionid = arg1;
      const path = arg2;
      url = this.getUrl(`mapp/${this.pageId}/subscriptions/${subscriptionid}/visit/${path}`);
    } else {
      const path = arg1;
      url = this.getUrl(`mapp/${this.pageId}/self/visit/${path}`);
    }

    fetch(url, {
      method: 'POST',
      headers: {
        "PageId": this.pageId
      }
    });
  }

  public toAmount(value: IMonetaryValue): number {
    var preAmount = value.amountUnit / 1000;
    return Math.round(preAmount * 1e6) / 1e6;
  }

  public toText(value: IMonetaryValue, format?: string): string {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    var amount = this.toAmount(value);
    var toDecimalamount = amount.toLocaleString('en', options);
    
    switch (format) {
      case "amt":
        return toDecimalamount;
      case "cur":
        return value.currency;
      // TODO: implement abb case
      // case "abb":
      //     this.pyodide.globals.set("obj", { amount: this.GetMonetaryAmount(monetary) });
      //     this.pyodide.runPython(this.pythonScript);
      //     var abbValue = this.pyodide.globals.get("GetAbbreviatedAmount");
      //     return `${abbValue()} ${monetary.currency}`;
      case "all":
      default:
        return `${toDecimalamount}${value.currency ? " " + value.currency : ""}`;
    }
  }

  public getDateText(date: any, format?: string): string {
    var dateFormat = new Date(date);
    if (isNaN(dateFormat.valueOf())) return "Invalid";
    if (dateFormat.getFullYear() < 0) return "Invalid";
    var day = dateFormat.getDate();
    var month = dateFormat.getMonth() + 1;
    var year = dateFormat.getFullYear();
    var hour = dateFormat.getHours().toString().padStart(2, "0");
    var minute = dateFormat.getMinutes().toString().padStart(2, "0");
    var second = dateFormat.getSeconds().toString().padStart(2, "0");
    var timezoneOffset = dateFormat.getTimezoneOffset();
    var reverttimeOffsetH = Math.floor(Math.abs(timezoneOffset) / 60).toString().padStart(2, "0");
    var reverttimeOffsetM = (Math.abs(timezoneOffset) % 60).toString().padStart(2, "0");
    var timezone = `UTC${timezoneOffset > 0 ? "-" : "+"}${reverttimeOffsetH}:${reverttimeOffsetM}`;

    const timeAgo = new TimeAgo('en-US')

    switch (format) {
      case "date":
        return `${day}/${month}/${year}`;
      case "time":
        return `${hour}:${minute}`;
      case "tmws":
        return `${hour}:${minute}:${second}`;
      case "tmdt":
        return `${hour}:${minute} (${day}/${month}/${year})`;
      case "zone":
        return `${day}/${month}/${year} (${hour}:${minute} ${timezone})`;
      case "agos":
        return timeAgo.format(dateFormat, 'mini').toString();
      case "agof":
        return timeAgo.format(dateFormat, 'round').toString();
      case "full":
      default:
        return `${day}/${month}/${year} (${hour}:${minute})`;
    }
  }

  public async takeFacialMasterPhoto(): Promise<any> {
    var url = this.getUrl(`mapp/takeFacialMasterPhoto`);
    var showCameraResult = await fetch(url, {
      method: 'POST',
      headers: {
        "PageId": this.pageId
      }
    });

    var cameraPageId = (await showCameraResult.json()).pageId;
    var resolver: any;
    var result = new Promise<any>((res, rej) => { resolver = res });
    this.socketMapper.set(cameraPageId, (data: any) => {
      var result = { isCancel: data.IsCancel, selection: JSON.parse(data.Selection) }
      resolver(result)
    });
    return await result;
  }

  public async browsePhoto(): Promise<any>;
  public async browsePhoto(attachId: string): Promise<any>;

  async browsePhoto(attachId?: string): Promise<any> {
    var url = this.getUrl(`mapp/browsePhoto`);
    var requestBody = attachId ? JSON.stringify({ "attachmentId": attachId }) : null;
    var browsePhoto = await fetch(url, {
      method: 'POST',
      headers: {
        "PageId": this.pageId
      },
      body: requestBody
    });

    var browsePhotoPageId = (await browsePhoto.json()).pageId;
    var resolver: any;
    var result = new Promise<any>((res, rej) => { resolver = res });
    this.socketMapper.set(browsePhotoPageId, (data: any) => {
      var result = { isCancel: data.IsCancel, pageId: browsePhotoPageId, selection: JSON.parse(data.Selection) }
      resolver(result)
    });
    return await result;
  }

  async getGpsAddress(): Promise<any> {
    var url = this.getUrl(`mapp/gps`);
    var getGpsAddress = await fetch(url, {
      method: 'GET',
      headers: {
        "PageId": this.pageId
      }
    });

    var json = await getGpsAddress.json();
    return json;
  }
  async setGpsAddress(address: ShippingAddress): Promise<any> {
    var url = this.getUrl(`mapp/gps`);
    var setGpsAddress = await fetch(url, {
      method: 'PUT',
      headers: {
        "PageId": this.pageId
      },
      body: JSON.stringify(address)
    });
    return setGpsAddress;
  }

  async getPhotoInfo(attachid: string): Promise<any> {
    var url = this.getUrl(`mapp/browsePhoto/${attachid}`);
    var photoInfo = await fetch(url, {
      method: 'GET',
      headers: {
        "PageId": this.pageId
      }
    });
    return await photoInfo.json();
  }

  async deletePhotoInfo(attachid: string): Promise<any> {
    var url = this.getUrl(`mapp/browsePhoto/${attachid}`);
    var deletePhotoInfo = await fetch(url, {
      method: 'DELETE',
      headers: {
        "PageId": this.pageId
      }
    });
    return deletePhotoInfo;
  }

  async saveImage(content: any, name?: string): Promise<any> {
    if (!content) return { isSuccess: false, errorMsg: "Content must be null or undefined" };

    var url = this.getUrl(`mapp/saveImage`);
    var saveImageRequest = await fetch(url, {
      method: 'POST',
      headers: {
        "PageId": this.pageId,
        "Name": name || ""
      },
      body: content
    });
    return await saveImageRequest.json();
  }

  async updateGps(callback: (data: any) => void) {
    this.socketMapper.set(this.pageId, callback);
  }
}