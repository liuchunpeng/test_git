# UI 资源使用声明

本项目使用 UI Agent 提供的以下资源：

| 资源文件 | 组件 | 使用位置 | 状态 |
|----------|------|----------|------|
| design-tokens.css | - | main.js 全局引用 | ✓ |
| asset-manifest.json | - | 代码资源映射 | ✓ |
| 页面预览图 | CalculatorView | App.vue | ✓ |

## 设计令牌使用说明

所有样式均使用 CSS 变量定义，来源于 ui-assets-manifest.json 中的 design_tokens：

- 颜色变量：`--color-primary`, `--color-background` 等
- 字体变量：`--font-family`, `--font-size-display` 等
- 间距变量：`--spacing-sm`, `--spacing-lg` 等

禁止硬编码颜色值，必须使用 CSS 变量。
