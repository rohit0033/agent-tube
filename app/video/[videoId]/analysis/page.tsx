"use client"
import AiAgentChat from '@/app/components/AiAgentChat';
import ThumbnailGeneration from '@/app/components/ThumbnailGeneration';
import TitleGenerations from '@/app/components/TitleGenerations';
import Transcriptions from '@/app/components/Transcriptions';
import Usage from '@/app/components/Usage'
import YoutubeVideoDetails from '@/app/components/YoutubeVideoDetails';
import { FeatureFlag } from '@/features/flags'
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation'
import { useState,useEffect } from 'react';
import React from 'react'
import {Doc} from "@/convex/_generated/dataModel"
import { createOrGetVideo } from '@/action/createOrGetVideo';

function AnalysisPage()   {
  

    const params = useParams<{videoId:string}>();

    const {videoId} = params;
    const {user} = useUser();
    const [video,setVideo]= useState<Doc<"videos"> | null | undefined>(
      undefined
    )
    useEffect(()=>{
      if(!user?.id) return ;
      const fetchVideo = async()=>{
        const response = await createOrGetVideo(videoId as string , user.id);
        if(!response.success){
          console.error(response.error);
          return;
        }else{
          setVideo(response.data);
        }
      }
      fetchVideo();
    },[videoId,user])
  return (
    <div className='xl:container mx-auto px-4 md:px-0'>
        <div className='grid grid-col-1 lg:grid-cols-2 gap-4 min-h-screen'>
            {/* Left Side  */}
            <div className='order-2 lg:order-1 flex flex-col gap-4 bg-white lg:border-r border-gray-200 p-6 overflow-y-auto max-h-[calc(100vh-6rem)]'> 
                {/* Analysis Video */}
                <div className='flex flex-col gap-4 p-4 border border-gray-200 rounded-xl'>
                    <Usage
                     featureFlag={FeatureFlag.ANALYSE_VIDEO}
                    title='Analysis Video' 
                    />

                </div>
                {/* Youtube video details */}
                <YoutubeVideoDetails videoId={videoId} />
                {/* Thumbnail Generation  */}
                <ThumbnailGeneration videoId={videoId} />
                {/* Title generations  */}
                <TitleGenerations videoId={videoId} />
                {/* Transcriptions */}
                <Transcriptions videoId={videoId} />


            </div>
            {/* Right Side */}
            <div className='order-1 lg:order-2 lg:sticky lg:top-5 h-[500px] md:h-[calc(100vh-6rem)] overflow-y-auto'>
              {/* Ai Agent chat Section */}
              <AiAgentChat videoId={videoId} />
            </div>


        </div>
       
      
    </div>
  )
}

export default AnalysisPage
