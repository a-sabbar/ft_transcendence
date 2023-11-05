import {
    Controller,
    Get,
    UseGuards,
    Req,
    Patch,
    Param,
    Headers,
    Request,
    Delete,
    Post,
    UploadedFile,
    UseInterceptors,
  } from "@nestjs/common";
  import { FriendshipService } from "./friendship.service";
  import { AuthGuard } from "@nestjs/passport";
  
  @Controller("friendship")
  export class friendshipController {
    constructor(private friendshipService: FriendshipService) {}

    @Post("request/:id")
    @UseGuards(AuthGuard("jwt"))
    async makeRequest(@Req() req, @Param() params: any): Promise<void> {
      return this.friendshipService.makeRequest(req.user.id, params.id);
    }

    @Patch("accept/:id")
    @UseGuards(AuthGuard("jwt"))
    async acceptRequest(@Req() req, @Param() params: any): Promise<void> {
      return this.friendshipService.acceptRequest(req.user.id, params.id);
    }
    // @Delete("refuse/:id")
    // @UseGuards(AuthGuard("jwt"))
    // async refuseRequest(@Req() req, @Param() params: any): Promise<void> {
    //   return this.friendshipService.refuseRequest(req.user.id, params.id);
    // }
    @Get("show/:id")
    @UseGuards(AuthGuard("jwt"))
    async showFriendship(@Req() req, @Param() params: any): Promise<void> {
      return this.friendshipService.showFriendship(req.user.id, params.id);
    }

    @Get("show")
    @UseGuards(AuthGuard("jwt"))
    async showFriendships(@Req() req): Promise<any> {
      return this.friendshipService.getFriends(req.user.id);
    }

    @Get("show/requests")
    @UseGuards(AuthGuard("jwt"))
    async showRequests(@Req() req): Promise<any> {
      return this.friendshipService.getRequests(req.user.id);
    }

  }