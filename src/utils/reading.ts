import { site } from "../site.config";

/**
 * 计算中英文混合内容的字数和阅读时间
 * 中文按字符数计算，英文按单词数计算
 */
export function getReadingStats(body: string) {
  const text = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/[#*_~>\-|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const englishText = text.replace(/[一-鿿]/g, "");
  const englishWords = englishText.split(/\s+/).filter(Boolean).length;

  const totalChars = chineseChars + englishWords;
  const readingTime = Math.max(
    1,
    Math.ceil(chineseChars / site.reading.zhWpm + englishWords / site.reading.enWpm),
  );

  return { wordCount: totalChars, readingTime };
}
