<template>
    <div class="hidden w-full" :class="{ showcontent: onMaui }">
        <button type="submit" data-testid="ok" :id="acceptUuid"
            class="text-white bg-red-600 font-semibold w-full text-sm px-5 py-2.5 text-center">{{ acceptText }}</button>
        <button type="submit" data-testid="cancel" :id="rejectUuid"
            class="text-white font-semibold w-full text-sm px-5 py-2.5 text-center">{{ rejectText }}</button>
    </div>
</template>

<script setup lang="ts">
import './style.css';
import { getManaContext, getEnvirontment, registerSocketmapper } from '../scripts/ManaLib';
import { onMounted, onUnmounted } from 'vue'
import { nanoid } from 'nanoid';

const props = withDefaults(
    defineProps<{
        modelValue?: string,
        acceptText?: string,
        acceptAppText?: string,
        acceptUuid?: string,
        rejectText?: string,
        rejectAppText?: string,
        rejectUuid?: string
    }>(), {
    acceptText: "Accept", acceptAppText: "", acceptUuid: `btn${nanoid()}`,
    rejectText: "Reject", rejectAppText: "", rejectUuid: `btn${nanoid()}`
});

const env = await getEnvirontment();
const lib = await getManaContext();
const onMaui = env.mode != "mobile";

registerSocketmapper(props.acceptUuid, (data: any) => {
    document.getElementById(props.acceptUuid)?.click();
    emits('update:modelValue', data.UserAction)
});

registerSocketmapper(props.rejectUuid, (data: any) => {
    document.getElementById(props.rejectUuid)?.click();
    emits('update:modelValue', data.UserAction)
});

const emits = defineEmits(['update:modelValue']);

onMounted(async () => {
    
    var url = lib.getUrl("mapp/buttons/show/consent");
    console.log("ConsentButtonsBand onMounted url : ", url);

    fetch(url, {
        method: 'POST',
        headers: {
            "PageId": env.pageid,
        },
        body: JSON.stringify([
            {
                "content": props.acceptText,
                "appText": props.acceptAppText,
                "buttonId": props.acceptUuid
            },
            {
                "content": props.rejectText,
                "appText": props.acceptAppText,
                "buttonId": props.rejectUuid
            }
        ]),
    });
});

onUnmounted(async () => {
    var url = lib.getUrl("mapp/buttons/hide");
    console.log("ConsentButtonsBand onUnmounted url : ", url);
    fetch(url, {
        method: 'POST',
        headers: {
            "PageId": env.pageid,
            "ButtonId": props.acceptUuid
        }
    });
});

</script>

<style scoped>
.showcontent {
    display: inline-block !important;
}
</style>