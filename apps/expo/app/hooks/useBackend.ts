import { BACKEND_URL } from "@env";
import axios from "axios";
import axiosRetry from "axios-retry";

import {
  type BackendCustomPictogram,
  type BackendDiaryPage,
  type BackendUserResponse,
} from "../utils/types/backendTypes";
import { type DiaryPage } from "../utils/types/commonTypes";

const reqInstance = axios.create({
  baseURL: BACKEND_URL,
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
axiosRetry(reqInstance as any, { retries: 3 });

export const getUser = async (token: string, email: string) => {
  try {
    const { data } = await reqInstance.post(
      `user`,
      {
        email: email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return data.user as BackendUserResponse;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const setBackendFavourites = async (
  token: string,
  favourites: string,
) => {
  try {
    const { data } = await reqInstance.post(
      `favourite`,
      {
        favourites: favourites,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return data.user as BackendUserResponse;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const postDiaryPage = async (token: string, page: DiaryPage) => {
  try {
    const { data } = await reqInstance.post(
      `diary`,
      {
        date: page.date,
        pictograms: JSON.stringify(page.pictograms),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return data.page as BackendDiaryPage;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const deleteDiaryPage = async (token: string, date: string) => {
  try {
    await reqInstance.delete(`diary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        date: date,
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const postCustomPictogram = async (
  token: string,
  oldId?: string,
  text?: string,
  image?: string,
  tags?: string[],
  color?: string,
) => {
  try {
    const { data } = await reqInstance.post(
      `custompictogram`,
      {
        oldId: oldId,
        text: text,
        image: image,
        tags: JSON.stringify(tags),
        color: color,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return data.pictogram as BackendCustomPictogram;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const removeCustomPictogram = async (token: string, id: string) => {
  try {
    const { data } = await reqInstance.delete(`custompictogram`, {
      headers: {
        Authorization: `Bearer ${token}`,
        id: id,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return data.deleted as BackendCustomPictogram;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
