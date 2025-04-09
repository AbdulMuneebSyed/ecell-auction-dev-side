"use client";

import { useEffect, useState } from "react";

interface Team {
  _id: string;
  teamName: string;
  teamBalance: number;
  teamRating: number;
  numberofPlayers: number;
  number_foreign: number;
}

type SortKey = keyof Omit<Team, "_id" | "teamName">;

export default function TeamRankings() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("teamRating");

  const fetchTeams = () => {
    setLoading(true);
    fetch("http://192.168.1.6:8080/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTeams(data.data);
        } else {
          setError("Failed to fetch data");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        setError("Failed to load team data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTeams();

    // Add event listener for player sold event
    const handlePlayerSold = () => {
      console.log("Player sold event detected, refreshing team rankings");
      fetchTeams();
    };

    window.addEventListener("playerSold", handlePlayerSold);

    // Clean up event listener
    return () => {
      window.removeEventListener("playerSold", handlePlayerSold);
    };
  }, []);

  const sortedTeams = [...teams].sort((a, b) => b[sortKey] - a[sortKey]);

  if (loading)
    return (
      <div className="text-center py-4 text-black">
        Loading team rankings...
      </div>
    );
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-center text-black">
        TEAM RANKINGS
      </h2>

      <div className="flex justify-between items-center mb-4">
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="p-2 border rounded text-black"
        >
          <option value="teamRating">Sort by Rating</option>
          <option value="teamBalance">Sort by Balance</option>
          <option value="numberofPlayers">Sort by Player Count</option>
          <option value="number_foreign">Sort by Foreign Players</option>
        </select>

        <button
          onClick={fetchTeams}
          className="px-4 py-2 bg-navy-700 text-white rounded hover:bg-navy-800"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-navy-700 text-white">
              <th className="px-4 py-2 border">Team Name</th>
              <th className="px-4 py-2 border">Rating</th>
              <th className="px-4 py-2 border">Balance</th>
              <th className="px-4 py-2 border">Players</th>
              <th className="px-4 py-2 border">Foreign Players</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {sortedTeams.map((team, index) => (
              <tr
                key={team._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 border">{team.teamName}</td>
                <td className="px-4 py-2 border">{team.teamRating}</td>
                <td className="px-4 py-2 border">
                  {team.teamBalance.toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{team.numberofPlayers}</td>
                <td className="px-4 py-2 border">{team.number_foreign}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
