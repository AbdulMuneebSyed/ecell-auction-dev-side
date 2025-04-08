'use client';

import { useState, useEffect } from 'react';
import PlayerInput from './PlayerInput';

interface Team {
  teamName: string;
  teamRating: number;
  teamBalance: number;
}

export default function SellPlayerForm() {
  const [playerName, setPlayerName] = useState('');
  const [price, setPrice] = useState('');
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [showTeamSuggestions, setShowTeamSuggestions] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch teams from API
    fetch('/api/team-rankings')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('Error fetching teams:', err));
  }, []);

  useEffect(() => {
    // Filter teams based on input
    if (team.trim() === '') {
      setFilteredTeams([]);
    } else {
      const filtered = teams.filter(t => 
        t.teamName.toLowerCase().includes(team.toLowerCase())
      );
      setFilteredTeams(filtered);
    }
  }, [team, teams]);

  const handleTeamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeam(e.target.value);
    setShowTeamSuggestions(true);
  };

  const handleSelectTeam = (teamName: string) => {
    setTeam(teamName);
    setShowTeamSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName || !price || !team) {
      setMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/sell-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName,
          price: parseInt(price),
          team
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(`Success: ${data.message}`);
        // Reset form
        setPlayerName('');
        setPrice('');
        setTeam('');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('Failed to sell player. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 text-black">
      <div>
        <label className="block text-sm font-medium mb-1 text-black">Name of Player</label>
        <PlayerInput value={playerName} onChange={setPlayerName} />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 text-black">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy-600 text-black"
        />
      </div>
      
      <div className="relative">
        <label className="block text-sm font-medium mb-1 text-black">Team</label>
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
            {filteredTeams.map((team, index) => (
              <div
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                onClick={() => handleSelectTeam(team.teamName)}
              >
                {team.teamName}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Sell this person'}
      </button>
      
      {message && (
        <div className={`mt-2 p-2 text-sm rounded ${message.startsWith('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
    </form>
  );
}
