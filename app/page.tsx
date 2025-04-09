"use client";

import { useState, useEffect } from "react";
import SellPlayerForm from "@/components/SellPlayerForm";
import TeamRankings from "@/components/TeamRankings";

export default function Home() {
  const [showRankings, setShowRankings] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Add event listener for player sold event
    const handlePlayerSold = () => {
      console.log("Player sold event detected in Home component");
      // Force refresh by updating the key
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("playerSold", handlePlayerSold);

    // Clean up event listener
    return () => {
      window.removeEventListener("playerSold", handlePlayerSold);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-navy-700 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">IPL Auction Dev Side</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 flex flex-col gap-8">
        {/* Player Management */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6 text-black text-center">
            PLAYER MANAGEMENT
          </h2>
          <SellPlayerForm />

          {/* See Teams Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowRankings(!showRankings)}
              className="px-4 py-2 bg-navy-700 text-white rounded hover:bg-navy-800"
            >
              {showRankings ? "Hide Team Rankings" : "Show Team Rankings"}
            </button>
          </div>
        </div>

        {/* Team Rankings - Only shown when button is clicked */}
        {showRankings && (
          <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <TeamRankings key={refreshKey} />
          </div>
        )}
      </main>
    </div>
  );
}
