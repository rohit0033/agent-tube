import { FeatureFlag } from '@/features/flags'
import { useSchematicEntitlement } from '@schematichq/schematic-react'
import React, { useCallback, useEffect, useState } from 'react'
import Usage from './Usage';
import { getYoutubeTranscript } from '@/action/getYoutubeTranscript';
import { set } from '@schematichq/schematic-typescript-node/core/schemas';


interface TranscriptEntry{
    text: string;
    time: string;
 
}
function Transcriptions( {videoId}:{
    videoId: string
  
}) {
    const[transcript,setTranscript]= useState<{
        transcript: TranscriptEntry[];
        cache:string
    }| null>(null);

    const {featureUsageExceeded}= useSchematicEntitlement(
        FeatureFlag.TRANSCRIPTION
    );

const handleGenerateTranscription = useCallback(
        async(videoId:string)=>{
            if(featureUsageExceeded){
                console.log("Transcription limit exceeeded ")
                return;
        }
        const result = await getYoutubeTranscript(videoId);
        // Map timeStamp to time to match the TranscriptEntry interface
        const formattedTranscript = {
            cache: result.cache,
            transcript: result.transcript.map(entry => ({
                text: entry.text,
                time: entry.timeStamp
            }))
        };
        setTranscript(formattedTranscript);
    },
    [featureUsageExceeded]
);

useEffect(()=>{
    handleGenerateTranscription(videoId);
},[handleGenerateTranscription,videoId])
    
  return (
    <div className='border p-4 pb-0 rounded-xl gap-4 flex flex-col'>
        <Usage
            featureFlag={FeatureFlag.TRANSCRIPTION}
            title='Transcriptions'
        />

        {/* Transcription */}
        {!featureUsageExceeded ? (
            <div className='flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-md p-4'>
                {transcript?(
                    transcript.transcript.map((entry,index)=>(
                        <div key={index} className='flex gap-2'>
                            <span className='text-sm text-gray-500'>{entry.time}</span>
                            <span>{entry.text}</span>
                        </div>
                    ))
                ):(
                    <div className='text-center text-gray-500'>
                        No transcriptions available
                    </div>
                )}


            </div>
        ):null}
      
    </div>
  )
}

export default Transcriptions
