<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { InformationCircleIcon } from '@heroicons/vue/24/solid';
import BaseTooltip from '@/components/uiComponents/Tooltip/BaseTooltip.vue';
import MeetingNotice from '@/components/pages/MeetingNotice.vue';
import { RouterLink, useRouter } from 'vue-router';
import { useMeetingStore } from '@/stores/MeetSurvey/useMeetingStore.js';
import { useOpinionStore } from '@/stores/OpinionUpload/useOpinionStore';
import { useMeetingNoticeStore } from '@/stores/MeetingNotice/useMeetingNoticeStore.js';

const router = useRouter();
const meetingStore = useMeetingStore();
const meetingNoticeStore = useMeetingNoticeStore();
const opinionStore = useOpinionStore();

const countUnfilled = computed(() => meetingStore.countUnfilled);
const countAttending = computed(() => meetingStore.countAttending);
const countAbsent = computed(() => meetingStore.countAbsent);

const ProjectTeamType = {
  PROJECT: true,
  NON_PROJECT: false
} as const;

const UploadStatus = {
  UPLOADED: true,
  NOT_UPLOADED: false
} as const;

const OpinionType = {
  CONFIRM: '確認意見',
  REVIEW: '書審意見'
} as const;

// 類型：可視需要進一步補上 stricter typing
type OpinionKey =
  | 'countUploadAndProjectTeamAndConfirm'
  | 'countNotUploadAndProjectTeamAndConfirm'
  | 'countUploadAndProjectTeamAndReview'
  | 'countNotUploadAndProjectTeamAndReview'
  | 'countUploadAndNotProjectTeamAndConfirm'
  | 'countNotUploadAndNotProjectTeamAndConfirm'
  | 'countUploadAndNotProjectTeamAndReview'
  | 'countNotUploadAndNotProjectTeamAndReview';

/** 取得意見上傳資料 */
const getCount = (
  isUpload: boolean,
  isProjectTeam: boolean,
  type: (typeof OpinionType)[keyof typeof OpinionType]
): number => {
  const uploadKey = isUpload ? 'Upload' : 'NotUpload';
  const teamKey = isProjectTeam ? 'ProjectTeam' : 'NotProjectTeam';
  const typeKey = type === OpinionType.CONFIRM ? 'Confirm' : 'Review';
  const key = `count${uploadKey}And${teamKey}And${typeKey}` as OpinionKey;

  return opinionStore.countByConditions[key] ?? 0;
};

const getMeetSurveyInfo = async (): Promise<void> => {
  if (meetingStore.allMeetingsData.length === 0) {
    await meetingStore.getMeetSurveyInfo();
  }
};
const getOpinionUploadInfo = async (): Promise<void> => {
  await opinionStore.getOpinionUploadInfo();
};

const getMeetNoticeInfo = async (): Promise<void> => {
  if (meetingNoticeStore.meetingNotices.length === 0) {
    await meetingNoticeStore.getMeetingNotices();
  }
};

const goToOpinionUpload = (
  isProjectTeam: Boolean,
  isUpload: Boolean,
  type: (typeof OpinionType)[keyof typeof OpinionType]
): void => {
  router.push({
    name: 'opinionUpload',
    query: {
      isProjectTeam: String(isProjectTeam),
      isUpload: String(isUpload),
      type
    }
  });
};

onMounted(async () => {
  await getMeetSurveyInfo();
  await getMeetNoticeInfo();
  await getOpinionUploadInfo();
});
/** 會議通知只需要前三筆 */
const meetingNoticesForHome = computed(() => meetingNoticeStore.meetingNotices.slice(0, 3));

// onActivated(() => {
//   updateMeetingNoticesForHome(); // 每次返回畫面時重新取前3筆
// });
</script>
<template>
  <main>
    <section>
      <div>
        <img src="../../assets/images/banner.jpg" alt="" />
      </div>
    </section>
    <section class="container mx-auto px-4 py-10">
      <div class="flex items-center justify-center">
        <div class="border-primary-600 flex-grow border-4 border-t"></div>
        <div class="flex items-center gap-2 px-4">
          <h3 class="text-secondary-700 text-2xl font-bold whitespace-nowrap">會議調查最新狀態</h3>
          <button
            class="group a11y-focus relative flex cursor-pointer flex-col items-center justify-center text-center"
            aria-label="會議調查最新狀態說明"
          >
            <InformationCircleIcon class="text-primary-500 size-6 cursor-pointer"></InformationCircleIcon>
            <!-- Tooltip -->
            <BaseTooltip desk-position="bottom" mobile-position="left" bg-class="bg-gray-50">
              <p class="mb-1 font-bold text-red-400">未填寫：</p>
              <p class="text-secondary-600 mb-1">僅對尚未填寫的個案調查進行統計，每案僅計算一次。</p>
              <p class="text-secondary-600 mt-2 font-bold">
                <span class="text-teal-600">出席</span>、<span class="text-secondary-700">不出席</span>：
              </p>
              <p class="text-secondary-600 mb-1">依據各案調查時段進行統計，配合調查時段，每案皆可重複統計。</p>
            </BaseTooltip>
          </button>
        </div>
        <div class="border-primary-600 flex-grow border-4 border-t"></div>
      </div>
      <!-- 狀態圓圈 -->
      <div class="mt-16 flex justify-evenly">
        <!-- 未上傳 -->
        <div class="flex flex-col items-center">
          <button
            class="flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 border-red-400 bg-sky-50 text-2xl font-bold text-red-400 shadow-lg shadow-red-400/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
            @click="router.push({ name: 'meetingAttendanceSurvey', query: { status: 1 } })"
          >
            {{ countUnfilled }}
          </button>
          <div class="mt-3 text-lg font-bold text-red-400 text-shadow-lg sm:text-2xl">未填寫</div>
        </div>
        <!-- 出席 -->
        <div class="flex flex-col items-center">
          <button
            class="text-teal-00 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 border-teal-500 bg-sky-50 text-2xl font-bold text-teal-600 shadow-lg shadow-teal-500/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
            @click="router.push({ name: 'meetingAttendanceSurvey', query: { status: 2 } })"
          >
            {{ countAttending }}
          </button>
          <div class="mt-3 text-lg font-bold text-teal-600 text-shadow-lg sm:text-2xl">出席</div>
        </div>
        <!-- 不出席 -->
        <div class="flex flex-col items-center">
          <button
            class="text-teal-00 border-secondary-700 text-secondary-700 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 bg-sky-50 text-2xl font-bold shadow-lg shadow-gray-500/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
            @click="router.push({ name: 'meetingAttendanceSurvey', query: { status: 3 } })"
          >
            {{ countAbsent }}
          </button>
          <div class="text-secondary-700 mt-3 text-lg font-bold text-shadow-lg sm:text-2xl">不出席</div>
        </div>
      </div>
    </section>
    <section class="container mx-auto px-4 py-10">
      <!-- 標題與橫線 -->
      <div class="flex w-full items-center justify-end">
        <div class="border-primary-600 flex-grow border-4 border-t"></div>
        <h3 class="text-secondary-700 px-4 text-2xl font-bold whitespace-nowrap">專案小組</h3>
        <div class="border-primary-600 flex-grow border-4 border-t"></div>
      </div>
      <div class="relative flex items-center justify-center md:flex-row">
        <!-- 左側 -->
        <div class="flex flex-1 flex-col items-center">
          <!-- 標題 -->
          <h4 class="text-primary-600 mt-12 px-4 text-xl font-bold whitespace-nowrap md:mt-8 md:text-2xl">書審意見</h4>
          <!-- 圓圈 -->
          <div class="mt-6 flex space-x-1.5 sm:space-x-4 md:mb-0 md:space-x-16">
            <!-- 未上傳 -->
            <div class="flex flex-col items-center">
              <button
                class="flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 border-red-400 bg-sky-50 text-2xl font-bold text-red-400 shadow-lg shadow-red-400/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
                @click="goToOpinionUpload(ProjectTeamType.PROJECT, UploadStatus.NOT_UPLOADED, '書審意見')"
              >
                {{ getCount(UploadStatus.NOT_UPLOADED, ProjectTeamType.PROJECT, OpinionType.REVIEW) }}
              </button>
              <div class="mt-3 text-lg font-bold text-red-400 text-shadow-lg sm:text-2xl">未上傳</div>
            </div>
            <!-- 已上傳 -->
            <div class="flex flex-col items-center">
              <button
                class="text-teal-00 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 border-teal-500 bg-sky-50 text-2xl font-bold text-teal-600 shadow-lg shadow-teal-500/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
                @click="goToOpinionUpload(ProjectTeamType.PROJECT, UploadStatus.UPLOADED, '書審意見')"
              >
                {{ getCount(UploadStatus.UPLOADED, ProjectTeamType.PROJECT, OpinionType.REVIEW) }}
              </button>
              <div class="mt-3 text-lg font-bold text-teal-600 text-shadow-lg sm:text-2xl">已上傳</div>
            </div>
          </div>
        </div>

        <!-- 垂直分隔線 -->
        <div
          class="border-primary-600 h-min-60 absolute top-3.5 left-1/2 hidden h-70 -translate-x-1/2 border-l-4 md:block"
        ></div>

        <!-- 右側 -->
        <div class="flex flex-1 flex-col items-center">
          <!-- 標題 -->
          <h4 class="text-primary-600 mt-12 px-4 text-xl font-bold whitespace-nowrap md:mt-8 md:text-2xl">確認意見</h4>
          <!-- 圓圈 -->
          <div class="mt-6 flex space-x-1.5 sm:space-x-4 md:mb-0 md:space-x-16">
            <!-- 未上傳 -->
            <div class="flex flex-col items-center">
              <button
                class="flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 border-red-400 bg-sky-50 text-2xl font-bold text-red-400 shadow-lg shadow-red-400/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
                @click="goToOpinionUpload(ProjectTeamType.PROJECT, UploadStatus.NOT_UPLOADED, '確認意見')"
              >
                {{ getCount(UploadStatus.NOT_UPLOADED, ProjectTeamType.PROJECT, OpinionType.CONFIRM) }}
              </button>
              <div class="mt-3 text-lg font-bold text-red-400 text-shadow-lg sm:text-2xl">未上傳</div>
            </div>
            <!-- 已上傳 -->
            <div class="flex flex-col items-center">
              <button
                class="text-teal-00 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 border-teal-500 bg-sky-50 text-2xl font-bold text-teal-600 shadow-lg shadow-teal-500/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
                @click="goToOpinionUpload(ProjectTeamType.PROJECT, UploadStatus.UPLOADED, '確認意見')"
              >
                {{ getCount(UploadStatus.UPLOADED, ProjectTeamType.PROJECT, OpinionType.CONFIRM) }}
              </button>
              <div class="mt-3 text-lg font-bold text-teal-600 text-shadow-lg sm:text-2xl">已上傳</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto mt-10 px-4">
      <!-- 標題與橫線 -->
      <div class="flex w-full items-center justify-end">
        <div class="border-primary-600 flex-grow border-4 border-t"></div>
        <h3 class="text-secondary-700 px-4 text-2xl font-bold whitespace-nowrap">非專案小組</h3>
        <div class="border-primary-600 flex-grow border-4 border-t"></div>
      </div>
      <div class="relative flex items-center justify-center md:flex-row">
        <!-- 左側 -->
        <div class="flex flex-1 flex-col items-center">
          <!-- 標題 -->
          <h4 class="text-primary-600 mt-12 px-4 text-xl font-bold whitespace-nowrap md:mt-8 md:text-2xl">書審意見</h4>
          <!-- 圓圈 -->
          <div class="mt-6 flex space-x-1.5 sm:space-x-4 md:mb-0 md:space-x-16">
            <!-- 未上傳 -->
            <div class="flex flex-col items-center">
              <button
                class="flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 border-red-400 bg-sky-50 text-2xl font-bold text-red-400 shadow-lg shadow-red-400/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
                @click="goToOpinionUpload(ProjectTeamType.NON_PROJECT, UploadStatus.NOT_UPLOADED, '書審意見')"
              >
                <!-- {{ countNotUploadAndNotProjectTeamAndReview }} -->
                {{ getCount(UploadStatus.NOT_UPLOADED, ProjectTeamType.NON_PROJECT, OpinionType.REVIEW) }}
              </button>
              <div class="mt-3 text-lg font-bold text-red-400 text-shadow-lg sm:text-2xl">未上傳</div>
            </div>
            <!-- 已上傳 -->
            <div class="flex flex-col items-center">
              <button
                class="text-teal-00 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 border-teal-500 bg-sky-50 text-2xl font-bold text-teal-600 shadow-lg shadow-teal-500/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
                @click="goToOpinionUpload(ProjectTeamType.NON_PROJECT, UploadStatus.UPLOADED, '書審意見')"
              >
                {{ getCount(UploadStatus.UPLOADED, ProjectTeamType.NON_PROJECT, OpinionType.REVIEW) }}
              </button>
              <div class="mt-3 text-lg font-bold text-teal-600 text-shadow-lg sm:text-2xl">已上傳</div>
            </div>
          </div>
        </div>

        <!-- 垂直分隔線 -->
        <div
          class="border-primary-600 h-min-60 absolute top-3.5 left-1/2 hidden h-70 -translate-x-1/2 border-l-4 md:block"
        ></div>

        <!-- 右側 -->
        <div class="flex flex-1 flex-col items-center">
          <!-- 標題 -->
          <h4 class="text-primary-600 mt-12 px-4 text-xl font-bold whitespace-nowrap md:mt-8 md:text-2xl">確認意見</h4>
          <!-- 圓圈 -->
          <div class="mt-6 flex space-x-1.5 sm:space-x-4 md:mb-0 md:space-x-16">
            <!-- 未上傳 -->
            <div class="flex flex-col items-center">
              <button
                class="flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 border-red-400 bg-sky-50 text-2xl font-bold text-red-400 shadow-lg shadow-red-400/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
                @click="goToOpinionUpload(ProjectTeamType.NON_PROJECT, UploadStatus.NOT_UPLOADED, '確認意見')"
              >
                {{ getCount(UploadStatus.NOT_UPLOADED, ProjectTeamType.NON_PROJECT, OpinionType.CONFIRM) }}
              </button>
              <div class="mt-3 text-lg font-bold text-red-400 text-shadow-lg sm:text-2xl">未上傳</div>
            </div>
            <!-- 已上傳 -->
            <div class="flex flex-col items-center">
              <button
                class="text-teal-00 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-10 border-teal-500 bg-sky-50 text-2xl font-bold text-teal-600 shadow-lg shadow-teal-500/50 transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95 sm:h-20 sm:w-20 md:h-30 md:w-30 md:text-6xl"
                @click="goToOpinionUpload(ProjectTeamType.NON_PROJECT, UploadStatus.UPLOADED, '確認意見')"
              >
                {{ getCount(UploadStatus.UPLOADED, ProjectTeamType.NON_PROJECT, OpinionType.CONFIRM) }}
              </button>
              <div class="mt-3 text-lg font-bold text-teal-600 text-shadow-lg sm:text-2xl">已上傳</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto px-4 py-20">
      <div class="mb-6 flex items-center">
        <div class="border-primary-600 flex-grow border-4 border-t"></div>
        <div class="flex items-center gap-2 px-4">
          <h3 class="text-secondary-700 text-2xl font-bold whitespace-nowrap">會議通知</h3>
          <RouterLink
            to="/meetingNoticeList"
            class="btn btn-sm btn-primary text-white transition-transform duration-200 text-shadow-lg hover:scale-110 active:scale-95"
          >
            more
          </RouterLink>
        </div>
        <div class="border-primary-600 flex-grow border-4 border-t"></div>
      </div>
      <MeetingNotice :meetings="meetingNoticesForHome"></MeetingNotice>
    </section>
  </main>
</template>
