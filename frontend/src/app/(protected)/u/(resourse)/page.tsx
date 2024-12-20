"use client";
import React, { useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToolbar } from "@/app/(protected)/u/nav_tools";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddContributers } from "@/components/ui/add-collaborators";
import { useSearchParams, useRouter } from "next/navigation";
import { httpsCallable, getFunctions } from "firebase/functions";
import Link from "next/link";

const getPortalLink = async () => {
  const returnUrl = window.location.href;
  // load environment variables STRIPE_CUSTOMER_PORTAL_RETURN_URL
  // const URL = process.env.NEXT_PUBLIC_STRIPE_PORTAL_LINK;
  const createPortalLink = httpsCallable(getFunctions(), "createPortalLink", {
    limitedUseAppCheckTokens: true,
  });
  const response = await createPortalLink({
    returnUrl,
    // locale: "auto",
    // configuration: {
    //   features: ["customer_update"],
    // },
  });
  console.log("response", response);
  return response && (response.data as any);
};

// button to open billing portal
const BillingPortalButton = () => {
  const router = useRouter();

  const openBillingPortal = async () => {
    const portalLink = await getPortalLink();
    console.log("portalLink", portalLink);
    if (portalLink && portalLink.url) {
      router.push(portalLink.url);
    }
  };

  return (
    <button
      onClick={openBillingPortal}
      className="rounded-lg px-4 py-2 bg-primary text-primary-foreground"
    >
      Open Billing Portal
    </button>
  );
};

const SearchTool = ({ item_id }: { item_id: string }) => {
  return (
    (item_id && (
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
                <AddContributers
                  item_id={item_id}
                  access={dummyDoc.access}
                  pending_access={dummyDoc.pending_access}
                />
                <span className="sr-only">Collaborate</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Collaborate</TooltipContent>
          </Tooltip>
        </div>
      </div>
    )) ||
    null
  );
};

export default function ItemPage() {
  // const { setNavTools } = useToolbar();
  const params = useSearchParams();
  const router = useRouter();

  let item_id = params.get("id");

  useEffect(() => {
    // item_id && setNavTools(<SearchTool item_id={item_id} />);
    console.log(
      "env",
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "not found"
    );
  }, []);

  return (
    (item_id && (
      <div>
        <h1>My Post: {item_id}</h1>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          {/* <TestCheckoutBtn /> */}
          <button
            onClick={() => router.push("/u/checkout")}
            className="rounded-lg px-4 py-2 bg-primary text-primary-foreground"
          >
            Go to Checkout
          </button>
          <button
            onClick={() => router.push("/u/checkout2")}
            className="rounded-lg px-4 py-2 bg-primary text-primary-foreground"
          >
            Go to Checkout 2
          </button>
          <BillingPortalButton />
        </div>
      </div>
    )) || <ItemNotFound />
  );
}

function ItemNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-2xl font-semibold">Item not found</h1>
      <p className="text-muted-foreground">
        The item you are looking for does not exist.
      </p>
    </div>
  );
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
    },
  },
  pending_access: {},
};
