<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
// import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
// import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

// const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const route = useRoute();
const loaded = ref(false);
const postId = route.params.id;
const posts = ref<Array<Record<string, string>>>([]);

async function getPost(_id: string) {
  let query: Record<string, string> = { _id };
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

onBeforeMount(async () => {
  console.log("searching for", postId);
  //@ts-expect-error stitchId is a string
  await getPost(postId);
  loaded.value = true;
});
</script>

<template>
  <main>
    <div v-if="loaded">
      <section class="post" v-if="loaded">
        <PostComponent :post="posts[0]" />
      </section>
    </div>
    <p v-else>Loading...</p>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
