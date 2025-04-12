"use server"

import { api } from '@/convex/_generated/api';
import { FeatureFlag, featureFlagEvents } from '@/features/flags';
import { getConvexClient } from '@/lib/convex';
import { client } from '@/lib/schematic';
import { currentUser } from '@clerk/nextjs/server';

import OpenAI from 'openai';

const convex = getConvexClient();

export async function generateTitles(
  videoId: string,
  videoSummary: string,
  considerations: string
) {
  const user = await currentUser();
    if (!user?.id) {
        throw new Error("User not found");
    }

    console.log("Generating title for videoId:", videoId);
    console.log("Video Summary:", videoSummary);
    console.log("Considerations:", considerations);

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful YouTube video creator assistant that creates high quality SEO friendly concise video titles`, 
                },
                {
                    role: 'user',
                    content: `Please provide ONE concise Youtube title (and nothing else) for this video. Focus on the main point and key takeaways, it should be SEO friendly and 100 characters or less: \n\nVideo Summary: ${videoSummary}\n\nConsiderations: ${considerations}`,
                }
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const title = response.choices[0]?.message?.content || "Unable to generate title"
        await convex.mutation(api.titles.generate,{
            videoId,
            userId: user.id,
            title:title,
        })   


        await client.track({
          event: featureFlagEvents[FeatureFlag.TITLE_GENERATION].event,
          company :{
            id: user.id,
           
          },
          user :{
            id: user.id,
          }

        })
        console.log("Generated title:", title);
        return title;
    } catch (error) {
        console.error("Error generating title:", error);
        throw new Error("Error generating title");
      
    }
}