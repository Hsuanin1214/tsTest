export function useChangeRoc() {
  const BASE_YEAR = 1911;
  const convertToRocMonth = dateString => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-'); // 拆分年月
    return `${year - BASE_YEAR}-${month}`; // 轉換為民國年
  };
  const convertToRocDate = dateString => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-'); // 拆分年月日
    return `${year - BASE_YEAR}-${month}-${day}`; // 轉換為民國年
  };

  return { convertToRocMonth, convertToRocDate };
}
