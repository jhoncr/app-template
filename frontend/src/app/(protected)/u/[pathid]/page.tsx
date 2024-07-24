"use client";
import React, { useEffect } from "react";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToolbar } from "@/app/(protected)/u/nav_tools";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AddContributers } from "@/components/ui/add-collaborators";

import Link from "next/link";

export default function ItemPage({ params }: { params: { pathid: string } }) {
  const { setTools } = useToolbar();

  useEffect(() => {
    setTools(<SearchTool />);
  }, []);

  const SearchTool = () => {
    return (
      <div className="flex items-center space-x-2">
        <div>
          <Search className=" absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        <div>
        <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                {/* <UserPlus className="h-5 w-5" /> */}
                <AddContributers item_id={params.pathid} access={dummyDoc.access} pending_access={dummyDoc.pending_access} />
                <span className="sr-only">Collaborate</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Collaborate</TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  };

  return <div>My Post: {params.pathid}</div>;
}


const dummyDoc = {
  id: "123",
  title: "A dummy document",
  item_type: "document",
  access: {
    "123": {
      uid: "123",
      email: "dummy@123",
      displayName: "Dummy User",
      role: "admin",

    }
  },
  pending_access: {},
};