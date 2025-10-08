<template>
  <div
    class="nav flex-column nav-pills me-3 custom-nav-btn"
    id="v-pills-tab"
    role="tablist"
    aria-orientation="vertical"
  >
    <button
      class="nav-link active"
      id="v-pills-home-tab"
      data-bs-toggle="pill"
      data-bs-target="#v-pills-home"
      type="button"
      role="tab"
      aria-controls="v-pills-home"
      aria-selected="true"
      @click="loadHome"
    >
      Home
    </button>
    <button
      class="nav-link"
      id="v-pills-profile-tab"
      data-bs-toggle="pill"
      data-bs-target="#v-pills-profile"
      type="button"
      role="tab"
      aria-controls="v-pills-profile"
      aria-selected="false"
      @click="loadProfile"
    >
      Apps
    </button>
  </div>
</template>
<script>
export default {
  name: 'SideMenuComponents',
  methods: {
    loadHome() {
      this.$emit('callHome')
    },
    loadProfile() {
      this.$emit('callProfile')
    },
  },
}
</script>

<style scoped>
.custom-nav-btn > .nav-link {
  color: white;
}

.custom-nav-btn > .nav-link.active {
  background-color: rgb(231 152 0);
  width: 100px;
}
</style>
