import axios from 'axios';
// import { useAlert } from '@/composables/alertMethod';

/**
 * 獲取表頭數據
 * @param {string} url - API 的 URL
 * @param {string | string[]} responseKeys - 要抓取的 caseDocIndex 的欄位名，可以是單個字串或陣列
 */
export async function getJsonData(urlParam, responseKeys) {
  // const url = `${import.meta.env.VITE_APP_JSON_FILE_ROUTE}${urlParam}`;
  const basePath = import.meta.env.BASE_URL;
  const jsonPath = urlParam.startsWith('/') ? urlParam.substring(1) : urlParam;
  const url = `${basePath}${jsonPath}`;

  // const { showAlert } = useAlert(); /** alert共用方法 */

  try {
    const response = await axios({ url, method: 'get' });
    if (response.status === 200) {
      const data = response.data || {};
      if (Array.isArray(responseKeys)) {
        // 如果是陣列，回傳對應的 key-value 物件
        const result = {};
        responseKeys.forEach(key => {
          result[key] = data[key] || [];
        });
        return result;
      }
      // 如果是單一 key，直接回傳
      return data[responseKeys] || [];
    }
  } catch (error) {
    console.log(error);
    // showAlert(`資料有誤，請聯繫管理員 ${error}`, 'warning', 'toastHasCloseAlert');
    return null;
  }
  return null;
}
