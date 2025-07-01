<script setup>
import { ref, onMounted, computed } from 'vue';
import WhiteContainer from '@/components/uiComponents/WhiteContainer/WhiteContainer.vue';
import PageTitle from '@/components/uiComponents/PageTitle/PageTitle.vue';
import BaseTable from '@/components/uiComponents/Table/BaseTable.vue';
import PaginationComponent from '@/components/uiComponents/Pagination/PaginationComponent.vue';
import { useAlertStore } from '@/stores/Alert/alertStore';

// import { useAxiosMethod } from '@/composables/axios/useAxios-v1';
// import { insertColumnAfter } from '@/composables/dynamicTableHeader/dynamicTableHeader';
import BaseButton from '@/components/uiComponents/Button/BaseButton.vue';
import { getJsonData } from '@/composables/axios/baseAxiosMethods';
// import LoadingPage from '@/components/uiComponent/LoadingComponent.vue';
// import ErrorPage from '@/components/uiComponent/ErrorPage.vue';
// import { useChangeRoc } from '@/composables/formatDate/useChangeRoc';

// const props = defineProps({
//   isModalOpen: Boolean,
//   closeModal: Function,
//   modalTitle: String,
//   unitResult: Object,
//   selectedRow: Object, // 選中的列
//   committeeMemberId: Number,
//   auth: {
//     type: Object,
//     default: () => {}
//   }
// });

/**
 * 定義 Enum 物件，作為常數集合
 * - PageName：頁面名稱，顯示該委員動態
 * - MinDate : 系統最早日期
 * - RepeatDateArr：重複的日期陣列，代表週一至週五
 * - RepeatTimeArr：重複的時間陣列，分別代表上半日、下半日及全天
 * - Url：表格 JSON 資料來源
 * - TableIndexKey：表頭欄位之索引鍵
 * @enum {Object}
 */
const PageConstInfo = Object.freeze({
  PageName: '該委員動態',
  MinDate: '1987-01-01',
  RepeatDateArr: ['一', '二', '三', '四', '五'],
  RepeatTimeArr: ['上', '下', '全'],
  TableHeadUrl: '/json/jsonData/informationBoard/committeeActivity/tableCommitteeUnit.json',
  TableIndexKey: 'headOfCommitteeUnit',
  committeeNameUrl: '/json/jsonData/committee/committeeSelectOptionData.json',
  committeeNameKey: 'committeeName',
  timeDataUrl: '/json/jsonData/informationBoard/committeeActivity/resultOfCommitteeUnit.json',
  timeDataKey: 'data'
});

// const { useAxios } = useAxiosMethod();

// const loadingStatus = ref({
//   isLoading: false,
//   text: ''
// });
// const tableData = ref({
//   loading: false,
//   error: ''
// });

// 提示訊息
const alertStore = useAlertStore();

// data
/** 新增 */
const initialCommitteeResult = {
  committeeMemberId: '',
  committeeName: '',
  setStartDate: '',
  setEndDate: '',
  repeatDate: '',
  repeatTime: '',
  lastUpdateDatetime: new Date()
};
const committeeActivities = ref({ ...initialCommitteeResult });
const results = ref([]);
const selectedNumbers = ref([]);
const selectedTimes = ref([]);

/**
 * 切換 array 中的項目
 * @param {Array} array - 被選取的項目
 * @param {*} number - 要切換的項目
 * @returns {[]} 新的[]
 */
const toggleNumber = (number, array = []) => {
  const newArray = [...array];
  if (newArray.includes(number)) {
    // 若新陣列中存在 number，則刪除 number
    return newArray.filter(item => item !== number);
  }
  // 若新陣列中不存在 number，則加入 number
  newArray.push(number);
  return newArray;
};
/**
 * 處理重複日期之切換
 * @param {*} number - 被切換之項目
 */
const handleToggleSelectedNumbers = number => {
  selectedNumbers.value = toggleNumber(number, selectedNumbers.value);
  committeeActivities.value.repeatDate = selectedNumbers.value;
};

/**
 * 處理重複時間之切換
 * @param {*} number - 被切換之項目
 */
const handleToggleSelectedTimes = number => {
  selectedTimes.value = toggleNumber(number, selectedTimes.value);
  committeeActivities.value.repeatTime = selectedTimes.value;
};

/**
 * 根據是否選取，回傳相應背景色的 class
 * @param {String} num - 每個可能被點選的時間及日期
 */
const getSelectedClass = num => {
  return selectedNumbers.value.includes(num) ? 'bg-primary-500' : 'bg-secondary-600';
};

/** 處理刪除 */
// const allSelected = computed({
//   get() {
//     return results.value.every(row => row.selected);
//   },
//   set(value) {
//     results.value.forEach(row => {
//       const item = row;
//       item.selected = value;
//       return item;
//     });
//   }
// });

const deleteSelectedRows = async () => {
  // 取得選定的資料
  const selectedRows = results.value.filter(row => row.selected);

  if (selectedRows.length === 0) {
    alertStore.trigger({
      type: 'warning',
      message: '請選擇要刪除的檔案',
      duration: 3000,
      showButton: false
    });
    return;
  }

  // loadingStatus.value = {
  //   isLoading: true,
  //   text: '刪除'
  // };
  // 使用 Promise.all 處理所有刪除請求，確保並行執行
  const deletePromises = selectedRows.map(row => {
    const chapterFileIds = [];
    chapterFileIds.push(row.chapterFileId);
    return true;
    // 	const payload = {
    // 		hCode,
    // 		chapterFileIds,
    // 		loginUserId: '',
    // 	};

    // 	return useAxios(
    // 		`/CaseManagement/DocCatalog/${hCode}/delete-files`,
    // 		'delete',
    // 		payload,
    // 	)
    // 		.then(() => {
    // 			showAlert(`檔案 ${row.chapterName} 刪除成功`, 'success');
    // 		})
    // 		.catch((error) => {
    // 			showAlert(
    // 				`刪除檔案 ${row.chapterName} 失敗。錯誤問題為: ${error.message}`,
    // 				'error',
    // 				'toastHasCloseAlert',
    // 			);
    // 		});
  });

  // 等待所有刪除請求完成
  await Promise.all(deletePromises);

  // 刪除完成後更新資料
  results.value = results.value.filter(row => !row.selected);
  alertStore.trigger({
    type: 'success',
    message: '選定的檔案皆已成功刪除',
    duration: 3000,
    showButton: false
  });

  // loadingStatus.value = {
  //   isLoading: false,
  //   text: '刪除'
  // };
};

const isLoading = ref(false);
const getData = async () => {
  try {
    isLoading.value = true;
    // useAxios(`/CaseManagement/DocCatalog/${hCode}`, 'get');
    // 取得委員姓名
    const choseCommittee = (await getJsonData(PageConstInfo.committeeNameUrl, PageConstInfo.committeeNameKey)) || [];
    // 確保 choseCommittee 是陣列
    if (!Array.isArray(choseCommittee)) {
      alertStore.trigger({
        type: 'warning',
        message: '取得委員名單時發生錯誤，請聯繫管理員',
        duration: 3000,
        showButton: false
      });
      return;
    }

    // 確保 props.committeeMemberId 是數字
    const selectedMember = choseCommittee.find(person => Number(person.id) === 1);
    // 如果找到，則設定委員名稱
    if (selectedMember) {
      committeeActivities.value.committeeName = selectedMember.name;
      committeeActivities.value.committeeMemberId = 1;
    }
  } catch (error) {
    alertStore.trigger({
      type: 'warning',
      message: `資料有誤，請聯繫管理員 ${error}`,
      duration: 3000,
      showButton: false
    });
    console.log(error);
  } finally {
    isLoading.value = false; // 完成API
  }
};

/** 西元轉民國年 */
// const { convertToRocDate } = useChangeRoc();

// const getTimeData = async () => {
//   try {
//     isLoading.value = true;
//     // useAxios(`/CaseManagement/DocCatalog/${hCode}`, 'get');
//     // 取得委員姓名
//     const timeData = (await getJsonData(PageConstInfo.timeDataUrl, PageConstInfo.timeDataKey)) || [];
//     // 確保 choseCommittee 是陣列
//     // if (!Array.isArray(timeData)) {
//     //   showAlert('取得委員名單時發生錯誤，請聯繫管理員', 'warning', 'toastHasCloseAlert');
//     //   return;
//     // }

//     results.value = timeData.map(
//       ({ setStartDate, setEndDate, repeatDate = [], repeatTime = [], lastUpdateDatetime, ...rest }) => {
//         return {
//           ...rest,
//           timeDuration:
//             setStartDate && setEndDate ? `${convertToRocDate(setStartDate)}~${convertToRocDate(setEndDate)}` : '',
//           repeatDate: repeatDate.join(', '), // 確保 `repeatDate` 為陣列，然後直接 join
//           repeatTime: repeatTime.join(', '),
//           lastUpdateDatetime: lastUpdateDatetime ? convertToRocDate(lastUpdateDatetime) : ''
//         };
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     // showAlert(`資料有誤，請聯繫管理員 ${error}`, 'warning', 'toastHasCloseAlert');
//   } finally {
//     isLoading.value = false; // 完成API
//   }
// };

// 日期
// const rocYears = 1911;
const today = new Date();
const maxDate = computed(() => {
  const futureDate = new Date(today);
  futureDate.setFullYear(today.getFullYear() + 100);
  return futureDate.toISOString().split('T')[0];
});
/** 審查日期大小 */
const maxSetStartDate = computed(() => {
  return committeeActivities.value.setEndDate;
});
const minSetEndDate = computed(() => {
  return committeeActivities.value.setStartDate;
});
const handleCreate = async () => {
  isLoading.value = true;
  // 到時候此段要移除
  try {
    console.log(committeeActivities.value);
    // committeeMemberId
  } catch (error) {
    alertStore.trigger({
      type: 'warning',
      message: `資料有誤，請聯繫管理員 ${error.message}`,
      duration: 3000,
      showButton: false
    });
  } finally {
    isLoading.value = false; // 完成API
  }
};

/** 取得表格的表頭欄位 */
const tableHeadOptions = ref(null);

const getTableData = async () => {
  tableHeadOptions.value = await getJsonData(PageConstInfo.TableHeadUrl, PageConstInfo.TableIndexKey);
};

// 產出假資料
const generateFakeData = (count = 10) => {
  const repeatDateOptions = ['一', '二', '三', '四', '五'];
  const repeatTimeOptions = ['上', '下', '全'];

  return Array.from({ length: count }, (_, i) => {
    return {
      id: i + 1,
      timeDuration: `112-0${(i % 9) + 1}-01 ~ 112-0${(i % 9) + 1}-02`,
      repeatDate: repeatDateOptions.slice(0, (i % 5) + 1).join(', '),
      repeatTime: repeatTimeOptions[i % 3],
      lastUpdateDatetime: `112-0${(i % 9) + 1}-03`
    };
  });
};

// 假資料帶入
// results.value = generateFakeData();

const previousPage = ref('');
const isSearchResult = ref(null);
const initialPage = ref(1);
const pageTotal = ref(1);
const totalRecords = ref(10);
const resetPage = ref(true);
const handlePageChange = newPage => {
  // if (caseSearchRequest.value.pageNumber !== newPage) {
  //   caseSearchRequest.value.pageNumber = newPage;
  //   resetPage.value = false;
  //   submitData(); // 分頁變更時執行查詢
  // }
  console.log('Page changed to:', newPage);
};

onMounted(async () => {
  await getTableData();
  await getData();
  // await getTimeData();

  // 若要直接顯示假資料，請註解掉 getTimeData 並打開以下行：
  results.value = generateFakeData();
  isSearchResult.value = true;
});

/** 清空 */
const handleClear = async () => {
  const { committeeName, committeeMemberId } = committeeActivities.value; // 暫存委員名稱
  committeeActivities.value = {
    ...initialCommitteeResult,
    committeeName,
    committeeMemberId
  }; // 保留委員名稱
  selectedNumbers.value = []; // 清除選取的重複日期
  selectedTimes.value = []; // 清除選取的重複時間
};

/** 表格標頭 */
const thead = [
  {
    name: '序',
    attrName: 'index',
    widthClass: 'w-[10%]'
  },
  {
    name: '日期區隔',
    attrName: 'timeDuration',
    widthClass: 'w-[10%]'
  },
  {
    name: '重複日期',
    attrName: 'repeatDate',
    widthClass: 'w-[10%]'
  },
  {
    name: '重複時間',
    attrName: 'repeatTime',
    widthClass: 'w-[10%]'
  },
  {
    name: '更新日期',
    attrName: 'lastUpdateDatetime',
    widthClass: 'w-[10%]'
  },
  {
    name: '刪除',
    attrName: 'selectAll',
    widthClass: 'w-[5%]',
    isSelectCheckbox: true
  }
];

const isAllSelected = computed(() => {
  return results.value.length > 0 && results.value.every(row => row.selected);
});

const toggleSelectAll = val => {
  results.value.forEach(row => {
    row.selected = val;
  });
};
</script>
<template>
  <WhiteContainer>
    <PageTitle>委員動態設定</PageTitle>
    <section class="container mx-auto px-4">
      <div class="my-5 grid grid-cols-1 items-start gap-5 md:grid-cols-2">
        <div class="col-span-2">
          <span> 請輸入委員無法與會的日期區間，可重複設定星期及上下午或全天 </span>
        </div>
        <div class="col-span-2 flex items-center">
          <label class="text-secondary-600 text-lg font-bold" for="">委員姓名</label>
          <div class="ml-5 text-lg">
            {{ committeeActivities.committeeName }}
          </div>
        </div>
        <div class="col-span-2">
          <label class="text-secondary-600 text-lg font-bold" for="">設定期間</label>
          <div class="sm:flex sm:items-center">
            <input
              type="date"
              id="setStartDate"
              name="期間開始日期"
              :min="PageConstInfo.MinDate"
              :max="maxSetStartDate"
              v-model="committeeActivities.setStartDate"
              class="form-control h-11"
            />
            <span class="mr-3 ml-3"> － </span>
            <input
              type="date"
              id="setEndDate"
              name="期間結束日期"
              :min="minSetEndDate"
              :max="maxDate"
              v-model="committeeActivities.setEndDate"
              class="form-control h-11"
            />
          </div>
        </div>
        <div class="col-span-2 md:col-span-1">
          <label class="text-secondary-600 text-lg font-bold" for="">重複日期</label>
          <div class="mx-3 mt-2 grid w-full grid-cols-5 gap-2 md:grid-cols-3 lg:grid-cols-5">
            <div
              v-for="num in PageConstInfo.RepeatDateArr"
              :key="num"
              @click="handleToggleSelectedNumbers(num)"
              :class="['h-6 w-6 cursor-pointer rounded-full text-center text-base text-white', getSelectedClass(num)]"
            >
              {{ num }}
            </div>
          </div>
        </div>
        <div>
          <label class="text-secondary-600 text-lg font-bold" for="">重複時間</label>
          <div class="mx-3 mt-2 grid w-full grid-cols-5 gap-2 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="num in PageConstInfo.RepeatTimeArr"
              :key="num"
              @click="handleToggleSelectedTimes(num)"
              class="h-6 w-6 cursor-pointer rounded-full text-center text-base text-white"
              :class="{
                'bg-primary-500': selectedTimes.includes(num),
                'bg-secondary-500': !selectedTimes.includes(num)
              }"
            >
              {{ num }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 flex items-start justify-center">
        <div class="mt-4 flex space-x-10 xl:mt-0">
          <BaseButton type="button" color="warning" title="儲存" :is-loading="isLoading" @click.prevent="handleCreate"
            >儲存</BaseButton
          >
          <button type="button" class="btn btn-secondary shrink-0" value="Clear" @click.prevent="handleClear">
            清除
          </button>
        </div>
      </div>
      <div class="mt-12 mb-6">
        <div class="flex items-center justify-between">
          <h6 class="text-primary-500 mb-3 text-2xl leading-6 font-bold">查詢結果</h6>
          <div class="mt-4 flex flex-wrap items-center md:mt-0 md:space-x-3">
            <!-- <BaseButton
              type="button"
              :color="!results.length ? 'secondary' : 'primary'"
              title="刪除"
              :is-loading="loadingStatus.text === '刪除' ? loadingStatus.isLoading : false"
              @click.prevent="deleteSelectedRows"
              class="mb-2 ml-2"
              :class="{
                'cursor-not-allowed': !results.length
              }"
              :disabled="!results.length"
              >刪除</BaseButton
            > -->
            <BaseButton
              type="button"
              color="primary"
              title="刪除"
              @click.prevent="deleteSelectedRows"
              class="mb-2 ml-2"
              :class="{
                'cursor-not-allowed': !results.length
              }"
              :disabled="!results.length"
              >刪除</BaseButton
            >
          </div>
        </div>
        <BaseTable :thead="thead" :tbody="results">
          <template #thead="{ head }">
            <!-- 表頭欄位-->
            <template v-if="head.isSelectCheckbox">
              <div class="item-center flex justify-center">
                <label for="selectAll">刪除</label>
                <input
                  id="selectAll"
                  type="checkbox"
                  class="checkbox my-auto ml-2"
                  :checked="isAllSelected"
                  @change="toggleSelectAll($event.target.checked)"
                />
              </div>
            </template>
            <template v-else>
              {{ head.name }}
            </template>
          </template>
          <template #default="{ row, index, head }">
            <template v-if="head.attrName === 'index'">
              {{ index + 1 }}
            </template>

            <template v-else-if="head.attrName === 'timeDuration'">
              {{ row.timeDuration }}
            </template>

            <template v-else-if="head.attrName === 'repeatDate'">
              {{ row.repeatDate }}
            </template>

            <template v-else-if="head.attrName === 'repeatTime'">
              {{ row.repeatTime }}
            </template>

            <template v-else-if="head.attrName === 'lastUpdateDatetime'">
              {{ row.lastUpdateDatetime }}
            </template>

            <template v-else-if="head.attrName === 'selectAll'">
              <input type="checkbox" class="checkbox" v-model="row.selected" />
            </template>
            <!-- 全選 checkbox 的表頭 -->
            <!--<template v-if="head.attrName === 'selectAll'">
              <input
                type="checkbox"
                class="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll($event.target.checked)"
              />
            </template>-->
          </template>
          <template #mobile-header>
            <div class="mb-4 flex items-center justify-end">
              <label class="text-secondary-600 mr-2 font-bold">全選刪除</label>
              <input
                type="checkbox"
                class="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll($event.target.checked)"
              />
            </div>
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
    </section>
  </WhiteContainer>
</template>
