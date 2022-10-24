<template>
  <section>
    <div class="md:grid grid-rows-[80px] grid-cols-2 gap-4 mb-5">
      <button
        @click="$emit('modechange')"
        class="text-stone-600 text-center text-xl flex items-center justify-center"
      >
        <code class="my-code">csv</code>
        <i class="mx-2 fa-solid fa-arrow-right fa-fw" />
        <code>
          <i class="fa-solid fa-file-code"></i>
          json
        </code>
      </button>

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
      <table v-show="Object.keys(jsonResult).length > 0" class="w-full">
        <tbody>
          <tr
            v-for="(value, key) in jsonResult"
            :key="`jsonResult_${key}`"
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
  emits: ["modechange"],
  setup() {
    const jsonResult = ref<Record<string, string>>({});

    /** 下載時的命名設定 */
    const DOWNLOAD_OPTIONS = ref<{ MODULE_NAME?: string; LANG?: string }>({});

    /** 檔案匯入 */
    const handleFile = async (ev: Event) => {
      const result = await handleCsv(ev);

      if (result) jsonResult.value = result;
    };

    /** CSV 下載 */
    const handleDownloadCSV = () => {
      /** 首列設定 */
      const FIRST_ROW = `${DOWNLOAD_OPTIONS.value.MODULE_NAME}, zh_TW, ${DOWNLOAD_OPTIONS.value.LANG} \n`;
      const keys = Object.keys(jsonResult.value);
      if (keys.length === 0) {
        alert("No data");
        return;
      }
      const formatedData = keys.map((k) => {
        return `${k},"${jsonResult.value[k]}"`;
      }, []);
      const text = `${FIRST_ROW} ${formatedData.join("\n")}`;
      if (text) {
        download(`${DOWNLOAD_OPTIONS.value.MODULE_NAME}.csv`, text);
      } else {
        alert("noData");
      }
    };

    return {
      DOWNLOAD_OPTIONS,
      handleFile,
      jsonResult,
      handleDownloadCSV,
    };
  },
});
</script>
