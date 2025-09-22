import YAML from "yamljs";
import path from "path";
import { requireEnv } from "@/utils";

const PORT = requireEnv("API_PORT");

const swaggerDocument = YAML.load(path.join(process.cwd(), "swagger.yml"));

swaggerDocument.servers[0].url = `http://localhost:${PORT}/api`;

export const swaggerConfig = {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "API Builder Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
  },
};

export const swaggerSpec = swaggerDocument;
