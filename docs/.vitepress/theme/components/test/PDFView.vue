<script setup>
import VuePdfEmbed  from 'vue-pdf-embed';

import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const pdfSource = defineProps({
    url: {
        type: String,
        required: true
    }
})
</script>

<template>
  <div class="pdf-container">
    <VuePdfEmbed
      :source="pdfSource.url"
      :page="1"
      class="pdf-viewer"
    />
  </div>
</template>

<style scoped>
.pdf-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem 0;
}

:deep(.pdf-viewer) {
  width: 100%;
  min-height: 600px;
}

</style>