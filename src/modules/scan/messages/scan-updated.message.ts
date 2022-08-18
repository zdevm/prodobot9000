import { Message } from "@modules/event/interfaces/message.interface";
import { Scan } from "@modules/scan/classes/scan";

export class ScanUpdatedMessage implements Message {

  public constructor(public scan: Scan) {}

  getType() {
    return 'ScanUpdated';
  }
  
}