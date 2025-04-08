import { NextResponse } from 'next/server';

// Dummy player data
const players = [
  { name: "Virat Kohli" },
  { name: "Rohit Sharma" },
  { name: "MS Dhoni" },
  { name: "Chris Gayle" },
  { name: "AB de Villiers" },
  { name: "Jasprit Bumrah" },
  { name: "Ravindra Jadeja" },
  { name: "Hardik Pandya" },
  { name: "KL Rahul" },
  { name: "Rishabh Pant" },
  { name: "Suresh Raina" },
  { name: "David Warner" },
  { name: "Kane Williamson" },
  { name: "Jos Buttler" },
  { name: "Kagiso Rabada" }
];

export async function GET() {
  return NextResponse.json(players);
}
