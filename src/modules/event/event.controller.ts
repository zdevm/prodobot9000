import { AuthUserId } from '@modules/auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { Controller, Get, NotFoundException, Param, Sse, UseGuards } from '@nestjs/common';
import { EventService } from './services/event/event.service';

@Controller('events')
export class EventController {

  public constructor(private readonly eventsService: EventService) {};
  
  @Get('subscribe/private')
  @UseGuards(JwtAuthGuard)
  subscribePrivate(@AuthUserId() userId: string) {
    return {
      key: this.eventsService.acquirePrivate(userId)
    };
  }

  @Sse('private/:privateKey')
  listen(@Param('privateKey') key: string) {
    const obs$ = this.eventsService.getByPrivate(key);
    if (!obs$) {
      throw new NotFoundException();
    }
    return obs$;
  }


}
