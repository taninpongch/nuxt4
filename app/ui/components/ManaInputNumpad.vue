<template>
  <div>
    <label data-testid="text" v-if="text" :for="uuid" class="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
      {{ text }}
    </label>
    <div class="relative w-full">
      <input type="text" inputmode="numeric" data-testid="input" v-bind="$attrs" :value="modelValue" :id="uuid" :placeholder="placeholder" @input="handleInput"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <div data-testid="error" v-if="errors" class="input-errors" v-for="error of errors">
        <div class="error-msg text-red-600">{{ error.$message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './style.css';
import { nanoid } from 'nanoid';
const props = withDefaults(
  defineProps<{
    modelValue?: string,
    uuid?: string,
    placeholder?: string,
    text?: string,
    appText?: string,
    isLastInput?: boolean
    errors?: any
  }>(), { placeholder: "placeholder", uuid: `inp${nanoid()}`, text: "", appText: "", isLastInput: false });

const emits = defineEmits(['update:modelValue']);
function handleInput($ev: any) {
  const evalue = $ev.target.value;
  $ev.target.parentNode.dataset.replicatedValue = evalue;
  emits('update:modelValue', evalue)
}
</script>