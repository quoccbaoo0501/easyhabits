import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Import the Supabase client

export async function GET(request: Request) {
  console.log("API: Fetching PDF list from Supabase");

  const { data: documents, error } = await supabase
    .from('documents')
    .select('*') // Select all columns
    .order('created_at', { ascending: false }); // Optional: order by creation date

  if (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents', details: error.message }, { status: 500 });
  }

  // Supabase returns the data in the 'data' property
  return NextResponse.json(documents || []);
} 