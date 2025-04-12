"use client"

// import { ClerkProvider } from "@clerk/nextjs";
// import Header from "./Header";
import { SchematicProvider } from "@schematichq/schematic-react";
import SchematicWrapped from "./SchematicWrapped";
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function ClientWrapper({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const SchematicpublishableKey = process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY;
    if (!SchematicpublishableKey) {
      throw new Error("Missing Clerk publishable key");
    }
    return <ConvexClientProvider>
        <SchematicProvider publishableKey={SchematicpublishableKey}>
           <SchematicWrapped> {children}</SchematicWrapped>
        </SchematicProvider>
        
    </ConvexClientProvider>;
  }