import {
  Pictogram,
  type WhatsItGameProperties,
} from "../../src/types/commonTypes";

export default class GamesHandler {
  public generateWhatsItGame(): WhatsItGameProperties {
    //TODO Implement
    return {
      pictograms: [{ _id: 100 }, { _id: 200 }],
      answer: "200",
      picture: "nop",
    };
  }
}
