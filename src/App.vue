<template>
  <div class="calculator">
    <div class="display">
      <div class="expression">{{ expression || '' }}</div>
      <div class="result">{{ displayValue }}</div>
    </div>
    <div class="grid">
      <div class="row"><CalcBtn value="C" type="function" @click="clear" /><CalcBtn value="±" type="function" @click="toggleSign" /><CalcBtn value="%" type="function" @click="percent" /><CalcBtn value="/" type="operator" @click="op" /></div>
      <div class="row"><CalcBtn value="7" @click="num" /><CalcBtn value="8" @click="num" /><CalcBtn value="9" @click="num" /><CalcBtn value="*" type="operator" @click="op" /></div>
      <div class="row"><CalcBtn value="4" @click="num" /><CalcBtn value="5" @click="num" /><CalcBtn value="6" @click="num" /><CalcBtn value="-" type="operator" @click="op" /></div>
      <div class="row"><CalcBtn value="1" @click="num" /><CalcBtn value="2" @click="num" /><CalcBtn value="3" @click="num" /><CalcBtn value="+" type="operator" @click="op" /></div>
      <div class="row"><CalcBtn value="0" @click="num" style="flex:0 0 calc(50% - 6px)" /><CalcBtn value="." @click="decimal" /><CalcBtn value="=" type="equal" @click="equals" /></div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import CalcBtn from '@/components/CalculatorButton.vue';
import logger from '@/utils/logger';
const current = ref('0'), prev = ref(null), operator = ref(null), expr = ref(''), waiting = ref(false);
const displayValue = computed(() => current.value.length > 12 ? parseFloat(current.value).toExponential(6) : current.value);
const num = (v) => {
  if (waiting.value) { current.value = v; waiting.value = false; }
  else { current.value = current.value === '0' && v !== '0' ? v : current.value + v; }
  if (current.value.replace('-','').replace('.','').length > 12) return;
  logger.info('Input', { value: v });
};
const op = (v) => {
  const cur = parseFloat(current.value);
  if (prev.value !== null && !waiting.value) {
    const result = calculate(prev.value, cur, operator.value);
    current.value = String(result); prev.value = result;
  } else { prev.value = cur; }
  operator.value = v; expr.value = `${current.value} ${v}`; waiting.value = true;
};
const equals = () => {
  if (prev.value === null) return;
  const result = calculate(prev.value, parseFloat(current.value), operator.value);
  expr.value = `${prev.value} ${operator.value} ${current.value} =`; current.value = String(result);
  prev.value = null; operator.value = null; waiting.value = true;
  logger.info('Result', { result });
};
const calculate = (a, b, op) => {
  switch (op) { case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return b === 0 ? 'Error' : a / b; default: return b; }
};
const clear = () => { current.value = '0'; prev.value = null; operator.value = null; expr.value = ''; };
const toggleSign = () => { current.value = current.value.startsWith('-') ? current.value.slice(1) : '-' + current.value; };
const percent = () => { current.value = String(parseFloat(current.value) / 100); };
const decimal = () => { if (!current.value.includes('.')) current.value += '.'; };
const expression = computed(() => expr.value);
</script>
<style scoped>
@import '@/assets/ui/design-tokens.css';
.calculator { max-width: 400px; margin: 0 auto; background: var(--color-background); border-radius: var(--border-radius-md); padding: var(--lg, 16px); }
.display { background: var(--color-surface); border-radius: var(--border-radius-md) var(--border-radius-md) 0 0; padding: 24px 16px; min-height: 120px; display: flex; flex-direction: column; justify-content: flex-end; }
.expression { font-size: 18px; color: rgba(255,255,255,0.6); text-align: right; }
.result { font-size: var(--font-size-display); color: #fff; text-align: right; }
.grid { display: flex; flex-direction: column; padding-bottom: 16px; }
.row { display: flex; }
</style>
