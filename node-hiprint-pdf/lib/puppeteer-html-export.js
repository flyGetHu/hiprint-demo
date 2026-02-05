/**
 * Puppeteer HTML 导出工具
 * 使用浏览器池复用 Chrome 实例，支持并发和自动重试
 * 优化：数据直接注入，避免内部 HTTP 回环
 */
import browserPool from "./browser-pool.js";

const isUrl = (url) => {
  if (!url) return false;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  return false;
};

// 判断是否是可重试的错误
const isRetryableError = (error) => {
  const retryableMessages = [
    "Browser disconnected",
    "frame was detached",
    "Target closed",
    "Session closed",
    "Protocol error",
    "Connection closed",
  ];
  return retryableMessages.some(msg =>
    error.message?.includes(msg) || error.toString().includes(msg)
  );
};

export default class PuppeteerHtmlExport {
  constructor() {
    this.options = {};
    this.maxRetries = 2;
  }

  setOptions(options) {
    this.options = options || {};
  }

  /**
   * 导航到页面（优化：使用 domcontentloaded 而非 networkidle0）
   */
  async navigateToPage(page, url) {
    const timeout = this.options.timeout || 30000;
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout
    });
  }

  /**
   * 直接注入数据并渲染（跳过 HTTP 回环）
   */
  async injectDataAndRender(page, templateData) {
    await page.evaluate((data) => {
      // 直接调用渲染，无需 axios 请求
      window.__INJECTED_DATA__ = data;

      if (typeof window.renderWithData === 'function') {
        window.renderWithData(data);
      }
    }, templateData);
  }

  /**
   * 等待模板加载完成
   */
  async waitTemplateLoaded(page, loadImage = true) {
    await page.waitForSelector(".hiprint-printTemplate", { visible: true, timeout: 30000 });

    if (loadImage) {
      await page.evaluate(() => {
        var images = document.querySelectorAll("img");
        function preLoad() {
          var promises = [];
          function loadImage(img) {
            return new Promise(function (resolve) {
              if (img.complete) {
                resolve(img);
              }
              img.onload = function () {
                resolve(img);
              };
              img.onerror = function () {
                resolve(img);
              };
            });
          }
          for (var i = 0; i < images.length; i++) {
            promises.push(loadImage(images[i]));
          }
          return Promise.all(promises);
        }
        return preLoad();
      });
    }
  }

  /**
   * 过滤掉非 Puppeteer 的内部选项
   */
  _filterOptions(opts) {
    const exclude = ["authorization", "executablePath", "args", "headless", "headers", "timeout", "templateData", "baseUrl"];
    const filtered = {};
    for (const key of Object.keys(opts)) {
      if (!exclude.includes(key)) {
        filtered[key] = opts[key];
      }
    }
    return filtered;
  }

  /**
   * 带重试的执行器（优化：支持页面复用）
   */
  async _executeWithRetry(operation, operationName) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      let page = null;
      try {
        page = await browserPool.getPage();
        const result = await operation(page);
        await browserPool.releasePage(page);
        return result;
      } catch (error) {
        lastError = error;
        console.log(`[PuppeteerExport] ${operationName} attempt ${attempt} failed:`, error.message);

        // 释放页面
        if (page) {
          await browserPool.releasePage(page).catch(() => {});
        }

        // 如果是可重试的错误且还有重试次数，继续重试
        if (isRetryableError(error) && attempt <= this.maxRetries) {
          console.log(`[PuppeteerExport] Retrying ${operationName}...`);
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }

        throw error;
      }
    }

    throw lastError;
  }

  /**
   * 生成 PDF（优化版：直接注入数据）
   */
  async createPdf(content, options = {}) {
    this.setOptions(options);
    const templateData = options.templateData;
    const baseUrl = options.baseUrl;

    return this._executeWithRetry(async (page) => {
      // 如果有 templateData，使用优化路径
      if (templateData && baseUrl) {
        await this.navigateToPage(page, baseUrl);
        await this.injectDataAndRender(page, templateData);
      } else {
        // 兼容旧模式
        const timeout = this.options.timeout || 30000;
        if (isUrl(content)) {
          await page.goto(content, { waitUntil: "domcontentloaded", timeout });
        } else {
          await page.setContent(content, { waitUntil: "domcontentloaded", timeout });
        }
      }

      await this.waitTemplateLoaded(page);

      const pdfOptions = this._filterOptions(this.options);
      const pdfBuffer = await page.pdf({
        ...pdfOptions,
        printBackground: this.options.printBackground ?? true,
      });

      return Buffer.from(pdfBuffer);
    }, "createPdf");
  }

  /**
   * 截图（优化版：直接注入数据）
   */
  async screenshot(content, options = {}) {
    this.setOptions(options);
    const templateData = options.templateData;
    const baseUrl = options.baseUrl;

    return this._executeWithRetry(async (page) => {
      if (templateData && baseUrl) {
        await this.navigateToPage(page, baseUrl);
        await this.injectDataAndRender(page, templateData);
      } else {
        const timeout = this.options.timeout || 30000;
        if (isUrl(content)) {
          await page.goto(content, { waitUntil: "domcontentloaded", timeout });
        } else {
          await page.setContent(content, { waitUntil: "domcontentloaded", timeout });
        }
      }

      await this.waitTemplateLoaded(page);

      const screenshotOptions = this._filterOptions(this.options);
      const havePath = this.options.path;
      const data = await page.screenshot({
        ...screenshotOptions,
        encoding: havePath ? "binary" : "base64",
      });

      return data;
    }, "screenshot");
  }

  /**
   * 获取 HTML 内容（优化版）
   */
  async htmlContent(content, options = {}) {
    this.setOptions(options);
    const templateData = options.templateData;
    const baseUrl = options.baseUrl;

    return this._executeWithRetry(async (page) => {
      if (templateData && baseUrl) {
        await this.navigateToPage(page, baseUrl);
        await this.injectDataAndRender(page, templateData);
      } else {
        const timeout = this.options.timeout || 30000;
        if (isUrl(content)) {
          await page.goto(content, { waitUntil: "domcontentloaded", timeout });
        } else {
          await page.setContent(content, { waitUntil: "domcontentloaded", timeout });
        }
      }

      await this.waitTemplateLoaded(page, false);

      const html = await page.$eval(
        options.domId || "#hiprintTemplate",
        (element) => element.innerHTML
      );

      return html;
    }, "htmlContent");
  }
}
