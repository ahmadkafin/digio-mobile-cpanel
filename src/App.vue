<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
onMounted(() => {
  console.log('Query params : ', route.query)

  if (route.query.token) {
  }
})
</script>

<template>
  <RouterView />
</template>

<style>
#app {
  min-height: 100dvh;
  background: url('/assets/images/bg_first.png') center/cover no-repeat fixed;
  overflow: hidden;
}

.fixed-img {
  height: 250px;
  object-fit: cover;
  background-color: #fff;
}

.ql-editor {
  background-color: #f5f5f5;
}

.ql-toolbar {
  background-color: #e0e0e0;
}

.goback-btn {
  cursor: pointer;
}

.breadcrumbs > .svg-inline--fa {
  width: 8px;
}

.is-invalid {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.1);
}
.is-valid {
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.1);
}

.list-group-item {
  cursor: pointer;
  background-color: rgb(231 152 0) !important;
}

.list-group-item {
  background-color: aliceblue !important;
}

.list-group-item.success:hover {
  background-color: darkgreen !important;
  color: white;
}

.list-group-item.warning:hover {
  background-color: coral !important;
  color: black;
}

.list-group-item.danger:hover {
  background-color: crimson !important;
  color: white;
}

/* loader */
.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 3px solid;
  border-color: rgb(231 152 0) rgb(231 152 0) transparent transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 3px solid;
  border-color: transparent transparent #ff3d00 #ff3d00;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 0.5s linear infinite;
  transform-origin: center center;
}
.loader::before {
  width: 32px;
  height: 32px;
  border-color: #fff #fff transparent transparent;
  animation: rotation 1.5s linear infinite;
}

.past-page {
  color: grey;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
