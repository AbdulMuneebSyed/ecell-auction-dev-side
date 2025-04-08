'use client';

import { useState, useEffect, useRef } from 'react';

interface Player {
  name: string;
}

interface PlayerInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PlayerInput({ value, onChange }: PlayerInputProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch players from API
    fetch('/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Error fetching players:', err));
    
    // Add click outside listener to close suggestions
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
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Filter players based on input value
    if (value.trim() === '') {
      setFilteredPlayers([]);
    } else {
      const filtered = players.filter(player => 
        player.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  }, [value, players]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectPlayer = (playerName: string) => {
    onChange(playerName);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Name of Player"
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy-600 text-black"
      />
      
      {showSuggestions && filteredPlayers.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-sm max-h-60 overflow-y-auto"
        >
          {filteredPlayers.map((player, index) => (
            <div
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
              onClick={() => handleSelectPlayer(player.name)}
            >
              {player.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
