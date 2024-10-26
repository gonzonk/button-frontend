<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const blueprintMedia = ref("");
const thumbnailMedia = ref("");
const description = ref("");
const community = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (title: string, blueprintMedia: string, thumbnailMedia: string, description: string, community: string) => {
  try {
    await fetchy("/api/posts", "POST", {
      body: { title, blueprintMedia, thumbnailMedia, description, community },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  blueprintMedia.value = "";
  thumbnailMedia.value = "";
  description.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(title, blueprintMedia, thumbnailMedia, description, community)">
    <label for="title">Post Title:</label>
    <input id="title" v-model="title" placeholder="Title" required />
    <label for="thumbnailMedia">Thumbnail Link:</label>
    <input id="thumbnailMedia" v-model="thumbnailMedia" placeholder="Thumbnail Link" required />
    <label for="blueprintMedia">Blueprint Link:</label>
    <input id="blueprintMedia" v-model="blueprintMedia" placeholder="Blueprint Link" required />
    <label for="description">Description:</label>
    <textarea id="description" v-model="description" placeholder="Description" required></textarea>
    <label for="community">Community:</label>
    <select id="community" v-model="community" placeholder="Community" required>
      <option value="Crochet">Crochet</option>
      <option value="Knitting">Knitting</option>
      <option value="Woodworking">Woodworking</option>
      <option value="Cross Stiching">Cross Stiching</option>
    </select>
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
