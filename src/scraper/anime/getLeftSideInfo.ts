import { Page } from "puppeteer-core";
import { Anime } from "../../types";

export const getLeftSideInfo = async (page: Page): Promise<Anime["info"]> => {
  const mainTitle = {
    english: await page.$$eval("p.title-english", (enTitleElement) => {
      return enTitleElement[0]?.textContent;
    }),
    romanized: await page.$$eval(
      ".title-name > strong",
      (romanizedTitleElement) => {
        return romanizedTitleElement[0]?.textContent;
      }
    ),
  };

  const info = await page.$$eval(".leftside > h2", () /* NOSONAR */ => {
    const datas: { [key: string]: string[] } = {};
    const leftSides = Array.from(document.querySelectorAll(".leftside > h2"));
    for (const leftSide of leftSides) {
      let currentElement: Element | ChildNode | null = leftSide;
      const key = leftSide.textContent
        ?.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toLocaleLowerCase())
        .replace(" ", "_");

      if (key) datas[key] = [];

      while (currentElement) {
        if (
          currentElement instanceof Element &&
          currentElement.tagName === "BR"
        )
          break;

        if (
          currentElement instanceof Element &&
          currentElement.classList.contains("js-alternative-titles")
        ) {
          currentElement
            .querySelectorAll(".spaceit_pad")
            .forEach((spacepadElement) => {
              const textContent = spacepadElement.textContent
                ?.replace(/\n/g, "")
                .trim();
              if (key && textContent && currentElement !== leftSide)
                datas[key].push(textContent);
            });
        } else {
          const textContent = currentElement.textContent
            ?.replace(/\n/g, "")
            .trim();
          if (key && textContent && currentElement !== leftSide)
            datas[key].push(textContent);
        }

        currentElement = currentElement.nextSibling;
      }
    }

    return datas;
  });

  return {
    main_title: mainTitle,
    ...transformInfoData(info),
  };
};

export const transformInfoData = (leftSideData: {
  [key: string]: string[];
}): Omit<Anime["info"], "main_title"> => {
  let synonyms: string[] = [];
  let alternative_titles: Anime["info"]["alternative_titles"] = {};
  // const { synonyms, ...otherLanguages } = (
  leftSideData.alternative_titles
    // Filter "More Titles" TextContent
    .filter((content: string) => content !== "More titles")
    // Titles into readable Objects e.g. { japanese: 'シトラス' }
    .forEach((content: string) => {
      // Get keys and values inside a string e.g. "Japanese: シトラス" to { japanese: "シトラス" }
      const match = content.match(/(\S+)\:([\S\s]+)/) as RegExpMatchArray;

      let key = match[1].toLocaleLowerCase();
      let value: string | string[] = match[2];

      if (key === "synonyms") synonyms = value.split(", ").map((t) => t.trim());
      else alternative_titles[key] = value.trim();
    });

  //Get info from leftside part of myanimelist
  const information = leftSideData.information
    .map((content: string) => {
      const match = content.match(/(\S+)\:([\S\s]+)/) as RegExpMatchArray;

      const baseKey = match[1].toLocaleLowerCase();
      let key = (baseKey === "theme" ? "themes" : baseKey) as Exclude<
        keyof Anime["info"],
        "synonyms" | "alternative_titles"
      >;
      let value: string | string[] | null | number = match[2];

      if (
        ["genres", "themes", "studios", "producers", "licensors"].includes(key)
      ) {
        if (value.trim() === "None found, add some") value = null;
        else value = value.split(", ").map((t) => t.trim());

        if (["genres", "themes", "demographics"].includes(key) && value)
          value = value.map((e) =>
            [...Array(e.length / 2).keys()]
              .map((i) => Array.from(e)[i])
              .join("")
          );
      } else {
        value = key === "episodes" ? parseInt(value) : value.trim();
      }

      return {
        [key]: value,
      };
    })
    .reduce((obj, item) => ({ ...obj, ...item }), {}) as Omit<
    Anime["info"],
    "main_title" | "alternative_titles" | "synonyms"
  >;

  return {
    alternative_titles,
    synonyms: synonyms,
    ...information,
  };
};
