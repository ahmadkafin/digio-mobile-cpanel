<template>
  <div class="tab-content" id="v-pills-tabContent">
    <HomePartialsComponents />
    <ProfilePartialsComponents />
  </div>
</template>

<script>
import HomePartialsComponents from './partials/Home.partials.components.vue'
import ProfilePartialsComponents from './partials/Profile.partials.components.vue'

export default {
  name: 'BodyComponent',
  components: { HomePartialsComponents, ProfilePartialsComponents },
}
</script>
