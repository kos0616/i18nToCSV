<template>
  <section>
    <div
      class="md:grid grid-rows-[80px_auto] grid-cols-2 grid-flow-col gap-4 mb-5"
    >
      <button
        @click="$emit('modeChange')"
        class="text-stone-600 text-center text-xl flex items-center justify-center"
      >
        <code class="my-code"> json </code>
        <i class="mx-2 fa-solid fa-arrow-right fa-fw" />
        <code>
          <i class="fa-solid fa-file-csv"></i>
          csv
        </code>
      </button>

      <form
        @submit.prevent="handleDownloadCSV"
        class="border rounded-lg bg-white"
      >
        <h3 class="py-2 px-3 text-lg rounded-t-lg bg-cyan-200 text-gray-700">
          <i class="text-cyan-800 fas fa-tools fa-fw"></i>
          SETTINGS
        </h3>
        <div class="px-3 py-2">
          <div class="mb-3">
            <label for="module" class="block mb-1">Module Name</label>
            <input
              v-model="DOWNLOAD_OPTIONS.MODULE_NAME"
              type="text"
              class="border rounded px-2 py-1 w-full"
              id="module"
              placeholder="FPKG-25-Util, THEME-1"
              required
            />
            <small>模組包命名，避免翻譯完成後，丟失來源。</small>
          </div>
          <div class="mb-3">
            <label for="lang" class="block mb-1">Target Lang code</label>
            <input
              v-model="DOWNLOAD_OPTIONS.LANG"
              type="text"
              class="border rounded px-2 py-1 w-full"
              id="lang"
              list="langs"
              placeholder="TH"
            />
            <datalist id="langs">
              <option v-for="(lang, i) in langs" :key="`lang_${i}`">
                {{ lang }}
              </option>
            </datalist>
            <small class="mt-2 block">
              翻譯完成後 可轉回
              <code class="my-code text-xs">{{ "{lang}.json" }}</code></small
            >
          </div>

          <button
            :disabled="
              Object.keys(csvResult).length === 0 ||
              Object.keys(DOWNLOAD_OPTIONS).length === 0
            "
            type="submit"
            class="my-btn w-full mt-3"
          >
            <i class="fas fa-fw fa-download"></i>
            DOWNLOAD CSV
          </button>
        </div>
      </form>

      <label class="rounded-lg bg-gray-200 border p-5 block">
        <input @change="handleFile" type="file" accept=".json" />
      </label>

      <label class="block">
        <p
          v-show="errorMSG"
          class="bg-red-300 text-red-900 px-3 py-2 mb-3 rounded"
          role="alert"
        >
          {{ errorMSG }}
        </p>
        <textarea
          @input="handleTextInput"
          class="p-3 border rounded w-full m-0 h-full"
          cols="30"
          placeholder="{ key: value }"
        ></textarea>
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
import { handleJson } from "./lib/index";
import flatter from "./lib/objectFlatter";
import download from "./lib/download";

const langs = ["en_US", "TH", "VN", "zh_CN", "zh_TW"];

/** 轉換模式 JSON 轉 CSV */
export default defineComponent({
  name: "my-transform-mode-JSON",
  emits: ["modeChange"],
  setup() {
    const csvResult = ref<Record<string, string>>({});

    /** 文字輸入 */
    const errorMSG = ref("");

    /** 下載時的命名設定 */
    const DOWNLOAD_OPTIONS = ref<{ MODULE_NAME?: string; LANG?: string }>({});

    /** 檔案匯入 */
    const handleFile = async (ev: Event) => {
      const getter = await handleJson(ev);

      if (getter) csvResult.value = getter;
    };

    /** 文字輸入 */
    const handleTextInput = (ev: InputEvent) => {
      const dom = ev.target as HTMLTextAreaElement;
      const str = dom.value;

      if (!str) {
        errorMSG.value = "";
        return;
      }

      try {
        const obj = JSON.parse(str);
        if (typeof obj === "number") {
          errorMSG.value = "";
          return;
        }
        csvResult.value = flatter(obj);
        errorMSG.value = "";
      } catch (e) {
        errorMSG.value = e as string;
      }
    };

    /** CSV 下載 */
    const handleDownloadCSV = () => {
      /** 首列設定 */
      const FIRST_ROW = `${DOWNLOAD_OPTIONS.value.MODULE_NAME}, zh_TW, ${DOWNLOAD_OPTIONS.value.LANG} \n`;
      const keys = Object.keys(csvResult.value);
      if (keys.length === 0) {
        alert("No data");
        return;
      }
      const formatedData = keys.map((k) => {
        return `${k},"${csvResult.value[k]}"`;
      }, []);
      const text = `${FIRST_ROW} ${formatedData.join("\n")}`;
      if (text) {
        download(`${DOWNLOAD_OPTIONS.value.MODULE_NAME}.csv`, text);
      } else {
        alert("noData");
      }
    };

    return {
      langs,
      DOWNLOAD_OPTIONS,
      handleFile,
      csvResult,
      handleTextInput,
      errorMSG,
      handleDownloadCSV,
    };
  },
});
</script>
