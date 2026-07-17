import config from "../config/config.js";

const isLocalhostUrl = (url = "") =>
  /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

export const resolveBackendUrl = (req) => {
  const configured = String(config.backendUrl || "")
    .trim()
    .replace(/\/$/, "");

  if (configured && !isLocalhostUrl(configured)) {
    return configured;
  }

  if (req) {
    const forwardedProto = req.headers["x-forwarded-proto"];
    const forwardedHost = req.headers["x-forwarded-host"];
    const host = forwardedHost || req.headers.host;

    if (host && !isLocalhostUrl(host)) {
      const proto =
        forwardedProto?.split(",")[0]?.trim() || req.protocol || "http";
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  }

  return configured || "http://localhost:4000";
};
