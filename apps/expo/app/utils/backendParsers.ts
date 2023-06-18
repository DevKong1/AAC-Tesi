import { type BackendDiaryPage } from "./types/backendTypes";
import { type DiaryPage } from "./types/commonTypes";

export const parseDiary = (diary: BackendDiaryPage[]) => {
  return diary.flatMap((el) => {
    return {
      date: el.date,
      pictograms: JSON.parse(el.pictograms),
    } as DiaryPage;
  });
};
