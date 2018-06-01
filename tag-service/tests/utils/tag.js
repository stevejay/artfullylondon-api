export function createId() {
  const NS_PER_SEC = 1e9;
  const time = process.hrtime();
  return `${time[0] * NS_PER_SEC + time[1]}`;
}
