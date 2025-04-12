import { getTemproaryAccessToken } from '@/action/getTemporaryAccessToken';

import React from 'react'
import SchematicEmbed from './schematicEmbed';

async function SchematicComponent({
    componentId
}:{ componentId: string }) {
    if(!componentId){
        return null;
    }
    const accessToken =  await getTemproaryAccessToken();
    if(!accessToken){
        throw new Error("Missing Access Token");
    }


  return <SchematicEmbed  accessToken={accessToken} componentId={componentId} />
}

export default SchematicComponent
