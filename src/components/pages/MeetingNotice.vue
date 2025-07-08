<script setup lang="ts">
import { ref } from 'vue';
import StaticModal from '@/components/uiComponents/Modal/StaticModal.vue';
import { useMeetingNoticeStore } from '@/stores/MeetingNotice/useMeetingNoticeStore.js';
// import { useAlertStore } from '@/stores/Alert/alertStore';

interface Meeting {
  id: string;
  type: string;
  date: string;
  time: string;
  title: string;
  location: string;
  contactor: string;
  phone: string;
  weekday: string;
}

interface Props {
  meetings?: Meeting[];
}

const props = defineProps<Props>();
// defineProps({
//   meetings: {
//     type: Array,
//     required: true
//   }
// });

const PageConstInfo = Object.freeze({
  MeetingNotice: '成會通知',
  MeetingPostponedReason: '因故延期',
  Title: '會議通知'
});

const meetingNoticeStore = useMeetingNoticeStore();
const isModalOpen = ref(false);
const selectedMeeting = ref<Meeting | null>(null);

const openModal = (meetingId: string): void => {
  selectedMeeting.value = meetingNoticeStore.getMeetingOneNotice(meetingId) ?? null;
  isModalOpen.value = true;
};

// const alertStore = useAlertStore();
// const firstMeetingNotices = ref([]);
// const isLoaded = ref(false);

// const getData = async () => {
//   try {
//     await meetingNoticeStore.getMeetingNotices();
//     // 確保資料有載入完成才處理
//     const allMeetings = meetingNoticeStore.meetingNotices;
//     firstMeetingNotices.value = meetingNoticeStore.getCountMeetings(3, allMeetings);
//   } catch {
//     alertStore.trigger({
//       type: 'error',
//       message: '取得會議調查資料失敗',
//       duration: 3000,
//       showButton: false
//     });
//   }
// };

// onMounted(async () => {
//   try {
//     await getData();
//     isLoaded.value = true;
//   } catch (error) {
//     console.error('載入資料失敗：', error);
//   }
// });
</script>
<template>
  <div class="space-y-4">
    <div
      class="mb-5 cursor-pointer rounded-lg bg-gray-50 p-4 shadow transition odd:bg-gray-200 hover:shadow-md md:mb-0 md:flex md:items-center md:gap-4 md:rounded-none md:bg-transparent md:odd:bg-transparent"
      v-for="(meeting, index) in meetings"
      :key="index"
      @click="openModal(meeting.id)"
    >
      <div
        class="mb-5 w-30 rounded-full px-3 py-1 text-center text-lg font-bold text-white md:mb-0"
        :class="{
          'bg-secondary-600': meeting.type === PageConstInfo.MeetingNotice,
          'bg-warning-500': meeting.type === PageConstInfo.MeetingPostponedReason
        }"
      >
        {{ meeting.type }}
      </div>
      <div class="flex flex-col space-x-3 md:flex-row">
        <span
          class="text-lg font-bold whitespace-nowrap"
          :class="{
            'text-secondary-600': meeting.type === PageConstInfo.MeetingNotice,
            'text-error-600': meeting.type === PageConstInfo.MeetingPostponedReason
          }"
          >{{ meeting.date }}</span
        >
        <span
          class="text-lg font-bold whitespace-nowrap"
          :class="{
            'text-secondary-600': meeting.type === PageConstInfo.MeetingNotice,
            'text-error-600': meeting.type === PageConstInfo.MeetingPostponedReason
          }"
          >{{ meeting.time }}</span
        >
        <span
          class="truncate overflow-hidden text-lg font-bold text-ellipsis md:max-w-[400px] lg:max-w-[600px]"
          :class="{
            'text-secondary-600': meeting.type === PageConstInfo.MeetingNotice,
            'text-error-600': meeting.type === PageConstInfo.MeetingPostponedReason
          }"
          >{{ meeting.title }}</span
        >
      </div>
    </div>
    <StaticModal
      :is-modal-open="isModalOpen"
      @click.prevent="isModalOpen = false"
      :is-has-title="false"
      :is-has-btn="true"
    >
      <template #modalTitle>
        <ul class="text-secondary-600 mx-4 md:flex md:items-center md:space-x-2" v-if="selectedMeeting">
          <div
            class="mb-5 w-24 rounded-full px-3 py-1 text-center text-base font-bold text-white md:mb-0"
            :class="{
              'bg-secondary-600': selectedMeeting.type === PageConstInfo.MeetingNotice,
              'bg-warning-500': selectedMeeting.type === PageConstInfo.MeetingPostponedReason
            }"
          >
            {{ selectedMeeting.type }}
          </div>
          <li class="flex flex-col space-x-2 md:flex-row md:items-center">
            <label class="text-primary-550 text-xl font-bold">會議日期</label>
            <span class="text-xl font-bold whitespace-nowrap"
              >{{ selectedMeeting.date }} ({{ selectedMeeting.weekday }}) {{ selectedMeeting.time }}</span
            >
          </li>
        </ul></template
      >
      <template #modalBody>
        <ul class="text-secondary-600 mx-4 space-y-2" v-if="selectedMeeting">
          <!-- <li class="flex flex-col space-x-2 md:flex-row md:items-center">
            <label class="text-primary-550 text-2xl font-bold">會議日期：</label>
            <span>{{ selectedMeeting.date }} ({{ selectedMeeting.weekday }}) {{ selectedMeeting.time }}</span>
          </li> -->
          <li class="flex flex-col">
            <label class="text-primary-500 text-xl font-bold">會議標題</label>
            <span>{{ selectedMeeting.title }}</span>
          </li>
          <li class="flex flex-col">
            <label class="text-primary-500 text-xl font-bold">地點</label>
            <span>{{ selectedMeeting.location }}</span>
          </li>
          <li class="flex flex-col">
            <label class="text-primary-500 text-xl font-bold">聯絡人</label>
            <span>{{ selectedMeeting.contactor }}（{{ selectedMeeting.phone }}）</span>
          </li>
        </ul>
      </template>
      <template #modalFooter>
        <button type="button" class="btn btn-secondary" @click="isModalOpen = false">關閉</button>
      </template>
    </StaticModal>
  </div>
</template>
