/**
 * 独立服务器入口
 * 不使用 fastify-cli，避免超时和进程管理问题
 */
import Fastify from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import AutoLoad from "@fastify/autoload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true,
  // 禁用请求超时，让 Puppeteer 有足够时间处理
  requestTimeout: 0,
  // 关闭 keep-alive 超时
  keepAliveTimeout: 0,
});

// 注册插件
fastify.register(AutoLoad, {
  dir: path.join(__dirname, "plugins"),
  options: {},
});

// 注册路由
fastify.register(AutoLoad, {
  dir: path.join(__dirname, "routes"),
  options: {},
});

// 启动服务
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port, host });
    console.log(`Server running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// 优雅关闭
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}, shutting down gracefully...`);
  try {
    await fastify.close();
    console.log("Server closed");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

start();
