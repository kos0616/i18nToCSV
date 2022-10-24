<template>
  <section>
    <json v-if="mode === 1" @modeCchange="handleSwitchMode"> </json>
    <csv v-if="mode === 2" @modeCchange="handleSwitchMode"> </csv>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import json from "./json.vue";
import csv from "./csv.vue";

/** 轉換模式 */
export default defineComponent({
  components: { json, csv },
  name: "my-transform-mode",
  setup() {
    /** 1: json to csv, 2: csv to json */
    const mode = ref<1 | 2>(2);

    const handleSwitchMode = () => {
      if (mode.value === 1) {
        mode.value = 2;
        return;
      }
      mode.value = 1;
    };

    return { mode, handleSwitchMode };
  },
});
</script>
