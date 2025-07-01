<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import WhiteContainer from '@/components/uiComponents/WhiteContainer/WhiteContainer.vue';
import PageTitle from '@/components/uiComponents/PageTitle/PageTitle.vue';
import SwitchComponent from '@/components/uiComponents/Switch/SwitchComponent.vue';
import BaseButton from '@/components/uiComponents/Button/BaseButton.vue';
import StaticModal from '@/components/uiComponents/Modal/StaticModal.vue';
import { useAlertStore } from '@/stores/Alert/alertStore';
import { useOpinionStore } from '@/stores/OpinionUpload/useOpinionStore';
// import { downloadFileFromApi } from '@/composables/file/useDownloadUtils';

const UploadStatus = Object.freeze({ All: 1, UnUpload: 2, Upload: 3 });
const TeamType = Object.freeze({ Project: '專案小組', NonProject: '非專案小組' });
const OpinionType = Object.freeze({ Confirm: '確認意見', Review: '書審意見' });

const route = useRoute();
const router = useRouter();

/** 是否為專案小組篩選 */
const selected = ref(TeamType.Project);
const isSelected = type => selected.value === type;

/** 意見類別篩選 */
const selectOpinionType = ref(OpinionType.Review);
const isOpinionTypeSelected = type => selectOpinionType.value === type;

/** 是否上傳篩選 */
const selectedStatus = ref(UploadStatus.All);
const uploadStatusOptions = [
  { label: '全部', value: UploadStatus.All },
  { label: '未上傳', value: UploadStatus.UnUpload },
  { label: '已上傳', value: UploadStatus.Upload }
];

const meetingSurveyList = ref([]);

const isModalOpen = ref(false);
const selectedMeeting = ref(null);
const opinionText = ref('');
const opinionFile = ref(null);

const alertStore = useAlertStore();
const opinionStore = useOpinionStore();

const handleFileChange = event => {
  if (event.target.files && event.target.files.length > 0) {
    opinionFile.value = event.target.files[0];
    console.log('Selected file:', opinionFile.value);
  } else {
    opinionFile.value = null;
  }
};

// Function to clear the file input visually and its state
const fileInputRef = ref(null);
const clearFileInput = () => {
  opinionFile.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

/** 清除檔案 */
const resetModalState = () => {
  opinionText.value = '';
  clearFileInput();
};

/** 打開彈跳視窗 */
const openModal = meetingId => {
  const foundMeeting = meetingSurveyList.value.find(m => m.id === meetingId);
  if (foundMeeting) {
    selectedMeeting.value = foundMeeting;
    console.log(selectedMeeting.value);
    resetModalState();
    isModalOpen.value = true;
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleConfirm = async () => {
  try {
    if (!opinionFile.value && !opinionText.value) {
      alertStore.trigger({ type: 'warning', message: '請上傳檔案或填寫意見內容。', duration: 3000 });
      return;
    }

    if (opinionFile.value) {
      if (opinionFile.value.size > 5 * 1024 * 1024) {
        alertStore.trigger({ type: 'warning', message: '檔案大小不可超過 5MB。', duration: 3000 });
        clearFileInput();
        return;
      }
      if (opinionFile.value.type !== 'application/pdf') {
        alertStore.trigger({ type: 'warning', message: '僅接受 PDF 格式的檔案。', duration: 3000 });
        clearFileInput();
        return;
      }

      const formData = new FormData();
      formData.append('meetingId', selectedMeeting.value.id);
      formData.append('opinionFile', opinionFile.value);
      // await uploadApiCall(formData);
    } else {
      const payload = {
        meetingId: selectedMeeting.value.id,
        opinionText: opinionText.value.trim()
      };
      console.log(payload);
      // await submitTextApiCall(payload);
    }

    alertStore.trigger({ type: 'success', message: '意見已送出', duration: 3000 });
    closeModal();
  } catch (error) {
    console.log(error);
    alertStore.trigger({ type: 'error', message: '送出失敗，請稍後再試。', duration: 3000 });
  }
};

/** 更新路由 */
const updateQuery = () => {
  const isUpload =
    selectedStatus.value === UploadStatus.All
      ? undefined
      : selectedStatus.value === UploadStatus.Upload
        ? 'true'
        : 'false';

  const isProjectTeam = selected.value === TeamType.Project ? 'true' : 'false';
  const type = selectOpinionType.value;

  router.replace({
    query: {
      ...(isUpload !== undefined && { isUpload }),
      isProjectTeam,
      type
    }
  });
};

/** 意見清單篩選 */
const filteredList = computed(() => meetingSurveyList.value);
const filterMeetings = () => {
  const isUpload = selectedStatus.value === UploadStatus.All ? undefined : selectedStatus.value === UploadStatus.Upload;

  const isProjectTeam = selected.value === TeamType.Project;
  const type = selectOpinionType.value;

  meetingSurveyList.value = opinionStore.getFilteredOpinions(isUpload, isProjectTeam, type);
};

const refreshView = () => {
  filterMeetings();
  updateQuery();
};

watch(selectedStatus, () => {
  refreshView();
});

const selectTeam = type => {
  selected.value = type;
  refreshView();
};

const selectOpinion = type => {
  selectOpinionType.value = type;
  refreshView();
};

const toBool = value => (value === 'true' ? true : value === 'false' ? false : undefined);

const initOpinionDataIfNeeded = () => {
  if (opinionStore.allOpinionsData.length === 0) {
    opinionStore.getOpinionUploadInfo();
  }
};

const getValidOpinionType = type => {
  return [OpinionType.Review, OpinionType.Confirm].includes(type) ? type : undefined;
};

const initFromRouteParams = () => {
  const { isUpload, isProjectTeam, type } = route.query;

  const uploadBool = toBool(isUpload);
  const teamBool = toBool(isProjectTeam);
  const opinionType = getValidOpinionType(type);

  meetingSurveyList.value = opinionStore.getFilteredOpinions(uploadBool, teamBool, opinionType);

  // 設定是否上傳
  if (uploadBool === true) selectedStatus.value = UploadStatus.Upload;
  else if (uploadBool === false) selectedStatus.value = UploadStatus.UnUpload;

  // 設定是否為專案小組
  if (teamBool === true) selected.value = TeamType.Project;
  else if (teamBool === false) selected.value = TeamType.NonProject;

  // 設定意見類型
  if (opinionType) selectOpinionType.value = opinionType;
};

onMounted(() => {
  initOpinionDataIfNeeded();
  initFromRouteParams();
  filterMeetings();
});

/**
 * 下載檔案
 * @param {Array} downloadLinks - 下載連結的清單
 * @param {String} fileId - 檔案ID
 * @param {String} fileName - 檔案名稱
 */
const handleFileDownload = async (downloadValueId, fileName) => {
  // if (includeIndex && index !== null) {

  // 執行下載邏輯
  console.log('downloadValueId,fileName', downloadValueId, fileName);
  // if (downloadValueId?.isAvailable) {
  //   await downloadFileFromApi({
  //     apiUrl: downloadUrl,
  //     downloadValueId,
  //     fileName
  //   });
  // } else {
  //   alertStore.trigger({
  //     type: 'warning',
  //     message: `檔案 ${fileName} 無法下載`,
  //     duration: 3000,
  //     showButton: false
  //   });
  // }
};
</script>
<template>
  <WhiteContainer>
    <PageTitle>意見上傳</PageTitle>
    <section class="mx-auto sm:px-4">
      <div class="mt-5 flex justify-start">
        <BaseButton
          type="button"
          :title="TeamType.Project"
          class="btn mb-2 ml-2"
          :color="isSelected(TeamType.Project) ? 'primary' : 'outlinePrimary'"
          @click="selectTeam(TeamType.Project)"
          >{{ TeamType.Project }}</BaseButton
        >
        <BaseButton
          type="button"
          :title="TeamType.NonProject"
          class="btn mb-2 ml-2"
          :color="isSelected(TeamType.NonProject) ? 'primary' : 'outlinePrimary'"
          @click="selectTeam(TeamType.NonProject)"
          >{{ TeamType.NonProject }}</BaseButton
        >
      </div>

      <div class="mt-5 md:flex md:items-center md:justify-between">
        <div class="w-2/3 md:flex md:items-center md:justify-between md:gap-4">
          <div class="my-auto flex justify-start gap-4 md:justify-center">
            <BaseButton
              type="button"
              :title="OpinionType.Review"
              class="btn-sm mb-2 ml-2"
              :color="isOpinionTypeSelected(OpinionType.Review) ? 'primaryLight' : 'outlinePrimaryLight'"
              @click="selectOpinion(OpinionType.Review)"
              >{{ OpinionType.Review }}</BaseButton
            >
            <BaseButton
              type="button"
              :title="OpinionType.Confirm"
              class="btn-sm mb-2 ml-2"
              :color="isOpinionTypeSelected(OpinionType.Confirm) ? 'primaryLight' : 'outlinePrimaryLight'"
              @click="selectOpinion(OpinionType.Confirm)"
              >{{ OpinionType.Confirm }}</BaseButton
            >
          </div>
          <SwitchComponent v-model="selectedStatus" :options="uploadStatusOptions" />
        </div>
        <div>
          <button type="button" class="btn btn-outline-secondary btn-sm md:btn-base mt-4 md:mt-0">範本下載</button>
        </div>
      </div>
      <div class="text-secondary-600 my-4">
        提醒您：「意見上傳功能」摘列應上傳書審意見及確認意見之書件清單，請於
        <span class="text-error-500 font-bold">【繳交期限】</span>前(含)將確認意見上傳至本部。
      </div>
      <div class="mx-auto md:max-w-[80vh]">
        <div
          class="md:border-secondary-600 text-secondary-600 mb-5 rounded-lg bg-gray-50 p-4 shadow transition hover:shadow-md md:my-4 md:mb-0 md:flex md:flex-col md:gap-4 md:rounded-none md:border md:bg-transparent md:odd:bg-transparent"
          v-for="meeting in filteredList"
          :key="meeting.id"
        >
          <div
            class="text-secondary-600 bg-primary-100 -mx-4 -mt-4 mb-4 flex flex-col p-2 text-lg font-semibold md:flex-row md:items-center md:space-x-4"
          >
            <span>繳交期限：{{ meeting.date }} 星期{{ meeting.weekday }}</span>
            <span
              class="bg-secondary-600 mb-5 w-24 rounded-full px-3 py-1 text-center text-base text-white md:mb-0"
              :class="meeting.type === OpinionType.Confirm ? 'bg-sky-500' : 'bg-teal-500'"
              >{{ meeting.type === OpinionType.Confirm ? OpinionType.Confirm : OpinionType.Review }}</span
            >
          </div>
          <div>
            <span class="mb-2 block font-semibold">（{{ meeting.hCode }}） {{ meeting.envProjectName }}</span>
            <span class="mb-2 block" v-if="meeting.contactName || meeting.contactNumber"
              >聯絡人：{{ meeting.contactName }}，{{ meeting.contactNumber }}</span
            >
            <span class="mb-2 block" v-else>聯絡人：無</span>
            <a
              class="text-primary-550 hover:text-primary-700 mb-4 block underline"
              :href="meeting.hCodeUrl"
              :title="'查閱 ' + meeting.envProjectName + ' 基本資料'"
              target="_blank"
              rel="noopener noreferrer"
              >查閱基本資料</a
            >
          </div>
          <div class="text-secondary-600 flex flex-col text-lg font-semibold md:flex-row md:items-center md:space-x-4">
            進度：
            <span v-if="!meeting.isUpload" class="mr-3 block font-bold text-red-500">尚未上傳</span>
            <div v-else class="flex items-center gap-2">
              <button
                v-if="meeting.previewFileId"
                class="btn btn-sm btn-primary"
                @click="handleFileDownload(meeting.previewFileId, meeting.previewFileName)"
              >
                檢視
              </button>
              <button
                v-if="meeting.pdfFileId"
                class="btn btn-sm btn-warning"
                @click="handleFileDownload(meeting.pdfFileId, meeting.pdfFileName)"
              >
                PDF
              </button>
            </div>
          </div>
          <div class="my-4 flex justify-center pt-4">
            <button class="btn btn-primary" @click="openModal(meeting.id)">
              {{
                meeting.type === OpinionType.Confirm
                  ? `${OpinionType.Confirm}意見上傳`
                  : `${OpinionType.Review}意見上傳`
              }}
            </button>
          </div>
        </div>
        <div v-if="!filteredList.length" class="text-secondary-700 py-10 text-center text-lg">沒有符合條件的會議。</div>
      </div>
    </section>
    <!-- 彈跳視窗 -->
    <StaticModal
      v-if="selectedMeeting"
      :is-modal-open="isModalOpen"
      @close="closeModal"
      :is-has-title="false"
      :is-has-btn="true"
      width-class="max-w-3xl"
    >
      <template #modalTitle>
        <div
          class="text-secondary-600 bg-primary-100 mx-4 flex w-full flex-col items-center rounded p-3 font-bold"
          v-if="selectedMeeting"
        >
          <label class="text-primary-550 text-xl font-bold">{{ selectedMeeting.type }}</label>
          <span class="mt-1 block text-base">（{{ selectedMeeting.hCode }}）</span>
          <span class="mt-1 block text-center text-base">{{ selectedMeeting.envProjectName }}</span>
        </div>
      </template>
      <template #modalBody>
        <div class="mb-4 pb-4">
          <label :for="`opinionFileUpload-${selectedMeeting.id}`" class="mb-2 block font-bold"
            >方式一： 檔案上傳 (<span class="text-red-500">僅限 PDF 格式，檔案大小 5MB 以內</span>)</label
          >
          <input
            ref="fileInputRef"
            :id="`opinionFileUpload-${selectedMeeting.id}`"
            type="file"
            class="form-control file:bg-primary-50 file:text-primary-700 file:bg-primary-100 cursor-pointer file:mr-4 file:rounded file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
            accept=".pdf"
            @change="handleFileChange"
          />
        </div>
        <div class="mb-4">
          <label :for="`opinionTextArea-${selectedMeeting.id}`" class="mb-2 block font-bold">方式二： 線上填寫</label>
          <textarea
            :id="`opinionTextArea-${selectedMeeting.id}`"
            rows="5"
            class="form-textarea w-full"
            v-model="opinionText"
            placeholder="建議於它處先完成文字編輯後，直接貼入文字，避免操作逾時。"
          ></textarea>
        </div>
      </template>
      <template #modalFooter>
        <BaseButton type="button" color="primary" title="儲存" @click="handleConfirm">儲存</BaseButton>
        <BaseButton type="button" color="secondary" title="關閉" @click="closeModal">關閉</BaseButton>
      </template>
      <template #underModalFooter>
        <span class="my-2 block text-center text-gray-600"
          >操作說明：您可以選擇上傳 PDF 檔案或直接在上方欄位填寫意見，完成後請按「儲存」。</span
        >
      </template>
    </StaticModal>
  </WhiteContainer>
</template>
