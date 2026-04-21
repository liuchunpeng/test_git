<template>
  <button :class="['calc-btn', `calc-btn--${type}`]" @click="$emit('click', value)">
    {{ displayValue }}
  </button>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({ value: String, type: { type: String, default: 'number' } });
defineEmits(['click']);
const displayValue = computed(() => ({ '*': '×', '/': '÷' }[props.value] || props.value));
</script>
<style scoped>
@import '@/assets/ui/design-tokens.css';
.calc-btn { font: var(--font-size-button) var(--font-family); border: none; border-radius: var(--border-radius-md); cursor: pointer; height: 70px; flex: 1; margin: 3px; transition: transform var(--transition-fast); box-shadow: var(--shadow-button); }
.calc-btn:hover { transform: scale(0.98); }
.calc-btn--number { background: var(--button-number-bg); color: #2D3436; }
.calc-btn--operator { background: var(--button-operator-bg); color: #fff; }
.calc-btn--function { background: var(--button-function-bg); color: #fff; }
.calc-btn--equal { background: var(--button-equal-bg); color: #fff; }
</style>
