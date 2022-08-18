import { RefreshMessage } from '@modules/event/classes/refresh-message';
import { Message } from '@modules/event/interfaces/message.interface';
import { Injectable } from '@nestjs/common';
import { HelperService } from '@services/helper.service';
import { instanceToPlain } from 'class-transformer';
import { map, Observable, Subject, tap } from 'rxjs';

@Injectable()
export class EventService {

  private privateKeys = new Map<string, string>(); // private key - channel name
  private channelsMap = new Map<string, Subject<Message>>();

  emit(channel: string, event: any) {
    const sub$ = this.channelsMap.get(channel);
    if (sub$) {
      sub$.next(event);
    }
  }

  subscribe(channel: string) {
    let sub$ = this.channelsMap.get(channel);
    if (sub$) {
      return sub$;
    }
    sub$ = new Subject<any>();
    // after 10 minutes, remove channel
    setTimeout(() => this.refresh(channel), 60000 * 10);
    this.channelsMap.set(channel, sub$);
  }

  get(channel: string): Observable<{ type: string; message: any }> | null {
    const sub$ = this.channelsMap.get(channel);
    if (!sub$) {
      return null;
    }
    return sub$.asObservable().pipe(
      map(message => ({
        type: 'message',
        data: {
          type: message.getType(),
          message: instanceToPlain(message)
        }
      })),
    ) as any
  }

  acquirePrivate(channel: string) {
    this.subscribe(channel);
    const uuid = HelperService.generateUuid();
    this.privateKeys.set(uuid, channel);
    return uuid;
  }

  getByPrivate(privateKey: string) {
    const channel = this.privateKeys.get(privateKey);
    if (!channel) {
      return null;
    }
    return this.get(channel);
  }

  /**
   * After sending a refresh event, will complete subject's channel, delete it from map and delete all privates keys associated to this channel.
   * @param channel 
   */
  refresh(channel) {
    const subject = this.channelsMap.get(channel);
    // complete subject and delete key
    if (subject) {
      this.emit(channel, new RefreshMessage())
      subject.complete();
      this.channelsMap.delete(channel);
    }
    // delete private keys
    for (const [key, value] of this.privateKeys.entries()) {
      if (value === channel) {
        this.privateKeys.delete(key);
      }
    }
  }

}
