import { DalleImageGeneration } from "@/action/dalleImageGeneration"
import { FeatureFlag } from "@/features/flags"
import { client } from "@/lib/schematic"
import { tool } from "ai"
import { userAgent } from "next/server"
import {z} from "zod"




export const generateImage = (videoId : string ,userId: string) =>
    tool({
        description: "Generate a thumbnail for this video",
        parameters:  z.object({
            prompt: z.string().describe("The prompt to generate the image"),
            videoId: z.string().describe("The id of the video"),

            
        }),
        execute:async({prompt})=>{
            const schematicCtx = {
                company : {id:userId},
                user:{
                    id:userId
                }
            
            }
            const isImageGenerationEnabled = await client.checkFlag(
                schematicCtx,
                FeatureFlag.IMAGE_GENERATION
            );
            if(!isImageGenerationEnabled){
               return {
                    error: "Image generation is not enabled for this user"
                }
               
            }
            const image = await DalleImageGeneration(prompt,videoId);
            return {image};
        }
    })
