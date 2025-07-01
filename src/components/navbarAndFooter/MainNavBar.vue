<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
// import { userStore } from '@/stores/userStore';
import { XMarkIcon, Bars3Icon } from '@heroicons/vue/24/outline';
import StaticModal from '@/components/uiComponents/Modal/StaticModal.vue';
import { useAlertStore } from '@/stores/Alert/alertStore';

// const router = useRouter();
// const useUserStore = userStore();
const isSidebarOpen = ref(false);
// const isApproved = localStorage.getItem('isApproved') === 'true';
// const isMustChangePassword = localStorage.getItem('mustChangePassword') === 'true';
// const logout = () => {
//   useUserStore.userLogout(router);
// };

const PageConstInfo = Object.freeze({
  UsageInstructions: '使用說明'
});
const routerLinks = [
  { name: '首頁', path: '/homePage' },
  { name: '個人資料', path: '/personInformation' }
  // { name: '系統意見投書', path: '/userFeedback' }
];
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value; // 切換側邊欄的顯示狀態
};
const title = ref(import.meta.env.VITE_APP_TITLE);

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const handleLinkClick = async () => {
  await nextTick();
  closeSidebar();
};

const isModalOpen = ref(false);
const openModal = modalName => {
  if (modalName === PageConstInfo.UsageInstructions) {
    isModalOpen.value = true;
  }
};

// 提示訊息
const alertStore = useAlertStore();

const showCustomAlert = () => {
  alertStore.trigger({
    type: 'success',
    message: '已登出成功！',
    duration: 3000,
    showButton: false
  });
};

const isLogoutModalOpen = ref(false);
const router = useRouter();
const confirmLogout = () => {
  isLogoutModalOpen.value = false;
  // 執行登出邏輯
  showCustomAlert();
  // 可在此加入真正的登出邏輯，如 router.push 或 userStore.userLogout()
  router.push('/');
};
</script>
<template>
  <div class="container flex flex-col items-end">
    <nav class="flex w-full items-center justify-between py-2">
      <h2 class="title-white-shadow text-primary-550 w-1/2 text-xl font-semibold sm:text-3xl lg:w-auto xl:w-full">
        {{ title }}
      </h2>
      <!-- 手機版開啟選單按鈕 -->
      <div class="block lg:hidden">
        <button
          class="border-primary-500 text-primary-500 hover:bg-primary-600 flex items-center rounded border px-2 py-1.5 hover:text-white"
          @click="toggleSidebar"
        >
          <Bars3Icon class="color-primary-500 size-4"></Bars3Icon>
        </button>
      </div>

      <!-- 共用 nav（RWD 控制樣式） -->
      <div
        class="text-secondary-500 z-50 flex w-full flex-col items-center space-y-4 py-4 text-base font-bold transition-all duration-300 ease-in-out lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-10 lg:bg-transparent"
        :class="{
          'fixed inset-0 bg-slate-200': isSidebarOpen,
          'hidden lg:flex': !isSidebarOpen
        }"
      >
        <!-- 關閉選單按鈕（手機版專用） -->
        <button
          v-show="isSidebarOpen"
          class="bg-primary-500 absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg lg:hidden"
          @click="closeSidebar"
        >
          <XMarkIcon class="size-6 text-white" />
        </button>
        <span class="hidden lg:inline-flex">|</span>

        <!-- 導覽項目
         使用 <template v-for> 包裹 <div> + <span>，才能渲染多個元素 -->
        <template v-for="(link, index) in routerLinks" :key="link.name">
          <div class="w-full text-center lg:w-auto">
            <RouterLink :to="link.path" @click="handleLinkClick" class="hover:text-primary-500 block py-2">
              {{ link.name }}
            </RouterLink>
          </div>

          <!-- 僅桌機顯示分隔線，且非最後一項 -->
          <span v-if="index !== routerLinks.length - 1" class="hidden lg:inline-flex">|</span>
        </template>
        <span class="hidden lg:inline-flex">|</span>

        <!-- 使用說明 -->
        <button
          class="hover:text-primary-500 block w-full py-2 text-center lg:w-auto"
          @click="
            () => {
              closeSidebar();
              openModal(PageConstInfo.UsageInstructions);
            }
          "
        >
          {{ PageConstInfo.UsageInstructions }}
        </button>
        <span class="hidden lg:inline-flex">|</span>
        <!-- 登出 -->
        <button
          class="hover:text-primary-500 block w-full py-2 text-center lg:w-auto"
          @click="
            () => {
              closeSidebar();
              isLogoutModalOpen = true;
            }
          "
        >
          登出
        </button>
        <span class="hidden lg:inline-flex">|</span>
      </div>
    </nav>
    <div
      v-show="isSidebarOpen"
      class="bg-opacity-50 fixed inset-0 z-40 bg-gray-200 lg:hidden"
      @click.prevent="closeSidebar"
    ></div>
    <span class="text-secondary-600 text-base font-bold lg:pe-4">王曉明委員 您好</span>
  </div>

  <!-- 說明文字 -->
  <StaticModal
    :is-modal-open="isModalOpen"
    @click.prevent="isModalOpen = false"
    :title="PageConstInfo.UsageInstructions"
  >
    <template #modalBody>
      <ol class="text-secondary-600 mx-4 list-decimal space-y-2">
        <li>系統目的：本系統專為調查、排定委員方便出席環評會 議之時段而製作。</li>
        <li>
          系統平台：本系統可在主流作業系統(較新版本)之桌上
          型電腦、筆記電腦、平版電腦、智慧型手機上運作，委員可視個人習慣及喜好自由選擇操作平台。
        </li>
        <li>
          填寫要領：各項調查功能在調查截止日期後會自動從系統移除，移除前均屬調查進行中，此時委員可視實際情況自由更新調查資料。
        </li>
        <li>其它：本系統中各項會議之開會時間屬預定性質，確定 之開會時間以正式公文通知為準。</li>
      </ol>
    </template>
  </StaticModal>

  <!-- 登出modal -->
  <StaticModal
    :is-has-title="false"
    :is-has-btn="true"
    :is-modal-open="isLogoutModalOpen"
    @click.prevent="isLogoutModalOpen = false"
    title="確認登出"
    width-class="max-w-xs"
    padding-class="p-2 md:p-3"
  >
    <template #modalBody>
      <p class="text-secondary-700 text-lg">您確定要登出嗎？</p>
    </template>
    <template #modalFooter>
      <div class="flex justify-end space-x-4">
        <button type="button" class="btn btn-primary" @click="confirmLogout">確認</button>
        <button type="button" class="btn btn-secondary" @click="isLogoutModalOpen = false">取消</button>
      </div>
    </template>
  </StaticModal>
</template>
<style scoped>
@media only screen and (min-width: 200px) {
  .parent:hover .child {
    opacity: 1;
    height: auto;
    overflow: none;
    transform: translateY(0);
  }
  .child {
    opacity: 0;
    height: 0;
    overflow: hidden;
    transform: translateY(-10%);
  }
}
.title-white-shadow {
  text-shadow:
    2px 2px white,
    -2px -2px white,
    2px -2px white,
    -2px 2px white;
}
</style>
