import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises'; // Use Node.js filesystem API
import path from 'path';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

// Removed in-memory store and nextId

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const category = formData.get('category') as string | null;

    if (!file || !title || !category) {
      return NextResponse.json({ error: "Missing file, title, or category" }, { status: 400 });
    }

    console.log(`API: Uploading file: ${file.name}, Title: ${title}, Category: ${category}`);

    // **Important Security Note:** In a real app, sanitize filenames and validate file types/sizes rigorously.
    const filename = Date.now() + '-' + file.name.replace(/\s+/g, '-'); // Basic sanitization
    const pdfsDir = path.join(process.cwd(), 'public', 'pdfs');
    const filePath = path.join(pdfsDir, filename);
    const fileUrl = `/pdfs/${filename}`; // URL path to access the file

    // Ensure the pdfs directory exists
    try {
      await mkdir(pdfsDir, { recursive: true });
    } catch (mkdirError: any) {
      if (mkdirError.code !== 'EEXIST') throw mkdirError;
    }

    // Read the file content and write to the public/pdfs directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    console.log(`File saved to: ${filePath}`);

    // **Placeholder PDF page count - Consider server-side PDF parsing here if needed**
    const pages = null; // Or implement actual page counting

    // Insert metadata into Supabase 'documents' table
    const { data: newDocument, error: insertError } = await supabase
      .from('documents')
      .insert({
        title: title,
        category: category,
        fileUrl: fileUrl,
        pages: pages, // Placeholder
        thumbnail: '/images/pdf-2127829_1280.webp', // Set static thumbnail path
        lastOpened: new Date().toISOString(), // Set initial lastOpened
        // Supabase generates the UUID 'id' automatically
      })
      .select() // Return the newly created row
      .single(); // Expect only one row back

    if (insertError) {
      console.error("Error saving document metadata to Supabase:", insertError);
      // Consider deleting the saved file if DB insert fails for consistency
      return NextResponse.json({ error: "Failed to save document metadata", details: insertError.message }, { status: 500 });
    }

    console.log("Document metadata saved to Supabase:", newDocument);

    // Return the newly created document record from Supabase
    return NextResponse.json(newDocument, { status: 201 });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 });
  }
}

// Note: We also need to update the GET /api/pdfs route to return the potentially updated `documents` array.
// This simple example doesn't share state between route files easily.
// A database would solve this. For now, we'll update the GET route separately if needed or assume it restarts. 