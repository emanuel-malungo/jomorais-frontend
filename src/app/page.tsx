"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a landing page
    router.push("/landing");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B6C4D] to-[#4a7c5d] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirecionando...</p>
      </div>
    </div>
  );
}
