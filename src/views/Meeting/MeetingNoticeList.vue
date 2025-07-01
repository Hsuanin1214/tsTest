<script setup>
import { ref, onMounted } from 'vue';
import StaticModal from '@/components/uiComponents/Modal/StaticModal.vue';
import WhiteContainer from '@/components/uiComponents/WhiteContainer/WhiteContainer.vue';
import { useMeetingNoticeStore } from '@/stores/MeetingNotice/useMeetingNoticeStore.js';

const PageConstInfo = Object.freeze({
  MeetingNotice: '成會通知',
  MeetingPostponedReason: '因故延期',
  Title: '會議通知'
});

const meetingNoticeStore = useMeetingNoticeStore();
const isModalOpen = ref(false);
const selectedMeeting = ref(null);

const openModal = meetingId => {
  selectedMeeting.value = meetingNoticeStore.getMeetingOneNotice(meetingId);
  isModalOpen.value = true;
};

onMounted(async () => {
  await meetingNoticeStore.getMeetingNotices();
});
</script>
<template>
  <section class="flex flex-col">
    <div>
      <img src="../../assets/images/banner.jpg" alt="" />
    </div>
    <WhiteContainer class="mt-5">
      <section class="container mx-auto px-4 py-10">
        <div class="mb-6 flex items-center space-x-3">
          <div class="border-primary-600 flex-grow border-4 border-t"></div>
          <h3 class="text-secondary-700 text-2xl font-bold whitespace-nowrap">會議通知</h3>
          <div class="border-primary-600 flex-grow border-4 border-t"></div>
        </div>
        <div class="space-y-4">
          <div
            class="mb-5 cursor-pointer rounded-lg bg-gray-50 p-4 shadow transition odd:bg-gray-200 hover:shadow-md md:mb-0 md:flex md:items-center md:gap-4 md:rounded-none md:bg-transparent md:odd:bg-transparent"
            v-for="(meeting, index) in meetingNoticeStore.meetingNotices"
            :key="index"
            @click="openModal(meeting.id)"
          >
            <div
              class="mb-5 w-24 rounded-full px-3 py-1 text-center text-base font-bold text-white sm:w-30 sm:text-lg md:mb-0"
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
                  class="mb-5 w-24 rounded-full px-4 py-1 text-center text-base font-bold text-white md:mb-0"
                  :class="{
                    'bg-secondary-600': selectedMeeting.type === PageConstInfo.MeetingNotice,
                    'bg-warning-500': selectedMeeting.type === PageConstInfo.MeetingPostponedReason
                  }"
                >
                  {{ selectedMeeting.type }}
                </div>
                <li class="flex flex-col space-x-2 md:flex-row md:items-center">
                  <label class="text-primary-550 text-2xl font-bold">會議日期</label>
                  <span>{{ selectedMeeting.date }} ({{ selectedMeeting.weekday }}) {{ selectedMeeting.time }}</span>
                </li>
              </ul></template
            >
            <template #modalBody>
              <ul class="text-secondary-600 mx-4 space-y-2" v-if="selectedMeeting">
                <li class="flex flex-col">
                  <label class="text-primary-500 text-xl font-bold">會議名稱</label>
                  <span>{{ selectedMeeting.title }}</span>
                </li>
                <li class="flex flex-col">
                  <label class="text-primary-500 text-xl font-bold">會議地點</label>
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
      </section>
    </WhiteContainer>
  </section>
</template>
