# AGENTS.md

## Development Commands

```bash
# Start development server (runs on port 3000, auto-opens browser)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**No test framework configured** - This project does not have test scripts.

## Code Style Guidelines

### Framework & Stack
- Vue 3 with Composition API (use `<script setup>`)
- Vite as build tool
- Element Plus for UI components
- Pinia for state management
- vue-plugin-hiprint for print functionality

### Import Conventions
- Use ES modules with named imports: `import { ref, onMounted } from 'vue'`
- Import local components relative to file: `import DraggableModules from './DraggableModules.vue'`
- Group imports: Vue/external libs first, then local components, then utilities

### File Structure
- Components: `src/components/` (PascalCase filenames for Vue components)
- Views: `src/views/` (PascalCase for page components)
- Utils: `src/utils/` (camelCase for JS utilities)
- Styles: `src/assets/styles/` (SCSS)
- Router: `src/router/index.js`

### Naming Conventions
- **Variables/Refs**: camelCase (`hiprintTemplate`, `showDataDialog`)
- **Functions**: camelCase with descriptive names, use `handle` prefix for event handlers (`handlePreview`, `handleUndo`)
- **Components**: PascalCase (`LogisticsDesigner`, `TemplateManager`)
- **Constants**: camelCase for data exports (`logisticsPrintData`), UPPER_SNAKE_CASE for config if needed
- **CSS classes**: kebab-case (`logistics-designer`, `action-bar`)

### Vue Component Pattern
```vue
<template>
  <!-- Template code -->
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// Component imports

// State (refs, computed)
const state = ref(null)

// Lifecycle hooks
onMounted(() => {
  // Initialization
})

// Event handlers
function handleEvent() {
  // Handler logic
}

// Cleanup
onBeforeUnmount(() => {
  // Cleanup
})
</script>

<style scoped lang="scss">
// Scoped SCSS styles
</style>
```

### Error Handling
- Wrap critical operations in try-catch blocks
- Use Element Plus `ElMessage` for user feedback:
  - Success: `ElMessage.success('message')`
  - Error: `ElMessage.error('message')`
  - Warning: `ElMessage.warning('message')`
  - Info: `ElMessage.info('message')`
- Early return for validation checks before execution

### Comments & Documentation
- Use Chinese comments for business logic explanations
- JSDoc style for exported functions:
  ```javascript
  /**
   * 获取随机物流数据
   * @param {number} count - 生成数量
   * @returns {Array} 物流数据数组
   */
  export function getRandomLogisticsData(count = 1) {
    // Implementation
  }
  ```
- Inline comments for complex logic

### Styling Guidelines
- Use SCSS with scoped styles
- Nesting max 3 levels deep
- Use CSS variables for theme colors
- Element Plus component customization with `:deep()`: `:deep(.el-button)`
- Responsive design with Element Plus grid system (`el-row`, `el-col`)

### hiprint Integration
- Initialize hiprint in component `onMounted` hook
- Clean up in `onBeforeUnmount`: `hiprintTemplate.clear()`
- Use template JSON format for templates (see `src/utils/defaultTemplate.js`)
- Use data object format for print data (see `src/utils/logisticsData.js`)

### Best Practices
- Use `nextTick()` after DOM updates before hiprint operations
- Avoid direct DOM manipulation, use Vue refs instead
- Copy objects with `JSON.parse(JSON.stringify(obj))` for deep cloning
- Use `<template #header>` and `<template #footer>` for Element Plus slots
- Use `v-model` for two-way binding with form controls
- Use router navigation via `router.push()` and `router.replace()`
