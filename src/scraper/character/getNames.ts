import { Page } from "puppeteer";
import { Character } from "../../types";

export const getNames = async (
  page: Page
): Promise<Pick<Character, "english_name" | "native_name" | "nicknames">> => {
  return {
    ...(await page.$$eval(".normal_header:nth-of-type(1)", ([nameElement]) => {
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
    })),
    ...(await page.$$eval(
      ".h1.edit-info > .h1-title > .title-name",
      ([nameElement]) => {
        const name = nameElement?.textContent as string;

        const match = name.match(/.+\"(.+)\".+/);

        if (!match)
          return {
            nicknames: [],
          };

        return { nicknames: match[1].split(", ") };
      }
    )),
  };
};
