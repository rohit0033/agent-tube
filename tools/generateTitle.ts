import {  generateTitles } from "@/action/titleGeneration";
import { tool } from "ai"
import {z} from "zod"


const generateTitle = tool({
    description:"Generate a title for the video based on its summary and specific considerations.", // Slightly improved description
    parameters:z.object({
        videoId:z.string().describe("The ID of the video the title is for"),
        videoSummary:z.string().describe("A concise summary of the video content"),
        // Make considerations optional, provide a default if needed by the action
        considerations:z.string().optional().describe("Specific instructions for the title style (e.g., 'make it funny', 'SEO-friendly', 'clickbait')"), 
    }),
    execute:async({videoId, videoSummary, considerations = "Create a concise and relevant title"})=>{ // Provide a default consideration
        try {
            console.log(`[generateTitle Tool] Executing for videoId: ${videoId}`);
            console.log(`[generateTitle Tool] Summary: ${videoSummary.substring(0, 100)}...`); // Log snippet
            console.log(`[generateTitle Tool] Considerations: ${considerations}`);

            const title = await generateTitles(
                videoId,
                videoSummary,
                considerations // Pass considerations to the action
            );

            console.log(`[generateTitle Tool] Successfully generated title: ${title}`);
            // Return success status along with the title for better handling
            return { title: title, success: true }; 
        } catch (error) {
            console.error(`[generateTitle Tool] Error executing generateTitles action:`, error);
            // Return an error structure
            return { 
                title: null, 
                success: false, 
                error: error instanceof Error ? error.message : "Unknown error during title generation" 
            };
        }
    }
})

export default generateTitle;