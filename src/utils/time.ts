/**
 * 计算距离发布时间的详细描述
 * 例：1 年 6 个月 20 天 21 时 54 分 38 秒
 */
export function getDetailedTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  let diffMs = Math.abs(now.getTime() - date.getTime());

  const sec = Math.floor(diffMs / 1000) % 60;
  diffMs -= sec * 1000;
  const min = Math.floor(diffMs / 60000) % 60;
  diffMs -= min * 60000;
  const hour = Math.floor(diffMs / 3600000) % 24;
  diffMs -= hour * 3600000;
  const day = Math.floor(diffMs / 86400000) % 30;
  const totalDays = Math.floor(Math.abs(now.getTime() - date.getTime()) / 86400000);
  const month = Math.floor(totalDays / 30) % 12;
  const year = Math.floor(totalDays / 365);

  const parts: string[] = [];
  if (year > 0) parts.push(`${year} 年`);
  if (month > 0) parts.push(`${month} 个月`);
  if (day > 0) parts.push(`${day} 天`);
  if (hour > 0) parts.push(`${hour} 时`);
  if (min > 0) parts.push(`${min} 分`);
  if (sec > 0 || parts.length === 0) parts.push(`${sec} 秒`);

  return parts.join(" ");
}
