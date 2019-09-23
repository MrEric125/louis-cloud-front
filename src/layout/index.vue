<template>
  <div v-if="device==='mobile' && siderbar.opend" class="drawer-bg" @click="handleClickOutsider">

  </div>
</template>

<script>

// import RightPanel from '@/components/RightPanel'
import { mapState } from 'vuex'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    }),
    classObj() {
      return {}
    }
  },
  methods: {
    handleClickOutside() {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
