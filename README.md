# Rectangle Animation App

## 開發筆記

### 主要元件：`GeometricShape.vue`

呈現 `SVG` 動畫的元件，主要使用屬性 `stroke-dasharray` 和 `stroke-dashoffset` 搭配元素`<animate>`來處理走線動畫的呈現。

### 目前的問題點

1. （已解決）~~使用 svg 自動縮放，線框很明顯與範例有落差，原因在於在相同的 `viewBox` 下，`stroke-width` 也會跟著縮放，並不會像一般元素的 `border-width: 2px` 會固定在某個像素。~~

2. （已解決）~~切換數量後，新增出來的矩形動畫，會與原本矩形動畫不同步，原因在於原本在畫面上的矩形動畫，不會因為新增了其他的矩形動畫而重新執行動畫，而是持續進行自己的循環。~~

3. `GeometricShape.vue` 使用 `props.chunk` 來控制動畫重啟，這樣忽略了「隨機 → 全部的切換」的這個變因，後續要播放的矩形動畫，會與原本正在跑的矩形動畫不同步。

## 參考資料

[SVG attrs: stroke-dasharray](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray)

[SVG attrs: stroke-dashoffset](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dashoffset)

[SVG Animate: begin](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/begin)

[SVG SVGAnimationElement](https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimationElement)
