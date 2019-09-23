<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
    export default {
      name: "Link",
      props: {
        to: {
          type: String,
          required: true
        }
      },
      methods:{
        linkProps(url){

        }
      }
    }
</script>

<style scoped>

</style>
