import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises'; // Use Node.js filesystem API
import path from 'path';

// In-memory store for documents (replace with DB)
let documents = [
  {
    id: 1,
    title: "Introduction to AI",
    category: "Learning",
    pages: 25,
    lastOpened: new Date(Date.now() - 86400000 * 2).toISOString(),
    thumbnail: "/placeholder.svg?height=120&width=90",
    fileUrl: "/pdfs/intro-ai.pdf"
  },
  {
    id: 2,
    title: "Healthy Recipes",
    category: "Health",
    pages: 50,
    lastOpened: new Date(Date.now() - 86400000 * 5).toISOString(),
    thumbnail: "/placeholder.svg?height=120&width=90",
    fileUrl: "/pdfs/healthy-recipes.pdf"
  },
    {
    id: 3,
    title: "Advanced React Patterns",
    category: "Learning",
    pages: 120,
    lastOpened: new Date().toISOString(),
    thumbnail: "/placeholder.svg?height=120&width=90",
    fileUrl: "/pdfs/react-patterns.pdf"
  },
];

// Simple counter for demo IDs (replace with DB auto-increment/UUID)
let nextId = 4;

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
    const filePath = path.join(process.cwd(), 'public', 'pdfs', filename);
    const fileUrl = `/pdfs/${filename}`; // URL path to access the file

    // Ensure the pdfs directory exists (important for the first upload)
    // In a production setup, you might handle this differently (e.g., during build or startup)
    try {
      await require('fs/promises').mkdir(path.dirname(filePath), { recursive: true });
    } catch (mkdirError: any) {
      // Ignore error if directory already exists
      if (mkdirError.code !== 'EEXIST') {
        throw mkdirError; // Re-throw other errors
      }
    }

    // Read the file content as ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write the file to the public/pdfs directory
    await writeFile(filePath, buffer);
    console.log(`File saved to: ${filePath}`);

    // **Placeholder PDF page count:** Replace with actual PDF processing if needed
    const pages = Math.floor(Math.random() * 100) + 1; // Random for now

    // Create new document metadata (simulating DB insert)
    const newDocument = {
      id: nextId++,
      title,
      category,
      pages,
      lastOpened: new Date().toISOString(),
      thumbnail: "/placeholder.svg?height=120&width=90", // Use placeholder
      fileUrl: fileUrl
    };

    documents.push(newDocument);
    console.log("Updated documents list:", documents);

    // Return the newly created document metadata
    return NextResponse.json(newDocument, { status: 201 });

  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Note: We also need to update the GET /api/pdfs route to return the potentially updated `documents` array.
// This simple example doesn't share state between route files easily.
// A database would solve this. For now, we'll update the GET route separately if needed or assume it restarts. 