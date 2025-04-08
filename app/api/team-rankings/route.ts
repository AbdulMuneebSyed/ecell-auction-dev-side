import { NextResponse } from 'next/server';

// Dummy team rankings data
const teamRankings = [
  { teamName: "Mumbai Indians", teamRating: 89, teamBalance: 1500000 },
  { teamName: "Chennai Super Kings", teamRating: 92, teamBalance: 1400000 },
  { teamName: "Royal Challengers Bangalore", teamRating: 85, teamBalance: 1600000 },
  { teamName: "Kolkata Knight Riders", teamRating: 87, teamBalance: 1450000 },
  { teamName: "Delhi Capitals", teamRating: 84, teamBalance: 1550000 },
  { teamName: "Punjab Kings", teamRating: 82, teamBalance: 1700000 },
  { teamName: "Rajasthan Royals", teamRating: 83, teamBalance: 1650000 },
  { teamName: "Sunrisers Hyderabad", teamRating: 81, teamBalance: 1750000 },
  { teamName: "Gujarat Titans", teamRating: 86, teamBalance: 1500000 },
  { teamName: "Lucknow Super Giants", teamRating: 84, teamBalance: 1600000 },
  { teamName: "Ahmedabad Lions", teamRating: 80, teamBalance: 1800000 },
  { teamName: "Kochi Tuskers", teamRating: 78, teamBalance: 1850000 },
  { teamName: "Pune Warriors", teamRating: 79, teamBalance: 1820000 },
  { teamName: "Rising Pune Supergiant", teamRating: 81, teamBalance: 1750000 },
  { teamName: "Deccan Chargers", teamRating: 80, teamBalance: 1780000 },
  { teamName: "Gujarat Lions", teamRating: 79, teamBalance: 1800000 }
];

export async function GET() {
  return NextResponse.json(teamRankings);
}
