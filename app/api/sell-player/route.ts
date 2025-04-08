import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Log the data received (in a real app, this would be processed and stored)
    console.log('Player sold:', data);
    
    // Return a success response
    return NextResponse.json({ 
      success: true, 
      message: `${data.name} has been sold to ${data.team} for ${data.price}`,
      data
    });
  } catch (error) {
    console.error('Error selling player:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to sell player' },
      { status: 400 }
    );
  }
}
