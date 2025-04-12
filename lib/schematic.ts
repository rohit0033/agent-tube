import { SchematicClient } from "@schematichq/schematic-typescript-node";

if(!process.env.SCHEMATIC_API_KEY) {
    throw new Error("Schematic API key is not set. Please set the SCHEMATIC_API_KEY environment variable.");
}
export const client = new SchematicClient({
    apiKey:process.env.SCHEMATIC_API_KEY as string,
    cacheProviders:{
        flagChecks:[ ]
    }
})