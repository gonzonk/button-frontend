<script setup lang="ts">
const props = defineProps(["post"]);
</script>

<template>
  <div class="thumbnail">
    <a :href="`/post/${post._id}`">
      <h3>{{ props.post.title }}</h3>
      <p class="author">{{ props.post.author }}</p>
      <!-- <img :src="props.post.thumbnailMedia" /> -->
      <iframe :src="props.post.thumbnailMedia"></iframe>
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
