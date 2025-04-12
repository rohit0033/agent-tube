import React from 'react'
import Form from "next/form"
import { analyseYoutubeVideo } from '@/action/analyseYoutubeVideo'
import AnalyzeButton from './AnalyzeButton'

function youTubeform() {
return (
    <div className='w-full max-w-4xl mx-auto mt-9'>
        <Form action={analyseYoutubeVideo} className='flex flex-col sm:flex-row gap-4 items-center'>
            <div className='flex-grow'>
                <input
                    className='w-full px-6 py-1 text-gray-700 bg-white border-2 border-gray-300 
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent transition-all duration-300 ease-in-out
                    text-base placeholder-gray-500 shadow-sm hover:border-blue-400'
                    id='youtubeUrl'
                    type='text'
                    name='url'
                    placeholder='Paste your YouTube video URL here (e.g., https://youtube.com/watch?v=...)'
                
                />
            </div>
            <div className='sm:flex-shrink-0'>
                <AnalyzeButton />
            </div>
        </Form>
    </div>
)
}

export default youTubeform;
