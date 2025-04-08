'use client';

import { useState, useEffect } from 'react';

interface Team {
  teamName: string;
  teamRating: number;
  teamBalance: number;
}

export default function TeamRankings() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/team-rankings')
      .then(res => res.json())
      .then(data => {
        setTeams(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching team rankings:', err);
        setError('Failed to load team rankings');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-black">Loading team rankings...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-center text-black">TEAM RANKINGS</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-navy-700 text-white">
              <th className="px-4 py-2 text-left border border-gray-300">teamName</th>
              <th className="px-4 py-2 text-left border border-gray-300">teamRating</th>
              <th className="px-4 py-2 text-left border border-gray-300">teamBalance</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {teams.map((team, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 border border-gray-300">{team.teamName}</td>
                <td className="px-4 py-2 border border-gray-300">{team.teamRating}</td>
                <td className="px-4 py-2 border border-gray-300">{team.teamBalance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
