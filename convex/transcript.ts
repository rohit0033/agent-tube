import {v} from 'convex/values'
import {mutation,query} from "./_generated/server"

export const getTranscriptByVideoId = query({
    args:{
        userId: v.string(),
        videoId: v.string(),
    },
    handler: async(ctx,args) =>{
        return  await ctx.db
         .query("transcript")
         .withIndex("by_user_and_video",(q) =>
            q.eq("userId",args.userId)
            .eq("videoId",args.videoId)
         )
         .unique();
       
    }
})
// Store the transcript of video 
export const storeTranscript = mutation({
    args:{
        userId: v.string(),
        videoId: v.string(),
        transcript: v.array(
            v.object({
                text: v.string(),
                timeStamp: v.string(),
            })
        ),
    },
    handler: async(ctx,args) =>{
       const existingTranscript = await ctx.db
        .query("transcript")
        .withIndex("by_user_and_video",(q) =>
            q.eq("userId",args.userId)
            .eq("videoId",args.videoId)
         )
         .unique();
        if(existingTranscript){
            console.log("Transcript already exists for this video. Skipping storage.");
            return;
        }
        return await ctx.db.insert("transcript",{
            userId: args.userId,
            videoId: args.videoId,
            transcript: args.transcript,
        });
    }
})

// Get the transcript of video by userId 
export const getTranscriptByUserId = query({
    args:{
        userId: v.string(),
    },
    handler: async(ctx,args) =>{
        return await ctx.db
         .query("transcript")
         .withIndex("by_user_and_video",(q) =>
            q.eq("userId",args.userId)
         )
         .collect();
         
    }
})
export const deleteTranscript = mutation({
    args:{ id : v.id("transcript"),userId: v.string()},
    handler: async(ctx,args) =>{
        const transcript = await ctx.db.get(args.id);
        if(!transcript){
            throw new Error("Transcript not found")
        }
        if(transcript.userId !== args.userId){
            throw new Error("You are not allowed to delete this transcript")
        }
        await ctx.db.delete(args.id);
        return true
    }
})
