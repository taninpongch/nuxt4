import { mount, flushPromises } from "@vue/test-utils";
import { vi } from 'vitest'
import { defineComponent } from 'vue';
import { ServerMock } from './mocks/ServerMock';
import { SocketMock } from './mocks/SocketMock';
import { IMonetaryValue } from "..";
import { environment, mockData } from './test-env';
import { ShippingAddress } from "../scripts/contracts/IShippingAddress";

const serversocket = new SocketMock;
const mockServer = new ServerMock();

serversocket.StartSocket();

mockServer.StartMockServer("playground");
var libImport = await import('../scripts/ManaLib');
var lib = await libImport.getManaContext();

var socketClient = await serversocket.GetSocketClient()
describe('Get url', () => {

  function TestGetUrlWith1Parameter(path: string, expected: string) {
    test(`Given path : "${path}" | expected "${expected}"`, () => {
      var url = lib.getUrl(path);
      expect(url).toEqual(expected);
    });
  }

  function TestGetUrlWith2Parameters(host: string, path: string, expected: string) {
    test(`Given host : "${host}", path : "${path}" | expected "${expected}"`, () => {
      var url = lib.getUrl(host, path);
      expect(url).toEqual(expected);
    });
  }

  TestGetUrlWith1Parameter("mapp/p1/p2", `http://${environment.localHostUrl}/mapp/p1/p2`);
  TestGetUrlWith1Parameter("api/p1/p2", `http://localhost:9000/api/${environment.playgroundpageId}/p1/p2`);
  TestGetUrlWith2Parameters("custom", "p1/p2", "https://custom/p1/p2");
  TestGetUrlWith2Parameters("local.onmana.app", "mapp/p1/p2", `http://${environment.localHostUrl}/mapp/p1/p2`);
  TestGetUrlWith2Parameters("local.onmana.app", "api/p1/p2", `http://${environment.localHostUrl}/api/${environment.playgroundpageId}/p1/p2`);
  TestGetUrlWith2Parameters("http://custom", "api/p1/p2", "getutl must not start with http:// or https://");
  TestGetUrlWith2Parameters("https://custom", "api/p1/p2", "getutl must not start with http:// or https://");
  TestGetUrlWith2Parameters("local.onmana.app", "/api/p1/p2", `http://${environment.localHostUrl}/api/${environment.playgroundpageId}/p1/p2`);
  TestGetUrlWith2Parameters("/local.onmana.app", "/api/p1/p2", `http://${environment.localHostUrl}/api/${environment.playgroundpageId}/p1/p2`);
});

describe('MonetaryValue to Amount', () => {

  function TestMonetaryValuetoAmount(amount: number, expected: number) {
    test(`Given amount : ${amount} | expect ${expected}`, () => {
      var monetary: IMonetaryValue = { amountUnit: amount, currency: "" };
      var toAmount = lib.toAmount(monetary);
      expect(toAmount).toEqual(expected);
    });
  }

  TestMonetaryValuetoAmount(20000, 20);
  TestMonetaryValuetoAmount(20000.568, 20.000568);
  TestMonetaryValuetoAmount(0.00, 0);
  TestMonetaryValuetoAmount(4850, 4.85);
});

describe('MonetaryValue to Text', () => {

  function TestMonetaryValuetoText(amount: number, currency: string, format: string, expected: any) {
    test(`Given amount : ${amount}, currency : ${currency}, format : ${format ? format : 'default'} | expect : ${expected}`, () => {
      var monetary: IMonetaryValue = { amountUnit: amount, currency: currency };
      var toText = lib.toText(monetary, format);
      expect(toText).toEqual(expected);
    });
  }

  TestMonetaryValuetoText(0.00, "", "", "0.00");
  TestMonetaryValuetoText(20000, "", "", "20.00");
  TestMonetaryValuetoText(20000, "CUR", "", "20.00 CUR");
  TestMonetaryValuetoText(20000, "CUR", "all", "20.00 CUR");
  TestMonetaryValuetoText(20000, "CUR", "amt", "20.00");
  TestMonetaryValuetoText(20000, "CUR", "cur", "CUR");
  TestMonetaryValuetoText(4850, "THB", "all", "4.85 THB");
});

describe('Get date text to day is 01-01-2000', () => {
  function TestGetDateText(date: any, format: string, expected: string) {
    test(`Given date : ${date}, format : ${format} | expect : ${expected}`, () => {
      var getDateText = lib.getDateText(date, format);
      expect(getDateText).toEqual(expected);
    });
  }

  vi.setSystemTime(environment.currentDate);

  TestGetDateText("", "", "Invalid");
  TestGetDateText("foo", "", "Invalid");
  TestGetDateText("-1000-01-01T12:00:00", "", "Invalid");
  TestGetDateText("2000-01-32T12:00:00", "", "Invalid");
  TestGetDateText("2000-13-01T12:00:00", "", "Invalid");
  TestGetDateText("2000-01-01T25:00:00", "", "Invalid");
  TestGetDateText("2000-01-01T00:00:-10", "", "Invalid");
  TestGetDateText("2000-01-01T24:00:01", "", "Invalid");
  TestGetDateText("1996-02-29T12:00:00", "", "29/2/1996 (12:00)");
  TestGetDateText("1999-02-29T12:00:00", "", "1/3/1999 (12:00)");
  TestGetDateText("1999-02-31T12:00:00", "", "3/3/1999 (12:00)");
  TestGetDateText(new Date(-1, 10, 10), "", "Invalid");
  TestGetDateText(new Date(0, 0, 1), "", "1/1/1900 (00:00)");
  TestGetDateText(new Date(0, 0, -1), "", "30/12/1899 (00:00)");
  TestGetDateText(new Date(0, -10, 1), "", "1/3/1899 (00:00)");
  TestGetDateText(new Date(1100, 0, 1), "", "1/1/1100 (00:00)");
  TestGetDateText(new Date(2000, 6, 30), "", "30/7/2000 (00:00)");
  TestGetDateText(0, "", "1/1/1970 (00:00)");
  TestGetDateText(60000, "", "1/1/1970 (00:01)");
  TestGetDateText(-120000, "", "31/12/1969 (23:58)");
  TestGetDateText(-60000 * 60 * 24 * 31, "", "1/12/1969 (00:00)");
  TestGetDateText("2000-01-01T12:59:58", "", "1/1/2000 (12:59)");
  TestGetDateText("2000-01-01T12:59:58", "full", "1/1/2000 (12:59)");
  TestGetDateText("2000-01-01T24:00:00", "full", "2/1/2000 (00:00)");
  TestGetDateText("2000-01-01T12:59:59", "time", "12:59");
  TestGetDateText("2000-01-01T24:00:00", "time", "00:00");
  TestGetDateText("2000-01-01 12:59:58", "tmws", "12:59:58");
  TestGetDateText("2000-01-01T24:00:00", "tmws", "00:00:00");
  TestGetDateText("2000-01-01T12:59:58", "tmdt", "12:59 (1/1/2000)");
  TestGetDateText("2000-01-01T12:59:58", "zone", "1/1/2000 (12:59 UTC+00:00)");
  TestGetDateText("2024-02-09T07:48:50.221Z", "agos", "24yr");
  TestGetDateText("2000-01-01T12:00:00", "agos", "0s");
  TestGetDateText("2000-01-01T12:00:12", "agos", "12s");
  TestGetDateText("2000-01-01T12:12:12", "agos", "12m");
  TestGetDateText("2000-01-01T14:12:12", "agos", "2h");
  TestGetDateText("2000-01-03T14:12:12", "agos", "2d");
  TestGetDateText("2000-03-02T14:12:12", "agos", "2mo");
  TestGetDateText("2002-03-02T14:12:12", "agos", "2yr");
  TestGetDateText("1997-01-01T12:00:00", "agos", "3yr");
  TestGetDateText("2000-01-01T12:00:00", "agof", "just now");
  TestGetDateText("2000-01-01T12:00:01", "agof", "in 1 second");
  TestGetDateText("2000-01-01T12:00:12", "agof", "in 12 seconds");
  TestGetDateText("2000-01-01T12:12:12", "agof", "in 12 minutes");
  TestGetDateText("2000-01-01T14:12:12", "agof", "in 2 hours");
  TestGetDateText("2000-01-03T14:12:12", "agof", "in 2 days");
  TestGetDateText("2000-03-02T14:12:12", "agof", "in 2 months");
  TestGetDateText("2002-03-02T14:12:12", "agof", "in 2 years");
  TestGetDateText("1997-01-01T12:00:00", "agof", "3 years ago");
  TestGetDateText("1999-12-27T14:12:12", "agof", "5 days ago");
});

describe('Option dialog', () => {
  function TestShowOptionDlg(flow: string, mode: string, selection: any, isCancel: boolean, data: string, expected: any) {
    test("Show option dialog", async () => {
      setTimeout(async () => {
        socketClient.send(JSON.stringify({
          Action: "submitselection",
          PageId: environment.optionDlgPageId,
          IsCancel: isCancel,
          Selection: data
        }));
      }, 300);
      var result = await lib.showOptionDlg(flow, mode, selection);
      expect(result).toEqual(expected);
    });
  }

  function TestGetDefaultSextion() {
    test("Get default section", async () => {
      var result = await lib.getDefaultSelection();
      expect(result, mockData.defaultSelection);
    });
  }

  var DataFromMana = mockData.OptionDialogData;
  TestShowOptionDlg("testflow", "1btn", "", DataFromMana.isCancel, JSON.stringify(DataFromMana.selection), DataFromMana);
  TestGetDefaultSextion();
});

describe('Take photo', () => {
  function TestTakePhoto(isCancel: boolean, data: string, expected: any) {
    test("Take photo", async () => {
      setTimeout(async () => {
        socketClient.send(JSON.stringify({
          Action: "takefacialmasterphoto",
          PageId: environment.cameraPageId,
          IsCancel: isCancel,
          Selection: data
        }));
      }, 300);
      var result = await lib.takeFacialMasterPhoto();
      expect(result).toEqual(expected);
    });
  }

  var DataFromMana = mockData.TakePhotoData;
  TestTakePhoto(DataFromMana.isCancel, JSON.stringify(DataFromMana.selection), DataFromMana);
});

describe('Browse photo', () => {
  function TestBrowsePhoto(isCancel: boolean, data: string,expected: any) {
    test("Browse photo", async () => {
      setTimeout(async () => {
        socketClient.send(JSON.stringify({
          Action: "browsephoto",
          PageId: environment.browsePageId,
          IsCancel: isCancel,
          Selection: data
        }));
      }, 300);
      var result = await lib.browsePhoto();
      expect(result).toEqual(expected);
    });
  }

  var DataFromMana = mockData.BrowsPhotoData;
  TestBrowsePhoto(DataFromMana.isCancel, JSON.stringify(DataFromMana.selection), DataFromMana);
});

describe('Test Image', () => {
  function TestSaveImage(expected: any, content: any, name?: string) {
    test("Save Image", async () => {
      var result = await lib.saveImage(content, name);
      expect(result).toEqual(expected);
    });
  }

  TestSaveImage({ isSuccess: true }, "data:image/png;base64", "test.png");
  TestSaveImage({ isSuccess: false, errorMsg: "Content must be null or undefined" }, null, "test.png");
});

describe('GPS', () => {
  function TestGetGPS(expected: any) {
    test("Get GPS", async () => {
      var result = await lib.getGpsAddress();
      expect(result).toEqual(expected);
    });
  }

  function TestSetGPS(shippingAddress: ShippingAddress) {
    test("Set GPS", async () => {
      var result = await lib.setGpsAddress(shippingAddress);
      expect(result.status).toEqual(200);
    });
  }

  var returnData = mockData.MockGpsAddressReturn;

  var exampleShippingAddressRaw  = {
    addressType: "mockaddressType",
    name: "mockname",
    line1: "mockline1",
    district: "mockdistrict",
    city: "mockcity",
    province: "mockprovince",
    state: "mockstate",
    country: "mockcountry",
    postalCode: "mockpostalCode",
    remark: "mockremark",
    saveRemark: true,
    contactNo : "04444xxxxxx",
    saveContactNo : true,
    gpsAddress : {gpsLocation : {lat : 13.123456, long : 100.123456}, accuracy : 10}
  };

  var exampleShippingAddressObject = new ShippingAddress(
    "mockaddressType",
    "mockname", "mockline1",
    "mockdistrict",
    "mockcity",
    "mockprovince",
    "mockstate",
    "mockcountry",
    "mockpostalCode",
    "mockremark",
    true,
    "04444xxxxxx",
    true,
    13.123456,
    100.123456,
    10);

  TestGetGPS(returnData);
  TestSetGPS(exampleShippingAddressRaw);
  TestSetGPS(exampleShippingAddressObject);
});

//ref : https://test-utils.vuejs.org/guide/advanced/async-suspense.html
describe('Components', () => {
  test('ActionButton', async () => {
    var ActionButton = (await import("../components/ActionButton.vue")).default;
    var btnText = "test_button"
    var btnUuid = "btnId";
    const TestComponent = defineComponent({
      components: { ActionButton },
      template: `<Suspense><ActionButton uuid='${btnUuid}' text='${btnText}'/></Suspense>`
    })

    const wrapper = mount(TestComponent);
    await flushPromises();

    var clickedCount = 0;
    var btnOkElement = wrapper.find(`[data-testid="ok"]`);

    expect(btnOkElement.text()).toEqual(btnText);
    expect(btnOkElement.classes()).toEqual(expect.arrayContaining(["showcontent"]));
    btnOkElement.element.addEventListener("click", () => {
      clickedCount++;
    });

    socketClient.send(JSON.stringify({ Action: "submit", ButtonId: btnUuid }));
    expect(clickedCount).toEqual(1);
    wrapper.unmount();
  });

  test("ManaInputNumpad", async () => {
    var ManaInputNumpad = (await import("../components/ActionButton.vue")).default;
    function TestManaInputNumpad(desc: string, initvalue: string, placeholder: string, text: string, appText: string, errors: string) {
      test(desc, async () => {
        const TestComponent = defineComponent({
          components: { ManaInputNumpad },
          template: `<Suspense><ActionButton 
            modelValue='${initvalue}' 
            placeholder='${placeholder}' 
            text='${text}' 
            appText='${appText}' 
            errors='${errors}' 
          /></Suspense>`
        });

        const wrapper = mount(TestComponent);
        await flushPromises();

        var textElement = wrapper.find(`[data-testid="text"]`);
        var inputElement = wrapper.find(`[data-testid="input"]`);
        var errorElement = wrapper.find(`[data-testid="error"]`);

        expect(textElement.text).toEqual(text);
      });
    }

    TestManaInputNumpad("Test normal input", "50.00", "please input me", "myTestText", "", "this is error");
  });
});