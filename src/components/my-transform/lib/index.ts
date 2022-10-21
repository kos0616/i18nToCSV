import setJson from "./loadingJson";
import setCsv from "./loadingCsv";

/**
 * Loading .json/.csv then convert to Object
 * @params ev Event
 * @return Object
 */
export default (ev: Event): void | Promise<Record<string, string>> => {
  if (chkFile(ev) === false) return;

  const target = ev.target as HTMLInputElement;
  const files = target.files || [];
  const data = files[0];
  const FILE_TYPE = data.type;

  /** json 流程 */
  if (FILE_TYPE.includes("json")) return setJson(data);

  /** csv 流程 */
  if (FILE_TYPE.includes("csv")) return setCsv(data);
};

/** 檢查檔案存在 */
function chkFile(ev: Event): boolean {
  const target = ev.target as HTMLInputElement;
  if (!target || target === null) {
    alert("File not exists.");
    return false;
  }

  const files = target.files;
  if (!files) return false;
  return true;
}
