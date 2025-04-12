import { error } from "console";
import { client } from "./schematic";
import { featureFlagEvents } from "@/features/flags";

export async function checkFeatureUsageLimit(
    userId: string,
    eventSubtype:string
): Promise<{success:boolean; error?:string}>{
    try {
        const entitlements = await client.entitlements.getFeatureUsageByCompany({
            keys:{
                id:userId,
            }
        })  
        const feature = entitlements.data.features.find(
            (entitlements) => entitlements.feature?.eventSubtype === eventSubtype
        )
        if (!feature) {
           
            return {success:false, error:"Feature not found in entitlements"};
        } 
        const {usage ,allocation}= feature
        if(usage===undefined || allocation === undefined){
            error: `This feature is not vailiable please upgrade`
            return {success:false, error:"Feature usage or allocation is undefined"};
        }
        const hasExceedUsageLimit =usage >= allocation
        if(hasExceedUsageLimit){
           const featureName=  Object.entries(featureFlagEvents).find(
                ([,value])=>
                    value.event === eventSubtype
            )?.[0] || eventSubtype           
            return {success:false, error:`You have reached your ${featureName} limit. Please upgrade your plant to continue`
            }
        }
        return {success:true}
    } catch (error) {
        console.error("Error checking feature usage limit:", error);
        return {success:false, error:"Error checking feature usage limit"};
        
    }
}