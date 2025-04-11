import { NextResponse } from 'next/server';

// Placeholder for annotations - replace with database logic
let allAnnotations: { [pdfId: string]: any[] } = {
  '1': [
    { id: 'a1', page: 1, text: 'Important point on page 1', position: { x: 20, y: 30 }, pdfDocumentId: '1' },
    { id: 'a2', page: 5, text: 'Reference this later', position: { x: 50, y: 50 }, pdfDocumentId: '1' },
  ],
  '2': [
    { id: 'b1', page: 2, text: 'Recipe ingredient note', position: { x: 10, y: 70 }, pdfDocumentId: '2' },
  ],
  '3': [], // No annotations for PDF 3 yet
};

// GET /api/pdfs/[id]/annotations?page=N
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const pdfId = params.id;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page'); // Get page number from query parameters

  console.log(`API: Fetching annotations for PDF ${pdfId}` + (page ? ` on page ${page}` : ''));

  // Simulate DB delay
  await new Promise(resolve => setTimeout(resolve, 50));

  const pdfAnnotations = allAnnotations[pdfId] || [];

  // Filter by page if the 'page' query parameter is provided
  const filteredAnnotations = page
    ? pdfAnnotations.filter(anno => anno.page === parseInt(page, 10))
    : pdfAnnotations;

  return NextResponse.json(filteredAnnotations);
}

// POST /api/pdfs/[id]/annotations
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const pdfId = params.id;
  const annotationData = await request.json(); // Annotation data from request body

  console.log(`API: Saving annotation for PDF ${pdfId}:`, annotationData);

  // Simulate DB save
  await new Promise(resolve => setTimeout(resolve, 100));

  if (!allAnnotations[pdfId]) {
    allAnnotations[pdfId] = [];
  }

  // Generate a simple ID (in real app, DB would handle this)
  const newAnnotation = {
    ...annotationData,
    id: `anno-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    pdfDocumentId: pdfId, // Ensure the PDF ID is set correctly
  };

  allAnnotations[pdfId].push(newAnnotation);

  // Return the saved annotation (including the new ID)
  return NextResponse.json(newAnnotation, { status: 201 }); // 201 Created status
} 