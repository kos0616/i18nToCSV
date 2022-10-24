import _ from "lodash";

export type returns = {
  fileName: string;
  result: Record<string, string>;
};

/**
 * 將格式化後的 csv 檔轉回物件，並且用 Promise 的方式回傳
 * @param file csv 語系檔
 * @returns Promise<object> 必須用 Promise 才能取得 FileReader 的結果
 */
export default (file: File): Promise<returns> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file."));
    };
    reader.onload = () => {
      try {
        const RAW_DATA = reader.result as string;
        resolve(parser(RAW_DATA));
      } catch (e) {
        alert(e);
        resolve({ fileName: "", result: {} });
      }
    };
    reader.readAsText(file);
  });
};

function parser(RAW_DATA: string) {
  const ARR_DATA = RAW_DATA.split("\n") || [];

  /** 取表頭做為設定值 */
  const TITLE = ARR_DATA[0] || "";
  /** 取 C:1 模組名稱 */
  const MODULE_NAME = CSVtoArray(TITLE)[0];
  /** 取 C:3 語系 */
  const LOCALE_NAME = CSVtoArray(TITLE)[2];
  const fileName = `${MODULE_NAME}-${LOCALE_NAME}`;

  /** 剩餘的語系資料 */
  const TRUE_DATAS = ARR_DATA.slice(1);
  const result: Record<string, string> = TRUE_DATAS.reduce((cur, str) => {
    const arr = CSVtoArray(str);
    /** 指定 KEY 值  */
    const key = arr[0];
    const NEST_KEYS = key.split(".");
    /** 指定 VALUE 值 */
    const value = arr[2];

    /** 若為巢狀物件，用 lodash 編輯原始物件 */
    if (NEST_KEYS.length > 1) {
      const NEST_OBJ = cur;
      _.setWith(NEST_OBJ, NEST_KEYS, value, Object);
      return NEST_OBJ;
    }
    return { ...cur, ...{ [key]: value } };
  }, {});

  return { fileName, result };
}

// Return array of string values, or NULL if CSV string not well formed.
function CSVtoArray(text: string) {
  const re_valid =
    /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  const re_value =
    /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

  // Return NULL if input string is not well formed CSV string.
  if (!re_valid.test(text)) return [];

  const a = []; // Initialize array to receive values.
  text.replace(
    re_value, // "Walk" the string using replace with callback.
    function (m0, m1, m2, m3) {
      // Remove backslash from \' in single quoted values.
      if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      // Remove backslash from \" in double quoted values.
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return ""; // Return empty string.
    }
  );

  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push("");
  return a;
}
