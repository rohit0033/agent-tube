"use client";

import { useState } from "react";
import Link from "next/link";
import { useYoutubeHistoryContext } from "@/context/YoutubeHistoryContext";
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent, 
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon, Home, Compass, History, Play, Trash2 } from "lucide-react";

export default function AppSidebar({ children }: { children: React.ReactNode }) {
  // Use the shared context instead of creating a new instance
  const { history, clearHistory } = useYoutubeHistoryContext();
  const [open, setOpen] = useState(true);
  
  return (
    <SidebarProvider defaultOpen={true} open={open} onOpenChange={setOpen}>
      <div className="flex w-full h-full overflow-hidden">
        {/* Add a fixed trigger button that's always visible when sidebar is collapsed */}
        <div 
          className={`fixed top-20 left-3 z-50 transition-opacity duration-300 ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8 rounded-full shadow-md bg-white"
            onClick={() => setOpen(true)}
          >
            <PanelLeftIcon className="h-4 w-4" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </div>

        <Sidebar variant="inset" className="z-40 mt-2">
        <SidebarTrigger className="visible opacity-100" />
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="flex justify-between items-center">
                <div className="flex items-center">
                  <History className="mr-1" size={14} />
                  <span>Recent Videos</span>
                </div>
                {history.length > 0 && (
                  <button 
                    onClick={() => clearHistory()}
                    className="hover:text-red-500 transition-colors"
                    title="Clear history"
                    type="button"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </SidebarGroupLabel>
              
              <SidebarMenu>
                {history.length > 0 ? (
                  history.map((item) => (
                    <SidebarMenuItem key={item.videoId}>
                      <SidebarMenuButton asChild tooltip={item.title || item.videoId}>
                        <Link href={`/video/${item.videoId}/analysis`}>
                          <Play className="mr-2" size={18} />
                          <span className="truncate">
                            {item.title || `Video ${item.videoId.substring(0, 6)}...`}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No history yet
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
