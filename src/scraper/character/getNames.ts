import { Page } from "puppeteer-core";

export const getNames = async (page: Page) => {
  return page.$$eval(".normal_header:nth-of-type(1)", ([nameElement]) => {
    const name = nameElement?.textContent as string;

    const match = name.match(/\(([\S\s]+)\)/);

    if (!match)
      return {
        native_name: null,
        english_name: name.trim(),
      };

    const nativeName = match[1];

    const englishName = name.replace(`(${nativeName})`, "").trim();

    return {
      native_name: nativeName,
      english_name: englishName,
    };
  });
};
