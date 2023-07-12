export interface BackendUserResponse {
  id: string;
  email: string;
  clerkID: string;
  diary: BackendDiaryPage[];
  favourites: string;
  customPictograms: BackendCustomPictogram[];
}

export interface BackendDiaryPage {
  id: string;
  userId: string;
  date: string;
  pictograms: string;
}

export interface BackendCustomPictogram {
  id: string;
  userId: string;
  oldId?: string;
  text?: string;
  image?: string;
}

export interface BackendBook {
  id: string;
  userId: string;
  title: string;
  cover: string;
  pictograms: string;
}
