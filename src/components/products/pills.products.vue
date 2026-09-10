<template>
  <div class="pill-container">
    <div :class="['pill', active == 'all' ? 'active' : '']" @click="changeActive(true, {})">
      All
    </div>
    <div
      :class="['pill', active == item.name ? 'active' : '']"
      v-for="item in pCategories"
      :key="item"
      @click="changeActive(false, item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PillsProductsComponent',
  data() {
    return {
      active: 'all',
    }
  },
  props: ['pCategories'],
  methods: {
    changeActive(isAll, item) {
      this.active = isAll ? 'all' : item.name
      this.$emit('filterVideoFeed', item.uid === undefined ? 'all' : item.uid)
    },
  },
}
</script>

<style scoped>
.pill-container {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.pill-container::-webkit-scrollbar {
  display: none;
}

.pill {
  flex-shrink: 0;
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid #e0e0e0;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.pill:hover {
  background-color: #e8e8e8;
}

.pill.active {
  background-color: #000;
  color: #fff;
  border-color: #000;
}
</style>
