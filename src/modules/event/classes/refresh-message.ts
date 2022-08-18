import { Message } from "../interfaces/message.interface";

export class RefreshMessage implements Message {

  public getType() {
    return '__refresh__';
  }

}