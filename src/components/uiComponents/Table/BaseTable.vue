<script setup>
const props = defineProps({
  thead: {
    type: Array, // [{name: '時間',attrName: 'time'},
    required: true
  },
  tbody: {
    type: Array,
    required: true
  },
  /** 目前選擇的欄位 id */
  selectedRowId: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['row-click']);
const handleRowClick = rowData => {
  emit('row-click', rowData);
};
</script>

<template>
  <div>
    <div>
      <!-- 電腦版 table -->
      <div class="hidden md:block">
        <table class="w-full table-auto border-collapse">
          <thead class="bg-secondary-600 text-white">
            <tr>
              <th
                v-for="head in props.thead"
                :key="head.attrName"
                class="border-secondary-200 border px-4 py-2 text-center font-bold"
              >
                <slot name="thead" :head="head">
                  {{ head.name }}
                </slot>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in props.tbody"
              :key="row.id"
              class="hover:bg-secondary-100 cursor-pointer"
              :class="{ 'text-primary-600': row.id === props.selectedRowId }"
              @click="handleRowClick(row)"
            >
              <td
                v-for="head in props.thead"
                :key="head.attrName"
                class="border-secondary-200 border px-4 py-2 text-start"
              >
                <slot :row="row" :index="index" :head="head" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 手機版卡片 -->
      <div class="block space-y-4 md:hidden">
        <!-- 處理需多選的欄位 -->
        <div class="mb-2">
          <slot name="mobile-header" />
        </div>
        <div
          v-for="(row, index) in props.tbody"
          :key="row.id"
          class="border-secondary-500 cursor-pointer rounded-lg border p-4 shadow-sm"
          :class="[row.id === props.selectedRowId ? 'bg-primary-100 text-primary-700' : '', 'hover:bg-secondary-100']"
          @click="handleRowClick(row)"
        >
          <div v-for="head in props.thead" :key="head.attrName" class="mb-4">
            <div class="text-secondary-600 text-lg font-bold">{{ head.name }}</div>
            <div>
              <slot :row="row" :index="index" :head="head" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
