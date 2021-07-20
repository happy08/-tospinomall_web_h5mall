<template>
  <div>
    <Nuxt keep-alive :keep-alive-props="{ max: 3 }" />
    <!-- <Nuxt /> -->
  </div>
</template>

<script>
export default {
  name: 'LayOuts'
}
</script>
