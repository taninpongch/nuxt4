<template>
  <h4 class="hidden text-2xl font-semibold text-red-600 dark:text-white" :class="{ showcontent: onMaui }" :id="uuid">
    {{ text }}
  </h4>
</template>

<script setup lang="ts">
import { getManaContext, getEnvirontment, registerSocketmapper } from '../scripts/ManaLib';
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { nanoid } from 'nanoid';
import { useWindowScroll, useThrottleFn, useDebounceFn } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    text?: string,
    appText?: string,
    uuid?: string
  }>(), { text: "", appText: "", uuid: `title${nanoid()}` });

const env = await getEnvirontment();
const lib = await getManaContext();

const onMaui = env.mode != "mobile";

registerSocketmapper(props.uuid, (data: any) => {
  document.getElementById(props.uuid)?.click();
});

onMounted(async () => {
  var url = lib.getUrl("mapp/pageheaders/show");

  fetch(url, {
    method: 'POST',
    headers: {
      "PageId": env.pageid,
      "HeaderId": props.uuid
    },
    body: JSON.stringify({
      "content": props.text,
      "appText": props.appText
    }),
  });
});

onUnmounted(async () => {
  var url = lib.getUrl("mapp/pageheaders/hide");

  fetch(url, {
    method: 'POST',
    headers: {
      "PageId": env.pageid,
      "HeaderId": props.uuid
    }
  });
});

//TODO ScrollY
if (onMaui) {
  const beforeUpdatedY = ref(0)
  const updatedY = ref(0)
  const y = ref(0);
  const { x, y: sy } = useWindowScroll()
  watch(sy, async () => {
    y.value = Math.round(sy.value);
    throttledFn();
    // debouncedFn();
  })

  const throttledFn = useThrottleFn(async () => {
    updatedY.value = y.value;
    if (updatedY.value != beforeUpdatedY.value) {
      beforeUpdatedY.value = updatedY.value;
      await setScrollY(updatedY.value);
    }
  }, 180)

  const debouncedFn = useDebounceFn(async () => {
    updatedY.value = y.value;
    if (updatedY.value != beforeUpdatedY.value) {
      beforeUpdatedY.value = updatedY.value;
      await setScrollY(updatedY.value);
    }
  }, 180)

  const setScrollY = async (scrollY: any) => {
    console.log("setScrollY", scrollY);
    var lib = await getManaContext();
    var ctx = await getEnvirontment();
    var url = lib.getUrl("mapp/y");

    fetch(url, {
      method: 'POST',
      headers: {
        "PageId": ctx.pageid,
        "HeaderId": props.uuid
      },
      body: JSON.stringify({
        "value": scrollY.value,
      }),
    });
  }
}
</script>

<style scoped>
.showcontent {
  display: inline-block !important;
}
</style>