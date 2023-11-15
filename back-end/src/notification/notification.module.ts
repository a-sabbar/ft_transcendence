import { Module } from "@nestjs/common";
import { NotificationGateway } from "./gateway/notification.gateway";
import { UserService } from "../user/user.service";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { friendshipModule } from "src/friendship/friendship.module";
import { FriendshipService } from "src/friendship/friendship.service";

@Module({
  imports: [],
  providers: [NotificationGateway, UserService, NotificationService, FriendshipService ],
  controllers: [NotificationController],
})
export class NotificationModule { }
