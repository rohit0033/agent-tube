import { title } from 'process';
import {v} from 'convex/values'
import {mutation,query} from "./_generated/server"


export const list = query({
    args:{
        videoId:v.string(),
        userId:v.string(),
    },
    handler:async(ctx,args) =>{
        const titles = await ctx.db
         .query("titles")
         .withIndex("by_user_and_video",(q) =>
            q.eq("userId",args.userId)
            .eq("videoId",args.videoId)
         )
         .collect()
        return titles;
    }
})

export const generate = mutation({
    args:{
        videoId:v.string(),
        userId:v.string(),
        title:v.string(),
    },
    handler:async(ctx,args) =>{
        const videoId = await ctx.db.insert("titles",{
            videoId:args.videoId,
            userId:args.userId,
            title:args.title,
        })
        return videoId;
    }
})