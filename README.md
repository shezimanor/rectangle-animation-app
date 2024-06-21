# Rectangle Animation App

## 開發筆記

### 主要元件：`GeometricShape.vue`

呈現 `SVG` 動畫的元件，主要使用屬性 `stroke-dasharray` 和 `stroke-dashoffset` 搭配元素`<animate>`來處理走線動畫的呈現。

### 目前的問題點

1. （已解決）~~使用 svg 自動縮放，線框很明顯與範例有落差，原因在於在相同的 `viewBox` 下，`stroke-width` 也會跟著縮放，並不會像一般元素的 `border-width: 2px` 會固定在某個像素。~~

2. （已解決）~~畫面發生變化時（不論變因是什麼），必須要增加額外的控制讓原本在畫面上正在播放的走線動畫重啟。目前的變因有兩個：第一個是走線動畫圖形數量；第二個是全部與隨機播放的切換。~~

### 走線動畫狀態變化情境矩陣

從下表得知，因為 `true`->`true` 無法被 `watch()` 偵聽，所以必須另外找其他方式來處發元件動畫事件：使用 `defineExpose()` 暴露方法提供父層元件使用，由父層的 `watch()` 來觸發。

| 情境                                  |                                                   狀態變化                                                   | 元件動畫事件                                                                                  |                            觸發方式                             |
| :------------------------------------ | :----------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------- | :-------------------------------------------------------------: |
| 圖形數量（少->多）<br/>模式：全部播放 |                                        `true`->`true`<br/>`x`->`true`                                        | `beginElement()`<br/>`beginElement()`                                                         |                   parent watcher<br/>watcher                    |
| 圖形數量（少->多）<br/>模式：隨機播放 | `true`->`true`<br/>`false`->`true`<br/>`true`->`fasle`<br/>`false`->`fasle`<br/>`x`->`true`<br/>`x`->`false` | `beginElement()`<br/>`beginElement()`<br/>`endElement()`<br/>`x`<br/>`beginElement()`<br/>`x` | parent watcher<br/>watcher<br/>watcher<br/>x <br/>watcher<br/>x |
| 圖形數量（多->少）<br/>模式：全部播放 |                                        `true`->`true`<br/>`true`->`x`                                        | `beginElement()`<br/>`x`                                                                      |                      parent watcher<br/>x                       |
| 圖形數量（多->少）<br/>模式：隨機播放 | `true`->`true`<br/>`false`->`true`<br/>`true`->`false`<br/>`false`->`false`<br/>`true`->`x`<br/>`false`->`x` | `beginElement()`<br/>`beginElement()`<br/>`endElement()`<br/>`x`<br/>`x`<br/>`x`              |    parent watcher<br/>watcher<br/>watcher<br/>x<br/>x<br/>x     |
| 模式（全部->隨機）<br/>數量不變       |                                      `true`->`true`<br/>`false`->`true`                                      | `beginElement()`<br/>`beginElement()`                                                         |                   parent watcher<br/>watcher                    |
| 模式（隨機->全部）<br/>數量不變       |                                      `true`->`true`<br/>`true`->`false`                                      | `beginElement()`<br/>`endElement()`                                                           |                   parent watcher<br/>watcher                    |

## 參考資料

[SVG attrs: stroke-dasharray](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray)

[SVG attrs: stroke-dashoffset](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dashoffset)

[SVG Animate: begin](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/begin)

[SVG SVGAnimationElement](https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimationElement)

[Vue3: Refs inside v-for​](https://vuejs.org/guide/essentials/template-refs.html#refs-inside-v-for)
