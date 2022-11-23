import { Page } from "puppeteer";
import { Anime } from "../../types";

export const getInfo = async (
  page: Page
): Promise<Anime["info"]> /* NOSONAR */ => {
  const mainTitle = await page.$$eval(
    ".title-name > strong",
    ([romanizedTitleElement]) => {
      return romanizedTitleElement?.textContent as string;
    }
  );

  const { synonyms, ...alternativeTitles } = await getAlternativeTitles(page);

  const episodes = await info(page, '//span[contains(text(), "Episodes:")]');

  const type = await info(page, '//span[contains(text(), "Type:")]');

  const aired = await info(page, '//span[contains(text(), "Aired:")]');

  const status = await info(page, '//span[contains(text(), "Status:")]');

  const premiered = await info(page, '//span[contains(text(), "Premiered:")]');

  const broadcast = await info(page, '//span[contains(text(), "Broadcast:")]');

  const producers = await info(page, '//span[contains(text(), "Producers:")]');

  const licensors = await info(page, '//span[contains(text(), "Licensors:")]');

  const studios = await info(page, '//span[contains(text(), "Studios:")]');

  const source = await info(page, '//span[contains(text(), "Source:")]');

  let genres = await info(page, '//span[contains(text(), "Genres:")]');

  if (!genres) genres = await info(page, '//span[contains(text(), "Genre:")]');

  let themes = await info(page, '//span[contains(text(), "Themes:")]');

  if (!themes) themes = await info(page, '//span[contains(text(), "Theme:")]');

  let demographics = await info(
    page,
    '//span[contains(text(), "Demographics:")]'
  );

  if (!demographics)
    demographics = await info(page, '//span[contains(text(), "Demographic:")]');

  const duration = await info(page, '//span[contains(text(), "Duration:")]');

  const rating = await info(page, '//span[contains(text(), "Rating:")]');

  const [synopsisElement] = await page.$x('//h2[contains(text(), "Synopsis")]');

  const synopsis =
    (await synopsisElement?.evaluate((synopsisNode) => {
      let textContent =
        synopsisNode.parentElement?.nextSibling?.textContent?.trim() || null;

      if (
        textContent ===
        "No synopsis information has been added to this title. Help improve our database by adding a synopsis here."
      )
        textContent = null;

      return textContent;
    })) || null;

  const [backgroundElement] = await page.$x(
    '//h2[contains(text(), "Background")]'
  );

  const background =
    (await backgroundElement?.evaluate((backgroundNode) => {
      let textContent =
        backgroundNode.parentElement?.nextSibling?.textContent?.trim() || null;

      if (
        textContent ===
        "No background information has been added to this title. Help improve our database by adding background information"
      )
        textContent = null;

      return textContent;
    })) || null;

  const picture = await page.$$eval(
    ".borderClass img:nth-of-type(1)",
    ([imgNode]) => imgNode?.getAttribute("data-src") || null
  );

  return {
    main_title: mainTitle,
    alternative_titles: alternativeTitles || null,
    synonyms: synonyms?.split(", ") || [],
    episodes: episodes ? parseInt(episodes, 10) : null,
    type,
    aired,
    status,
    premiered,
    broadcast,
    producers: producers?.split(",") || [],
    licensors: licensors?.split(",") || [],
    studios: studios?.split(",") || [],
    source,
    genres: genres?.split(",") || [],
    themes: themes?.split(",") || [],
    demographics: demographics?.split(",") || [],
    duration,
    rating,
    synopsis,
    background,
    picture,
  };
};

const getAlternativeTitles = async (page: Page) => {
  const [alternativeTitlesElement] = await page.$x(
    '//h2[contains(text(), "Alternative Titles")]'
  );

  return (
    alternativeTitlesElement?.evaluate((alternativeTitlesNode) => {
      const alternativeTitlesData: Anime["info"]["alternative_titles"] = {};
      let currentElement = alternativeTitlesNode.nextSibling;

      while (currentElement) {
        if (
          currentElement instanceof Element &&
          currentElement.tagName === "H2"
        )
          break;

        const getTitles = (spacepadElement: Node) => {
          const textContent = spacepadElement.textContent
            ?.replace(/\n/g, "")
            .trim() as string;

          if (textContent) {
            const match = textContent.match(/(\S+)\: (.+)/);

            if (match) {
              const [, language, value] = match;
              alternativeTitlesData[language.toLocaleLowerCase()] = value;
            }
          }
        };

        if (
          currentElement instanceof Element &&
          currentElement.classList.contains("js-alternative-titles")
        ) {
          currentElement.querySelectorAll(".spaceit_pad").forEach(getTitles);
        } else {
          getTitles(currentElement);
        }

        currentElement = currentElement.nextSibling;
      }

      return alternativeTitlesData;
    }) || {}
  );
};

const info = async (page: Page, key: string) => {
  const [keyElement] = await page.$x(key);

  return (
    keyElement?.evaluate((keyNode) => {
      const nodeCount = keyNode.parentElement?.childElementCount || 0;
      if (nodeCount <= 2) {
        let textContent = keyNode.nextSibling?.textContent?.trim();
        if (textContent === "")
          textContent = keyNode.nextSibling?.nextSibling?.textContent?.trim();

        if (
          textContent &&
          [
            "Not available",
            "Not available",
            "None found,",
            "Unknown",
            "?",
          ].includes(textContent)
        )
          textContent = undefined;

        return textContent || null;
      } else {
        let textContent = "";
        let currentElement = keyNode.nextSibling;

        while (currentElement) {
          if (
            !(
              currentElement instanceof Element &&
              currentElement.getAttribute("style") === "display: none"
            )
          )
            textContent += currentElement.textContent?.trim();

          currentElement = currentElement.nextSibling;
        }

        return textContent.trim();
      }
    }) || null
  );
};
