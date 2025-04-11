import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

// Removed in-memory store

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const pdfId = params.id;
  console.log(`API: Request to download PDF ID: ${pdfId}`);

  // Find the document metadata using the ID from Supabase
  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('fileUrl') // Only select the fileUrl we need
    .eq('id', pdfId)
    .maybeSingle(); // Use maybeSingle() in case the ID doesn't exist

  if (fetchError) {
    console.error(`Error fetching document ${pdfId} for download:`, fetchError);
    return NextResponse.json({ error: "Failed to fetch document metadata", details: fetchError.message }, { status: 500 });
  }

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

// --- Add DELETE Handler Below ---
import { unlink } from 'fs/promises'; // Ensure unlink is imported

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const pdfId = params.id;
    console.log(`API: Request to delete PDF ID: ${pdfId}`);

    if (!pdfId) {
        return NextResponse.json({ error: 'Missing PDF ID' }, { status: 400 });
    }

    try {
        // 1. Fetch the document to get its fileUrl before deleting
        const { data: document, error: fetchError } = await supabase
            .from('documents')
            .select('fileUrl')
            .eq('id', pdfId)
            .single(); // Use single() as we expect one or zero results

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = Row not found, which is okay if it's already gone
            console.error(`Error fetching document ${pdfId} for deletion:`, fetchError);
            return NextResponse.json({ error: "Failed to fetch document before deletion", details: fetchError.message }, { status: 500 });
        }

        // If document exists or existed, attempt DB deletion
        if (document || (fetchError && fetchError.code === 'PGRST116')) {
            // 2. Delete the document record from Supabase
            const { error: deleteError } = await supabase
                .from('documents')
                .delete()
                .eq('id', pdfId);

            if (deleteError) {
                console.error(`Error deleting document ${pdfId} from Supabase:`, deleteError);
                return NextResponse.json({ error: "Failed to delete document from database", details: deleteError.message }, { status: 500 });
            }
            console.log(`Document ${pdfId} deleted from Supabase.`);
        } else {
             console.log(`Document ${pdfId} not found in Supabase, skipping DB deletion.`);
        }


        // 3. Delete the actual file from the filesystem if we found its URL
        if (document?.fileUrl) {
            const serverFilePath = path.join(process.cwd(), 'public', document.fileUrl);
            try {
                await unlink(serverFilePath);
                console.log(`File deleted from filesystem: ${serverFilePath}`);
            } catch (fileError: any) {
                if (fileError.code === 'ENOENT') {
                     console.warn(`File not found, could not delete: ${serverFilePath}`);
                } else {
                    console.error(`Error deleting file ${serverFilePath}:`, fileError);
                }
            }
        } else {
             console.log(`No fileUrl found for document ${pdfId}, skipping file deletion.`);
        }

        // 4. Return success response
        return NextResponse.json({ message: `Document ${pdfId} deleted successfully` }, { status: 200 });

    } catch (error: any) {
        console.error(`Unexpected error deleting PDF ${pdfId}:`, error);
        return NextResponse.json({ error: 'Internal server error during deletion' }, { status: 500 });
    }
} 