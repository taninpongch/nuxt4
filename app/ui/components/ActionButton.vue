<template>
    <button ref="buttonOk" data-testid="ok" type="submit" :id="uuid" :class="{ showcontent: !onMaui }"
        class="hidden text-white bg-red-600 font-semibold text-sm w-full px-5 py-2.5 text-center">{{ text }}</button>
</template>

<script setup lang="ts">
import './style.css';
import { getManaContext, getEnvirontment, registerSocketmapper } from '../scripts/ManaLib';
import { onMounted, onUnmounted, ref } from 'vue'
import { nanoid } from 'nanoid';

const props = withDefaults(
    defineProps<{
        text?: string,
        appText?: string,
        uuid?: string
    }>(), { text: "OK", appText: "", uuid: `btn${nanoid()}` });

const env = await getEnvirontment();
const lib = await getManaContext();
const onMaui = env.mode == "mobile";
const buttonOk = ref();

registerSocketmapper(props.uuid, (data: any) => {
    buttonOk.value.click();
});

onMounted(async () => {
    console.log("ActionButton onMounted");
    var url = lib.getUrl("mapp/buttons/show");
    fetch(url, {
        method: 'POST',
        headers: {
            "PageId": env.pageid,
            "ButtonId": props.uuid
        },
        body: JSON.stringify({
            "content": props.text,
            "appText": props.appText,
        }),
    });
});

onUnmounted(async () => {
    console.log("ActionButton onUnmounted");
    var url = lib.getUrl("mapp/buttons/hide");
    fetch(url, {
        method: 'POST',
        headers: {
            "PageId": env.pageid,
            "ButtonId": props.uuid
        }
    });
});

</script>

<style scoped>
.showcontent {
    display: inline-block !important;
}
</style>