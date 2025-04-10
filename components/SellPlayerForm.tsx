"use client";

import type React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import PlayerInput from "./PlayerInput";

interface Team {
  teamName: string;
  teamId?: string;
  _id?: string;
  teamRating?: number;
  teamBalance?: number;
}

interface SellPlayerStruct{
  playerId: string;
  playerName: string;
}

export default function SellPlayerForm() {
  const [playerName, setPlayerName] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [price, setPrice] = useState("");
  const [team, setTeam] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<SellPlayerStruct[]>([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState<SellPlayerStruct[]>([]);
  const [showTeamSuggestions, setShowTeamSuggestions] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch data
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        // Fetch teams from API
        // const teamsResponse = await fetch("http://192.168.1.6:8080/api/teams", {
          const teamsResponse = await fetch("http://localhost:8080/api/teams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const teamsData = await teamsResponse.json();
        console.log("API Response for teams:", teamsData);

        if (teamsData.success && Array.isArray(teamsData.data)) {
          setTeams(teamsData.data);
        } else if (Array.isArray(teamsData)) {
          setTeams(teamsData);
        } else {
          console.error(
            "Failed to fetch teams data or unexpected format:",
            teamsData
          );
          setTeams([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    const fetchPlayerData = async () => {
      setLoading(true);
      try {
        // Fetch all players from API
        // const playersResponse = await fetch("http://192.168.1.6:8080/api/fetch-players-for-sell-player", {
          const playersResponse = await fetch("http://localhost:8080/api/fetch-players-for-sell-player", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const playersData = await playersResponse.json();
        console.log("API Response for players:", playersData);

        if (playersData.success && Array.isArray(playersData.data)) {
          setPlayers(playersData.data);
        } else if (Array.isArray(playersData)) {
          setPlayers(playersData);
        } else {
          console.error(
            "Failed to fetch teams data or unexpected format:",
            playersData
          );
          setTeams([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
    fetchPlayerData();
    // fetchUnsoldPlayerData();
  }, []);

  useEffect(() => {
    // Filter teams based on input
    if (team.trim() === "") {
      setFilteredTeams([]);
    } else {
      const filtered = teams.filter((t) => {
        return (
          t.teamName && t.teamName.toLowerCase().includes(team.toLowerCase())
        );
      });
      setFilteredTeams(filtered);
    }
  }, [team, teams]);

  const handleTeamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeam(e.target.value);
    setSelectedTeamId(""); // Reset selected team ID when input changes
    setShowTeamSuggestions(true);
  };

  const handleSelectTeam = (teamObj: Team) => {
    setTeam(teamObj.teamName || "");
    setSelectedTeamId(teamObj._id || teamObj.teamId || "");
    setShowTeamSuggestions(false);
  };

  const handleSelectPlayer = (playerId: string, playerName: string) => {
    setSelectedPlayerId(playerId);
    setPlayerName(playerName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName || !price || !team) {
      setMessage("Please fill in all fields");
      return;
    }

    if (!selectedPlayerId) {
      setMessage("Error: Please select a player from the dropdown");
      return;
    }

    if (!selectedTeamId) {
      setMessage("Error: Please select a team from the dropdown");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // Create request payload with IDs
      const payload = {
        playerId: selectedPlayerId,
        teamID: selectedTeamId,
        soldPrice: Number.parseInt(price),
      };

      console.log("Selling player with payload:", payload);

      // Make POST request using axios
      const response = await axios.post(
        // "http://192.168.1.6:8080/api/sell-player",
        "http://localhost:8080/api/sell-player",
        payload
      );

      if (response.data.success) {
        setMessage(
          `Success: ${response.data.message || "Player sold successfully"}`
        );
        // Reset form
        setPlayerName("");
        setSelectedPlayerId("");
        setPrice("");
        setTeam("");
        setSelectedTeamId("");

        // Trigger a refresh of the team rankings
        const event = new CustomEvent("playerSold");
        window.dispatchEvent(event);
      } else {
        setMessage(
          `Error: ${response.data.message || "Failed to sell player"}`
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle structured error response from server
        setMessage(
          `Error: ${error.response.data.message || "Failed to sell player"}`
        );
      } else {
        setMessage("Failed to sell player. Please try again.");
      }
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 text-black"
    >
      <div>
        <label className="block text-sm font-medium mb-1 text-black">
          Name of Player
        </label>
        <PlayerInput
          value={playerName}
          onChange={setPlayerName}
          onSelectPlayer={handleSelectPlayer}
          players={players} // Pass the players data to the component
        />
        {selectedPlayerId && (
          <div className="mt-1 text-xs text-green-600">
            Player ID: {selectedPlayerId}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-black">
          Price
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy-600 text-black"
        />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium mb-1 text-black">
          Team
        </label>
        <input
          type="text"
          value={team}
          onChange={handleTeamInputChange}
          onFocus={() => setShowTeamSuggestions(true)}
          placeholder="Select team"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy-600 text-black"
        />

        {showTeamSuggestions && filteredTeams.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-sm max-h-60 overflow-y-auto">
            {filteredTeams.map((teamObj, index) => (
              <div
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                onClick={() => handleSelectTeam(teamObj)}
              >
                {teamObj.teamName}
              </div>
            ))}
          </div>
        )}
        {selectedTeamId && (
          <div className="mt-1 text-xs text-green-600">
            Team ID: {selectedTeamId}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isSubmitting ? "Processing..." : "Sell this player"}
      </button>

      {message && (
        <div
          className={`mt-2 p-2 text-sm rounded ${
            message.startsWith("Success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
