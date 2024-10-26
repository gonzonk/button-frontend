<script setup lang="ts">
import router from "@/router";

const props = defineProps(["post"]);
</script>

<template>
  <div class="thumbnail">
    <div @click="router.push({ path: `/post/${props.post._id}` })">
      <h3>{{ props.post.title }}</h3>
      <p class="author">{{ props.post.author }}</p>
      <iframe :src="props.post.thumbnailMedia"></iframe>
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
