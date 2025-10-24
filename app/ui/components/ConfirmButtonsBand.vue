<template>
    <div class="hidden w-full" :class="{ showcontent: !onMaui }">
        <div v-if="mode == 'confirm'">
            <button data-testid="cancel" @click="choose('cancel')"
                class="text-white bg-gray-700 font-semibold text-sm w-1/2 px-5 py-2.5 text-center">cancel</button>
            <button data-testid="ok" @click="choose('ok')"
                class="text-white bg-red-600 font-semibold text-sm w-1/2 px-5 py-2.5 text-center">ok</button>
        </div>
        <div v-if="mode == 'toast'">
            <button data-testid="cancel" @click="choose('cancel')"
                class="text-white bg-gray-700 font-semibold text-sm w-full px-5 py-2.5 text-center">close</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import './style.css';
import { getManaContext, getEnvirontment } from '../scripts/ManaLib';

const props = withDefaults(
    defineProps<{
        mode?: keyof ModeType
    }>(), { mode: "confirm" });

console.log("Confirm btn start");
const env = await getEnvirontment();
const lib = await getManaContext();
console.log("Confirm after promise");
const onMaui = env.mode == "mobile";
console.log("onMaui : ", onMaui);
const choose = (choice: string) => {
    var url = lib.getUrl("mdev/confirmbuttons");

    fetch(url, {
        method: 'POST',
        headers: {
            "PageId": env.pageid,
            "Select": choice
        }
    });
};

interface ModeType {
    confirm;
    toast;
}

</script>

<style scoped>
.showcontent {
    display: inline-block !important;
}
</style>