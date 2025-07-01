import { createRouter, createWebHistory } from 'vue-router';
import BeforeLoginLayout from '@/views/BaseLayout/BeforeLoginLayout.vue';
import MeetingLayout from '@/views/BaseLayout/MeetingLayout.vue';
import LoginPage from '@/views/Authentication/LoginPage.vue';

const envName = {
  title: import.meta.env.VITE_APP_TITLE
  // url: import.meta.env.BASE_URL,
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BeforeLoginLayout,
      children: [
        {
          path: '',
          name: '',
          component: LoginPage,
          meta: {
            requiresAuth: false,
            title: `${envName.title}－登入`
          }
        },
        {
          path: '/forgetPassword',
          name: 'forgetPassword',
          component: () => import('@/views/Authentication/ForgetPassword.vue'),
          meta: {
            // requiresAuth: false,
            title: `${envName.title}－忘記密碼`
          }
        }
      ]
    },
    {
      path: '/meeting',
      name: 'meeting',
      // meta: { requiresAuth: true, role: 'agency' },
      component: MeetingLayout,
      children: [
        {
          path: '/homePage',
          component: () => import('@/views/Meeting/HomePage.vue'),
          name: 'homePage',
          meta: {
            title: `${envName.title}－首頁`
          }
        },
        {
          path: '/meetingNoticeList',
          component: () => import('@/views/Meeting/MeetingNoticeList.vue'),
          name: 'meetingNoticeList',
          meta: {
            title: `${envName.title}－會議通知清單`,
            breadCrumbs: [
              {
                text: '首頁',
                to: { name: '' }
              },
              {
                text: '會議通知',
                to: { name: 'meetingNoticeList' }
              }
            ]
          }
        },
        {
          path: '/meetingAttendanceSurvey',
          component: () => import('@/views/Meeting/MeetingAttendanceSurvey.vue'),
          name: 'meetingAttendanceSurvey',
          meta: {
            title: `${envName.title}－會議出席調查`,
            breadCrumbs: [
              {
                text: '首頁',
                to: { name: '' }
              },
              {
                text: '會議出席調查',
                to: { name: 'meetingAttendanceSurvey' }
              }
            ]
          }
        },
        {
          path: '/meetingSurveyDetail/:id', // 加上動態參數 :id
          component: () => import('@/components/pages/MeetingSurvey/MeetingSurveyDetail.vue'),
          name: 'meetingSurveyDetail',
          meta: {
            title: `${envName.title}－會議出席調查詳細資料`,
            breadCrumbs: [
              {
                text: '首頁',
                to: { name: '' }
              },
              {
                text: '會議出席調查',
                to: { name: 'meetingAttendanceSurvey' }
              },
              {
                text: '會議出席調查詳細資料',
                to: { name: 'meetingSurveyDetail' }
              }
            ]
          }
        },
        {
          path: '/meetingSchedule',
          component: () => import('@/views/Meeting/MeetingSchedule.vue'),
          name: 'meetingSchedule',
          meta: {
            title: `${envName.title}－會議行程表`,
            breadCrumbs: [
              {
                text: '首頁',
                to: { name: '' }
              },
              {
                text: '會議行程表',
                to: { name: 'meetingSchedule' }
              }
            ]
          }
        },
        {
          path: '/opinionUpload',
          component: () => import('@/views/Meeting/OpinionUpload.vue'),
          name: 'opinionUpload',
          meta: {
            title: `${envName.title}－意見上傳`,
            breadCrumbs: [
              {
                text: '首頁',
                to: { name: '' }
              },
              {
                text: '意見上傳',
                to: { name: 'opinionUpload' }
              }
            ]
          }
        },
        {
          path: '/memberDynamicSettings',
          component: () => import('@/views/Meeting/MemberDynamicSettings.vue'),
          name: 'memberDynamicSettings',
          meta: {
            title: `${envName.title}－委員動態設定`,
            breadCrumbs: [
              {
                text: '首頁',
                to: { name: '' }
              },
              {
                text: '委員動態設定',
                to: { name: 'memberDynamicSettings' }
              }
            ]
          }
        },
        {
          path: '/personInformation',
          component: () => import('@/views/User/PersonInformation.vue'),
          name: 'personInformation',
          meta: {
            title: `${envName.title}－個人資料`,
            breadCrumbs: [
              {
                text: '首頁',
                to: { name: '' }
              },
              {
                text: '個人資料',
                to: { name: 'personInformation' }
              }
            ]
          }
        },
        {
          path: '/changePassword',
          component: () => import('@/views/User/ChangePassword.vue'),
          name: 'changePassword',
          meta: {
            title: `${envName.title}－重設密碼`,
            breadCrumbs: [
              {
                text: '首頁',
                to: { name: '' }
              },
              {
                text: '重設密碼',
                to: { name: 'changePassword' }
              }
            ]
          }
        }
        // {
        //   path: '/userFeedback',
        //   component: () => import('@/views/User/UserFeedback.vue'),
        //   name: 'userFeedback',
        //   meta: {
        //     title: `${envName.title}－系統意見投書`,
        //     breadCrumbs: [
        //       {
        //         text: '首頁',
        //         to: { name: '' }
        //       },
        //       {
        //         text: '系統意見投書',
        //         to: { name: 'userFeedback' }
        //       }
        //     ]
        //   }
        // }
      ]
    }
  ]
});

export default router;
