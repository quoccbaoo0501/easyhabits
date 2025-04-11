import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import { unlink } from 'fs/promises'; // For deleting files
import path from 'path';

// Removed placeholder annotations

// GET /api/pdfs/[id]/annotations
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const pdfId = params.id;
  // Removed page query param logic for now, fetching all for the document

  console.log(`API: Fetching annotations for PDF ${pdfId} from Supabase`);

  const { data: annotations, error } = await supabase
    .from('annotations')
    .select('*')
    .eq('pdfDocumentId', pdfId); // Use camelCase column name to match DB schema image
    // Add .eq('page', pageNumber) if filtering by page

  if (error) {
    console.error('Error fetching annotations:', error);
    return NextResponse.json({ error: 'Failed to fetch annotations', details: error.message }, { status: 500 });
  }

  return NextResponse.json(annotations || []);
}

// POST /api/pdfs/[id]/annotations
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const pdfId = params.id;

  try {
    const annotationData = await request.json(); // Annotation data from request body

    // Basic validation (add more as needed)
    if (!annotationData.type || !annotationData.page) {
        return NextResponse.json({ error: 'Missing required annotation fields (type, page)' }, { status: 400 });
    }
    if (annotationData.type === 'text' && (!annotationData.position || !annotationData.text)) {
         return NextResponse.json({ error: 'Missing position or text for text annotation' }, { status: 400 });
    }
    if (annotationData.type === 'highlight' && !annotationData.rects) {
        return NextResponse.json({ error: 'Missing rects for highlight annotation' }, { status: 400 });
    }

    console.log(`API: Saving annotation for PDF ${pdfId} to Supabase:`, annotationData);

    const { data: newAnnotation, error: insertError } = await supabase
      .from('annotations')
      .insert({
        pdfDocumentId: pdfId,
        page: annotationData.page,
        type: annotationData.type,
        text: annotationData.text, // Will be null if type is 'highlight'
        position: annotationData.position, // Will be null if type is 'highlight'
        rects: annotationData.rects, // Will be null if type is 'text'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving annotation to Supabase:", insertError);
      return NextResponse.json({ error: "Failed to save annotation", details: insertError.message }, { status: 500 });
    }

    console.log("Annotation saved to Supabase:", newAnnotation);

    // Return the saved annotation (including the new ID from Supabase)
    return NextResponse.json(newAnnotation, { status: 201 }); // 201 Created status

  } catch (error: any) {
     console.error(`Error processing POST request for annotations (PDF ID: ${pdfId}):`, error);
     // Check if the error is due to invalid JSON in the request body
     if (error instanceof SyntaxError) {
         return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
     }
     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
            // Annotations should be deleted automatically if ON DELETE CASCADE is set on the foreign key constraint.
            const { error: deleteError } = await supabase
                .from('documents')
                .delete()
                .eq('id', pdfId);

            if (deleteError) {
                console.error(`Error deleting document ${pdfId} from Supabase:`, deleteError);
                // Don't proceed to delete file if DB deletion fails
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
                // Log error if file deletion fails, but don't necessarily fail the whole request
                // if the DB entry was removed. Could be it was already deleted manually.
                if (fileError.code === 'ENOENT') {
                     console.warn(`File not found, could not delete: ${serverFilePath}`);
                } else {
                    console.error(`Error deleting file ${serverFilePath}:`, fileError);
                     // You might choose to return an error here depending on desired behavior
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