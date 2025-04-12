"use server"
import {google} from "googleapis";
import { VideoDetails } from "@/types/types";
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
})

export async function getVideoDetails(videoId: string) {
    console.log(`getVideoDetails: ${videoId}`);
    try {
        const videoResponse = await youtube.videos.list({
            part:["snippet","statistics"],
            id:[videoId],
            key:process.env.YOUTUBE_API_KEY
        })
        const videoDetails = videoResponse.data.items?.[0];
        if(!videoDetails) throw new Error("Video not found");
        const channelResponse = await youtube.channels.list({
            part:["snippet","statistics"],
            id:[videoDetails.snippet?.channelId || ""],
            key:process.env.YOUTUBE_API_KEY

        });
        const channelDetails = channelResponse.data.items?.[0];
        if(!channelDetails) throw new Error("Channel not found");
        console.log("Successfully fetched video details");

        const video:VideoDetails = {
            title:videoDetails.snippet?.title || "Unknown Title",
            thumbnail:videoDetails.snippet?.thumbnails?.maxres?.url || 
            videoDetails.snippet?.thumbnails?.high?.url ||
            videoDetails.snippet?.thumbnails?.default?.url || "",
            publishedAt:videoDetails.snippet?.publishedAt || new Date().toISOString(),
           
            views:videoDetails.statistics?.viewCount || "0",
            likes:videoDetails.statistics?.likeCount || "Not available",
            comments:videoDetails.statistics?.commentCount || "", 

            channel:{
                title:channelDetails.snippet?.title || "Unknown Channel",
                thumbnail:channelDetails.snippet?.thumbnails?.default?.url || "",
                subscribers:channelDetails.statistics?.subscriberCount || "0"
            }
        }

        return video; 


        
    } catch (error) {
        console.error("Eror fetching the video details",error);
        return null
    }

}