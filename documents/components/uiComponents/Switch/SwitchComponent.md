# 滑動選項按鈕元件

## 此為選項切換按鈕列，支援滑動效果指示目前選擇，並進行狀態與樣式控制。適合應用於表單選項、分類選單等 UI 場景。

## 外部使用範例

### Options 設定

```js
const meetingStatusOptions = [
  { label: '未填寫', value: 0 },
  { label: '出席', value: 1 },
  { label: '不出席', value: 2 }
];
```

### 元件使用方式

```html
<div>
  <label class="mb-4 font-semibold md:mb-0">是否出席：</label>
  <div class="w-3/5">
    <SwitchComponent v-model="meeting.isAttend" bg-class="md:bg-white bg-gray-50" :options="meetingStatusOptions" />
  </div>
</div>
```

---

## Props

| 名稱         | 型別   | 預設值       | 說明                                     |
| ------------ | ------ | ------------ | ---------------------------------------- |
| `options`    | Array  | 無（必填）   | 按鈕選項陣列，格式：`[{ label, value }]` |
| `modelValue` | Number | `1`          | 綁定當前選中項目的值                     |
| `bgClass`    | String | `'bg-white'` | 最外層容器的背景樣式類別                 |

---

## Emits

| 名稱                | 說明                                     |
| ------------------- | ---------------------------------------- |
| `update:modelValue` | 當使用者點擊按鈕時觸發，回傳對應的 value |

---

## Composition API 說明

| 變數 / 函式         | 說明                                   |
| ------------------- | -------------------------------------- |
| `buttons`           | 存放所有按鈕的 DOM 節點（透過 `ref`）  |
| `buttonContainer`   | 包覆按鈕的容器 DOM 節點（`ref`）       |
| `activeIndex`       | 計算當前被選取選項的索引值             |
| `onClick(value)`    | 點擊按鈕時更新 `modelValue`            |
| `isActive(value)`   | 判斷按鈕是否為當前選中項目             |
| `sliderStyle`       | 控制滑動底色的位置與寬度               |
| `updateSlider()`    | 根據目前選中按鈕的位置更新滑動底色樣式 |
| `onMounted()`       | 元件掛載後初始化滑動底色位置           |
| `watch(modelValue)` | 當選中項目變更時重新計算滑動底色位置   |

---

## Template 結構說明

```html
<div :class="[bgClass, 'flex w-full flex-col ...']">
  <div ref="buttonContainer" class="relative flex h-14 ... ...">
    <!-- 滑動底色區塊 -->
    <div class="bg-primary-500 absolute h-10 rounded-full transition-all duration-300" :style="sliderStyle"></div>

    <!-- 動態渲染選項按鈕 -->
    <button
      v-for="item in props.options"
      :key="item.value"
      ref="buttons"
      class="z-10 flex h-10 w-full items-center justify-center ..."
      :class="isActive(item.value) ? 'text-white' : 'hover:bg-gray-100'"
      @click.prevent="onClick(item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</div>
```

### 視覺效果

- 使用 `sliderStyle` 控制的背景滑動條會根據使用者所選選項移動與變寬。
- 被選中的按鈕會有 `text-white` 樣式，未選中則具備 hover 效果。

---

## 注意事項

- 每個選項的 `value` 應具有唯一性。
- 使用 `ref="buttons"` 搭配 `v-for` 需要小心，Vue 會自動將該 `ref` 收集為陣列，便於後續操作。
- 若容器寬度變動（如響應式設計），需確保能重新呼叫 `updateSlider()` 以重計位置。
  """
