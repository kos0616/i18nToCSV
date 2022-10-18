<template>
  <header class="border-b border-stone-600 px-5 pt-3">
    <div class="max-w-6xl mx-auto flex justify-between">
      <h1 class="bg-stone-600 text-white px-3 py-2">i18n.json to CSV</h1>
      <nav>
        <ul class="flex">
          <li>
            <label
              class="px-3 py-2 hover:text-stone-900 block cursor-pointer"
              title="切換至轉換模式"
            >
              <input
                v-model="active"
                value="transform"
                type="radio"
                class="sr-only peer"
              />
              <i
                class="transition-colors peer-checked:text-blue-600 fa-solid fa-arrow-right-arrow-left fa-fw"
              />
              轉換
            </label>
          </li>
          <li>
            <label
              class="px-3 py-2 hover:text-stone-900 block cursor-pointer"
              title="切換至合併模式"
            >
              <input
                v-model="active"
                value="merge"
                type="radio"
                class="sr-only peer"
                disabled
              />
              <i
                class="transition-colors peer-checked:text-blue-600 fa-solid fa-down-left-and-up-right-to-center fa-flip-horizontal fa-fw"
              />
              合併
            </label>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "my-header",
  emits: ["change"],
  setup(props, { emit }) {
    const active = ref<typeMode>("transform");

    watch(
      active,
      (v) => {
        emit("change", v);
      },
      { immediate: true }
    );

    return { active };
  },
});
</script>
