import { Page } from "puppeteer";
import { StaffOnAnime } from "../../types";

export const getStaffsOfAnime = async (page: Page): Promise<StaffOnAnime[]> => {
  const staffs = await page.$$eval(
    ".border_solid ~ table",
    (staffsElement): (StaffOnAnime | undefined)[] => {
      return staffsElement.map((staffElement) => {
        const pictureLink =
          staffElement
            ?.querySelector("td:nth-of-type(1) a img")
            ?.getAttribute("src") || null;

        const staffLink = staffElement
          .querySelector("td:nth-of-type(1) a")
          ?.getAttribute("href");

        const name = staffElement.querySelector(
          "td:nth-of-type(2) > a"
        )?.textContent;

        const role = staffElement
          .querySelector("td:nth-of-type(2) div > small")
          ?.textContent?.split(",");

        if (!staffLink || !name || !role) return;

        const staffID = staffLink?.split("/")[staffLink?.split("/").length - 2];

        return {
          staff_id: parseInt(staffID),
          name,
          role,
          picture: pictureLink,
        };
      });
    }
  );

  return staffs.filter((staff): staff is StaffOnAnime => !!staff);
};
