import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { headers } from 'next/headers';

// Placeholder data - Should match or fetch from the same source as GET /api/pdfs
// Ideally, use a database or shared module to manage documents.
const documents = [
  {
    id: 1,
    title: "Introduction to AI",
    category: "Learning",
    pages: 25,
    lastOpened: new Date(Date.now() - 86400000 * 2).toISOString(),
    thumbnail: "/placeholder.svg?height=120&width=90",
    fileUrl: "/pdfs/intro-ai.pdf" // Example, actual filename might differ from upload
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
  // Assume uploads add to this list (problematic without shared state/DB)
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const pdfId = params.id;
  console.log(`API: Request to download PDF ID: ${pdfId}`);

  // Find the document metadata using the ID
  // Note: Comparing string ID from params with potential number ID in data
  const document = documents.find(doc => String(doc.id) === pdfId);

  if (!document || !document.fileUrl) {
    console.error(`PDF not found or missing fileUrl for ID: ${pdfId}`);
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  // Construct the full file path on the server
  // fileUrl is like "/pdfs/1678886400000-MyFile.pdf"
  const serverFilePath = path.join(process.cwd(), 'public', document.fileUrl);

  try {
    // Read the file from the filesystem
    const fileBuffer = await readFile(serverFilePath);

    // Set headers for file download
    const responseHeaders = new Headers();
    // Extract filename from the fileUrl for the Content-Disposition
    const filename = path.basename(document.fileUrl);
    responseHeaders.set('Content-Type', 'application/pdf');
    responseHeaders.set('Content-Disposition', `attachment; filename="${filename}"`);

    console.log(`API: Sending file ${filename} for download.`);
    // Return the file content as the response body
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: responseHeaders,
    });

  } catch (error: any) {
    // Handle file reading errors (e.g., file not found on disk)
    if (error.code === 'ENOENT') {
        console.error(`File not found on disk at path: ${serverFilePath}`);
        return NextResponse.json({ error: "File not found on server" }, { status: 404 });
    } else {
        console.error(`Error reading file for download (ID: ${pdfId}):`, error);
        return NextResponse.json({ error: "Failed to read PDF file" }, { status: 500 });
    }
  }
} 