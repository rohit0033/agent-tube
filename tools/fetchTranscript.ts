import { getYoutubeTranscript } from "@/action/getYoutubeTranscript"
import { tool } from "ai"
import { z } from "zod"

const fetchTranscript = 
    tool({
        description: "Fetch the transcript of a YouTube video in segments",
        parameters: z.object({
            videoId: z.string().describe("The video ID to fetch for transcript for")
        }),
        execute: async ({videoId}) => {
            try {
                const transcript = await getYoutubeTranscript(videoId);
                return {
                    transcript: transcript?.transcript,
                    cache: transcript?.cache
                };
            } catch (error: any) {
                if (error.message?.includes("CompositeVideoPrimaryInfo not found")) {
                    return {
                        error: "YouTube structure change detected. Unable to parse video information.",
                        suggestion: "Try an alternative transcript source or update the YouTube.js library."
                    };
                }
                
                return {
                    error: `Failed to fetch transcript: ${error.message}`,
                    videoId
                };
            }
        }
    })

export default fetchTranscript