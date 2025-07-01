# 表格，會搭配 BaseColumn 使用

## 使用位置

- 使用檔案，可參考 src\components\Pages\Dashboard\Air\RegularInfo\AirPollutionPetition.vue

- 使用頁面 /dashboard/airInfo 空儀表板內

## 功能說明

### BaseTable

- Props 使用
  - `thead`：表格標頭，格式為陣列包物件，物件內有兩個屬性，一為中文顯示名稱、一為使用 API 的屬性名稱
  - `tbody`：表格資料來源，為物件陣列
  - `showTooltip` 為 `true` 的時候，就是設定哪一欄要顯示 tooltip，同時會在文字過長時變成截斷文字。當有截斷文字的時候，要搭配 BaseColumn 的 `:info=""` 使用，傳入該欄資料才有辦法顯示出 tooltip
  - `selected-row-id` 是使用者選擇的橫欄的 id
- 插槽使用
  - 透過 v-slot="{ key1, key2, ... }" 的方式取得欄位值，用於渲染對應的 BaseColumn
- Emit 事件
  - `@row-click` 可以自訂方法，是點擊橫欄 (點擊 <tr></tr>) 要做事的方法

### BaseColumn

- 也有插槽
- 使用 BaseColumn 來決定要顯示哪幾個資料欄位，不需要 API 傳來的都全部顯示 (tbody 傳入的資料可能有五個屬性，但實際上只會顯示三個，那就會用到三個 BaseColumn)
- 可設定 `custom-class` 來設定 column 寬度，基本上都會傳入 `w-*` 或是其他樣式，傳入 tailwind css 樣式，或是自訂 class
- 若使用 showTooltip，需傳入 :info（對應顯示內容）以啟用 Tooltip 功能

## 使用範例

外層使用

```javascript
/** 表格標頭 */
const thead = [
  {
    name: '時間',
    attrName: 'time'
  },
  {
    name: '地點',
    attrName: 'address'
  },
  {
    name: '狀態',
    attrName: 'state'
  }
];
```

```html
<BaseTable
  :thead="thead"
  :tbody="petitionAndFireStore.adjustPetitionData"
  v-slot="{ time, address, state }"
  @row-click="petitionAndFireStore.recordAirPollutantLocation"
  :selected-row-id="petitionAndFireStore.selectedLocation.id"
>
  <BaseColumn :custom-class="['max-w-[100px] text-center']">{{ time }}</BaseColumn>
  <BaseColumn custom-class="max-w-[180px] " showTooltip :info="address"> {{ address }} </BaseColumn>
  <BaseColumn custom-class="max-w-[100px]  text-center ">{{ state }}</BaseColumn>
</BaseTable>
```

## 元件參數說明

### Props

| 名稱            | 型別   | 必填 | 預設值 | 說明                                      |
| --------------- | ------ | ---- | ------ | ----------------------------------------- |
| `thead`         | Array  | ✅   | -      | 表格標頭，例如 `['時間', '地點', '狀態']` |
| `tbody`         | Array  | ✅   | -      | 表格資料，物件陣列格式                    |
| `selectedRowId` | String | ❌   | `''`   | 目前選擇的列 ID，用於高亮或選取控制       |

```javascript
const props = defineProps({
  thead: {
    type: Array, // 格式像 ['時間', '地點', '狀態']
    required: true
  },
  tbody: {
    type: Array,
    required: true
  },
  /** 目前選擇的欄位 id */
  selectedRowId: {
    type: String,
    default: ''
  }
});
```

### Emit

| 名稱        | 說明                             |
| ----------- | -------------------------------- |
| `row-click` | 點擊表格列（`<tr>`）時觸發的事件 |

```javascript
const emit = defineEmits(['row-click']);
```
