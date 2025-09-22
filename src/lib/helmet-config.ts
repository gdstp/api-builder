import helmet, { HelmetOptions } from "helmet";

export default function setupHelmetConfig() {
  const defaultConfig: HelmetOptions = {
    hidePoweredBy: true,
    frameguard: { action: "deny" },
    noSniff: true,
    contentSecurityPolicy: false,
  };

  if (process.env.NODE_ENV === "production") {
    defaultConfig.hsts = {
      maxAge: 60 * 60 * 24 * 365,
      includeSubDomains: true,
      preload: true,
    };
    defaultConfig.referrerPolicy = { policy: "no-referrer" };
  }

  return helmet(defaultConfig);
}
