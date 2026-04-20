<template>
  <button
    :class="buttonClass"
    :style="buttonStyle"
    @click="handleClick"
  >
    {{ displayValue }}
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'number', // 'number' | 'operator' | 'function' | 'equal'
    validator: (v) => ['number', 'operator', 'function', 'equal'].includes(v)
  },
  span: {
    type: Number,
    default: 1 // 按钮跨越的列数
  }
});

const emit = defineEmits(['click']);

// 显示值转换
const displayValue = computed(() => {
  const valueMap = {
    '*': '×',
    '/': '÷',
    '-': '−'
  };
  return valueMap[props.value] || props.value;
});

// 按钮样式类
const buttonClass = computed(() => {
  return [
    'calculator-btn',
    `calculator-btn--${props.type}`,
    { 'calculator-btn--wide': props.span === 2 }
  ];
});

// 按钮样式
const buttonStyle = computed(() => {
  if (props.span === 2) {
    return { flex: '0 0 calc(50% - 6px)' };
  }
  return {};
});

// 点击处理
const handleClick = () => {
  emit('click', props.value);
};
</script>

<style scoped>
@import '@/assets/ui/design-tokens.css';

.calculator-btn {
  font-family: var(--font-family);
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: var(--shadow-button);
  height: 70px;
  flex: 1;
  margin: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calculator-btn:hover {
  transform: scale(0.98);
  filter: brightness(1.05);
}

.calculator-btn:active {
  transform: scale(0.95);
}

.calculator-btn--number {
  background-color: var(--button-number-bg);
  color: var(--button-number-text);
}

.calculator-btn--operator {
  background-color: var(--button-operator-bg);
  color: var(--button-operator-text);
}

.calculator-btn--function {
  background-color: var(--button-function-bg);
  color: var(--button-function-text);
}

.calculator-btn--equal {
  background-color: var(--button-equal-bg);
  color: var(--button-equal-text);
}

.calculator-btn--wide {
  flex: 0 0 calc(50% - 6px);
}
</style>
