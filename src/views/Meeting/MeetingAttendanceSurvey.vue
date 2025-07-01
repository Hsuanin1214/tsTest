<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import WhiteContainer from '@/components/uiComponents/WhiteContainer/WhiteContainer.vue';
import PageTitle from '@/components/uiComponents/PageTitle/PageTitle.vue';
import SwitchComponent from '@/components/uiComponents/Switch/SwitchComponent.vue';
import BaseTable from '@/components/uiComponents/Table/BaseTable.vue';
import { useMeetingStore } from '@/stores/MeetSurvey/useMeetingStore.js';
import PaginationComponent from '@/components/uiComponents/Pagination/PaginationComponent.vue';

const meetingStore = useMeetingStore();

const meetingStatusOptions = [
  { label: '全部', value: 0 },
  { label: '未填寫', value: 1 },
  { label: '出席', value: 2 },
  { label: '不出席', value: 3 }
];

/** 表格標頭 */
const thead = [
  {
    name: '序',
    attrName: 'index',
    widthClass: 'w-[10%]'
  },
  {
    name: '調查截止日期',
    attrName: 'surveyDeadline',
    widthClass: 'w-[10%]'
  },
  {
    name: '會議名稱',
    attrName: 'meetingName',
    widthClass: 'w-[10%]'
  }
];

const route = useRoute();
const selectedStatus = ref(Number(route.query.status) || 0);
// 使用 store 的 computed getter
const filteredList = computed(() => meetingStore.getFilteredMeetings(selectedStatus.value));

const router = useRouter();
const selectedRowId = ref(0);
const handleRowClick = row => {
  selectedRowId.value = row.id; // 高亮目前選中的 row
  router.push({
    name: 'meetingSurveyDetail',
    params: { id: row.id },
    query: {
      status: selectedStatus.value
    }
  });
};
const previousPage = ref('');
const isSearchResult = ref(null);
const initialPage = ref(1);
const pageTotal = ref(1);
const totalRecords = ref(5);
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
  if (meetingStore.allMeetingsData.length === 0) {
    meetingStore.getMeetSurveyInfo();
    isSearchResult.value = true;
  }
});
</script>
<template>
  <WhiteContainer>
    <PageTitle>會議出席調查</PageTitle>
    <section class="mx-auto sm:px-4">
      <SwitchComponent v-model="selectedStatus" :options="meetingStatusOptions" />
    </section>
    <div class="mt-12">
      <div class="flex items-center justify-between">
        <h6 class="text-primary-500 mb-3 text-2xl leading-6 font-bold">查詢結果</h6>
      </div>
      <BaseTable :thead="thead" :tbody="filteredList" :selected-row-id="selectedRowId" @row-click="handleRowClick">
        <template #default="{ row, index, head }">
          <template v-if="head.attrName === 'index'">
            {{ index + 1 }}
          </template>

          <template v-else-if="head.attrName === 'surveyDeadline'">
            {{ row.surveyDeadline }}
          </template>

          <template v-else-if="head.attrName === 'meetingName'">
            {{ row.meetingName }}
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
  </WhiteContainer>
</template>
