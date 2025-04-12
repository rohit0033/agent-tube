"use client";

import { useUser } from "@clerk/nextjs";
import { useSchematic, useSchematicEvents } from "@schematichq/schematic-react";
import { useEffect } from "react";

const SchematicWrapped = ({children}:{children: React.ReactNode})=>{
   const {identify } = useSchematicEvents();
   const {user} =  useUser();
   

   useEffect(()=>{
    const userName=
      user?.username ??
      user?.fullName ??
      user?.emailAddresses?.[0]?.emailAddress ??
      user?.id;
      if (user?.id){
        identify({
            // Compnay Level
            company:{
                keys:{
                    id: user.id
                },
                name: userName
            },
            // User Level
            keys:{
                id: user.id
            },
            name: userName,
             
        })
      }


   },[user,identify])



   return children 
};
export default SchematicWrapped;