<script setup lang="ts">
import CreateStitchComponent from "@/components/Stitch/CreateStitchComponent.vue";
import StitchThumbnailComponent from "@/components/Stitch/StitchThumbnailComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["parent", "allSearch"]);
const loaded = ref(false);
let stitches = ref<Array<Record<string, string>>>([]);

async function getStitches() {
  console.log("calling get stitches");
  let query: Record<string, string>;
  if (props.allSearch) {
    query = {};
  } else {
    const parent = props.parent._id;
    query = { parent };
  }
  let stitchResults;
  try {
    stitchResults = await fetchy("/api/stitches", "GET", { query });
  } catch (_) {
    return;
  }
  stitches.value = stitchResults;
}

onBeforeMount(async () => {
  await getStitches();
  loaded.value = true;
});
</script>

<template>
  <h2>Stitches</h2>
  <section class="stitches" v-if="loaded && stitches.length !== 0">
    <article v-for="stitch in stitches" :key="stitch._id">
      <StitchThumbnailComponent :stitch="stitch" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
  <section v-if="isLoggedIn">
    <h2>Create a Stitch:</h2>
    <CreateStitchComponent :parent="props.parent" @refreshStitches="getStitches" />
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.stitches {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
