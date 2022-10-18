<template>
  <div class="bg-stone-100">
    <my-header @change="handelModeChange" />
    <main class="max-w-6xl mx-auto py-5 px-5">
      <myTransform v-if="activeMode === 'transform'" />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import myHeader from "./components/my-header.vue";
import myTransform from "./components/my-transform/index.vue";

export default defineComponent({
  name: "App",
  components: { myHeader, myTransform },
  setup() {
    const activeMode = ref<typeMode>("transform");

    const handelModeChange = (mode: typeMode) => {
      activeMode.value = mode;
    };

    return { handelModeChange, activeMode };
  },
});
</script>
