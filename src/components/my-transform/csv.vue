<template>
  <section>
    <div class="md:grid grid-rows-[100px] grid-cols-2 gap-4 mb-5">
      <div class="flex flex-col">
        <button
          @click="$emit('modeChange')"
          class="text-stone-600 text-center text-xl flex items-center justify-center w-full mb-auto"
        >
          <code class="my-code">csv</code>
          <i class="mx-2 fa-solid fa-arrow-right fa-fw" />
          <code>
            <i class="fa-solid fa-file-code"></i>
            json
          </code>
        </button>
        <button
          @click="handleDownloadJSON"
          :disabled="Object.keys(csvResult).length === 0"
          type="submit"
          class="my-btn w-full mt-3"
        >
          <i class="fas fa-fw fa-download"></i>
          <span v-if="fileName"> {{ fileName }}.JSON</span>
          <span v-else>DOWNLOAD JSON</span>
        </button>
      </div>
      <label class="rounded-lg bg-gray-200 border p-5 block">
        <input @change="handleFile" type="file" accept=".csv" />
      </label>
    </div>

    <div class="border bg-white rounded-lg">
      <h3 class="text-lg rounded-t-lg py-2 px-3 bg-blue-200">
        <i class="fa-solid fa-file-lines fa-fw text-blue-500"></i>
        RESULT
      </h3>
      <hr />
      <table v-show="Object.keys(csvResult).length > 0" class="w-full">
        <tbody>
          <tr
            v-for="(value, key) in csvResult"
            :key="`csvResult_${key}`"
            class="border-b hover:bg-gray-100"
          >
            <th class="text-left px-3 whitespace-nowrap w-6">{{ key }}</th>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { handleCsv } from "./lib/index";
import flatter from "./lib/objectFlatter";
import download from "./lib/download";

/** 轉換模式 csv 轉 json */
export default defineComponent({
  name: "my-transform-mode-CSV",
  emits: ["modeChange"],
  setup() {
    /** 巢狀物件型態 準備轉為 json */
    const jsonResult = ref<Record<string, string>>({});
    /** csv 檔案預覽型態 */
    const csvResult = ref<Record<string, string>>({});

    /** 下載時的命名設定 */
    const fileName = ref("");

    /** 檔案匯入 */
    const handleFile = async (ev: Event) => {
      const getter = await handleCsv(ev);

      if (getter) {
        jsonResult.value = getter.result;
        csvResult.value = flatter(getter.result);
        fileName.value = getter.fileName;
      }
    };

    /** JSON 下載 */
    const handleDownloadJSON = () => {
      const text = JSON.stringify(jsonResult.value);

      if (text) {
        download(`${fileName.value}.json`, text);
      } else {
        alert("noData");
      }
    };

    return {
      handleFile,
      jsonResult,
      handleDownloadJSON,
      csvResult,
      fileName,
    };
  },
});
</script>
