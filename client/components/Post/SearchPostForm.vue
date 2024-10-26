<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const community = ref("");
const emit = defineEmits(["getPostsByAuthor", "getPostsByCommunity"]);
</script>

<template>
  <!-- <form @submit.prevent="emit('getPostsByAuthor', author)" class="pure-form">
    <fieldset>
      <legend>Search by Author</legend>
      <input id="author" type="text" v-model="author" placeholder="Username" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form> -->
  <form @submit.prevent="emit('getPostsByCommunity', community)" class="pure-form">
    <fieldset>
      <legend>Search by Community</legend>
      <select id="community" v-model="community" placeholder="Community" required>
        <option value="Crochet">Crochet</option>
        <option value="Knitting">Knitting</option>
        <option value="Woodworking">Woodworking</option>
        <option value="Cross Stiching">Cross Stiching</option>
      </select>
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
