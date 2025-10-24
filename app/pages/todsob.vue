<template>
  asdasdsd
  <!-- <UFormGroup :label="data.wallet.displayName" :description="data.wallet.walletName" class="text-center"> -->
  <label>{{ date }}</label>
  <label>{{ amount }}</label>
  <!-- </UFormGroup> -->
  <ActionButton />

</template>
<script lang="ts" setup>
import { getManaContext, ActionButton } from "@manaapp/ui";
const data = ref<any>({
  "wallet": {
    "id": "637849861493678570",
    "displayName": "นาง อาภาภรณ์ จารุธนเศรษฐ์",
    "walletName": "Mana WalletX",
    "logo": "",
    "balance": {
      "currency": "THB",
      "amountUnit": 45000
    }
  },
  "session": {
    "id": "638120554091000121",
    "fromId": "001",
    "fromType": "Bank",
    "fromName": "อานน บางสาน",
    "fromSubName": "Anon Bangsan",
    "fromLogoHost": "failfast.blob.core.windows.net",
    "fromLogoPath": "easy/bank-account/assets/ktb.png",
    "fromAccountNo": "1122334455",
    "fromAccountName": "My Wallet",
    "toId": "002",
    "toType": "PP",
    "toName": "โทมัส อะไร",
    "toSubName": "Tomus Arai",
    "toLogoHost": "failfast.blob.core.windows.net",
    "toLogoPath": "easy/bank-account/assets/prompt.svg",
    "toAccountNo": "9999988877",
    "toAccountName": "บัญชีของฉัน",
    "amount": {
      "currency": "THB",
      "amountUnit": 1000000
    },
    "fee": {
      "currency": "THB",
      "amountUnit": 0
    },
    "discount": {
      "currency": "THB",
      "amountUnit": 0
    },
    "totalAmount": {
      "currency": "THB",
      "amountUnit": 1000000
    },
    "exchangeAmount": {
      "currency": "THB",
      "amountUnit": 0
    },
    "rateRequest": null,
    "rate": null,
    "refs": [
      {
        "name": "เลขพร้อมเพย์",
        "value": "01234567891"
      }
    ],
    "remark": null,
    "createDate": "0001-01-01T00:00:00",
    "requestDate": null,
    "executeDate": null,
    "destinationFee": null,
    "rateDisplay": null,
    "refCode": "UNK813264",
    "txType": "AdhocDeposit",
    "actionDate": "2023-04-18T09:41:42.179Z",
    "qrCode": "https://s.manal.ink/np/nwltbil-",
    "qrUrlHostFqdn": "mcproxy-devd.onmana.space",
    "qrUrlPath": "qr/url?url=s.manal.ink/np/nwltbil-&scheme=https",
    "shareUrlHostFqdn": "sharemlink.azurewebsites.net",
    "shareUrlPath": "?uri=https://xmunilink-devd.onmana.space/"
  },
  "listWallet": [
    {
      "id": "0001",
      "logoHost": "failfast.blob.core.windows.net",
      "logoPath": "easy/bank-account/assets/prompt.svg",
      "accountNo": "****48621793",
      "accountName": "บัญชีของฉัน",
      "type": "ppay"
    },
    {
      "id": "0002",
      "logoHost": "failfast.blob.core.windows.net",
      "logoPath": "easy/bank-account/assets/ktb.png",
      "accountNo": "****951357",
      "accountName": "กรุงไทย",
      "type": "bank"
    }
  ],
  // Hack: แปลง session.amount ให้เป็น arry
  "txsummary": [
    { description: 'จำนวนเงิน', value: "10,000.00 THB" },
    { description: 'ค่าธรรมเนียม', value: "50.00 THB" },
    { description: 'ส่วนลด', value: "20.00 THB" },
    { description: 'รวมทั้งหมด', value: "10,030.00 THB" }
  ]
})
const lib = await getManaContext();

const date = computed(() => { return lib.getDateText(data.value?.session?.actionDate) });
const amount = computed(() => { return lib.toText(data.value?.session?.amount) });


</script>
