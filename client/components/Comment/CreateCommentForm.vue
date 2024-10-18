<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["parent"]);

const content = ref("");
const emit = defineEmits(["refreshPosts"]);

const createComment = async (content: string, parentId: string) => {
  try {
    await fetchy("/api/comments", "PUT", {
      body: { content, parentId },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createComment(content, props.parent._id)">
    <label for="content">Comment:</label>
    <textarea id="content" v-model="content" placeholder="Make a comment!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Post Comment</button>
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
