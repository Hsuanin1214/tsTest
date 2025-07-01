# TooltipWrapper.vue 說明文件

此元件為一個簡易的 Tooltip 容器元件，可根據使用者裝置（桌機或手機）自動調整 Tooltip 的顯示位置，並提供彈性設定背景樣式、文字樣式與動畫效果。

## 功能簡述

- 根據使用者裝置（desktop / mobile）動態顯示不同位置的 Tooltip。
- 支援 top / bottom / left / right 四種顯示位置。
- 可自訂 Tooltip 的背景顏色、文字顏色與過渡動畫。
- 使用 `<slot />` 傳入顯示內容，彈性高。

---

## Props 說明

| Prop 名稱         | 類型     | 預設值                      | 說明                                             |
| ----------------- | -------- | --------------------------- | ------------------------------------------------ |
| `deskPosition`    | `String` | `'bottom'`                  | 桌機版 Tooltip 顯示位置（top/bottom/left/right） |
| `mobilePosition`  | `String` | `'left'`                    | 手機版 Tooltip 顯示位置（top/bottom/left/right） |
| `bgClass`         | `String` | `'bg-gray-700'`             | Tooltip 背景樣式的 Tailwind CSS 類別             |
| `textClass`       | `String` | `'text-white'`              | Tooltip 文字樣式的 Tailwind CSS 類別             |
| `transitionClass` | `String` | `'transition duration-200'` | Tooltip 顯示與隱藏的過渡動畫樣式                 |

---

## 自適應顯示位置

本元件透過 Composable 的 `isDesktop` 判斷當前裝置為桌機或手機，並依據 `deskPosition` 或 `mobilePosition` 決定 Tooltip 的顯示位置。

---

## 使用方式

```vue
<TooltipWrapper deskPosition="top" mobilePosition="right" bgClass="bg-black" textClass="text-yellow-300">
  這是提示內容
</TooltipWrapper>
```
