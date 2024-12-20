"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth_handler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { authUser, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!authUser) {
    return (
      <div className="w-full flex flex-col h-screen items-center justify-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Please loging with your google account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <img src="/logo.svg" alt="logo" className="w-36 h-36 mx-auto" />
              <Button
                variant="outline"
                className="w-full"
                onClick={signInWithGoogle}
              >
                Login with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else if (loading) {
    return <div>Loading...</div>;
  } else {
    router.push(searchParams.get("next") || "/");
  }
}
