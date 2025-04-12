import { FeatureFlag } from '@/features/flags';
import { useUser } from '@clerk/nextjs'
import { useSchematicEntitlement } from '@schematichq/schematic-react';
import React from 'react'
import Usage from './Usage';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function TitleGenerations({videoId}:{
    videoId: string
}) {
  const {user}= useUser();
  const titles = useQuery(api.titles.list,{
    videoId,
    userId: user?.id ?? "", // Pass userId, handle potential null user
  });
  const {value: isTitleGenerationEnabled} = useSchematicEntitlement(
    FeatureFlag.TITLE_GENERATION
  )
    const copyToClipboard = (text:string)=>{
        navigator.clipboard.writeText(text);
    }

  return (
    <div className='rounded-xl flex flex-col p-4 border'>
      <div className='min-w-52'>
        <Usage
           featureFlag={FeatureFlag.TITLE_GENERATION}
           title='Titles'
        
        />
        {/* Titles generated */}
        <div className='space-y-3 mt-4 max-h-[280px] overflow-y-auto'>
            {titles?.map((title:any)=>(
            <div
             key={title._id}
             className='group relative p-4 rounded-l border border-gray-100 bg-gray-50 hovwe:border-blue-100 hover:bg-blue-50 tansition-all duration-200'
            >  
             <div className='flex items-start  justify-between gap-4'>
                <p className='text-sm text-gray-900 leading-relaxed'>
                    {title.title}

                </p>
                <button
                 onClick={()=>copyToClipboard(title.title)}
                >

                </button>
            </div>
                
            </div>
              
            ))}

        </div>
        {/* No Titlesated yet */}
      {!titles?.length && !!isTitleGenerationEnabled && (
        <div className='text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-100'>
          <p className='text-gray-500'> No Titles have been generated</p>
          <p className=' text-sm text-gray-500 mt-1'>Please generate some Titles by uploading videos</p>
        </div>
      )}

      </div>
    </div>
  )
}

export default TitleGenerations
