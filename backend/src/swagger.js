import swaggerJsDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "UCEats API",
      version: "1.0.0",
      description: "Official API documentation for the UCEats project.",
    },
    servers: [
      {
        url: "http://3.88.179.56:3000/api",
      },
    ],
  },

  apis: [`${path.join(__dirname, "./routes/*.js").replace(/\\/g, "/")}`],
};

export const swaggerSpec = swaggerJsDoc(options);