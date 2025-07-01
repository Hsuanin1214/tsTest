import { useAxiosMethod } from '@/composables/axios/useAxios-v1';

const { useAxios } = useAxiosMethod();
export async function downloadFileFromApi({ apiUrl, downloadValueId, fileName }) {
  try {
    const config = { responseType: 'blob' };
    // const fileUrl = `${apiUrl}/1130851A/${downloadValueId}`;
    const fileUrl = `${apiUrl}/${downloadValueId}`;
    const fileResponse = await useAxios(fileUrl, 'get', undefined, config, 'DOWNLOAD');

    if (fileResponse?.data?.value) {
      const blob = fileResponse.data.value.data; // 假設 response.data 是 Blob 對象
      const downloadUrl = window.URL.createObjectURL(blob);
      window.open(downloadUrl, '_blank'); // 在新標籤頁中打開文件
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || 'downloaded_file';
    }
  } catch (error) {
    console.error('下載檔案失敗:', error);
  }
}
