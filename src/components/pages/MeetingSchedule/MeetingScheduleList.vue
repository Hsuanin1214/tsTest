<script setup>
import { ref, onMounted } from 'vue';
import BaseTable from '@/components/uiComponents/Table/BaseTable.vue';
import PaginationComponent from '@/components/uiComponents/Pagination/PaginationComponent.vue';

/** 表格標頭 */
const thead = [
  {
    name: '序',
    attrName: 'index',
    widthClass: 'w-[10%]'
  },
  {
    name: '開會日期',
    attrName: 'meetingDate',
    widthClass: 'w-[10%]'
  },
  {
    name: '會議內容',
    attrName: 'meetingDetail',
    widthClass: 'w-[10%]'
  }
];
const results = [
  {
    id: 1,
    meetingDate: '2025-04-22',
    meetingWeek: '一',
    meetingDetail: {
      title: '跨部門月會',
      time: '下午 1:00',
      location: '會議室A',
      contact: '王小明',
      isPublic: true,
      file: {
        name: '會議記錄.pdf',
        url: '/files/meeting-record.pdf'
      }
    }
  },
  {
    id: 2,
    meetingDate: '2025-04-24',
    meetingWeek: '一',
    meetingDetail: {
      title: '產品規劃會議',
      time: '下午 3:30',
      location: 'Zoom 線上會議',
      contact: '林小花',
      isPublic: false,
      file: {
        name: '',
        url: ''
      }
    }
  }
];

const previousPage = ref('');
const isSearchResult = ref(null);
const initialPage = ref(1);
const pageTotal = ref(1);
const totalRecords = ref(2);
const resetPage = ref(true);
const handlePageChange = newPage => {
  // if (caseSearchRequest.value.pageNumber !== newPage) {
  //   caseSearchRequest.value.pageNumber = newPage;
  //   resetPage.value = false;
  //   submitData(); // 分頁變更時執行查詢
  // }
  console.log('Page changed to:', newPage);
};

onMounted(() => {
  // if (meetingStore.allMeetingsData.length === 0) {
  // meetingStore.getMeetSurveyInfo();
  isSearchResult.value = true;
  // }
});
</script>

<template>
  <div class="mt-5">
    <span class="my-3 block">說明：實際會議出席時間，仍以環境部正式發出之「開會通知單」為準。</span>
    <BaseTable :thead="thead" :tbody="results">
      <template #default="{ row, index, head }">
        <template v-if="head.attrName === 'index'">
          {{ index + 1 }}
        </template>
        <template v-else-if="head.attrName === 'meetingDate'">
          {{ row.meetingDate }}（星期{{ row.meetingWeek }}）
        </template>
        <template v-else-if="head.attrName === 'meetingDetail'">
          <ul class="space-y-1 text-base leading-6">
            <li class="text-primary-500 text-lg font-bold">{{ row.meetingDetail.title }}</li>
            <li>時間：{{ row.meetingDetail.time }}</li>
            <li>地點：{{ row.meetingDetail.location }}</li>
            <li>聯絡人：{{ row.meetingDetail.contact }}</li>
            <li>會議公開：{{ row.meetingDetail.isPublic ? '已公開' : '未公開' }}</li>
            <li v-if="row.meetingDetail.file && row.meetingDetail.file.name">
              開會公文：<a
                :href="row.meetingDetail.file.url"
                class="text-primary-600 hover:text-primary-800 underline"
                target="_blank"
                >{{ row.meetingDetail.file.name }}</a
              >
            </li>
          </ul>
        </template>
      </template>
    </BaseTable>
    <PaginationComponent
      :key="previousPage"
      v-show="isSearchResult === true"
      :page-total="pageTotal"
      :total-records="totalRecords"
      :initial-page="initialPage"
      :reset-page="resetPage"
      :previous-page="previousPage"
      @update:currentPage="handlePageChange"
    ></PaginationComponent>
  </div>
</template>
