import { NextResponse } from "next/server"
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { StreamData, streamText, tool } from 'ai';
import { getVideoDetails } from "@/action/getVideodetails";
import { headers } from "next/headers";
import fetchTranscript from "@/tools/fetchTranscript";
import { generateImage } from "@/tools/generateImage";
import { currentUser } from "@clerk/nextjs/server";
import {z} from "zod"
import { getVideoIdfromId } from "@/lib/getVideoIdfromId";
import generateTitle from "@/tools/generateTitle";
const openAI = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,

})
const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    headers:{
        "anthropic-beta":"token-efficient-tools-2025-02-19"
    }
})
const model1= anthropic("claude-3-7-sonnet-20250219")

const model = openai('gpt-4-turbo');
export async function POST(req: Request){
    const{ messages,videoId} = await req.json();
    const user = await currentUser();
    if(!user?.id){
        return NextResponse.json({error:"User not found"},{
            status:401
        })
    }
    const videoDetails = await getVideoDetails(videoId);
    console.log("Video Details Fetched for Transcript");

    
const systemMessage = `You are an AI agent ready to accept questions from the user about ONE specific video. The video ID in question is ${videoId} but you will refer to this as ${videoDetails?.title || "Selected Video"}. Use beatiful Emojis to make the conversation more engaging. If an error occurs, explain it to the user and ask them to try again later. If the error suggest the user upgrade, explain that they must upgrade to use the feature, tell them to go to 'Manage Plan' in the header and upgrade. If any tool is used, analyse the response and if it contains a cache, explain that the transcript is cached because they previously transcribed the video saving the user a token use words like database instead of cache to make it more easy to understand. Format for notion.`

   
    const result = streamText({
        model:model,
        messages:[
            ...messages,
            {
                role:"system",
                content:systemMessage
            }
        ],
        tools:{
            fetchTranscript: fetchTranscript,
            generateImage: generateImage(videoId,user.id),
            generateTitle: generateTitle,
            getVideoDetails: tool({
                description:"Get the video details of Youtube Video",
                parameters:z.object({
                    videoId:z.string().describe("The id of the video")
                }),
                execute:async({videoId})=>{
                    const videoDetails = await getVideoDetails(videoId);
                    return videoDetails;
                }
            }),
            extractVideoId: tool({
                description:"Extract the video ID from a Youtube URL",
                parameters:z.object({
                    url:z.string().describe("The Youtube URL")
                }),
                execute:async({url})=>{
                    const videoId = await getVideoIdfromId(url);
                    return {videoId};
                }
            })
        },
        onError:(error:any) => {
            console.error("Error in StreamText",error);
        }
       
    })
    // console.log("Result",result);
    return result.toDataStreamResponse();
}