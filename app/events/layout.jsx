'use client'

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./_components/header";



function EventsLayout({ children }) {
  const router = useRouter();
  const { user, authLoaded } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [authLoaded, user, router]);

  if (!authLoaded) return null;

return (
  <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
            {children}
       
  </div>
  )
}
export default EventsLayout