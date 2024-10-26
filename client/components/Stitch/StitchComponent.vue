<script setup lang="ts">
import CommentListComponent from "@/components/Comment/CommentListComponent.vue";
import PostThumbnailComponent from "@/components/Post/PostThumbnailComponent.vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["stitch"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
const parent = ref<Array<Record<string, string>>>();
const loaded = ref(false);

const deleteStitch = async () => {
  try {
    await fetchy(`/api/stitches/${props.stitch._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

async function getPost() {
  let _id = props.stitch.parent;
  let query: Record<string, string> = { _id };
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  parent.value = postResults[0];
}

onBeforeMount(async () => {
  await getPost();
  loaded.value = true;
});
</script>

<template>
  <article class="stitch">
    <div class="media">
      <iframe :src="props.stitch.media"></iframe>
    </div>
    <div class="info">
      <h1>{{ props.stitch.caption }}</h1>
      <p class="author">By: {{ props.stitch.author }}</p>
      <article class="timestamp">
        <p v-if="props.stitch.dateCreated !== props.stitch.dateUpdated">Edited on: {{ formatDate(props.stitch.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.stitch.dateCreated) }}</p>
      </article>
      <menu v-if="props.stitch.author == currentUsername">
        <li><button class="button-error btn-small pure-button" @click="deleteStitch">Delete</button></li>
      </menu>
      <article class="parentPost">
        <h2>Made from:</h2>
        <PostThumbnailComponent v-if="loaded" :post="parent" />
        <p v-else>loading</p>
      </article>
    </div>
  </article>
  <div class="comments">
    <CommentListComponent :parent="props.stitch" />
  </div>
</template>

<style scoped>
.stitch {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100vw;
  margin: 0px;
}

iframe {
  margin: 1vw;
  width: 49vw;
  height: 60vh;
}

.info {
  display: flex;
  flex-direction: column;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.parentPost {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: inline-flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  margin: 2vh;
}
</style>
