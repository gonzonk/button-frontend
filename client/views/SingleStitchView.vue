<script setup lang="ts">
import StitchComponent from "@/components/Stitch/StitchComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

// const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const route = useRoute();
const loaded = ref(false);
const stitchId = route.params.id;
const stitches = ref<Array<Record<string, string>>>([]);

async function getStitch(id: string) {
  let query: Record<string, string> = id !== undefined ? { id } : {};
  let stitchResults;
  try {
    stitchResults = await fetchy("/api/stitches", "GET", { query });
  } catch (_) {
    return;
  }
  stitches.value = stitchResults;
  console.log(stitchResults);
}

onBeforeMount(async () => {
  //@ts-expect-error stitchId is a string
  await getStitch(stitchId);
  loaded.value = true;
  console.log(stitches.value[0]);
});
</script>

<template>
  <main>
    <section class="post" v-if="loaded">
      <StitchComponent :stitch="stitches[0]" />
    </section>
    <p v-else>Loading...</p>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
