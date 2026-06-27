import type { ImageMetadata } from "astro";

/**
 * 根据 frontmatter 中的图片路径解析为实际的 ImageMetadata
 * 自动处理不同目录层级的路径差异
 */
export function resolveImage(
  imagePath: string | undefined,
  modules: Record<string, { default: ImageMetadata }>
): ImageMetadata | undefined {
  if (!imagePath) return undefined;

  // 1. 精确匹配
  if (modules[imagePath]) return modules[imagePath].default;

  // 2. 按文件名模糊匹配（处理不同相对路径的情况）
  const fileName = imagePath.split("/").pop();
  if (fileName) {
    const match = Object.entries(modules).find(([key]) =>
      key.endsWith(`/${fileName}`)
    );
    if (match) return match[1].default;
  }

  return undefined;
}
