<template>
  <div class="calculator">
    <!-- 显示屏 -->
    <div class="calculator-display">
      <div class="calculator-expression">{{ expression || '0' }}</div>
      <div class="calculator-result">{{ displayValue }}</div>
    </div>

    <!-- 按钮网格 -->
    <div class="calculator-grid">
      <!-- 第一行：AC, +/-, %, ÷ -->
      <div class="calculator-row">
        <CalculatorButton value="C" type="function" @click="handleClear" />
        <CalculatorButton value="±" type="function" @click="handleToggleSign" />
        <CalculatorButton value="%" type="function" @click="handlePercent" />
        <CalculatorButton value="/" type="operator" @click="handleOperator" />
      </div>

      <!-- 第二行：7, 8, 9, × -->
      <div class="calculator-row">
        <CalculatorButton value="7" type="number" @click="handleNumber" />
        <CalculatorButton value="8" type="number" @click="handleNumber" />
        <CalculatorButton value="9" type="number" @click="handleNumber" />
        <CalculatorButton value="*" type="operator" @click="handleOperator" />
      </div>

      <!-- 第三行：4, 5, 6, - -->
      <div class="calculator-row">
        <CalculatorButton value="4" type="number" @click="handleNumber" />
        <CalculatorButton value="5" type="number" @click="handleNumber" />
        <CalculatorButton value="6" type="number" @click="handleNumber" />
        <CalculatorButton value="-" type="operator" @click="handleOperator" />
      </div>

      <!-- 第四行：1, 2, 3, + -->
      <div class="calculator-row">
        <CalculatorButton value="1" type="number" @click="handleNumber" />
        <CalculatorButton value="2" type="number" @click="handleNumber" />
        <CalculatorButton value="3" type="number" @click="handleNumber" />
        <CalculatorButton value="+" type="operator" @click="handleOperator" />
      </div>

      <!-- 第五行：0, ., = -->
      <div class="calculator-row">
        <CalculatorButton value="0" type="number" :span="2" @click="handleNumber" />
        <CalculatorButton value="." type="number" @click="handleDecimal" />
        <CalculatorButton value="=" type="equal" @click="handleEqual" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CalculatorButton from '@/components/CalculatorButton.vue';
import logger from '@/utils/logger';

// 状态
const currentValue = ref('0');
const previousValue = ref(null);
const operator = ref(null);
const expression = ref('');
const waitingForOperand = ref(false);

// 显示值处理
const displayValue = computed(() => {
  const value = currentValue.value;
  
  // 处理科学计数法显示
  if (value.length > 12) {
    return parseFloat(value).toExponential(6);
  }
  
  // 移除末尾多余的零
  if (value.includes('.') && !value.endsWith('.')) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return num.toString();
    }
  }
  
  return value;
});

// 数字输入
const handleNumber = (num) => {
  logger.info('数字输入', { num, currentValue: currentValue.value });
  
  if (waitingForOperand.value) {
    currentValue.value = num;
    waitingForOperand.value = false;
  } else {
    // 限制输入长度
    if (currentValue.value.replace('-', '').replace('.', '').length >= 12) {
      return;
    }
    
    if (currentValue.value === '0' && num !== '0') {
      currentValue.value = num;
    } else if (currentValue.value === '0' && num === '0') {
      // 保持显示 0
    } else {
      currentValue.value += num;
    }
  }
};

// 运算符输入
const handleOperator = (op) => {
  logger.info('运算符输入', { operator: op, currentValue: currentValue.value });
  
  const current = parseFloat(currentValue.value);
  
  if (previousValue.value !== null && !waitingForOperand.value) {
    // 连续运算
    const result = calculate(parseFloat(previousValue.value), current, operator.value);
    currentValue.value = String(result);
    previousValue.value = result;
    expression.value = `${result} ${op}`;
  } else {
    previousValue.value = current;
    expression.value = `${current} ${op}`;
  }
  
  operator.value = op === '*' ? '*' : op === '/' ? '/' : op;
  waitingForOperand.value = true;
};

// 等号计算
const handleEqual = () => {
  logger.info('等号计算', { 
    previousValue: previousValue.value, 
    currentValue: currentValue.value, 
    operator: operator.value 
  });
  
  if (previousValue.value === null || operator.value === null) {
    return;
  }
  
  const current = parseFloat(currentValue.value);
  const result = calculate(parseFloat(previousValue.value), current, operator.value);
  
  expression.value = `${previousValue.value} ${operator.value} ${current} =`;
  currentValue.value = String(result);
  
  // 重置状态
  previousValue.value = null;
  operator.value = null;
  waitingForOperand.value = true;
  
  logger.info('计算结果', { result });
};

// 计算逻辑
const calculate = (a, b, op) => {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) {
        logger.error('除零错误');
        return 'Error';
      }
      return a / b;
    default:
      return b;
  }
};

// 清除
const handleClear = () => {
  logger.info('清除计算器');
  currentValue.value = '0';
  previousValue.value = null;
  operator.value = null;
  expression.value = '';
  waitingForOperand.value = false;
};

// 正负切换
const handleToggleSign = () => {
  const value = currentValue.value;
  if (value === '0' || value === 'Error') return;
  
  if (value.startsWith('-')) {
    currentValue.value = value.slice(1);
  } else {
    currentValue.value = '-' + value;
  }
  logger.info('正负切换', { currentValue: currentValue.value });
};

// 百分比
const handlePercent = () => {
  const value = parseFloat(currentValue.value);
  currentValue.value = String(value / 100);
  logger.info('百分比计算', { original: value, result: currentValue.value });
};

// 小数点
const handleDecimal = () => {
  if (currentValue.value.includes('.')) return;
  currentValue.value += '.';
};
</script>

<style scoped>
@import '@/assets/ui/design-tokens.css';

.calculator {
  max-width: 400px;
  margin: 0 auto;
  background-color: var(--color-background);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.calculator-display {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  padding: var(--spacing-xl) var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.calculator-expression {
  font-family: var(--font-family);
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  text-align: right;
  margin-bottom: var(--spacing-xs);
  min-height: 24px;
}

.calculator-result {
  font-family: var(--font-family);
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-regular);
  color: #FFFFFF;
  text-align: right;
  word-break: break-all;
}

.calculator-grid {
  display: flex;
  flex-direction: column;
  padding-bottom: var(--spacing-lg);
}

.calculator-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
