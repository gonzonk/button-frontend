<script setup lang="ts">
import CommentListComponent from "@/components/Comment/CommentListComponent.vue";
import DifficultyRatingComponent from "@/components/Rating/DifficultyRatingComponent.vue";
import StitchListComponent from "@/components/Stitch/StitchListComponent.vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import QualityRatingComponent from "../Rating/QualityRatingComponent.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};
</script>

<template>
  <div class="post">
    <div class="media">
      <iframe :src="props.post.thumbnailMedia"></iframe>
    </div>
    <div class="info">
      <h1>{{ props.post.title }}</h1>
      <p class="author">by: {{ props.post.author }}</p>
      <a :href="props.post.blueprintMedia">Instructions</a>
      <p>Description: {{ props.post.description }}</p>
      <article class="timestamp">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
      <menu v-if="props.post.author == currentUsername">
        <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
      </menu>
    </div>
  </div>
  <div class="ratings">
    <DifficultyRatingComponent :parent="props.post" />
    <QualityRatingComponent :parent="props.post" />
  </div>
  <div class="comments">
    <CommentListComponent :parent="props.post" />
  </div>
  <div class="stitches">
    <StitchListComponent :parent="props.post" :allSearch="false" />
  </div>
</template>

<style scoped>
.post {
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
  width: 49vw;
  align-items: flex-start;
  justify-content: flex-start;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.ratings {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100vw;
  margin: 1vh;
}
</style>
