"use server";

import { api } from "@/convex/_generated/api";
import {Doc} from "@/convex/_generated/dataModel"
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import { checkFeatureUsageLimit } from "@/lib/checkFeatureUsageLimit";
import { getConvexClient } from "@/lib/convex"
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";

export interface VideoResponse{
    success:boolean,
    data?:Doc<"videos">,
    error?:string,
}

export const createOrGetVideo = async(
    videoId: string,  // Note: param order should match how you call it
    userId: string,
): Promise<VideoResponse> => {
    const convex = getConvexClient();
    const user = await currentUser();
    
    if(!user) {
        return {success: false, error: "User not found"};
    }
    
    const featureCheck = await checkFeatureUsageLimit(
        user.id,
        featureFlagEvents[FeatureFlag.ANALYSE_VIDEO].event
    );
    
    if(!featureCheck.success) {
        return {success: false, error: featureCheck.error}
    }
    
    try {
        // First check if video exists
        const existingVideo = await convex.query(api.video.getVideoId, {
            videoId,
            userId
        });
        
        // If video already exists, return it
        if(existingVideo) {
            console.log("Found existing video, no token spent");
            return {success: true, data: existingVideo};
        }
        
        // Only if video doesn't exist, create a new one
        console.log(`Analyse event for video ${videoId} and Token will be spent`);
        
        const newVideoId = await convex.mutation(api.video.createVideoEntry, {
            videoId,
            userId,
        });
        
        // Fetch the newly created video
        const newVideo = await convex.query(api.video.getVideoId, {
            userId,
            videoId,  // Use videoId, not newVideoId here (might be a bug in your code)
        });
        
        // Track the event
        console.log("Tracking video event")
        await client.track({
            event: featureFlagEvents[FeatureFlag.ANALYSE_VIDEO].event,
            company: {
                id: user.id,
            },
            user: {
                id: user.id,
            },
        });
        
        return {success: true, data: newVideo!}
    } catch (error) {
        console.error("Error creating or getting video:", error);
        return {success: false, error: "Error creating or getting video"};
    }
}