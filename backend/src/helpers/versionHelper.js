const parseVersion = (version) =>
  String(version || "0")
    .trim()
    .split(".")
    .map((part) => {
      const parsed = Number.parseInt(part, 10);
      return Number.isFinite(parsed) ? parsed : 0;
    });

export const compareAppVersions = (left, right) => {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftParts[index] || 0;
    const rightValue = rightParts[index] || 0;
    if (leftValue > rightValue) return 1;
    if (leftValue < rightValue) return -1;
  }

  return 0;
};

export const isAppVersionAtOrAbove = (userVersion, minVersion) =>
  compareAppVersions(userVersion, minVersion) >= 0;
