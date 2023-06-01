import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({

  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const tweet = await ctx.prisma.tweet.create({
        data: { content, userId: ctx.session.user.id },
      });
      return tweet;
    }),


  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({
          id: z.string(),
          createdAt: z.date(),
        }),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const tweets = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes: currentUserId ? { where: { userId: currentUserId } } : false,
          user: {
            select: { name: true, id: true, image: true }
          }
        }
      });
      let nextCursor: typeof cursor | undefined;
      if (tweets.length > limit) {
        const lastTweet = tweets.pop()!
        nextCursor = {
          id: lastTweet.id,
          createdAt: lastTweet.createdAt
        }
      }
      return {
        tweets: tweets.map(tweet => {
          return {
            id: tweet.id,
            content: tweet.content,
            createdAt: tweet.createdAt,
            likesCount: tweet._count.likes,
            likedByMe: tweet.likes?.length > 0,
            user: tweet.user
          }
        }), nextCursor
      };

    }),

});
