import { Page } from "puppeteer";

export const getNames = async (page: Page) => {
  return page.$$eval(".normal_header:nth-of-type(1)", ([nameElement]) => {
    const name = nameElement.textContent as string;

    const nativeName = (name.match(/\(([\S\s]+)\)/) as unknown as string[])[1];

    const englishName = name.replace(`(${nativeName})`, "").trim();

    return {
      native_name: nativeName,
      english_name: englishName,
    };
  });
};
