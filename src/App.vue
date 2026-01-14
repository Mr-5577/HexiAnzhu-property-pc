<template>
  <div id="app">
    <!-- <EstContainer v-if="$route.meta.loadContainer === true"></EstContainer> -->
    <router-view/>
  </div>
</template>

<script>
import '@/assets/common/css/main.css'
import EstContainer from '@/components/common/EstContainer.vue'
export default {
  name: 'app',
  components: {
    EstContainer
  }
}
</script>


