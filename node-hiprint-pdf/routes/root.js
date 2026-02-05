import PuppeteerHtmlExport from "../lib/puppeteer-html-export.js";
import browserPool from "../lib/browser-pool.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "..", "public");

// 单例复用，避免重复创建
const phe = new PuppeteerHtmlExport();

// 目录缓存，避免重复检查
const createdDirs = new Set();

const todayDir = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  const dir = path.join(publicPath, "files", today);

  // 使用缓存避免重复目录检查
  if (!createdDirs.has(dir)) {
    await fs.mkdir(dir, { recursive: true });
    createdDirs.add(dir);
  }
  return `files/${today}`;
};
const randomId = () => {
  return Date.now() + "-" + Math.random().toString(36).slice(2);
};

export default async function (fastify, opts) {
  // 健康检查
  fastify.get("/", async function (request, reply) {
    return { status: "ok", message: "node-hiprint-pdf service" };
  });

  // 浏览器池状态
  fastify.get("/status", async function (request, reply) {
    return {
      code: 200,
      msg: "ok",
      data: browserPool.getStatus()
    };
  });

  fastify.get("/template", async function (request, reply) {
    const cacheId = request.query.id;
    const value = await new Promise((resolve, reject) => {
      fastify.cacheman.get(cacheId, (err, value) => {
        if (err) throw err;
        resolve(value);
      });
    });
    if (value) {
      reply.send({ code: 200, msg: "ok", data: value });
    } else {
      reply.send({ code: 500, msg: "no cache", data: null });
    }
  });
  fastify.post("/img", async function (request, reply) {
    try {
      const data = request.body;
      const host = `${request.protocol}://${request.hostname}`;
      const baseUrl = `${host}/vue-plugin-hiprint/index.html`;

      console.log("data", data);

      // 更多参数见: https://pptr.dev/api/puppeteer.screenshotoptions
      const name = `/${await todayDir()}/${randomId()}.png`;
      const options = {
        fullPage: true,
        path: `${publicPath}${name}`,
        // 直接注入数据，跳过 HTTP 回环
        templateData: data,
        baseUrl: baseUrl,
        ...data.options,
      };
      if (data.noFile) {
        delete options.path;
      }
      console.log(options);
      const base64 = await phe.screenshot(null, options);
      const res = {
        code: 200,
        msg: "success",
        data: `${host}${name}`,
      };
      if (data.noFile) {
        res.data = `data:image/png;base64,${base64}`;
      }
      reply.send(res);
    } catch (error) {
      console.log("createImage error", error);
      reply.send({
        code: 500,
        msg: error.message || String(error),
        data: null,
      });
    }
    return;
  });
  fastify.post("/pdf", async function (request, reply) {
    try {
      const data = request.body;
      const host = `${request.protocol}://${request.hostname}`;
      const baseUrl = `${host}/vue-plugin-hiprint/index.html`;

      console.log("data", data);

      // 更多参数见: https://pptr.dev/api/puppeteer.pdfoptions
      const name = `/${await todayDir()}/${randomId()}.pdf`;
      const options = {
        path: `${publicPath}${name}`,
        // 直接注入数据，跳过 HTTP 回环
        templateData: data,
        baseUrl: baseUrl,
        ...data.options,
      };
      if (data.noFile) {
        delete options.path;
      }
      console.log(options);
      const buffer = await phe.createPdf(null, options);
      const res = {
        code: 200,
        msg: "success",
        data: `${host}${name}`,
      };
      if (data.noFile) {
        res.data = `data:application/pdf;base64,${buffer.toString("base64")}`;
      }
      reply.send(res);
    } catch (error) {
      console.log("createPdf error", error);
      reply.send({
        code: 500,
        msg: error.message || String(error),
        data: null,
      });
    }
  });
  fastify.post("/html", async function (request, reply) {
    try {
      const data = request.body;
      const host = `${request.protocol}://${request.hostname}`;
      const baseUrl = `${host}/vue-plugin-hiprint/index.html`;

      console.log("data", data);

      const name = `/${await todayDir()}/${randomId()}.html`;
      const options = {
        // 直接注入数据，跳过 HTTP 回环
        templateData: data,
        baseUrl: baseUrl,
        ...data.options,
      };
      console.log(options);
      const htmlContent = await phe.htmlContent(null, options);
      if (!data.noFile) {
        await fs.writeFile(`${publicPath}${name}`, htmlContent);
      }
      const res = {
        code: 200,
        msg: "success",
        data: `${htmlContent}`,
      };
      reply.send(res);
    } catch (error) {
      console.log("createHtml error", error);
      reply.send({
        code: 500,
        msg: error.message || String(error),
        data: null,
      });
    }
  });
}
