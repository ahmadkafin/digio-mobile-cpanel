<template>
  <div class="row">
    <div class="px-2">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="search"
          id="search-value"
          :value="searchValue"
          v-debounce:1s="searchData"
        />
        <span class="input-group-text" id="basic-addon">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </span>
      </div>
    </div>
    <div v-if="isLoading" class="d-flex justify-content-center">
      <span class="loader"></span>
    </div>
    <template v-for="item in products" v-else>
      <div class="text-center" v-if="noData">No Data</div>
      <div class="card mx-2 my-2 p-0" style="width: 18rem" v-else>
        <img
          :src="`https://digio.pgn.co.id/digiomobilebe/dev/static/images/products/${item.image}`"
          class="card-img-top fixed-img"
          :alt="item.image"
        />
        <div class="card-body">
          <h5 class="card-title">{{ item.name }}</h5>
          <div class="card-text clamp-4" v-html="legacyToHtml(item.description)"></div>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item warning" @click="goToForm(item.uid)">
            <font-awesome-icon :icon="['fas', 'pencil']" />
            Update
          </li>
          <li class="list-group-item danger" @click="apiDelete(item.uid)">
            <font-awesome-icon :icon="['fas', 'trash']" />
            Delete
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import apiServices from '@/services/api.services'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import DOMPurify from 'dompurify'

const escapeHtml = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )
const looksLikeHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s ?? '')

export default {
  name: 'ProductsComponents',
  components: { FontAwesomeIcon },
  data() {
    return {
      searchValue: '',
    }
  },
  props: ['products', 'isLoading', 'noData'],
  methods: {
    searchData(value) {
      value = document.getElementById('search-value').value
      this.searchValue = value
      this.$emit('searchData', value)
    },
    goToForm(item) {
      this.$emit('goTo', item)
    },
    legacyToHtml(raw) {
      if (!raw) return ''
      if (looksLikeHtml(raw)) {
        const html = looksLikeHtml(raw) ? raw : generatedHtml
        return DOMPurify.sanitize(html, {
          ALLOWED_TAGS: ['p', 'ul', 'li', 'br', 'strong', 'em', 'a'],
          ALLOWED_ATTR: ['href', 'target', 'rel'],
        })
      }

      const text = raw.replace(/\\n/g, '\n') // jika \n masih escaped
      const lines = text.split('\n')

      let html = ''
      let inList = false

      for (const line of lines) {
        const t = line.trim()
        const bul = t.match(/^<bul>\s*(.*)$/i) // marker bullet
        if (bul) {
          if (!inList) {
            html += '<ul>'
            inList = true
          }
          html += `<li>${escapeHtml(bul[1])}</li>`
        } else {
          if (inList) {
            html += '</ul>'
            inList = false
          }
          if (t) html += `<p>${escapeHtml(t)}</p>`
          else html += '<p><br></p>' // baris kosong
        }
      }
      if (inList) html += '</ul>'
      return html
    },
    apiDelete(uid) {
      this.$emit('apiDelete', uid)
    },
  },
}
</script>

<style scoped>
.clamp-4 {
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hidden {
  display: none;
}
</style>
