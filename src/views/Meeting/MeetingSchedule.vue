<script setup>
import { ref } from 'vue';
import WhiteContainer from '@/components/uiComponents/WhiteContainer/WhiteContainer.vue';
import PageTitle from '@/components/uiComponents/PageTitle/PageTitle.vue';
import BaseButton from '@/components/uiComponents/Button/BaseButton.vue';
import MeetingScheduleList from '@/components/pages/MeetingSchedule/MeetingScheduleList.vue';
import MeetingCalendar from '@/components/pages/MeetingSchedule/MeetingCalendar.vue';

const currentView = ref('calendar');

const setView = view => {
  currentView.value = view;
};
</script>
<template>
  <WhiteContainer>
    <div class="flex flex-col items-start md:flex-row md:items-center md:justify-between">
      <PageTitle>會議行程表</PageTitle>
      <div class="flex justify-center">
        <BaseButton type="button" color="warning" title="行事曆" class="mb-2 ml-2" @click="setView('calendar')"
          >行事曆</BaseButton
        >
        <BaseButton type="button" color="primary" title="清單" class="mb-2 ml-2" @click="setView('list')"
          >清單</BaseButton
        >
      </div>
    </div>
    <section v-if="currentView === 'calendar'" class="mx-auto md:container md:px-4">
      <MeetingCalendar />
    </section>
    <section v-if="currentView === 'list'" class="container mx-auto px-4">
      <MeetingScheduleList />
    </section>
  </WhiteContainer>
</template>
