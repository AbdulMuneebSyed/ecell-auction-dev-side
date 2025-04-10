"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";

interface Player {
  name?: string;
  playerName?: string;
  _id?: string;
  id?: string;
  playerId?: string;
}

interface PlayerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectPlayer?: (playerId: string, playerName: string) => void;
  players?: Player[]; 
}

export default function PlayerInput({
  value,
  onChange,
  onSelectPlayer,
  players: propPlayers, // Rename to avoid conflict with state
}: PlayerInputProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Use players from props if available, otherwise fetch them
  useEffect(() => {
    fetch("http://localhost:8080/api/unsold-players", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response for players:", data);

        // Handle different response structures
        if (Array.isArray(data)) {
          setPlayers(data);
          console.log("Set players:", data);
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.data)) {
            setPlayers(data.data);
            console.log("Set players from data.data:", data.data);
          } else if (data.success && Array.isArray(data.players)) {
            setPlayers(data.players);
            console.log("Set players from data.players:", data.players);
          } else {
            console.error("API did not return an array of players:", data);
            setPlayers([]);
          }
        } else {
          console.error("API did not return an array of players:", data);
          setPlayers([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching players:", err);
        setPlayers([]);
      });


    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update filtered players based on input value changes
  useEffect(() => {
    if (!Array.isArray(players)) {
      console.error("players is not an array:", players);
      setFilteredPlayers([]);
      return;
    }

    if (value.trim() === "") {
      setFilteredPlayers([]);
    } else {
      const filtered = players.filter((player) => {
        // Normalize player name access by checking all possible properties
        const playerName = player.name || player.playerName || "";
        return playerName.toLowerCase().includes(value.toLowerCase());
      });
      console.log("Filtered players:", filtered);
      setFilteredPlayers(filtered);
    }
    setHighlightIndex(-1); // reset highlighted index when value changes
  }, [value, players]);

  // Auto scroll into view when the highlighted suggestion changes
  useEffect(() => {
    if (highlightIndex >= 0 && itemRefs.current[highlightIndex]) {
      itemRefs.current[highlightIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectPlayer = (player: Player) => {
    const playerName = player.playerName || "";
    const playerId = player._id || "";
    onChange(playerName);
    if (onSelectPlayer) {
      onSelectPlayer(playerId, playerName);
    }
    setShowSuggestions(false);
  };

  // Enable arrow key navigation and enter to select
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredPlayers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredPlayers.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredPlayers.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredPlayers[highlightIndex];
      if (selected) {
        handleSelectPlayer(selected);
      }
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder="Name of Player"
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy-600 text-black"
      />

      {showSuggestions && filteredPlayers.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-sm max-h-60 overflow-y-auto"
        >
          {filteredPlayers.map((player, index) => {
            const playerName = player.name || player.playerName || "";
            const isHighlighted = index === highlightIndex;

            return (
              <div
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => handleSelectPlayer(player)}
                className={`px-3 py-2 cursor-pointer text-black ${
                  isHighlighted
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {playerName}
              </div>
            );
          })}
          {filteredPlayers.length === 0 && (
            <div className="px-3 py-2 text-gray-400">No players found</div>
          )}
        </div>
      )}
    </div>
  );
}
