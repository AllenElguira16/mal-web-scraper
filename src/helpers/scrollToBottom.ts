import { Page } from "puppeteer";

export const scrollToBottom = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let scrollTop = -1;
        const interval = setInterval(() => {
          window.scrollBy(0, 100);
          if (document.documentElement.scrollTop !== scrollTop) {
            scrollTop = document.documentElement.scrollTop;
            return;
          }
          clearInterval(interval);
          resolve();
        }, 10);
      })
  );
