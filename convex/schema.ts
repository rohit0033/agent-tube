import { timeStamp } from 'console'
import {defineSchema, defineTable} from 'convex/server'
import {v} from 'convex/values'
import { title } from 'process'


export default defineSchema({
    videos:defineTable({
        videoId:v.string(),
        userId:v.string(),
    })
      .index("by_user_id",["userId"])
      .index("by_video_id",["videoId"])
      .index("by_user_and_video",["userId","videoId"]),

    transcript:defineTable({
        videoId: v.string(),
        userId: v.string(),
        transcript: v.array(
            v.object({
                text: v.string(),
                timeStamp: v.string(),
            })
        ),

    })
      .index("by_user_id",["userId"])
      .index("by_video_id",["videoId"])
      .index("by_user_and_video",["userId","videoId"]),

    images: defineTable({
        storageId:v.id("_storage"),
        userId:v.string(),
        videoId:v.string(),

    })
      .index("by_user_id",["userId"])
      .index("by_video_id",["videoId"])
      .index("by_user_and_video",["userId","videoId"]),
    
    titles: defineTable({
        videoId:v.string(),
        userId:v.string(),
        title:v.string(),
    })
      .index("by_user_id",["userId"])
      .index("by_video_id",["videoId"])
      .index("by_user_and_video",["userId","videoId"]),

})