<template>
  <div class="finder-columns">
    <div v-for="(col, colIndex) in columns" :key="col.key" class="finder-column">
      <div v-if="col.loading" class="col-state">Loading…</div>
      <div v-else-if="!col.items.length" class="col-state">Tidak ada data</div>

      <ul v-else class="finder-list">
        <li
          v-for="item in col.items"
          :key="getId(item)"
          :class="['finder-item', { selected: selected[colIndex] === getId(item) }]"
          @click="onSelect(colIndex, item)"
        >
          <span class="label">{{ getLabel(item) }}</span>
          <span>
            <!-- {{ item.querystring }}
            {{ item.contentstring }}
            {{ item.contenttype }} -->
          </span>
          <span class="chevron" v-if="hasChild(item)">›</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import apiServices from '@/services/api.services'

export default {
  name: 'DigioHelperFormComponents',
  props: {
    rootParentId: { type: [Number, String], default: 0 },
  },
  data() {
    return {
      columns: [],
      selected: [],
      childrenCache: new Map(),
    }
  },
  mounted() {
    this.loadColumn(0, this.rootParentId)
  },
  methods: {
    getId(item) {
      return item.menuid ?? item.id ?? item.menu_id
    },
    getLabel(item) {
      return item.label ?? item.name ?? item.title
    },
    hasChild(item) {
      return item.haschild
    },
    async fetchChildren(parentId) {
      if (this.childrenCache.has(parentId)) {
        return this.childrenCache.get(parentId)
      }
      const resp = await apiServices.getMenuDigio(parentId)
      const items = Array.isArray(resp?.data?.data) ? resp.data.data : []
      this.childrenCache.set(parentId, items)
      return items
    },

    async loadColumn(index, parentId) {
      this.columns = this.columns.slice(0, index)
      this.selected = this.selected.slice(0, index)

      const colKey = `col-${index}-${parentId}`
      this.columns.push({ key: colKey, loading: true, items: [] })

      try {
        const items = await this.fetchChildren(parentId)
        this.columns.splice(index, 1, { key: colKey, loading: false, items })
        return items
      } catch (e) {
        this.columns.splice(index, 1, { key: colKey, loading: false, items: [] })
        this.$toast?.error(`Gagal memuat menu: ${e?.response?.data?.resp || e.message}`)
        return []
      }
    },

    async onSelect(colIndex, item) {
      const id = this.getId(item)
      if (this.selected.length > colIndex) {
        this.selected.splice(colIndex, 1, id)
      } else {
        this.selected.push(id)
      }

      const children = await this.fetchChildren(id).catch(() => [])

      if (children.length === 0) {
        if (this.columns.length > colIndex + 1) {
          this.columns = this.columns.slice(0, colIndex + 1)
        }
        if (this.selected.length > colIndex + 1) {
          this.selected = this.selected.slice(0, colIndex + 1)
        }
        this.$emit('pick', item)
        return
      }

      await this.loadColumn(colIndex + 1, id)
    },
  },
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
