<template>
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </section>
</template>

<script>
    export default {
      name: "AppMain",
      computed:{
        cacheViews(){
          return this.$store.state.tagsView.cacheViews
        },
        key(){
          return this.$route.path;
        }

      }
    }
</script>

<style lang="scss" scoped>
  .app-main{

  }

</style>
