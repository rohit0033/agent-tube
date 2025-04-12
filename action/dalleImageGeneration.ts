"use server";

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import { getConvexClient } from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";


const IMAGE_SIZE = "1792x1024" as const;
const convexClient = getConvexClient();

export const DalleImageGeneration = async (prompt: string, videoId: string) => {
    const user =  await currentUser();
    if(!user?.id){
        throw new Error("User not found")
    }
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      
    })
    if(!prompt){
        throw new Error("Prompt is required")
    }
    const imageResponse = await openai.images.generate({
        model:"dall-e-3",
        prompt,
        n: 1,
        size: IMAGE_SIZE,
        quality:"standard",
        style:"vivid"
    })
    const imageUrl = imageResponse.data[0].url;
    if(!imageUrl){
        throw new Error("Image generation failed")
    }
    
    // Step 1 : Get short lived upload url
    const postUrl = await convexClient.mutation(api.images.generateUploadUrl);

    // Step 2 : Downlaod the image from URL
    const image :Blob = await fetch(imageUrl).then((res) => res.blob());

    // Step 3 : Upload the image to convex storage bucket

    const result = await fetch(postUrl,{
        method: "POST",
        headers:{
            "Content-Type": image!.type,
           
        },
        body:image
    })
    const {storageId} = await result.json();
     // Step 4 : Saving the newly allocated storage Id to the database
    await convexClient.mutation(api.images.storeImage,{
        userId: user.id,
        videoId,
        storageId,
    })

    const dbImageUrl = await convexClient.query(api.images.getImage,{
        userId: user.id,
        videoId,
    })
    await client.track({
        event:featureFlagEvents[FeatureFlag.IMAGE_GENERATION].event,
        company:{
            id:user.id,
        },
        user:{
            id:user.id,
        }
    })
    return {
        imageUrl: dbImageUrl
    }


}