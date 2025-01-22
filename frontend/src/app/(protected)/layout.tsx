"use client";
import { useAuth } from "@/lib/auth_handler";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function NeedLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authUser, loading, signOut } = useAuth();
  // const [toolbar, setToolBar] = useState(null as React.ReactNode);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Loading Layout. User:", authUser);
  }, [authUser]);

  // redirect with login page
  // if (!authUser && !loading) {
  //   router.push("/login");
  // }

  return (
    <div>
      {(loading && <div>Loading App...</div>) ||
        (authUser && <> {children} </>) ||
        router.push("/login?next=" + pathname)}
    </div>
  );
}
