"use server"
import { currentUser } from "@clerk/nextjs/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";
const apiKey = process.env.SCHEMATIC_API_KEY;
if(!apiKey) {
    throw new Error("Missing Schematic API Key");
}

const client = new SchematicClient({
    apiKey
})
export async function getTemproaryAccessToken() {
    const user = await currentUser();
    if(!user) {
        throw new Error("User not found");
    }
    const response = await client.accesstokens.issueTemporaryAccessToken({
        resourceType:"company",
        lookup:{
            id: user.id
        }
    })

    return response.data.token;

}