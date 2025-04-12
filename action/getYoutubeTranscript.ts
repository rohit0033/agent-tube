"use server";

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { Innertube } from "youtubei.js";
// Add this import for the fallback method
import { YoutubeTranscript } from 'youtube-transcript';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export interface TranscriptEntry {
    text: string;
    timeStamp: string
}

const youtube = await Innertube.create({
    lang: "en",
    location:"US",
    retrieve_player:false
});

function formatTimestamp(start_ms:number):string{
    const minutes = Math.floor(start_ms/60000);
    const seconds = Math.floor((start_ms%60000)/1000);
    return `${minutes}:${seconds.toString().padStart(2,"0")}`;
}

async function fetchTranscript(videoId:string): Promise<TranscriptEntry[]>{
    // Primary method using youtubei.js
    try {
        let info;
        try {
            console.log(`[fetchTranscript] Attempting youtube.getInfo for videoId: ${videoId}`); // Log entry
            info = await youtube.getInfo(videoId);
            console.log(`[fetchTranscript] Successfully fetched info for videoId: ${videoId}`); // Log success
        } catch (infoError: any) {
            console.error("[fetchTranscript] Error during youtube.getInfo:", infoError); // Log the full error object
            console.error("[fetchTranscript] Error message:", infoError?.message); // Log just the message

            // Check specific parser error
            if (infoError instanceof Error && infoError.message?.includes("CompositeVideoPrimaryInfo not found")) {
                console.log("[fetchTranscript] >>> CONDITION MET: CompositeVideoPrimaryInfo error. Attempting fallback."); // Explicit log
                return await fetchTranscriptFallback(videoId);
            }
            // Check general parser error
            if (infoError instanceof Error && infoError.message?.includes("[Parser]: Error")) {
                 console.log("[fetchTranscript] >>> CONDITION MET: General parser error. Attempting fallback."); // Explicit log
                 return await fetchTranscriptFallback(videoId);
            }

            console.log("[fetchTranscript] Non-parser error in getInfo, re-throwing to outer catch.");
            throw infoError; // Re-throw other errors
        }

        if (!info) {
            // This case might occur if getInfo returns null/undefined without throwing
            console.log("[fetchTranscript] youtube.getInfo returned no info (null/undefined). Attempting fallback.");
            return await fetchTranscriptFallback(videoId);
        }

        // Check if transcript is available before trying to fetch it
        try {
            console.log(`[fetchTranscript] Attempting info.getTranscript() for videoId: ${videoId}`); // Log before getTranscript
            const transcriptData = await info.getTranscript();
            console.log(`[fetchTranscript] Successfully called info.getTranscript() for videoId: ${videoId}`); // Log after getTranscript

            if (!transcriptData?.transcript?.content?.body?.initial_segments) {
                console.log("[fetchTranscript] No transcript segments found in primary method. Attempting fallback.");
                return await fetchTranscriptFallback(videoId);
            }

            const transcript: TranscriptEntry[] = transcriptData.transcript.content.body
                .initial_segments.map((segment) => ({
                    text: segment.snippet.text ?? "N/A",
                    timeStamp: formatTimestamp(Number(segment.start_ms))
                }));

            console.log(`[fetchTranscript] Primary method successful for videoId: ${videoId}. Returning transcript.`);
            return transcript;
        } catch (transcriptError:any) {
            console.error("[fetchTranscript] Error during info.getTranscript():", transcriptError?.message);
            if (transcriptError instanceof Error && transcriptError.message.includes("Transcript panel not found")) {
                console.log("[fetchTranscript] No captions available (Transcript panel not found). Attempting fallback.");
                return await fetchTranscriptFallback(videoId);
            }
            console.log("[fetchTranscript] Unknown error during info.getTranscript(), re-throwing to outer catch.");
            throw transcriptError; // Re-throw other transcript errors
        }
    } catch (error) {
        // This outer catch handles errors thrown from the inner try/catch blocks
        console.error("[fetchTranscript] Outer catch triggered:", error); // Log the error caught here
        console.log("[fetchTranscript] Outer catch: Primary method failed. Attempting fallback.");
        return await fetchTranscriptFallback(videoId);
    }
}

// Fallback method using youtube-transcript library
async function fetchTranscriptFallback(videoId: string): Promise<TranscriptEntry[]> {
    try {
        console.log(`[fetchTranscriptFallback] >>> ENTERING fallback for videoId: ${videoId}`); // Log entry to fallback
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

        if (!transcriptItems || transcriptItems.length === 0) {
            console.log("[fetchTranscriptFallback] No transcript available from fallback library.");
            return [];
        }

        // Convert to our TranscriptEntry format
        const transcript: TranscriptEntry[] = transcriptItems.map(item => ({
            text: item.text,
            timeStamp: formatTimestamp(item.offset) // Ensure formatTimestamp handles potential errors
        }));

        console.log(`[fetchTranscriptFallback] Fallback method successful for videoId: ${videoId}.`);
        return transcript;
    } catch (fallbackError) {
        console.error(`[fetchTranscriptFallback] Fallback method FAILED for videoId: ${videoId}:`, fallbackError);
        return []; // Return empty array as last resort
    }
}

// ... rest of getYoutubeTranscript function ...
export async function getYoutubeTranscript(videoId: string) {
    const user = await currentUser();
    if(!user?.id){
        throw new Error("User not found");
    }
    const existingTranscript = await convex.query(
        api.transcript.getTranscriptByVideoId,
        { videoId, userId: user.id }
    );
    
    if(existingTranscript){
        console.log("Transcript already exists for this video. Skipping storage.");
        return {
            cache: "This video has already been transcribed - Accessing cached transcript instead of using a token",
            transcript: existingTranscript.transcript,
        };
    }
    
    try {
        // Try to get transcript with fallback mechanism
        const transcript = await fetchTranscript(videoId);
        
        if (transcript.length === 0) {
            return {
                transcript: [],
                cache: "No transcript available for this video. It may not have captions.",
            };
        }
        
        await convex.mutation(api.transcript.storeTranscript, {
            userId: user.id,
            videoId,
            transcript,
        });
        
        await client.track({
            event: featureFlagEvents[FeatureFlag.TRANSCRIPTION].event,
            company: {
                id: user.id,
            },
            user: {
                id: user.id,
            }
        });
        
        return {
            transcript,
            cache: "The video transcribed is using the token. Transcript fetched and stored successfully",
        };
    } catch (error) {
        console.error("Error fetching transcript:", error);
        return {
            transcript: [],
            cache: "Error fetching transcript. Unable to retrieve captions for this video.",
        };
    }
}