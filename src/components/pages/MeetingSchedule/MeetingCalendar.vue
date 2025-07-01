<script setup>
import { ref, nextTick, computed, readonly, watch } from 'vue';
import BaseButton from '@/components/uiComponents/Button/BaseButton.vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import StaticModal from '@/components/uiComponents/Modal/StaticModal.vue';

const meetingStatusList = readonly([
  {
    name: '已公開出席',
    color: '#28a745'
  },
  {
    name: '已公開不出席',
    color: '#dc3545'
  },
  {
    name: '因故取消',
    color: '#6c757d'
  },
  {
    name: '調查未填寫',
    color: '#ffc107'
  },
  {
    name: '調查出席',
    color: '#17a2b8'
  },
  {
    name: '調查不出席',
    color: '#fd7e14'
  }
]);

// --- 狀態管理 ---
const selected = ref('專案小組');
const selectMeetingType = ref('已公開出席');
const calendarRef = ref(null);

// --- 輔助函數 ---
const isSelected = type => selected.value === type;
const isMeetingTypeSelect = type => selectMeetingType.value === type;

// -- 控制modal狀態 --
const isEventModalOpen = ref(false);
const currentEventInfo = ref(null);

//  狀態名稱到顏色的映射，方便查找
const statusColorMap = meetingStatusList.reduce((acc, status) => {
  acc[status.name] = status.color;
  return acc;
}, {});

// --- 假數據生成 ---
const generateFakeEvents = () => {
  const events = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  meetingStatusList.forEach((status, index) => {
    // 為每個狀態創建一個事件，分散在當月
    const dayOfMonth = index * 4 + 2; // 例如：第 2, 6, 10, 14, 18, 22 天
    const eventDate = new Date(year, month, dayOfMonth + 1, 8, 30);

    // 確保日期仍在當月
    if (eventDate.getMonth() === month) {
      events.push({
        id: `evt-${index + 1}`,
        title: `「台東新設成功淨水場環境影響說明書第四次變更內容對照表」專案小組審查會議 - ${status.name}`, // 會議 A, B, C...
        start: eventDate.toISOString(), // 使用 YYYY-MM-DD 格式
        allDay: false,
        color: status.color, // 直接使用狀態定義的顏色
        extendedProps: {
          // 儲存自定義屬性
          date: eventDate.toISOString().split('T')[0], // 使用 YYYY-MM-DD 格式
          status: status.name,
          location: `本部後棟101會議室`,
          organizer: '專案小組',
          phone: '02-1234-5678',
          fileName: '會議記錄.pdf',
          fileId: 'meeting-record-1234'
        }
      });
    }

    // 為 '已公開出席' 添加一個時間事件範例
    if (status.name === '已公開出席') {
      const timeEventDate = new Date(year, month, dayOfMonth + 1, 14, 30); // 下午 2:30
      if (timeEventDate.getMonth() === month) {
        events.push({
          id: `evt-time-${index + 1}`,
          title: `下午茶討論 - ${status.name}`,
          start: timeEventDate.toISOString(), // 包含時間的 ISO 格式
          allDay: false,
          color: status.color,
          extendedProps: {
            date: eventDate.toISOString().split('T')[0],
            status: status.name,
            location: `本部後棟101會議室`,
            organizer: '專案小組',
            phone: '02-1234-5678'
          }
        });
      }
    }
  });
  console.log('Generated Fake Events:', events); // 調試用
  return events;
};
// 額外補上非專案小組假資料（紅色：迴避，綠色：非迴避）
const generateNonProjectGroupEvents = () => {
  const events = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  for (let i = 0; i < 10; i++) {
    const dayOfMonth = 3 + i * 5;
    const dateStr = new Date(year, month, dayOfMonth + 1, 10, 0).toISOString();

    // 非迴避委員
    events.push({
      id: `non-proj-${i + 1}-1`,
      title: `「廣源觀光旅館環境影響說明書」專案小組第2次初審會議 `,
      start: dateStr,
      allDay: false,
      color: '#28a745', // 綠色
      extendedProps: {
        date: dateStr.split('T')[0],
        status: '非迴避委員',
        location: `本部後棟101會議室`,
        organizer: '非專案小組',
        phone: '02-1234-5678',
        fileName: '會議通知單1.pdf',
        fileId: `nonproj-${i}-doc`
      }
    });

    // 迴避委員
    events.push({
      id: `non-proj-${i + 1}-2`,
      title: `「台灣～澎湖161kV電纜線路工程環境影響說明書變更內容對照表（停止營運期間環境監測）」專案小組第2次審查會議`,
      start: dateStr,
      allDay: false,
      color: '#dc3545', // 紅色
      extendedProps: {
        date: dateStr.split('T')[0],
        status: '迴避委員',
        location: `本部後棟101會議室`,
        organizer: '非專案小組',
        phone: '02-1234-5678',
        fileName: '會議通知單2.pdf',
        fileId: `nonproj-${i}-doc`
      }
    });
  }

  return events;
};

// --- 存儲所有生成的假事件 ---
const baseEvents = computed(() =>
  selected.value === '專案小組' ? generateFakeEvents() : generateNonProjectGroupEvents()
);
// --- 根據 selected (專案小組/非專案小組) 過濾事件 ---
const filteredEvents = computed(() => {
  // if (!selected.value) return allFakeEvents.value; // 如果沒有選擇，顯示全部
  // return allFakeEvents.value.filter(event => event.extendedProps?.organizer === selected.value);
  return selected.value === '專案小組'
    ? baseEvents.value.filter(event => {
        const organizerMatch = !selected.value || event.extendedProps?.organizer === selected.value;
        const statusMatch = !selectMeetingType.value || event.extendedProps?.status === selectMeetingType.value;
        return organizerMatch && statusMatch;
      })
    : baseEvents.value;
});

/** 計算目前行事曆日期 */
// const handleDatesSet = info => {
//   const startDate = info.start; // 顯示範圍的第一天
//   const endDate = new Date(info.end); // 顯示範圍的 exclusive 結束日期

//   // 調整 endDate 為最後一天
//   endDate.setDate(endDate.getDate() - 1);

//   console.log('顯示範圍開始日期:', startDate.toLocaleDateString(), '顯示範圍結束日期:', endDate.toLocaleDateString());
// };

const formatDateTime = isoStr => {
  if (!isoStr) return '';
  const date = new Date(isoStr);

  const pad = num => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());

  const weekdayMap = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdayMap[date.getDay()];

  return `${year}-${month}-${day}（星期${weekday}）${hour}:${minute}`;
};

/**
 * 當點擊日曆上的事件時觸發
 * @param {object} clickInfo - 包含 event 對象等信息
 */
const handleEventClick = clickInfo => {
  currentEventInfo.value = {
    title: clickInfo.event.title,
    start: clickInfo.event.startStr,
    status: clickInfo.event.extendedProps?.status,
    location: clickInfo.event.extendedProps?.location,
    organizer: clickInfo.event.extendedProps?.organizer,
    phone: clickInfo.event.extendedProps?.phone,
    fileName: clickInfo.event.extendedProps?.fileName || '無檔案',
    fileId: clickInfo.event.extendedProps?.fileId || ''
  };

  // 使用 nextTick 確保 DOM 更新完成
  nextTick(() => {
    if (calendarRef.value) {
      const calendarApi = calendarRef.value.getApi();
      // 取消可能的日期選擇狀態
      calendarApi.unselect();

      // 延遲移除 FullCalendar 可能殘留的 popover 元素
      // 這是處理某些交互後 UI 殘留的常見方法
      setTimeout(() => {
        const popovers = document.querySelectorAll('.fc-popover');
        popovers.forEach(popoverElement => {
          popoverElement.remove(); // 移除彈出框
        });
      }, 100);

      // updateMaintainEvent(event);
    }
  });
  isEventModalOpen.value = true;
  // }
};

const getDotColor = event => {
  const status = event.extendedProps?.status;
  if (event.extendedProps?.organizer === '非專案小組') {
    return status === '非迴避委員' ? '#28a745' : '#dc3545'; // 綠 or 紅
  } else {
    return statusColorMap[status] || '#3D6C97';
  }
};

/**
 * 當日期單元格掛載到 DOM 時觸發 (用於手機版顯示點)
 * @param {object} info - 包含 el (DOM元素), date, view 等信息
 */
const handleDayCellMount = info => {
  // info.el: 日期單元格的 DOM 元素
  // info.date: 此單元格代表的日期
  // info.view: 當前視圖對象

  // 只在月視圖執行
  if (info.view.type !== 'dayGridMonth') {
    return;
  }

  const calendarApi = calendarRef.value?.getApi();
  if (!calendarApi) return;

  // --- 潛在效能注意點 ---
  // 此處 getEvents() 會獲取所有事件，並在每個單元格掛載時執行過濾。
  // 對於大量事件，考慮預先處理事件數據可能更優。
  const events = calendarApi.getEvents(); // 獲取所有事件
  const cellDateStr = info.date.toISOString().split('T')[0]; // YYYY-MM-DD 格式

  // 找出當天的事件 (包含跨天事件)
  const eventsOnDay = events.filter(event => {
    const eventStartStr = event.startStr.split('T')[0];
    return eventStartStr === cellDateStr;
  });

  if (eventsOnDay.length > 0) {
    const uniqueColors = new Set(eventsOnDay.map(event => getDotColor(event)));

    // 創建點的容器
    const dotsContainer = document.createElement('div');
    dotsContainer.classList.add('mobile-event-dots-container');

    uniqueColors.forEach(color => {
      const dot = document.createElement('span');
      dot.classList.add('mobile-event-dot');
      dot.style.backgroundColor = color;
      dotsContainer.appendChild(dot);
    });

    // 將點容器添加到日期數字下方
    // 找到日期數字元素 .fc-daygrid-day-number
    const dayNumberEl = info.el.querySelector('.fc-daygrid-day-number');
    if (dayNumberEl) {
      // 插在數字後面 (或其父元素的末尾)
      dayNumberEl.parentNode.appendChild(dotsContainer);
    } else {
      // 加到單元格內容的末尾
      const dayTopEl = info.el.querySelector('.fc-daygrid-day-top');
      if (dayTopEl) {
        dayTopEl.appendChild(dotsContainer);
      } else {
        // 直接添加到單元格
        info.el.appendChild(dotsContainer);
      }
    }
  }
};

const refreshMobileDots = () => {
  const calendarApi = calendarRef.value?.getApi();
  if (!calendarApi) return;

  // 先清掉所有舊的點
  document.querySelectorAll('.mobile-event-dots-container').forEach(el => el.remove());

  const events = calendarApi.getEvents();

  // 逐個格子處理
  document.querySelectorAll('.fc-daygrid-day').forEach(dayCell => {
    const dateStr = dayCell.getAttribute('data-date');
    if (!dateStr) return;

    const eventsOnDay = events.filter(event => {
      const startStr = event.startStr.split('T')[0];
      const isSameDate = startStr === dateStr;
      if (selected.value === '專案小組') {
        return (
          isSameDate &&
          event.extendedProps?.organizer === '專案小組' &&
          (!selectMeetingType.value || event.extendedProps?.status === selectMeetingType.value)
        );
      } else {
        return isSameDate && event.extendedProps?.organizer === '非專案小組';
      }
    });

    if (eventsOnDay.length === 0) return;

    const dotsContainer = document.createElement('div');
    dotsContainer.classList.add('mobile-event-dots-container');

    eventsOnDay.forEach(event => {
      console.log(event);
      const dot = document.createElement('span');
      dot.classList.add('mobile-event-dot');
      dot.style.backgroundColor = getDotColor(event);

      // 加上點擊事件（跳出 modal）
      dot.addEventListener('click', () => {
        currentEventInfo.value = {
          title: event.title,
          start: event.startStr,
          status: event.extendedProps?.status,
          location: event.extendedProps?.location,
          organizer: event.extendedProps?.organizer,
          phone: event.extendedProps?.phone
        };
        isEventModalOpen.value = true;
      });

      dotsContainer.appendChild(dot);
    });

    const dayNumberEl = dayCell.querySelector('.fc-daygrid-day-number');
    if (dayNumberEl?.parentNode) {
      dayNumberEl.parentNode.appendChild(dotsContainer);
    }
  });
};

watch([selectMeetingType, selected], async () => {
  await nextTick();

  const calendarApi = calendarRef.value?.getApi();
  if (!calendarApi) return;

  // 強制更新 FullCalendar 事件
  calendarApi.removeAllEvents();
  filteredEvents.value.forEach(event => calendarApi.addEvent(event));

  // 手動處理手機版點點顯示
  refreshMobileDots();
});

const isStatusMatched = status => {
  return status === '已公開出席' || status === '已公開不出席' || status === '因故取消';
};
/** 顯示用的狀態（處理非專案小組） */
/** 是否為迴避委員 */
const isAvoided = computed(() => currentEventInfo.value?.status === '迴避委員');

/** 是否為非迴避委員 */
const isNonAvoided = computed(() => currentEventInfo.value?.status === '非迴避委員');

/** 行事曆options */
const calendarOptions = ref({
  locale: 'zh-cn',
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: 'dayGridMonth',
  handleWindowResize: true, // 隨瀏覽器變化
  // 自定義標題顯示為民國年
  titleFormat: args => {
    const date = args.start;
    const taiwanYear = date.year - 1911;
    const month = date.month + 1;
    return `${taiwanYear}年${month}月`;
  },
  dayCellContent: info => info.date.getDate(), // 只顯示數字
  firstDay: 1,
  headerToolbar: {
    left: 'title',
    right: 'prev,next'
  },
  buttonText: {
    prev: '<',
    next: '>'
  },

  aspectRatio: 1.35,
  eventColor: '#3D6C97', // 移除默認顏色，讓每個事件使用自己的顏色
  editable: false,
  selectable: false, // 允許選擇日期範圍
  selectMirror: true,
  dayMaxEvents: true, // 允許 "+more" 連結當事件過多時
  weekends: true,
  // eventMouseEnter: handleEventMouseEnter, // hover
  // eventMouseLeave: handleEventMouseLeave, // mouseleave
  // datesSet: handleDatesSet, // 綁定 datesSet 事件
  // dateClick: handleDateClick, // 日期方格點擊事件
  eventClick: handleEventClick, // 事件點擊事件
  // events: this.fetchEvents, // 獲取事件
  // eventClick: this.handleEventClick, // 點擊事件
  // eventsSet: this.handleEvents,
  events: filteredEvents, // 使用過濾後的事件
  // --- 掛載日期單元格的 Hook ---
  dayCellDidMount: handleDayCellMount
});
</script>

<template>
  <div class="mt-5 flex justify-start">
    <BaseButton
      type="button"
      title="專案小組"
      class="btn-sm mb-2 ml-2"
      :color="isSelected('專案小組') ? 'primary' : 'outlinePrimary'"
      @click="selected = '專案小組'"
      >專案小組</BaseButton
    >
    <BaseButton
      type="button"
      title="非專案小組"
      class="btn-sm mb-2 ml-2"
      :color="isSelected('非專案小組') ? 'primary' : 'outlinePrimary'"
      @click="selected = '非專案小組'"
      >非專案小組</BaseButton
    >
  </div>
  <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-4 md:px-8" v-if="selected === '專案小組'">
    <button
      v-for="meetingStatus in meetingStatusList"
      :key="meetingStatus.name"
      type="button"
      :title="meetingStatus.name"
      :class="[
        isMeetingTypeSelect(meetingStatus.name) ? 'text-white' : 'text-secondary-600 bg-secondary-100',
        'btn mb-2 ml-2'
      ]"
      :style="{
        backgroundColor: isMeetingTypeSelect(meetingStatus.name) ? meetingStatus.color : ''
      }"
      @click="selectMeetingType = meetingStatus.name"
    >
      {{ meetingStatus.name }}
    </button>
  </div>
  <FullCalendar
    ref="calendarRef"
    class="custom-calendar mt-5 rounded-lg bg-white shadow md:px-4 md:py-4"
    :options="calendarOptions"
  >
  </FullCalendar>
  <StaticModal
    :isModalOpen="isEventModalOpen"
    :title="
      currentEventInfo?.organizer?.includes('非專案小組')
        ? `非專案小組 - ${currentEventInfo?.status}`
        : currentEventInfo?.status
    "
    :title-color="isAvoided ? 'text-red-500' : 'text-primary-500'"
    @close="isEventModalOpen = false"
  >
    <template #modalBody>
      <!-- 狀態說明文字 -->
      <span class="block" v-if="isStatusMatched(currentEventInfo?.status)">
        實際會議出席時間，仍以環境部正式發出之「開會通知單」為準。
      </span>
      <span class="text-primary-600 block font-bold" v-else-if="isAvoided"> 本會須迴避 </span>
      <span class="text-primary-600 block font-bold" v-else-if="isNonAvoided">
        委員非本專案小組會議成員，仍可出席本會議。
      </span>
      <div class="space-y-2">
        <div class="grid grid-cols-1">
          <label class="text-primary-600 text-lg font-bold">會議日期</label>
          {{ formatDateTime(currentEventInfo?.start) }}
        </div>
        <div class="grid grid-cols-1">
          <label class="text-primary-600 text-lg font-bold">會議名稱</label>{{ currentEventInfo?.title }}
        </div>

        <div class="grid grid-cols-1">
          <label class="text-primary-600 text-lg font-bold">會議地點</label>{{ currentEventInfo?.location }}
        </div>
        <div class="grid grid-cols-1">
          <label class="text-primary-600 text-lg font-bold">聯絡人</label>{{ currentEventInfo?.organizer }}，{{
            currentEventInfo?.phone
          }}
        </div>
        <div class="grid grid-cols-1" v-if="currentEventInfo?.fileName">
          <label class="text-primary-600 text-lg font-bold">開會公文</label>
          <template v-if="currentEventInfo?.fileName && currentEventInfo?.fileId">
            <a
              :href="`/your-download-path/${currentEventInfo.fileId}`"
              target="_blank"
              class="text-primary-600 hover:text-primary-700 underline"
            >
              {{ currentEventInfo.fileName }}
            </a>
          </template>
          <template v-else>
            <span class="text-secondary-600">無檔案</span>
          </template>
        </div>
      </div>
    </template>
  </StaticModal>
</template>
<style>
.custom-calendar .fc-daygrid-day-number {
  padding: 4px;
}
.custom-calendar .fc-event {
  cursor: pointer;
  padding: 2px 4px;
  font-size: 0.8rem;
  border-radius: 3px;
}

/* 讓 prev/next 按鈕更明顯 */
.custom-calendar .fc-prev-button,
.custom-calendar .fc-next-button {
  font-size: 1.5em;
  padding: 0.1em 0.4em !important;
  background-color: #2c3e50 !important;
  color: white !important; /* Hover 效果 */
}
.custom-calendar .fc-prev-button:hover,
.custom-calendar .fc-next-button:hover {
  background-color: #4b637a !important;
}

/* 調整標題樣式 */
.custom-calendar .fc-toolbar-title {
  font-size: 1.4em;
  font-weight: bold;
  color: #3d6c97; /* 主題藍色 */
}

/* 點的容器 */
.mobile-event-dots-container {
  display: none; /* 默認隱藏*/
}

/* Media Query */
@media (max-width: 767px) {
  /* 顯示點容器 */
  .mobile-event-dots-container {
    display: flex;
    flex-wrap: wrap; /* 換行排列 */
    justify-content: flex-start; /* 從左開始 */
    align-items: flex-start;
    gap: 4px;
    position: absolute;
    top: 4px; /* 貼近格子最上方 */
    left: 4px;
    right: 4px;
    z-index: 10;
    padding-right: 6px;
    margin-top: 20px;
  }
  /* 單個點的樣式 */
  .mobile-event-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  /** 手機版的more */
  .mobile-event-more-dot {
    font-size: 10px;
    background-color: #999;
    color: white;
    padding: 0 4px;
    border-radius: 4px;
    line-height: 1.2;
    height: auto;
    cursor: pointer;
  }

  /* 隱藏月視圖中的默認事件條 */
  .custom-calendar .fc-daygrid-day-events {
    display: none;
  }

  /* 隱藏 "+more" 連結 */
  .custom-calendar .fc-daygrid-more-link {
    display: none;
  }

  /* 調整日期單元格的最小高度，確保點能顯示 */
  .custom-calendar .fc-daygrid-day-frame {
    /* min-height: 40px; 根據需要調整 */
    min-height: 120px;
  }

  /* 調整標題字體大小 */
  .custom-calendar .fc-toolbar-title {
    font-size: 1.1em;
  }
  /* 調整按鈕大小 */
  .custom-calendar .fc-button {
    padding: 0.4em 0.6em !important;
    font-size: 0.8em;
  }
  .custom-calendar .fc-prev-button,
  .custom-calendar .fc-next-button {
    font-size: 1.2em;
    padding: 0.1em 0.3em !important;
  }
}
</style>
