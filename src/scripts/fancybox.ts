import { Fancybox } from "@fancyapps/ui";

export function initFancybox() {
  Fancybox.bind(".prose img", {
    groupAll: true,
    backdropClick: "close",

    Carousel: {
      transition: "fade",
      Thumbs: { type: "modern", showOnStart: true },
      Toolbar: {
        display: {
          left: ["counter"],
          middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW"],
          right: ["autoplay", "thumbs", "close"],
        },
      },
    },
  });
}

export function destroyFancybox() {
  Fancybox.destroy();
}
