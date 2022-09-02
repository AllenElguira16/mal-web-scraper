import { Page } from "puppeteer";
import { Character } from "../../types";

export const getNames = async (
  page: Page
): Promise<Pick<Character, "kanji_name" | "english_name" | "nicknames">> => {
  return {
    ...(await page.$$eval(".normal_header:nth-of-type(1)", ([nameElement]) => {
      const name = nameElement?.textContent as string;

      const match = name.match(
        /[A-Z][a-zA-Z\-]*\s*?(?:\([A-Z][a-zA-Z\-\s]*\))?\s*?(?:\((.*)\))/
      );

      if (!match)
        return {
          kanji_name: null,
        };

      const nativeName = match[1];

      return {
        kanji_name: nativeName?.trim() ?? null,
      };
    })),
    ...(await page.$$eval(
      ".h1.edit-info > .h1-title > .title-name",
      ([nameElement]) => {
        const name = nameElement?.textContent as string;

        const match =
          /(?<firstName>.*)(?:\s+)(?:"(?<nicknames>[\S\,\s]*)")(?:\s*)(?<lastName>.*)/.exec(
            name
          );

        if (match && match.groups) {
          const {
            groups: { firstName, nicknames, lastName },
          } = match;
          let englishName = firstName;

          if (lastName && lastName.length !== 0)
            englishName = lastName + ", " + firstName;

          return {
            english_name: englishName,
            nicknames: nicknames.split(", "),
          };
        }

        const matchGerman = name.match(
          /([A-Z][a-zA-Z\s]*)? (?=[a-z]+)([a-z]+) ([A-Z][a-zA-Z\-]*)/
        );

        if (matchGerman) {
          return {
            english_name: `${matchGerman[2].trim()} ${matchGerman[3].trim()}, ${matchGerman[1].trim()}`,
            nicknames: [],
          };
        }

        return {
          english_name: name
            .split(" ")
            .filter((s) => s !== "")
            .reverse()
            .join(", "),
          nicknames: [],
        };
      }
    )),
  };
};
