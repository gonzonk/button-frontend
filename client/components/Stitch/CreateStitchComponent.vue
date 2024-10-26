<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["parent"]);
const caption = ref("");
const media = ref("");
const emit = defineEmits(["refreshStitches"]);

const createStitch = async (caption: string, media: string) => {
  try {
    let parentId = props.parent._id;
    let community = props.parent.community;
    await fetchy("/api/stitches", "PUT", {
      body: { caption, media, parentId, community },
    });
  } catch (_) {
    return;
  }
  emptyForm();
  emit("refreshStitches");
};

const emptyForm = () => {
  caption.value = "";
  media.value = "";
};
</script>

<template>
  <form @submit.prevent="createStitch(caption, media)">
    <label for="caption">Caption:</label>
    <input id="caption" v-model="caption" placeholder="Caption" required />
    <label for="media">Thumbnail Link:</label>
    <input id="media" v-model="media" placeholder="Thumbnail Link" required />
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
