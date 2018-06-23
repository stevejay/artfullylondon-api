import delay from "delay";

export default async function(startTime, minMs) {
  if (minMs > 1000) {
    throw new Error("minMs cannot be greater than 1000");
  }

  const elapsedTime = process.hrtime(startTime);

  if (elapsedTime[0] < 1) {
    const elapsedMs = Math.floor(elapsedTime[1] / 1000000);

    if (elapsedMs < minMs) {
      await delay(minMs - elapsedMs);
    }
  }
}
