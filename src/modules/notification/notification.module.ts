import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { NotificationConsumer, NotificationQueueName } from './queue/consumers/notification.consumer';

const notificationQueue = BullModule.registerQueue({ name: NotificationQueueName })

@Module({
  imports: [
    notificationQueue
  ],
  providers: [NotificationConsumer],
  exports: [notificationQueue]
})
export class NotificationModule {}
