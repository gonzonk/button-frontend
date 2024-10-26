<script setup lang="ts">
const props = defineProps(["stitch"]);
</script>

<template>
  <div class="thumbnail">
    <a :href="`/stitch/${stitch._id}`">
      <h3>{{ props.stitch.caption }}</h3>
      <p class="author">{{ props.stitch.author }}</p>
      <iframe :src="props.stitch.media"></iframe>
    </a>
  </div>
</template>

<style scoped>
.thumbnail {
  width: 15em;
}

iframe {
  width: 100%;
}
</style>
