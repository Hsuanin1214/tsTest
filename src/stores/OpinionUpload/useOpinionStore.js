import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAlertStore } from '@/stores/Alert/alertStore';

const uploadOptions = [
  { key: 'Upload', value: true },
  { key: 'NotUpload', value: false }
];
const teamOptions = [
  { key: 'ProjectTeam', value: true },
  { key: 'NotProjectTeam', value: false }
];
const typeOptions = [
  { key: 'Confirm', value: '確認意見' },
  { key: 'Review', value: '書審意見' }
];

export const useOpinionStore = defineStore('opinion', () => {
  const alertStore = useAlertStore();
  // --- State ---
  const allOpinionsData = ref([]);

  /** 取得所有意見上傳資料 */
  const getOpinionUploadInfo = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: '/jsonExampleData/opinionUpload/opinionUploadList.json'
      });
      allOpinionsData.value = res.data.opinionList;
    } catch {
      alertStore.trigger({
        type: 'error',
        message: '取得意見上傳資料失敗',
        duration: 3000,
        showButton: false
      });
    }
  };

  // 根據條件過濾意見
  const getFilteredOpinions = (isUpload, isProjectTeam, type) => {
    return allOpinionsData.value.filter(
      item =>
        (isUpload === undefined || item.isUpload === isUpload) &&
        (isProjectTeam === undefined || item.isProjectTeam === isProjectTeam) &&
        (type === undefined || item.type === type)
    );
  };

  // 各狀態數量
  const countByConditions = computed(() => {
    const result = {};
    uploadOptions.forEach(uploadStatus =>
      teamOptions.forEach(team =>
        typeOptions.forEach(type => {
          const key = `count${uploadStatus.key}And${team.key}And${type.key}`;
          result[key] = allOpinionsData.value.filter(
            item =>
              item.isUpload === uploadStatus.value && item.isProjectTeam === team.value && item.type === type.value
          ).length;
        })
      )
    );
    return result;
  });

  return {
    allOpinionsData,
    getOpinionUploadInfo,
    getFilteredOpinions,
    // 統計數
    countByConditions
  };
});
