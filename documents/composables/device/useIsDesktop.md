### 使用範例

- 使用檔案，可參考 \src\components\uiComponents\Pagination\PaginationComponent.vue
- 使用頁面，/memberDynamicSettings
- 說明：

  - 監聽裝置螢幕寬度
  - 可直接取 `isDesktop` 這個值使用，會是 true 或 false
  - 目前預設斷點是 575

### 外層使用

```javascript
import { useIsDesktop } from '@/composables/device/useIsDesktop';

const { isDesktop } = useIsDesktop();

console.log(isDesktop); // true 或 false
```
