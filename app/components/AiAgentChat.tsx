"use client"

import React from 'react'
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { Message, Tool } from 'ai';
import { useSchematic, useSchematicFlag } from '@schematichq/schematic-react';
import { FeatureFlag } from '@/features/flags';
import { ImageIcon, LetterText, PenIcon } from 'lucide-react';

interface ToolInvocation {
    toolCallId:string;
    toolName: string;
    result?: Record<string,unknown>;
}

interface ToolPart{
    type: "tool-invocation";
    toolInvocation : ToolInvocation
    
}
const formatToolInvocation =(part : ToolPart) =>{
    if(!part.toolInvocation) return "unknown tool invocation"
    return `Tool: ${part.toolInvocation.toolName} `
}

function AiAgentChat(
    {videoId}:{videoId:string}
) {
  const {messages,input,handleInputChange,handleSubmit,append,status}= useChat({
    maxSteps :5,
    body:{
        videoId
    }

 })

  const isScriptGenerationEnabled = useSchematicFlag(
    FeatureFlag.SCRIPT_GENERATION
  )
  const isImageGenerationEnabled = useSchematicFlag(
    FeatureFlag.IMAGE_GENERATION
  )
const isTitleGenerationEnabled = useSchematicFlag(
        FeatureFlag.TITLE_GENERATION
 )
 const isVideoAnalysisEnabled = useSchematicFlag(
    FeatureFlag.ANALYSE_VIDEO
    )
  const generateScript = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const userMessage: Message = {
        id:`generate-script-${randomId}`,
        role:"user",
        content:"Generate a step-by-step shooting script for this video that I can use my own channel to produce a video that is similar to this one, dont do any other other steps such as generating a image, just generate script only ",
    }
    append(userMessage);
  }
  const generateImage = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const userMessage: Message = {
        id:`generate-image-${randomId}`,
        role:"user",
        content:"Generate a thumbnail for this video",
    }
    append(userMessage);
  }
  const generateTitle = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const userMessage: Message = {
        id:`generate-title-${randomId}`,
        role:"user",
        content:"Generate a title for this video",
    }
    append(userMessage);
  }

  return (

    <div className='flex flex-col h-full'>
        <div className='hidden lg:block px-4 border-b border-gray-100'>
            <h2 className='text-lg font-semibold text-gray-800'>Ai Agent Chat</h2>
        </div>
        <div className='flex-1 overflow-y-auto px-4 py-4'>
            <div className='space-y-6'>
                {messages.length === 0 && (
                    <div className='flex items-center justify-center h-full min-h-[200px]'>
                       <div className='text-center space-y-2'>
                          <h3 className='text-lg font-medium text-gray-800'>
                            Welcome to AI agent chat
                          </h3>
                          <p className='text-sm text-gray-500'></p>
                          <p className='text-sm text-gray-500'>
                            Ask any question about the video

                          </p>
                       </div>

                    </div>
                )}
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end":"justify-start"}`}>
                        <div className={`max-w-[85%] ${
                            message.role === "user" ? "bg-blue-500":"bg-gray-100"
                        } rounded-2xl px-4 py-3`}>
                            {message.role === "assistant" ? (
                                //Assistant message
                               <div className='space-y-3'>
                                     {message.parts.map((part, index) => part.type === "text" ?(
                                    <div key={index} className='prose prose-sm max-w-none'>
                                    <ReactMarkdown>
                                        {message.content}
                                    </ReactMarkdown>
                                    </div> 

                                ): part.type === "tool-invocation"?(
                                    <div
                                     key={index}
                                    className='bg-white/50 rounded-lg p-2 space-y-2 text-gray-800'
                                    > 
                                     <div className='font-medium text-xs'>
                                        {formatToolInvocation(part as ToolPart)}

                                        
                                    </div>
                                    {(part as ToolPart).toolInvocation.result && (
                                        <pre className='text-xs bg-white/75 p-2 rounded overflow-auto max-h-40'>
                                            {JSON.stringify((part as ToolPart).toolInvocation.result, null, 2)}

                                        </pre>
                                    )}

                                    </div>
                                ):null
                                )}

                               </div>

                            ) : (
                                //User message
                                <div className='prose prose-sm max-w-none text-white'>
                                <ReactMarkdown>
                                    {message.content}
                                </ReactMarkdown>
                                </div>
                            )}
                        </div>
                     </div> 
                ))}

            </div>

        </div>
        <div className='p-4 border-t border-gray-100'>
            <form onSubmit={handleSubmit} className='flex gap-2'>
                <input 
                type='text'
                placeholder={
                    !isVideoAnalysisEnabled ? "Upgrade to Ask a question about the video" : "Ask anything abt video"
                }
                value={input}
                onChange={handleInputChange}
                className='flex-1 border border-gray-200 rounded-full px-4 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <Button type='submit'
                 disabled = {
                    status === "streaming" || status === "submitted" || !isVideoAnalysisEnabled
                 }
                 className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'>
                    {
                        status === "streaming" ? (
                            <span className='animate-pulse'>Ai is replying...</span>
                        ) : status === "submitted" ? (
                            <span>AI is thinking</span>
                        ) : (
                            <span>Send</span>
                        )
                    }
                </Button>
            </form>
            <div className='flex gap-5 mt-4'>
                <button className='text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4
                bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={generateScript}
                type="button"
                disabled={!isScriptGenerationEnabled}
                >
                    <LetterText className='w-4 h-4' />
                    {isScriptGenerationEnabled ? (
                        <span>Generate Script</span>
                    ) : (
                        <span>Upgrade to script Generation</span>
                    )}
                  

                </button>

                <button className='text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4
                bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={generateTitle}
                type="button"
                disabled={!isTitleGenerationEnabled}
                >
                  <PenIcon className='w-4 h-4' />
                  Generate Title

                </button>
                <button className='text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4
                bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={generateImage}
                type="button"
                disabled={!isImageGenerationEnabled}
                >
                    <ImageIcon className='w-4 h-4' />
                    Generate Image
                  

                </button>
            </div>                

        </div> 
      
    </div>
  )
}

export default AiAgentChat
