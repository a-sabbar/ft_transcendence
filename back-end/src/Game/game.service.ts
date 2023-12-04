import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { MatchType, match } from "@prisma/client";
import { NotificationGateway } from "src/notification/gateway/notification.gateway";


@Injectable()
export class GameService {
    constructor(private prisma: PrismaService, private notificationGateway: NotificationGateway) { }

    async createMatch(creatorId: any, opponentId: any, type: MatchType): Promise<string> {
        try {
            const match = await this.prisma.match.create({
                data: {
                    creatorId: creatorId,
                    opponentId: opponentId,
                    type: type,
                },
            });
            return match.id;
        } catch (error) {
            console.log("This is The ERROR  ", error);
            return error;
        }
    }

    async getMatch(clientId: string): Promise<match> {
        try {
            const match = await this.prisma.match.findFirst({
                where: {
                    OR: [
                        { creatorSocket: clientId },
                        { opponentSocket: clientId },
                    ],
                },
                orderBy: { createdAt: 'desc' },
            })
            return match;
        } catch (error) {
            return error;
        }
    }

    async getMatch2(clientId: string): Promise<match> {
        try {
            const match = await this.prisma.match.findFirst({
                where: {
                    OR: [
                        { creatorId: clientId },
                        { opponentId: clientId },
                    ],
                },
                orderBy: { createdAt: 'desc' },
            })
            return match;
        } catch (error) {
            return error;
        }
    }

    async getMatchById(matchId: string): Promise<match> {
        try {
            const match = await this.prisma.match.findUnique({
                where: {
                    id: matchId
                }
            })
            return match;
        } catch (error) {
            return error;
        }
    }

    // expectedScore(rating1: number, rating2: number): number {
    //     return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
    // }

    // updateRating(rating: number, expected: number, actual: number, k: number = 32): number {
    //     return rating + k * (actual - expected);
    // }

    async checkAchievements(profile: any) {
        const achievements = await this.prisma.achievement.findUnique({
            where: {
                userId: profile.userId,
            }
        });

        achievements.ach1 = profile.randommatchcount >= 20 ? true : false;
        achievements.ach2 = profile.twc >= 1 ? true : false;
        achievements.ach3 = profile.invitematchcount >= 1 ? true : false;
        achievements.ach4 = achievements.ach1 && achievements.ach2 && achievements.ach3 && achievements.ach4 && achievements.ach5 && achievements.ach6 ? true : false;
        achievements.ach5 = profile.win >= 1 ? true : false;
        achievements.ach6 = profile.invitematchcount + profile.randommatchcount >= 50 ? true : false;
        achievements.ach7 = profile.lose >= 1 ? true : false;

        await this.prisma.achievement.update({
            where: { userId: profile.userId },
            data: {
                ach1: achievements.ach1,
                ach2: achievements.ach2,
                ach3: achievements.ach3,
                ach4: achievements.ach4,
                ach5: achievements.ach5,
                ach6: achievements.ach6,
                ach7: achievements.ach7,
            },
        });
        
        let count = 0;
        if (achievements.ach1) count++;
        if (achievements.ach2) count++;
        if (achievements.ach3) count++;
        if (achievements.ach4) count++;
        if (achievements.ach5) count++;
        if (achievements.ach6) count++;
        if (achievements.ach7) count++;

        await this.prisma.profile.update({
            where: { userId: profile.userId },
            data: {
                achcount: count,
            },
        });
        
        return achievements;
    }

    async submitScore(matchId: string, creatorScore: number, opponentScore: number): Promise<void> {
        try {
            const match = await this.prisma.match.findUnique({
                where: {
                    id: matchId,
                },
            });

            await this.prisma.match.update({
                where: { id: matchId },
                data: {
                    creatorScore: creatorScore,
                    opponentScore: opponentScore,
                },
            });

            const MatchType = match.type;

            const winnerId = creatorScore > opponentScore ? match.creatorId : match.opponentId;
            const loserId = creatorScore > opponentScore ? match.opponentId : match.creatorId;
            const winnerProfile = await this.prisma.profile.findUnique({ where: { userId: winnerId } });
            const loserProfile = await this.prisma.profile.findUnique({ where: { userId: loserId } });

            winnerProfile.xp += 100;
            // winnerProfile.nextLevelXp = winnerProfile.level === 0 ? 500 : (winnerProfile.level + 1) * 1000;
            winnerProfile.nextLevelXp = winnerProfile.level === 0 ? 500 : 500 + winnerProfile.level * 1000;
            if (winnerProfile.xp >= winnerProfile.nextLevelXp) {
                winnerProfile.level += 1;
                winnerProfile.xp = winnerProfile.xp - winnerProfile.nextLevelXp;
            }
            winnerProfile.percentage = (winnerProfile.xp / winnerProfile.nextLevelXp) * 100;
            winnerProfile.points += 50;
            
            
            
            
            const updatedwinner = await this.prisma.profile.update({
                where: { userId: winnerId },
                data: {
                    xp: winnerProfile.xp,
                    level: winnerProfile.level,
                    points: winnerProfile.points,
                    ratio: winnerProfile.ratio,
                    nextLevelXp: winnerProfile.nextLevelXp,
                    percentage: winnerProfile.percentage,
                    win: { increment: 1 },
                    totalmatches: { increment: 1 },
                    invitematchcount: MatchType === "FRIEND" ? { increment: 1 } : { increment: 0 },
                    randommatchcount: MatchType === "RANDOM" ? { increment: 1 } : { increment: 0 },
                    twc: Math.abs(creatorScore - opponentScore) === 1 ? { increment: 1 } : { increment: 0 },
                },
            });
            const updatedloser = await this.prisma.profile.update({
                where: { userId: loserId },
                data: {
                    xp: loserProfile.xp,
                    level: loserProfile.level,
                    points: loserProfile.points,
                    ratio: loserProfile.ratio,
                    nextLevelXp: loserProfile.nextLevelXp,
                    lose: { increment: 1 },
                    totalmatches: { increment: 1 },
                    invitematchcount: MatchType === "FRIEND" ? { increment: 1 } : { increment: 0 },
                    randommatchcount: MatchType === "RANDOM" ? { increment: 1 } : { increment: 0 },
                },
            });
            
            this.notificationGateway.apiInfo(winnerId,"You won the match")
            this.notificationGateway.apiInfo(loserId,"You lost the match")

            await this.checkAchievements(updatedwinner);
            await this.checkAchievements(updatedloser);

        } catch (error) {
            console.log("This is the ERROR  in submitScore ", error);
            return error;
        }
    }



    async makeRequest(senderId: string, OpponentId: string): Promise<void> {
        try {
            if (senderId === OpponentId) {
                throw new BadRequestException("You can't send an invite to yourself");
            }
            const sender = await this.prisma.profile.findUnique({ where: { userId: senderId } });
            const notification = await this.prisma.notification.create({
                data: {
                    userId: OpponentId,
                    type: "Match_Invitation",
                    message: "You have a new match request",
                    actionUserId: senderId,
                    actionUserName: sender.firstName + " " + sender.lastName,
                    actionUserAvatar: sender.avatar,
                },
            });
            this.notificationGateway.inviteMatch(senderId, OpponentId);
        } catch (error) {
            return error;
        }
    }

    async upateMatch(matchId, creatorSocket: string, opponentSocket: string): Promise<void> {
        try {
            await this.prisma.match.update({
                where: {
                    id: matchId,
                },
                data: {
                    creatorSocket: creatorSocket,
                    opponentSocket: opponentSocket,
                },
            });
        } catch (error) {
            console.log("This is the ERROR  in updateMatch ", error);
            return error;
        }
    }

    async acceptRequest(senderId: string, receiverId: string, notId: string): Promise<void> {
        try {
            await this.prisma.notification.delete({
                where: {
                    id: notId,
                },
            });
            const matchId = await this.createMatch(senderId, receiverId, MatchType.FRIEND);
            this.notificationGateway.acceptMatchRequest(senderId, receiverId, matchId);
        } catch (error) {
            return error;
        }
    }

    async refuseRequest(senderId: string, receiverId: string, notId: string): Promise<void> {
        try {
            await this.prisma.notification.delete({
                where: {
                    id: notId,
                },
            });
            this.notificationGateway.refuseMatchRequest(senderId, receiverId);
        } catch (error) {
            return error;
        }
    }

    async deleteMatch(matchId: string): Promise<void> {
        try {
            await this.prisma.match.delete({
                where: {
                    id: matchId,
                },
            });
        } catch (error) {
            console.log("Error deleting match:", error);
            throw error;
        }
    }


    async getMatchHistory(userId: string): Promise<any> {
        try {
            const matchHistory = await this.prisma.match.findMany({
                where: {
                    OR: [
                        { creatorId: userId },
                        { opponentId: userId },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    creator: { select: { profile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            avatar: true,
                        }
                    }} }, opponent: { select: { profile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            avatar: true,
                        }
                    } } } }
            });
            console.log("this is the matchHistory ", matchHistory);
            return matchHistory;
        } catch (error) {
            return error;
        }
    }

    async getLeaderboard(): Promise<any> {
        try {
            const leaderboard = await this.prisma.profile.findMany({
                orderBy: { points: 'desc' },
                // select: {
                //     userId: true,
                //     firstName: true,
                //     lastName: true,
                //     avatar: true,
                //     points: true,
                // },
            });
            return {first : leaderboard[0] , second : leaderboard[1] , third : leaderboard[2]};
        } catch (error) {
            return error;
        }
    }
}