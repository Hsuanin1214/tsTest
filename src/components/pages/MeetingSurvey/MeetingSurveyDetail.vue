<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watch, computed, onMounted } from 'vue';
import WhiteContainer from '@/components/uiComponents/WhiteContainer/WhiteContainer.vue';
import PageTitle from '@/components/uiComponents/PageTitle/PageTitle.vue';
import { InformationCircleIcon } from '@heroicons/vue/24/outline';
import BaseTooltip from '@/components/uiComponents/Tooltip/BaseTooltip.vue';
import { useAlertStore } from '@/stores/Alert/alertStore';
import SwitchComponent from '@/components/uiComponents/Switch/SwitchComponent.vue';
import BaseButton from '@/components/uiComponents/Button/BaseButton.vue';
import { useMeetingStore } from '@/stores/MeetSurvey/useMeetingStore';

// 拿取 route 中的 id 參數
const route = useRoute();
const router = useRouter();
const currentMeetingId = ref(route.params.id);

const alertStore = useAlertStore();
const meetingStore = useMeetingStore();

// 假資料（之後可改為 API 請求）
const meetingDetail = ref(null);

const selectedStatus = computed(() => Number(route.query.status || 0));

const filteredMeetingList = computed(() => {
  //0=全部, 1=未填寫(status:1), 2=出席(status:2), 3=不出席(status:3)
  // const filterStatus = selectedStatus.value;
  // if (filterStatus === 0) {
  //   // return allMeetingsData.value;
  //   return meetingStore.getFilteredMeetings(selectedStatus.value);
  // }
  // return allMeetingsData.value.filter(item => item.status === filterStatus);
  return meetingStore.getFilteredMeetings(selectedStatus.value);
});

const fetchMeetingDetail = async id => {
  // meetingDetail.value = allMeetingsData.value.find(m => String(m.id) === String(id)) || null;
  meetingDetail.value = meetingStore.getMeetingById(id);
};

const currentIndex = computed(() => {
  return filteredMeetingList.value.findIndex(m => String(m.id) === String(currentMeetingId.value));
});
const totalFilteredCount = computed(() => filteredMeetingList.value.length);

// 模擬取得資料
onMounted(async () => {
  await fetchMeetingDetail(currentMeetingId.value);
});

watch(
  () => route.params.id,
  newId => {
    if (newId && newId !== currentMeetingId.value) {
      currentMeetingId.value = newId;
      fetchMeetingDetail(newId);
    }
  }
  // { immediate: true }
);

const meetingStatusOptions = [
  { label: '未填寫', value: 1 },
  { label: '出席', value: 2 },
  { label: '不出席', value: 3 }
];

const meetingSurveyList = ref([
  {
    id: '1',
    date: '114-04-25',
    weekday: '五',
    time: '上午 10:00',
    contactTxt: '補充說明:第一點需要再討論',
    isAttend: 2
  },
  {
    id: '2',
    date: '113-12-13',
    weekday: '四',
    time: '上午 10:00',
    contactTxt: '',
    isAttend: 1 // '未填寫'
  },
  {
    id: '3',
    date: '114-04-25',
    weekday: '五',
    time: '下午 14:00',
    contactTxt: '當天另有要事',
    isAttend: 3
  }
]);

const handleConfirm = meetingSurveyItem => {
  console.log('確認儲存:', meetingSurveyItem);
  alertStore.trigger({
    type: 'success',
    message: '儲存成功',
    duration: 3000,
    showButton: false
  });
  router.push({ name: 'meetingAttendanceSurvey' });
};

const handlePrevious = () => {
  if (currentIndex.value > 0) {
    const previousMeeting = filteredMeetingList.value[currentIndex.value - 1];
    router.push({
      name: 'meetingSurveyDetail',
      params: { id: previousMeeting.id },
      query: { status: selectedStatus.value }
    });
  }
};

const handleNext = () => {
  if (currentIndex.value < totalFilteredCount.value - 1) {
    const nextMeeting = filteredMeetingList.value[currentIndex.value + 1];
    router.push({
      name: 'meetingSurveyDetail',
      params: { id: nextMeeting.id },
      query: { status: selectedStatus.value }
    });
  }
};
</script>

<template>
  <WhiteContainer>
    <div class="flex items-center gap-2">
      <PageTitle>會議詳細資料</PageTitle>
      <button
        class="group a11y-focus relative flex cursor-pointer flex-col items-center justify-center text-center"
        aria-label="會議詳細資料說明"
      >
        <InformationCircleIcon class="text-primary-500 size-6 cursor-pointer"></InformationCircleIcon>
        <!-- Tooltip -->
        <BaseTooltip desk-position="right" mobile-position="left" bg-class="bg-gray-500">
          <p class="mb-1 text-white">
            您可隨時更新出席調查或聯絡事項的相關資料。若調查截止日的隔日後將不再開放修改。如需進一步調整，請聯繫本案環境部承辦人。
          </p>
        </BaseTooltip>
      </button>
    </div>
    <h4 class="bg-primary-100 text-secondary-700 mt-6 mb-4 max-w-[16vh] px-2 py-2 text-xl font-bold">會議基本資料</h4>
    <div v-if="meetingDetail" class="my-2 flex flex-col items-start gap-4 md:mx-24">
      <p class="text-secondary-600 text-lg font-bold">會議名稱： {{ meetingDetail.meetingName }}</p>
      <p>召集人： {{ meetingDetail.convener }}</p>
      <p>調查截止日期： {{ meetingDetail.surveyDeadline }}</p>
      <p>地點： {{ meetingDetail.location }}</p>
      <p>聯絡人： {{ meetingDetail.contactName }}，{{ meetingDetail.contactPhone }}</p>
    </div>
    <div v-else class="m-2">
      <p class="text-red-500">正在載入會議資料或找不到該會議資料...</p>
    </div>
    <h4 class="bg-primary-100 text-secondary-700 mt-6 mb-4 max-w-[16vh] px-2 py-2 text-center text-xl font-bold">
      會議調查
    </h4>
    <div class="md:mx-auto md:max-w-[80vh]">
      <div
        class="md:border-secondary-600 text-secondary-600 mb-5 rounded-lg bg-gray-50 p-4 shadow transition hover:shadow-md md:mx-auto md:my-4 md:mb-0 md:flex md:flex-col md:gap-4 md:rounded-none md:border md:bg-transparent md:odd:bg-transparent"
        v-for="meeting in meetingSurveyList"
        :key="meeting.id"
      >
        <div class="text-secondary-600 flex flex-col text-lg font-semibold md:flex-row md:items-center md:space-x-4">
          <span class="mb-4 md:mb-0">場次{{ meeting.id }}</span>
          <span class="mb-4 md:mb-0">時間：{{ meeting.date }}（{{ meeting.weekday }}）</span>
          <span class="mb-4 md:mb-0">{{ meeting.time }}</span>
        </div>
        <div class="my-5 grid grid-cols-1 items-start gap-5 md:gap-5">
          <div>
            <label :for="'contactTxt-' + meeting.id" class="mb-1 block flex-shrink-0 font-semibold md:mb-0"
              >聯絡事項：</label
            >
            <textarea
              :id="'contactTxt-' + meeting.id"
              name="聯絡事項"
              rows="2"
              class="form-textarea focus:border-primary-500 w-full flex-grow rounded border-gray-300 p-2"
              v-model="meeting.contactTxt"
              placeholder="若不出席，可在此說明原因"
            ></textarea>
          </div>
        </div>
        <div>
          <label class="mb-4 font-semibold md:mb-0">是否出席：</label>
          <div class="w-3/5">
            <SwitchComponent
              v-model="meeting.isAttend"
              bg-class="md:bg-white bg-gray-50"
              :options="meetingStatusOptions"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10 flex justify-center space-x-10">
      <BaseButton
        type="button"
        color="primary"
        title="儲存"
        @click.prevent="handleConfirm(meetingSurveyList)"
        class="mb-2 ml-2"
        >儲存</BaseButton
      >
      <RouterLink
        to="/meetingAttendanceSurvey"
        class="btn btn-secondary mb-2 ml-2 text-white transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95"
      >
        取消
      </RouterLink>
    </div>
    <div class="mt-10 flex items-center justify-center space-x-6">
      <BaseButton
        type="button"
        :color="currentIndex <= 0 ? 'disabled' : 'primary'"
        title="上一筆"
        @click="handlePrevious"
        :disabled="currentIndex <= 0"
        class="mb-2"
        >上一筆</BaseButton
      >
      <BaseButton
        type="button"
        :color="currentIndex < 0 || currentIndex >= totalFilteredCount - 1 ? 'disabled' : 'primary'"
        title="下一筆"
        @click="handleNext"
        :disabled="currentIndex < 0 || currentIndex >= totalFilteredCount - 1"
        class="mb-2"
        >下一筆</BaseButton
      >
      <span class="text-secondary-700">
        筆數：{{ totalFilteredCount > 0 ? currentIndex + 1 : 0 }} / {{ totalFilteredCount }}
      </span>
    </div>
  </WhiteContainer>
</template>
