import { HardHat } from "lucide-react";

export default function gamePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#081C29] to-[#0f2c3f] px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <HardHat className="w-16 h-16 text-[#23ccdc] animate-bounce" />
        </div>
        <h1 className="text-white text-3xl sm:text-4xl font-bold">
          Page Under Construction
        </h1>
        <p className="text-[#cccccc] text-lg sm:text-xl max-w-md mx-auto">
          We're working hard to bring you something awesome. Check back soon!
        </p>
      </div>
    </main>
  );
}

