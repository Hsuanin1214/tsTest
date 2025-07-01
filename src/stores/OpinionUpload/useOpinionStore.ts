import { OpinionItem } from './useOpinionStore';
import { defineStore } from 'pinia';
import { ref, computed, ComputedRef } from 'vue';
import axios from 'axios';
import { useAlertStore } from '@/stores/Alert/alertStore';

// --- 型別定義 ---
export type UploadKey = 'Upload' | 'NotUpload';
export type TeamKey = 'ProjectTeam' | 'NotProjectTeam';
export type TypeKey = 'Confirm' | 'Review';

export type OpinionKey =
  | 'countUploadAndProjectTeamAndConfirm'
  | 'countNotUploadAndProjectTeamAndConfirm'
  | 'countUploadAndProjectTeamAndReview'
  | 'countNotUploadAndProjectTeamAndReview'
  | 'countUploadAndNotProjectTeamAndConfirm'
  | 'countNotUploadAndNotProjectTeamAndConfirm'
  | 'countUploadAndNotProjectTeamAndReview'
  | 'countNotUploadAndNotProjectTeamAndReview';

export interface OpinionItem {
  isUpload: boolean;
  isProjectTeam: Boolean;
  type: '確認意見' | '書審意見';
  [key: string]: any; //若資料有其他欄位
}

// --- 設定選項 ---
const uploadOptions: { key: UploadKey; value: boolean }[] = [
  { key: 'Upload', value: true },
  { key: 'NotUpload', value: false }
];
const teamOptions: { key: TeamKey; value: boolean }[] = [
  { key: 'ProjectTeam', value: true },
  { key: 'NotProjectTeam', value: false }
];
const typeOptions: { key: TypeKey; value: OpinionItem['type'] }[] = [
  { key: 'Confirm', value: '確認意見' },
  { key: 'Review', value: '書審意見' }
];

// --- state ---
export const useOpinionStore = defineStore('opinion', () => {
  const alertStore = useAlertStore();

  // --- State ---
  const allOpinionsData = ref<OpinionItem[]>([]);

  /** 取得所有意見上傳資料 */
  const getOpinionUploadInfo = async (): Promise<void> => {
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
  const getFilteredOpinions = (
    isUpload?: boolean,
    isProjectTeam?: boolean,
    type?: OpinionItem['type']
  ): OpinionItem[] => {
    return allOpinionsData.value.filter(
      item =>
        (isUpload === undefined || item.isUpload === isUpload) &&
        (isProjectTeam === undefined || item.isProjectTeam === isProjectTeam) &&
        (type === undefined || item.type === type)
    );
  };

  // 各狀態數量
  const countByConditions: ComputedRef<Record<OpinionKey, number>> = computed(() => {
    const result = {} as Record<OpinionKey, number>;
    uploadOptions.forEach(uploadStatus =>
      teamOptions.forEach(team =>
        typeOptions.forEach(type => {
          const key = `count${uploadStatus.key}And${team.key}And${type.key}` as OpinionKey;
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
