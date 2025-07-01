import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAlertStore } from '@/stores/Alert/alertStore';

export const useMeetingStore = defineStore('meeting', () => {
  const alertStore = useAlertStore();
  // --- State ---
  const allMeetingsData = ref([]);
  /** 取得會議調查資料 */
  const getMeetSurveyInfo = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: '/jsonExampleData/meetingSurvey/meetingSurveyList.json'
      });
      allMeetingsData.value = res.data.meetingData;
    } catch {
      alertStore.trigger({
        type: 'error',
        message: '取得會議調查資料失敗',
        duration: 3000,
        showButton: false
      });
    }
  };

  // --- Getters ---
  const getMeetingById = computed(() => {
    return id => allMeetingsData.value.find(m => String(m.id) === String(id));
  });

  // Getter to filter meetings by status (0 = All)
  const getFilteredMeetings = computed(() => {
    // status: 0=全部, 1=未填寫, 2=出席, 3=不出席
    return status => {
      const filterStatus = Number(status || 0);
      if (filterStatus === 0) {
        return allMeetingsData.value;
      }

      return allMeetingsData.value.filter(item => item.status === filterStatus);
    };
  });

  // 各狀態數量
  const countUnfilled = computed(() => allMeetingsData.value.filter(item => item.status === 1).length);
  const countAttending = computed(() => allMeetingsData.value.filter(item => item.status === 2).length);
  const countAbsent = computed(() => allMeetingsData.value.filter(item => item.status === 3).length);

  return {
    allMeetingsData,
    getMeetSurveyInfo,
    getMeetingById,
    getFilteredMeetings,
    // 統計數
    countUnfilled,
    countAttending,
    countAbsent
  };
});
