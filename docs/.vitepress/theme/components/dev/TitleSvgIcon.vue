<script setup>
defineProps({
  svgPath: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '64px'
  },
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="lang-icon-container">
    <img
      :src="svgPath"
      :style="{ width: size, height: size }"
      class="lang-icon"
    />
    <h1 style="color:var(--vp-c-text-1)"> {{ title }} </h1>
  </div>
</template>

<style scoped>
.lang-icon-container {
  display: flex;
  align-items: center;
  margin: 1rem 0 2rem;
}

.lang-icon {
  margin-right: 16px;
  vertical-align: middle;
}
</style>