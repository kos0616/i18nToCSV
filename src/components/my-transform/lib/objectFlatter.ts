type TYPE_LOCALE = Record<
  string,
  string | string[] | { [key: string]: TYPE_LOCALE }
>;

/**
 * Flat the nest object
 * @param obj object 巢狀物件
 * @returns 單層物件
 */
function flatter(obj: TYPE_LOCALE = {}): Record<string, string> {
  /** 取得語系檔的 key 值 */
  const KEYS = Object.keys(obj);
  /** 進行單層解析 */
  const data = KEYS.reduce((cur, key) => {
    /** 其值可能為字串, 字串陣列, 或是物件 */
    const NEXT_DATA = obj[key];

    /** 當值為普通的字串時，將其補上 */
    if (typeof NEXT_DATA === "string") {
      return { ...cur, ...{ [key]: NEXT_DATA } };
    }
    /** 當值為陣列時，進行轉換並且補上 */
    if (Array.isArray(NEXT_DATA)) {
      const ARR_DATA = NEXT_DATA.reduce((subCur, subNext, i) => {
        const NEW_KEY = `${key}.${i}`;
        return { ...subCur, ...{ [NEW_KEY]: subNext } };
      }, {});
      return { ...cur, ...ARR_DATA };
    }
    /** 值為物件時的轉換 */
    if (
      typeof NEXT_DATA === "object" &&
      NEXT_DATA !== null &&
      Object.keys(NEXT_DATA).length !== 0
    ) {
      /** 取得物件形態項目的 key值 */
      const SUB_KEYS = Object.keys(NEXT_DATA);
      /** 重新命名 key 值(加入母項目的 key 值) */
      const RE_KEYS_DATA = SUB_KEYS.reduce((subCur, subKey) => {
        /** 新的key */
        const NEW_KEY = `${key}.${subKey}`;
        /** 子項目資料 */
        const newDATA = NEXT_DATA[subKey];
        return { ...subCur, [NEW_KEY]: newDATA };
      }, {});
      /** 進行遞迴處理，將資料注回 */
      return { ...cur, ...flatter(RE_KEYS_DATA) };
    }
    return cur;
  }, {});
  return data;
}

export default flatter;
