# AlertModal 元件說明文件

此 Vue 元件提供一個彈跳式的提示視窗，可根據不同類型顯示不同顏色與圖示，並具備遮罩點擊關閉、按鈕關閉等功能。此元件常用於錯誤提示、成功訊息、警告通知或資訊提示。

### 功能簡述

根據 type 類型顯示對應顏色與圖示（info、success、error、warning）

支援遮罩點擊關閉或強制常駐（maskClosable）

支援插槽自定義訊息內容

支援內建關閉按鈕或自定義按鈕

### Props 說明

| Prop 名稱      | 型別    | 說明                     | 預設值   |
| -------------- | ------- | ------------------------ | -------- |
| `type`         | String  | 提示框類型               | `'info'` |
| `message`      | String  | 預設訊息文字內容         | ''       |
| `maskClosable` | Boolean | 點擊遮罩是否可關閉視窗   | true     |
| `showButton`   | Boolean | 是否顯示底部「關閉」按鈕 | false    |

### Emits 說明

| 事件名稱 | 說明           |
| -------- | -------------- |
| close    | 關閉提示框事件 |

### 類型對應設定

type 對應樣式（alertStyle 計算屬性）

| 類型    | 邊框色             | 背景色 | 文字色             |
| ------- | ------------------ | ------ | ------------------ |
| info    | border-primary-550 | white  | text-secondary-600 |
| success | border-teal-500    | white  | text-secondary-600 |
| error   | border-error-500   | white  | text-secondary-600 |
| warning | border-warning-500 | white  | text-secondary-600 |

type 對應圖示（iconComponent 計算屬性）

| 類型    | 圖示元件                |
| ------- | ----------------------- |
| info    | `InformationCircleIcon` |
| success | `CheckCircleIcon`       |
| error   | `XCircleIcon`           |
| warning | `ExclamationCircleIcon` |

插槽說明

| 插槽名稱    | 說明                       |
| ----------- | -------------------------- |
| `alertBody` | （可選）自定義訊息顯示內容 |

若未使用插槽，則會顯示 `message`prop 所帶入的字串內容。

## 使用範例

### 基本用法

```html
<AlertModal type="success" message="資料儲存成功" @close="handleClose" />
```

### 使用插槽

```html
<AlertModal type="error" :maskClosable="false" @close="handleClose">
  <template #alertBody> 系統發生錯誤，請稍後再試。 </template>
</AlertModal>
```

### 顯示「關閉」按鈕

```html
<AlertModal type="warning" :showButton="true" @close="handleClose" />
```

### 結構摘要

```html
<div class="fixed inset-0 z-50 flex items-center justify-center">
  <!-- 遮罩 -->
  <div class="absolute inset-0 bg-gray-500 opacity-25" @click="maskClosable && emit('close')"></div>

  <!-- alert 本體 -->
  <div :class="alertStyle" class="...">
    <component :is="iconComponent" :class="iconColor" />
    <slot name="alertBody">{{ message }}</slot>
    <button v-if="showButton" @click="emit('close')">關閉</button>
    <button class="..." @click="emit('close')">&times;</button>
  </div>
</div>
```
