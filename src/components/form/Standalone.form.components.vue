<template>
  <div v-if="isLoading" class="d-flex justify-content-center">
    <span class="loader"></span>
  </div>
</template>
<script>
import DigioMenuHelperFormComponents from './helper/DigioMenu.helper.form.components.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  name: 'StandaloneFormComponent',
  props: ['isLoading', 'standalone'],
}
</script>

<style scoped>
.finder-columns {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px;
}
.finder-column {
  min-width: 240px;
  max-height: 60vh;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
}
.finder-list {
  list-style: none;
  margin: 0;
  padding: 6px;
}
.finder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
}
.finder-item:hover {
  background: #f6f7f9;
}
.finder-item.selected {
  background: #eef5ff;
  font-weight: 600;
}
.chevron {
  opacity: 0.5;
}
.col-state {
  font-size: 13px;
  color: #6b7280;
  padding: 10px;
}
</style>
