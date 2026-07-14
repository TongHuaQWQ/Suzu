import { Fancybox } from "@fancyapps/ui";

export { Fancybox };

export function initFancybox() {
  // 文章图片
  Fancybox.bind(".prose img", {
    groupAll: true,
    backdropClick: "close",
    Carousel: { transition: "fade" },
    Thumbs: { type: "modern", showOnStart: true },
    Toolbar: {
      display: {
        left: ["counter"],
        middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW"],
        right: ["autoplay", "thumbs", "close"],
      },
    },
  });

  // 相册照片
  Fancybox.bind("[data-fancybox]", {
    groupAll: true,
    backdropClick: "close",
    Carousel: { transition: "fade" },
    Thumbs: { type: "modern", showOnStart: true },
    Toolbar: {
      display: {
        left: ["counter"],
        middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW"],
        right: ["slideshow", "thumbs", "close"],
      },
    },
  });
}

export function destroyFancybox() {
  Fancybox.destroy();
}
