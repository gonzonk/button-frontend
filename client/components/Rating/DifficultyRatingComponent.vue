<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["parent"]);
console.log(parent);
const rating = ref(1);
const newRating = ref(1);
const loaded = ref(false);

async function getRating(contentId: string) {
  let query: Record<string, string> = { contentId };
  let ratingResults;
  try {
    ratingResults = await fetchy(`/api/difficultyRatings/${props.parent.id}`, "GET", { query });
  } catch (_) {
    return;
  }
  rating.value = Math.round(ratingResults.rating.averageRating);
}

const rate = async (contentId: string, rating: number) => {
  try {
    await fetchy(`/api/difficultyRatings/${props.parent._id}`, "PUT", { body: { rating: newRating.value, contentId: contentId } });
  } catch (_) {
    return;
  }
};

onBeforeMount(async () => {
  await getRating(props.parent._id);
  loaded.value = true;
});
</script>

<template>
  <article class="rating">
    <div>
      <p>Difficulty Rating:</p>
      <p v-if="loaded">{{ rating }}</p>
      <p v-else>loading...</p>
    </div>
    <div>
      <p>Rate:</p>
      <form @submit.prevent="rate(props.parent._id, newRating)">
        <input type="range" min="1" max="5" id="newRating" v-model="newRating" placeholder="Your Rating" required />
        <p style="display: inline; margin: 1vw">{{ newRating }}</p>
        <button class="btn-small pure-button-primary pure-button" type="submit">Rate!</button>
      </form>
    </div>
  </article>
</template>

<style scoped>
.rating {
  display: flex;
  flex-direction: column;
}
</style>
