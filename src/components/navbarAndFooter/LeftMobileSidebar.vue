<script setup>
import { ref } from 'vue';
import { XCircleIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/solid';
import SwitchLinkType from './SwitchLinkType.vue';

const props = defineProps({
  nav: {
    type: Array,
    required: true
  }
});

const isOpenSidebar = ref(false);
const openSubmenus = ref({}); // 儲存展開的子選單狀態

const toggleSidebar = () => {
  isOpenSidebar.value = !isOpenSidebar.value;
};

const toggleSubmenu = name => {
  openSubmenus.value[name] = !openSubmenus.value[name];
};
</script>
<template>
  <div>
    <div>
      <button
        type="button"
        class="bg-primary-500 hover:bg-primary-600 flex items-center gap-1 rounded-lg px-2 py-2 text-white"
        @click="toggleSidebar"
      >
        <div class="h-4 w-4">
          <img src="@/assets/images/icons/open_side_bar_icon.svg" alt="" />
        </div>

        <p>子選單</p>
      </button>
    </div>

    <nav>
      <div
        :class="['fixed top-0 left-0 z-20 h-screen w-screen bg-black opacity-40', { hidden: !isOpenSidebar }]"
        @click="toggleSidebar"
      ></div>
      <div
        :class="[
          'fixed top-0 z-20 h-full w-80 bg-gray-200 p-4 transition-all duration-300',
          isOpenSidebar ? 'left-0' : '-left-80'
        ]"
      >
        <div class="px-4 text-left">
          <button type="button" @click="toggleSidebar">
            <XCircleIcon class="text-primary-500 hover:text-primary-600 size-11" />
          </button>
        </div>
        <div class="flex h-[calc(100%-60px)] flex-col justify-between">
          <ul class="px-3">
            <li v-for="item in props.nav" :key="item.name">
              <!-- 若有子選單 -->
              <div v-if="item.children">
                <!-- 主項目按鈕 -->
                <button
                  class="hover:bg-primary-300 flex w-full items-center rounded-xl px-5 py-3 text-left font-bold hover:text-white"
                  @click="toggleSubmenu(item.name)"
                >
                  <span>{{ item.name }}</span>
                  <span class="ml-2">
                    <ChevronDownIcon v-if="!openSubmenus[item.name]" class="h-5 w-5 transition-colors duration-200" />
                    <ChevronUpIcon v-else class="h-5 w-5 transition-colors duration-200" />
                  </span>
                </button>
                <!-- 子項目列 -->
                <ul v-show="openSubmenus[item.name]" class="ml-4 space-y-1">
                  <li v-for="child in item.children" :key="child.name">
                    <SwitchLinkType
                      :nav="child"
                      class="hover:bg-primary-300 text-primary-500 block w-full rounded-lg px-5 py-2 font-bold hover:text-white"
                    />
                  </li>
                </ul>
              </div>

              <!-- 若無子選單 -->
              <div v-else>
                <SwitchLinkType
                  :nav="item"
                  class="hover:bg-primary-300 inline-block w-full rounded-xl px-5 py-3 font-bold hover:text-white"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
