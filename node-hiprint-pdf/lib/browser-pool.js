/**
 * Puppeteer 浏览器池 - 支持并发的单例模式
 * 复用浏览器实例，使用页面池处理并发请求
 */
import puppeteer from "puppeteer";

class BrowserPool {
  constructor() {
    this.browser = null;
    this.browserPromise = null;
    this.args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
    ];
    this.maxPages = 3; // 最大并发页面数（降低以提高稳定性）
    this.waitingQueue = []; // 等待队列
    this.activePages = 0;
    this.isShuttingDown = false;
  }

  /**
   * 获取浏览器实例（线程安全的懒加载单例）
   */
  async getBrowser() {
    if (this.isShuttingDown) {
      throw new Error("Browser pool is shutting down");
    }

    // 如果已有浏览器实例且连接正常，直接返回
    if (this.browser && this.browser.connected) {
      return this.browser;
    }

    // 如果正在启动中，等待启动完成
    if (this.browserPromise) {
      return this.browserPromise;
    }

    // 创建启动 Promise
    this.browserPromise = this._launchBrowser();

    try {
      this.browser = await this.browserPromise;
      return this.browser;
    } catch (error) {
      this.browserPromise = null;
      throw error;
    } finally {
      this.browserPromise = null;
    }
  }

  async _launchBrowser() {
    console.log("[BrowserPool] Launching browser...");

    const launchOptions = {
      args: this.args,
      headless: "new",
      timeout: 60000,
      protocolTimeout: 60000,
    };

    // Docker 环境使用系统 Chromium
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    const browser = await puppeteer.launch(launchOptions);

    browser.on("disconnected", () => {
      console.log("[BrowserPool] Browser disconnected");
      // 只有当前浏览器断开时才重置
      if (this.browser === browser) {
        this.browser = null;
        this.browserPromise = null;
        this.activePages = 0;
        // 不清空队列，让等待的请求重新获取新浏览器
      }
    });

    console.log("[BrowserPool] Browser launched successfully");
    return browser;
  }

  /**
   * 清空等待队列
   */
  _clearQueue(error) {
    while (this.waitingQueue.length > 0) {
      const { reject } = this.waitingQueue.shift();
      reject(error);
    }
  }

  /**
   * 获取新页面（带并发控制）
   */
  async getPage() {
    if (this.isShuttingDown) {
      throw new Error("Browser pool is shutting down");
    }

    // 如果达到最大并发数，进入等待队列
    if (this.activePages >= this.maxPages) {
      console.log(`[BrowserPool] Waiting for available page (active: ${this.activePages}, queue: ${this.waitingQueue.length})`);

      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          const index = this.waitingQueue.findIndex(item => item.resolve === resolve);
          if (index !== -1) {
            this.waitingQueue.splice(index, 1);
            reject(new Error("Page request timeout (60s)"));
          }
        }, 60000); // 60秒超时

        this.waitingQueue.push({
          resolve: () => {
            clearTimeout(timeoutId);
            resolve();
          },
          reject: (err) => {
            clearTimeout(timeoutId);
            reject(err);
          }
        });
      });
    }

    this.activePages++;
    console.log(`[BrowserPool] Page acquired (active: ${this.activePages})`);

    try {
      const browser = await this.getBrowser();
      const page = await browser.newPage();

      // 设置默认超时
      page.setDefaultTimeout(60000);
      page.setDefaultNavigationTimeout(60000);

      return page;
    } catch (error) {
      this.activePages = Math.max(0, this.activePages - 1);
      this._processQueue();
      throw error;
    }
  }

  /**
   * 释放页面
   */
  async releasePage(page) {
    try {
      if (page && !page.isClosed()) {
        await page.close().catch(() => {});
      }
    } catch (e) {
      // 忽略关闭页面的错误
    } finally {
      this.activePages = Math.max(0, this.activePages - 1);
      console.log(`[BrowserPool] Page released (active: ${this.activePages})`);
      this._processQueue();
    }
  }

  /**
   * 处理等待队列
   */
  _processQueue() {
    if (this.waitingQueue.length > 0 && this.activePages < this.maxPages) {
      const { resolve } = this.waitingQueue.shift();
      resolve();
    }
  }

  /**
   * 关闭浏览器（进程退出时调用）
   */
  async close() {
    this.isShuttingDown = true;
    this._clearQueue(new Error("Browser pool is closing"));

    if (this.browser) {
      console.log("[BrowserPool] Closing browser...");
      try {
        await this.browser.close();
      } catch (e) {
        // 忽略关闭错误
      }
      this.browser = null;
      this.activePages = 0;
    }
  }

  /**
   * 获取状态
   */
  getStatus() {
    return {
      browserConnected: this.browser?.connected || false,
      activePages: this.activePages,
      waitingRequests: this.waitingQueue.length,
      maxPages: this.maxPages,
      isShuttingDown: this.isShuttingDown,
    };
  }
}

// 导出单例
const browserPool = new BrowserPool();

export default browserPool;
