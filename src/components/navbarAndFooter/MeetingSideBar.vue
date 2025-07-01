<script setup>
import { ref } from 'vue';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/solid';
import AccessibilityGuild from '@/components/uiComponents/AccessibilityGuild/AccessibilityGuild.vue';
import LeftMobileSidebar from './LeftMobileSidebar.vue';
import SwitchLinkType from './SwitchLinkType.vue';

const sidebar = [
  {
    name: '會議出席調查',
    title: '前往會議出席調查',
    link: '/meetingAttendanceSurvey',
    linkType: 'RouterLink',
    target: '_self'
  },
  {
    name: '會議行程表',
    title: '前往會議行程表',
    link: '/meetingSchedule',
    linkType: 'RouterLink',
    target: '_self'
  },
  {
    name: '意見上傳',
    title: '前往意見上傳',
    link: '/opinionUpload',
    linkType: 'RouterLink',
    target: '_self'
  },
  {
    name: '委員動態設定',
    title: '前往委員動態設定',
    link: '/memberDynamicSettings',
    linkType: 'RouterLink',
    target: '_self'
  }
];

const openSubmenus = ref({});

// 切換收合狀態
const toggleSubmenu = name => {
  openSubmenus.value[name] = !openSubmenus.value[name];
};
</script>
<template>
  <div>
    <AccessibilityGuild position="center" class="sr-only" />
    <nav class="hidden lg:block lg:min-w-[15.5rem] lg:flex-shrink-0">
      <h2 v-for="item in sidebar" :key="item.name">
        <!-- 若有子選單 -->
        <div v-if="item.children">
          <!-- 主選單：可點擊收合 -->
          <button
            type="button"
            class="bg-primary-500 hover:bg-primary-600 flex w-full items-center justify-between border-b-2 border-emerald-50 px-4 py-3 text-left text-lg font-bold text-emerald-50"
            @click="toggleSubmenu(item.name)"
          >
            <span>{{ item.name }}</span>
            <span>
              <ChevronDownIcon v-if="!openSubmenus[item.name]" class="h-5 w-5 transition-colors duration-200" />
              <ChevronUpIcon v-else class="h-5 w-5 transition-colors duration-200" />
            </span>
          </button>

          <!-- 子選單 -->
          <div v-show="openSubmenus[item.name]">
            <div v-for="child in item.children" :key="child.name">
              <SwitchLinkType
                :nav="child"
                class="hover:text-primary-600 inline-block w-full border-b-2 border-emerald-100 bg-zinc-100 px-4 py-2 text-base font-bold hover:bg-zinc-300"
              />
            </div>
          </div>
        </div>

        <!-- 若沒有子選單 -->
        <SwitchLinkType
          v-else
          :nav="item"
          class="bg-primary-500 hover:bg-primary-600 inline-block w-full border-b-2 border-emerald-50 px-4 py-3 text-lg font-bold text-emerald-50"
        />
      </h2>
    </nav>
    <!-- 手機版子選單 -->
    <div class="block lg:hidden">
      <LeftMobileSidebar :nav="sidebar" />
    </div>
  </div>
</template>
