<script setup lang="ts">
import router from "@/router";

const props = defineProps(["stitch"]);
</script>

<template>
  <div class="thumbnail">
    <div @click="router.push({ path: `/stitch/${props.stitch._id}` })">
      <h3>{{ props.stitch.caption }}</h3>
      <p class="author">{{ props.stitch.author }}</p>
      <iframe :src="props.stitch.media"></iframe>
    </div>
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
