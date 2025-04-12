"use client"
import React, { useCallback } from 'react'
import { VideoDetails } from '@/types/types'
import { useState, useEffect, useRef } from 'react'
import { getVideoDetails } from '@/action/getVideodetails'
import Image from 'next/image'
import { Calendar, Eye, ThumbsUp } from 'lucide-react'
import { MessageCircle } from 'lucide-react'
import { useYoutubeHistoryContext } from '@/context/YoutubeHistoryContext'

function YoutubeVideoDetails({videoId}:{
    videoId:string
}) {
  const [video, setVideo] = useState<VideoDetails | null>(null);
  // Use the shared context instead of creating a new instance
  const { addToHistory } = useYoutubeHistoryContext();
  const hasAddedToHistory = useRef(false);
  
  // Use useCallback to prevent recreation of the function on each render
  const fetchVideoDetails = useCallback(async () => {
    if (!videoId) return;
    
    try {
      const videoData = await getVideoDetails(videoId);
      setVideo(videoData);
      
      // Add to history when video details are loaded, but only once
      if (videoData && !hasAddedToHistory.current) {
        console.log("Adding to history:", videoId, videoData.title);
        addToHistory(videoId, videoData.title);
        hasAddedToHistory.current = true;
      }
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  }, [videoId, addToHistory]);

  useEffect(() => {
    hasAddedToHistory.current = false;
    fetchVideoDetails();
  }, [fetchVideoDetails]);
  
  if(!video) return (
    <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
    </div>
  );

  return <div className='@container bg-white rounded-xl'>
    <div className='flex flex-col  gap-8'>
        {/* video Thumbnail */}
        <div className='flex-shrink-0'>
            <Image
            src={video.thumbnail}
            alt={video.title}
            width={500}
            height={500}
            className='w-full rounded-xl shadow-md hover:shadow-xl transistion-shadow duration-300' 
            />

        </div>
        {/* Video Details */}
        <div className='flex-grow space-y-4'>
            <h1 className='text-2xl font-semibold text-gray-800 leading-tight line-clamp-2'>{video.title}</h1>

           
        </div>
        {/* Channel Details  */}
        <div className="mt-4">
            <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-5 gap-4">
                {/* Channel Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <Image
                        src={video.channel.thumbnail}
                        alt={video.channel.title}
                        width={48}
                        height={48}
                        className="w-16 h-16 rounded-full border-2 border-white shadow-lg mx-auto mb-4"
                    />
                    <div className="text-center">
                        <p className="text-lg font-bold text-gray-800 mb-2">{video.channel.title}</p>
                        <p className="bg-blue-50 rounded-full px-4  text-sm text-blue-700 font-medium inline-block max-w-full break-words">
                            {video.channel.subscribers} subscribers
                        </p>
                    </div>
                </div>

                {/* Date Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-6 h-6 text-indigo-600" />
                        <p className="text-gray-700 font-medium">Published</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{new Date(video.publishedAt).toLocaleDateString()}</p>
                </div>

                {/* Views Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-6 h-6 text-emerald-600" />
                        <p className="text-gray-700 font-medium">Views</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{video.views}</p>
                </div>

                {/* Likes Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <ThumbsUp className="w-6 h-6 text-rose-600" />
                        <p className="text-gray-700 font-medium">Likes</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{video.likes}</p>
                </div>
                {/* Comments Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <MessageCircle className="w-6 h-6 text-amber-600" />
                        <p className="text-gray-700 font-medium">Comments</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{video.comments}</p>
                </div>
                
            </div>
        </div>
        


    </div>
    
  </div>
}

export default YoutubeVideoDetails
