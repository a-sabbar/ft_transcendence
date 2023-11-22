import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket } from "socket.io";
import * as SocketIO from "socket.io";
import { PrismaService } from "../../prisma/prisma.service";
import { UserService } from "../../user/user.service";
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { NotificationService } from "../notification.service";
import jwt_decode from "jwt-decode";
import { FriendshipService } from "../../friendship/friendship.service";

@WebSocketGateway({
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
  namespace: "notification",
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private prisma: PrismaService,
  ) { }
  @WebSocketServer()
  server: SocketIO.Server;

  private socketMap: Map<string, Socket[]> = new Map<string, Socket[]>();

  async handleConnection(socket: Socket) {
    console.log(`Client connected notif : ${socket.id}`);
    const token = socket.handshake.headers.authorization?.split(" ")[1];
    const user: any = jwt_decode(token);
    if (user && user.userId) {
      if (!this.socketMap.has(user.userId)) {
        this.socketMap.set(user.userId, []);
      }
      this.socketMap.get(user.userId).push(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    const token = socket.handshake.headers.authorization?.split(" ")[1];
    const user: any = jwt_decode(token);
    if (user && user.userId && this.socketMap.has(user.userId)) {
      const sockets = this.socketMap.get(user.userId);
      const index = sockets.indexOf(socket);
      if (index !== -1) {
        sockets.splice(index, 1);
      }
      if (sockets.length === 0) {
        this.socketMap.delete(user.userId);
      }
    }
  }

  sendNotification(id: string, data: any) {
    this.socketMap.get(id).forEach(socket => {
      socket.emit('notification', {
        type: data.type,
        message: data.message,
      });
      socket.emit("reload");
    });
  }

  sendNotification_redirect(id: string, data: any) {
    this.socketMap.get(id).forEach(socket => {
      socket.emit('notification', {
        type: data.type,
        message: data.message,
      });
      socket.emit("redirect", { link : data.link });
    });
  }
  
  sendNotification_refresh(id: string, data: any) {
    this.socketMap.get(id).forEach(socket => {
      this.sendRefresh();
      socket.emit('notification', {
        type: data.type,
        message: data.message,
      });
    });
  }

  sendNotification_v2(id: string, data: any) {
    this.socketMap.get(id).forEach(socket => {
      socket.emit('notification', {
        type: data.type,
        message: data.message,
      });
      socket.emit("reload");
      setTimeout(() => {
        socket.emit("refresh");
      } , 500);
    });
  }

  sendRefresh() {
    setTimeout(() => {
      this.socketMap.forEach((sockets) => {
        sockets.forEach(socket => {
          socket.emit("refresh");
        });
      });
    }, 500);
  }

  async inviteMatch(senderId : string , receiverId : string) {
    this.sendNotification_v2(receiverId, {type : "info", message : "You have a new match invitation"});
    this.sendNotification_redirect(senderId, {type : "success", message : "Invitation sent", link : "/Game"});
  }

  friendRequest(senderId : string , receiverId : string) {
    this.sendNotification(receiverId, {type : "info", message : "You have a new friend request"});
    this.sendNotification(senderId, {type : "success", message : "Request sent"});
  }

  acceptFriendRequest(senderId : string , receiverId : string) {
    this.sendNotification_v2(receiverId, {type : "info", message : "Friend request accepted"});
    this.sendNotification_v2(senderId, {type : "success", message : "Friend request accepted"});
  }
  refuseFriendRequest(senderId : string , receiverId : string) {
    this.sendNotification(receiverId, {type : "warning", message : "Friend request refused"});
  }

  acceptMatchRequest(senderId : string , receiverId : string) {
    this.sendNotification_redirect(receiverId, {type : "info", message : "Match request accepted", link : "/Game"});
    this.sendNotification_v2(senderId, {type : "success", message : "Match request accepted"});
  }

  refuseMatchRequest(senderId : string , receiverId : string) {
    this.sendNotification(senderId, {type : "warning", message : "Match request refused"});
    this.sendNotification(receiverId, {type : "warning", message : "Match request refused"});
  }

  apiError(userId : string , message : string) {
    this.sendNotification(userId, {type : "error", message});
  }
  updated(userId : string) {
    this.sendNotification_refresh(userId, {type : "success", message : "Updated successfully"});
  }
}
