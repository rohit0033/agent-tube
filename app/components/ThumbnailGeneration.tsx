import { useUser } from '@clerk/nextjs'
import React from 'react'
import Usage from './Usage';
import { FeatureFlag } from '@/features/flags';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function ThumbnailGeneration({videoId}:{
  videoId: string
}) {

  const {user} = useUser();
  const images = useQuery(api.images.getImages,{
    videoId,
    userId: user?.id ?? "",
  })
  console.log("Image debugging",images);
  return (
    <div className='rounded-xl flex flex-col p-4 border'>
      <div className='min-w-52'>
        <Usage
           featureFlag={FeatureFlag.IMAGE_GENERATION}
           title='Thumbnail Generation'
        
        />

      </div>
      {/* Simple horizonal scrolling  */}
      <div className={`flex overflow-auto gap-4 ${images?.length && "mt-4"}`}>
        {images?.map((image)=>// To do remove any 
         image.url && (
          <div  key = {image._id} className='flex-none w-[200px] h-[110px] rounded-lg overflow x-auto'>
            <Image 
             src={image.url}
             loading='lazy'
             alt='Generated image'
              width={200}
              height={200}
              className='object-cover'
            />
          </div>
         )
         )}

      </div>
      {/* No images Generated yet */}
      {!images?.length && (
        <div className='text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-100'>
          <p className='text-gray-500'> No thumbnails have been generated</p>
          <p className=' text-sm text-gray-500 mt-1'>Please generate some thumbnails by uploading videos</p>
        </div>
      )}
      
    </div>
  )
}

export default ThumbnailGeneration
