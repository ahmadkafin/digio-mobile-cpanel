<template>
  <div
    class="tab-pane fade mx-3"
    id="v-pills-profile"
    role="tabpanel"
    aria-labelledby="v-pills-profile-tab"
    tabindex="1"
  >
    <div class="row text-center text-light">
      <h1>CONFIG APPS</h1>
    </div>

    <div class="row justify-content-between align-items-stretch">
      <template v-for="item in dataCard" :key="item.name">
        <div
          :class="['card', 'col-md-4', 'col-sm-12', 'mb-3', 'custom-card', item.images]"
          :style="[`background-color: ${item.color}`]"
        >
          <img
            :src="'/digiomobilecpanel/assets/images/' + item.images + '.png'"
            class="card-img-top fixed-img"
            :alt="item.images"
          />
          <div class="card-body custom-card-body">
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-text">
              {{ item.description }}
              <input
                type="text"
                class="form-control"
                v-if="item.type === 'input'"
                v-model="version"
              />
            </p>
            <button
              class="btn btn-primary btn-sm"
              @click="submitToServer(item)"
              v-if="item.type == 'input'"
            >
              Submit
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </button>

            <div
              class="btn-group"
              role="group"
              aria-label="Basic checkbox toggle button group"
              v-if="item.type == 'checkbox'"
            >
              <input
                type="checkbox"
                class="btn-check"
                :id="item.path"
                :checked="item.model"
                v-model="item.model"
                autocomplete="off"
                @change="changeToServer(item)"
              />
              <label class="btn btn-sm btn-outline-warning" :for="item.path">
                <template v-if="item.path == 'documentSecure'">
                  {{ item.model ? 'Document Locked' : 'Document not Locked' }}
                </template>
                <template v-else-if="item.path == 'isMaintenance'">
                  {{ item.model ? 'Apps is maintenance' : 'Apps is not maintenance' }}
                </template>
              </label>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import apiServices from '@/services/api.services'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'ProfilePartialsComponents',
  components: { FontAwesomeIcon },

  data() {
    return {
      dataCard: [],
      version: '0',
      isDocumentSecure: false,
      isMaintenance: false,
    }
  },
  mounted() {
    this.getInit()
  },
  methods: {
    getInit() {
      apiServices.initConfig().then((response) => {
        this.version = response.data.currentVersion
        this.isDocumentSecure = response.data.isDocumentSecure
        this.isMaintenance = response.data.isMaintenance
        this.buildDataCard()
      })
    },
    buildDataCard() {
      this.dataCard = [
        {
          name: 'Current Version',
          description: 'Use this to change the app version (applies on cold start).',
          color: '#E79800',
          images: 'SemanticVersioning',
          path: 'version',
          type: 'input',
        },
        {
          name: 'Change Locked Document',
          description:
            'Enable this to control whether the document viewer allows screenshots (applies on cold start).',
          color: '#C44536',
          images: 'no-screenshot',
          path: 'documentSecure',
          type: 'checkbox',
          model: this.isDocumentSecure,
        },
        {
          name: 'Maintenance Apps',
          description:
            'Enable this to notify users when the app is under maintenance (applies on cold start).',
          color: '#2E5077',
          images: 'no-screenshot',
          path: 'isMaintenance',
          type: 'checkbox',
          model: this.isMaintenance,
        },
      ]
    },

    changeToServer(item) {
      if (item.path == 'documentSecure') {
        this.isDocumentSecure = !this.isDocumentSecure
        this.apiCall({
          isDocumentSecure: this.isDocumentSecure,
        })
        // console.log(item)
      } else if (item.path == 'isMaintenance') {
        this.isMaintenance = !this.isMaintenance
        this.apiCall({
          isAppMaintenance: this.isMaintenance,
        })
        // console.log(item)
      }
    },
    submitToServer(item) {
      if (item.path === 'version') {
        if (this.version === '' || this.version === null) {
          alert('Version cannot be empty!')
        } else {
          this.apiCall({
            currentVersion: this.version,
          })
        }
      }
    },
    apiCall(data) {
      apiServices
        .changeConfig(data)
        .then((response) => {
          this.$toast.success('201 - berhasil ubah data')
        })
        .catch((e) => {
          this.loading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.message}`
          this.$toast.error(eMessage)
        })
    },
  },
}
</script>

<style scoped>
.custom-card {
  color: white;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.custom-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.custom-card.products > .custom-card-body > .btn {
  background-color: rgb(234, 184, 92);
}

.custom-card-body > .btn {
  margin-top: auto;
  font-size: 0.8em;
  background-color: rgb(231 152 0);
  border-color: rgb(231 152 0);
}

.custom-card.products > .custom-card-body > .btn:hover,
.custom-card-body > .btn:hover {
  background-color: rgb(174, 44, 0);
  border-color: rgb(174, 44, 0);
}
</style>
