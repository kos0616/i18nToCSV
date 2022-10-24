import setJson from "./loadingJson";
import setCsv, { returns } from "./loadingCsv";

/**
 * Loading .json then convert to Object
 * @params ev Event
 * @return Object
 */
export function handleJson(ev: Event): void | Promise<Record<string, string>> {
  if (chkFile(ev) === false) return;

  const target = ev.target as HTMLInputElement;
  const files = target.files || [];
  const data = files[0];
  const FILE_TYPE = data.type;

  /** json 流程 */
  if (FILE_TYPE.includes("json")) return setJson(data);
  throw new Error("File error!");
}

/**
 * Loading .csv then convert to Object
 * @params ev Event
 * @return Object
 */
export function handleCsv(ev: Event): void | Promise<returns> {
  if (chkFile(ev) === false) return;

  const target = ev.target as HTMLInputElement;
  const files = target.files || [];
  const data = files[0];
  const FILE_TYPE = data.type;

  // csv 流程
  if (FILE_TYPE.includes("csv")) return setCsv(data);

  throw new Error("File error!");
}
/** csv 流程 */
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
