"use server"

import { getVideoIdfromId } from "@/lib/getVideoIdfromId";
import { redirect } from "next/navigation";

export async function  analyseYoutubeVideo(formData:FormData) {
   const url = formData.get('url')?.toString();
   if(!url) return;

   const vidoeId = getVideoIdfromId(url);
   // console.log("Video id",vidoeId);

   if(!vidoeId) return;
   redirect(`/video/${vidoeId}/analysis`);

}