import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAlertStore } from '@/stores/Alert/alertStore';

export const useMeetingNoticeStore = defineStore('notice', () => {
  const alertStore = useAlertStore();
  const meetingNotices = ref([]);

  const getMeetingNotices = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: '/jsonExampleData/meetingNotice/meetingNoticeList.json'
      });
      // console.log(res.data);
      meetingNotices.value = res.data.meetingNoticeList;
      // console.log(meetingNotices.value);
    } catch {
      alertStore.trigger({
        type: 'error',
        message: '取得會議通知資料失敗',
        duration: 3000,
        showButton: false
      });
    }
  };

  const getMeetingOneNotice = id => {
    return meetingNotices.value.find(m => m.id === id);
  };

  return {
    meetingNotices,
    getMeetingNotices,
    getMeetingOneNotice
  };
});
