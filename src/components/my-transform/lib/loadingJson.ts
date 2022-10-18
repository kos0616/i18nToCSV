import flatter from "./objectFlatter";

/**
 * 將 json 檔轉為物件，並且用 Promise 的方式回傳
 * @param file File JSON語系檔
 * @returns Promise<object> 必須用 Promise 才能取得 FileReader 的結果
 */
export default (file: File): Promise<Record<string, string>> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    reader.onload = () => {
      try {
        const RAW_DATA = reader.result as string;
        resolve(flatter(JSON.parse(RAW_DATA)));
      } catch (e) {
        alert(e);
        resolve({});
      }
    };
    reader.readAsText(file);
  });
};
