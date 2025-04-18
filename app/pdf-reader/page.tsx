"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Download, File, Loader2, Plus, Search, Upload, Highlighter, ZoomIn, ZoomOut, Expand, Minimize, Trash2 } from "lucide-react"
import { Document, Page, pdfjs } from 'react-pdf'
import { useFullscreen } from 'react-use'

// Original ESM imports (commented out, using CDN link in layout instead)
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// CSS Imports moved to globals.css
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Configure PDF.js worker
// Use the version from the installed pdfjs-dist package
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Define the structure for PDF documents fetched from the backend
interface PdfDocument {
  id: number | string // Use string if IDs come from a DB
  title: string
  category: string
  pages?: number | null // Make pages optional or allow null
  lastOpened: string // Keep as string for simplicity, or use Date
  thumbnail?: string // Make optional as it might not always exist
  fileUrl?: string // Add fileUrl to the interface
}

// Define structure for position/rectangles
interface Position { x: number; y: number; }
interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

// Define the structure for different annotation types
interface BaseAnnotation {
  id?: number | string
  page: number
  pdfDocumentId: number | string
}

interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  text: string;
  position: Position;
}

interface HighlightAnnotation extends BaseAnnotation {
  type: 'highlight';
  rects: Rect[]; // Store bounding boxes for the highlight
  // Optionally store the highlighted text itself for searching, etc.
  text?: string;
}

type Annotation = TextAnnotation | HighlightAnnotation;

// Function to check annotation type
function isTextAnnotation(annotation: Annotation): annotation is TextAnnotation {
    return annotation.type === 'text';
}
function isHighlightAnnotation(annotation: Annotation): annotation is HighlightAnnotation {
    return annotation.type === 'highlight';
}

export default function PDFReaderPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [libraryDocuments, setLibraryDocuments] = useState<PdfDocument[]>([]) // State for fetched documents
  const [selectedPdfId, setSelectedPdfId] = useState<number | string | null>(null) // Use ID
  const [searchTerm, setSearchTerm] = useState("")
  const [annotations, setAnnotations] = useState<Annotation[]>([]) // Use the new union type
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true) // Add loading state
  const [error, setError] = useState<string | null>(null) // Add error state
  const [numPages, setNumPages] = useState<number | null>(null); // State for actual PDF pages
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null); // State for PDF loading errors
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectionPopover, setSelectionPopover] = useState<{ top: number, left: number, range: Range } | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null); // Ref for the main PDF container div
  const [scale, setScale] = useState(1.0); // Initial scale
  const viewerWrapperRef = useRef<HTMLDivElement>(null); // Ref for the outermost viewer wrapper for fullscreen
  const isFullscreen = useFullscreen(viewerWrapperRef, false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const toggleFullscreen = useCallback(() => {
      if (!viewerWrapperRef.current) {
          console.error("Viewer wrapper ref not available for fullscreen toggle.");
          return;
      }
      if (!isFullscreen) {
          // Enter fullscreen
          viewerWrapperRef.current.requestFullscreen()
              .catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
      } else {
          // Exit fullscreen - check if element is actually fullscreen first
          if (document.fullscreenElement) {
              document.exitFullscreen()
                  .catch(err => console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`));
          }
      }
  }, [isFullscreen]);

  // Fetch documents from backend on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching documents from backend API...");
        const response = await fetch('/api/pdfs');
        if (!response.ok) {
           // Try to parse error message from backend, otherwise use default
           let errorMsg = 'Failed to fetch documents';
           try {
               const errorData = await response.json();
               errorMsg = errorData.error || errorMsg;
           } catch (parseError) {
               // Ignore if response is not JSON or empty
           }
           throw new Error(errorMsg);
        }
        const data: PdfDocument[] = await response.json();
        // Ensure IDs are strings for consistency if mixing types
        const formattedData = data.map(doc => ({ ...doc, id: String(doc.id) }));
        setLibraryDocuments(formattedData);

        // --- Placeholder until backend is ready --- Removed ---
        // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        // setLibraryDocuments([]); // Start with empty or fetch initial data
        // --- End Placeholder ---

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching documents:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  // Filter documents based on search term and potentially category from tabs
  const filteredDocuments = libraryDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Find the selected document from the library state
  const selectedDocument = selectedPdfId ? libraryDocuments.find((doc) => doc.id === selectedPdfId) : null

  // Fetch annotations when a PDF is selected or page potentially changes
  // Note: Fetching all annotations for the doc and filtering client-side for now
  // Modify API/fetch call if page-specific fetching is preferred later
  useEffect(() => {
    if (!selectedPdfId) {
      setAnnotations([]); // Clear annotations if no PDF is selected
      return;
    }

    const fetchAnnotations = async () => {
      try {
        // Fetch all annotations for the selected document ID
        console.log(`Fetching annotations for PDF ${selectedPdfId}...`)
        const response = await fetch(`/api/pdfs/${selectedPdfId}/annotations`);
        if (!response.ok) {
            let errorMsg = 'Failed to fetch annotations';
             try {
                 const errorData = await response.json();
                 errorMsg = errorData.error || errorMsg;
             } catch (parseError) {}
             throw new Error(errorMsg);
        }
        const data: Annotation[] = await response.json();
         // Ensure IDs are strings if they exist
        const formattedData = data.map(anno => ({ ...anno, id: anno.id ? String(anno.id) : undefined }));
        setAnnotations(formattedData);

        // --- Placeholder Removed ---
        // await new Promise(resolve => setTimeout(resolve, 300));
        // setAnnotations(prev => prev.filter(a => a.pdfDocumentId === selectedPdfId /* && a.page === currentPage */));
        // --- End Placeholder ---

      } catch (err) {
        console.error("Error fetching annotations:", err);
        setError(err instanceof Error ? `Annotation Error: ${err.message}` : "Failed to load annotations");
        // Handle error appropriately (e.g., show a message to the user)
      }
    };

    fetchAnnotations();
    // We only refetch annotations when the PDF ID changes.
    // Page-specific filtering happens during rendering.
    // Add currentPage here if API supports fetching by page and you want to refetch on page change.
  }, [selectedPdfId]);

  const handleOpenPdf = (id: number | string) => {
    setSelectedPdfId(id)
    setNumPages(null); // Reset page count when opening new PDF
    setPdfLoadError(null); // Reset PDF load error
    // Annotations are fetched by the useEffect hook dependent on selectedPdfId
  }

  const handleBackToLibrary = () => {
    setSelectedPdfId(null);
    setAnnotations([]); // Clear annotations
    setNumPages(null);
    setPdfLoadError(null);
  }

  // Callback for react-pdf Document load success
  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: { numPages: number }) => {
    console.log("PDF Loaded successfully, pages:", nextNumPages);
    setNumPages(nextNumPages);
    setPdfLoadError(null); // Clear any previous error
    // Clear selection when document changes
    setSelectedText(null);
    setSelectionPopover(null);
  }, []);

   // Callback for react-pdf Document load error
   const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Failed to load PDF:', error);
    setPdfLoadError(`Failed to load PDF: ${error.message}. Please ensure the file exists and is accessible at ${selectedDocument?.fileUrl}`);
    setNumPages(null); // Reset page count on error
    setSelectedText(null);
    setSelectionPopover(null);
  }, [selectedDocument?.fileUrl]);

  // Handle uploading a new PDF
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;

     // Basic client-side validation (optional but recommended)
     if (file.type !== 'application/pdf') {
         setError("Invalid file type. Please upload a PDF.");
         setIsUploadDialogOpen(true); // Keep dialog open
         if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
         return;
     }
     // Example size limit (10MB)
     if (file.size > 10 * 1024 * 1024) {
         setError("File size exceeds 10MB limit.");
         setIsUploadDialogOpen(true); // Keep dialog open
         if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
         return;
     }

     const titleInput = document.getElementById('pdf-title') as HTMLInputElement | null;
     const categoryInput = document.getElementById('pdf-category') as HTMLInputElement | null;
     const title = titleInput?.value.trim() || file.name.replace(/\.pdf$/i, ''); // Use filename (no ext) if title missing
     const category = categoryInput?.value.trim() || 'Uncategorized';

     if (!title) {
        setError("Document title cannot be empty.");
        setIsUploadDialogOpen(true);
        return;
     }

     const formData = new FormData();
     formData.append('file', file);
     formData.append('title', title);
     formData.append('category', category);

     setIsUploadDialogOpen(false); // Close dialog optimistically
     setError(null); // Clear previous errors
     // Optionally show a loading indicator specific to upload

     try {
        console.log(`Uploading file via API: ${file.name}`);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
            let errorMsg = 'Upload failed';
            try {
                 const errorData = await response.json();
                 errorMsg = errorData.error || errorMsg;
             } catch (parseError) {}
             throw new Error(errorMsg);
        }

        const newDocument: PdfDocument = await response.json();
         // Ensure ID is string
        const formattedDocument = { ...newDocument, id: String(newDocument.id) };

        // --- Placeholder Removed ---
        // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
        // const newDocument: PdfDocument = {
        //   id: Date.now(), // Temp ID
        //   title,
        //   category,
        //   pages: Math.floor(Math.random() * 100) + 1, // Random pages for demo
        //   lastOpened: new Date().toISOString(),
        //   thumbnail: "/placeholder.svg?height=120&width=90" // Keep placeholder thumb for now
        // };
        // --- End Placeholder ---

        // Add the new document to the library state
        setLibraryDocuments(prev => [...prev, formattedDocument]);
        // Clear input fields after successful upload
        if (titleInput) titleInput.value = '';
        if (categoryInput) categoryInput.value = '';
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input

     } catch (err) {
       console.error("Error uploading file:", err);
       setError(err instanceof Error ? `Upload Error: ${err.message}` : "Upload failed");
       // Reopen dialog on error to allow user to retry or cancel
       setIsUploadDialogOpen(true);
     }
     // Hide loading indicator here if shown
  };

  // --- New Handler: Detect Text Selection ---
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedContent = range.toString();

      // Check if selection is within the PDF viewer area
      const viewerElement = viewerContainerRef.current;
      if (viewerElement && range.commonAncestorContainer && viewerElement.contains(range.commonAncestorContainer)) {
        setSelectedText(selectedContent);

        // Get position for the popover based on the selection bounds
        const rect = range.getBoundingClientRect();
        const containerRect = viewerElement.getBoundingClientRect();

        setSelectionPopover({
          // Position popover above the selection, adjusting for container scroll
          top: rect.top - containerRect.top + viewerElement.scrollTop - 40, // Adjust offset as needed
          left: rect.left - containerRect.left + viewerElement.scrollLeft + rect.width / 2, // Center horizontally
          range: range, // Store the range for creating the highlight later
        });
      } else {
        // Selection is outside the viewer
        setSelectedText(null);
        setSelectionPopover(null);
      }
    } else {
      // No selection or selection collapsed
      setSelectedText(null);
      setSelectionPopover(null);
    }
  }, []);

  // --- New Handler: Create Highlight Annotation ---
  const handleHighlightSelection = async () => {
    if (!selectionPopover || !selectedPdfId) return;

    const { range } = selectionPopover;
    const pageElement = range.commonAncestorContainer.parentElement?.closest('.react-pdf__Page') as HTMLElement | null;
    if (!pageElement) {
        console.error("Could not find page element for selection");
        setSelectionPopover(null); // Hide popover on error
        return;
    }
    const pageNumberStr = pageElement.dataset.pageNumber;
     if (!pageNumberStr) {
          console.error("Could not determine page number from selection");
          setSelectionPopover(null);
          return;
     }
     const pageNumber = parseInt(pageNumberStr, 10);

    const pageRect = pageElement.getBoundingClientRect();
    const clientRects = range.getClientRects();
    const relativeRects: Rect[] = [];

    for (let i = 0; i < clientRects.length; i++) {
        const rect = clientRects[i];
        relativeRects.push({
            left: ((rect.left - pageRect.left) / pageRect.width) * 100,
            top: ((rect.top - pageRect.top) / pageRect.height) * 100,
            width: (rect.width / pageRect.width) * 100,
            height: (rect.height / pageRect.height) * 100,
        });
    }

    if (relativeRects.length === 0) {
        console.warn("No rectangles found for selection.");
        setSelectionPopover(null);
        return;
    }

    const newAnnotationData = {
        type: 'highlight' as const,
        pdfDocumentId: selectedPdfId,
        page: pageNumber, // Use determined page number
        rects: relativeRects,
        text: selectedText || range.toString(), // Optionally store text
    };

    try {
        console.log("Saving HIGHLIGHT annotation via API:", newAnnotationData);
        const response = await fetch(`/api/pdfs/${selectedPdfId}/annotations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAnnotationData),
        });
        if (!response.ok) {
            let errorMsg = 'Failed to save highlight';
            try { const errorData = await response.json(); errorMsg = errorData.error || errorMsg; } catch (parseError) {}
            throw new Error(errorMsg);
        }
        const savedAnnotation: Annotation = await response.json();
        const formattedAnnotation = { ...savedAnnotation, id: String(savedAnnotation.id), type: 'highlight' } as HighlightAnnotation;

        setAnnotations(prev => [...prev, formattedAnnotation]);

        // Clear selection and hide popover after successful save
        window.getSelection()?.removeAllRanges();
        setSelectedText(null);
        setSelectionPopover(null);

    } catch (err) {
        console.error("Error saving highlight annotation:", err);
        setError(err instanceof Error ? `Highlight Error: ${err.message}` : "Failed to save highlight");
        // Keep popover open on error?
        // setSelectionPopover(null);
    }
  };

  // --- New Zoom Handlers ---
  const handleZoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 3.0)); // Max zoom 300%
  const handleZoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5)); // Min zoom 50%

  // --- Delete Handler (handleDeletePdf) ---
  const handleDeletePdf = async (docId: string | number, docTitle: string) => {
    setIsDeleting(String(docId));
    setError(null);
    try {
      const response = await fetch(`/api/pdfs/${docId}`, { method: 'DELETE' });
      if (!response.ok) { /* ... error handling ... */ }
      setLibraryDocuments(prevDocs => prevDocs.filter(doc => String(doc.id) !== String(docId)));
    } catch (err) { /* ... error handling ... */ }
     finally { setIsDeleting(null); }
  };

  // Handle loading state
  if (isLoading) {
    // Optional: Replace with a proper skeleton loader component
    return <div className="container mx-auto max-w-4xl py-6 text-center">Loading PDF Library...</div>;
  }

  // Handle error state
  if (error && !selectedPdfId) {
    return <div className="container mx-auto max-w-4xl py-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-6 flex flex-col h-screen"> {/* Adjust height if needed */}
      <div className="mb-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">PDF Reader</h1>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Upload className="h-4 w-4" />
              Upload PDF
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload PDF Document</DialogTitle>
              <DialogDescription>Upload a PDF file to your library.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-title">Document Title</Label>
                <Input id="pdf-title" placeholder="e.g., Study Guide" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf-category">Category</Label>
                <Input id="pdf-category" placeholder="e.g., Learning, Health, etc." />
              </div>

              <div className="space-y-2">
                <Label>PDF File</Label>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer hover:border-primary"
                  onClick={handleUploadClick}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />
                  <File className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF (max. 10MB)</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {selectedPdfId && selectedDocument ? (
        <div ref={viewerWrapperRef} className="flex flex-col flex-grow border rounded-md overflow-hidden bg-background">
          <div className="flex items-center gap-2 p-2 border-b bg-muted flex-shrink-0 sticky top-0 z-30">
            <Button variant="ghost" size="sm" onClick={handleBackToLibrary} className="mr-2">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Library
            </Button>
            <span className="font-semibold truncate mr-auto" title={selectedDocument.title}>
              {selectedDocument.title}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut} disabled={scale <= 0.5}>
              <ZoomOut className="h-4 w-4" /><span className="sr-only">Zoom Out</span>
            </Button>
            <span className="text-sm font-medium w-12 text-center">{(scale * 100).toFixed(0)}%</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn} disabled={scale >= 3.0}>
              <ZoomIn className="h-4 w-4" /><span className="sr-only">Zoom In</span>
            </Button>
            <Button
              variant="outline" size="icon" className="h-8 w-8"
              onClick={() => window.open(`/api/pdfs/${selectedPdfId}/download`, '_blank')}
              disabled={!selectedDocument?.fileUrl}
            >
              <Download className="h-4 w-4" /><span className="sr-only">Download</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
              <span className="sr-only">{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</span>
            </Button>
          </div>

          <div
            ref={viewerContainerRef}
            className="relative overflow-auto bg-gray-100 pdf-viewer-container flex-grow"
            onMouseUp={handleMouseUp}
          >
            {pdfLoadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-red-600 p-4 z-10 bg-gray-100/90">
                <p className="font-semibold mb-2">Error Loading PDF</p>
                <p className="text-sm">{pdfLoadError}</p>
              </div>
            )}

            {selectionPopover && (
              <div
                className="absolute z-20 bg-background border rounded-md shadow-lg p-1 flex items-center gap-1"
                style={{
                  top: `${selectionPopover.top}px`,
                  left: `${selectionPopover.left}px`,
                  transform: 'translateX(-50%)',
                }}
                onMouseDown={(e) => e.preventDefault()}
                onMouseUp={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHighlightSelection}
                  className="p-1 h-auto"
                >
                  <Highlighter className="h-4 w-4 mr-1" />
                  Highlight
                </Button>
              </div>
            )}

            {selectedDocument.fileUrl && !pdfLoadError ? (
              <Document
                file={selectedDocument.fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading PDF...
                  </div>
                }
                error={
                  <div className="absolute inset-0 flex items-center justify-center text-red-600">
                    Error loading PDF document.
                  </div>
                }
                className="flex flex-col items-center py-4"
              >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_container_${index + 1}`} className="pdf-page-container relative mb-4 shadow-md bg-white">
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      renderTextLayer={true}
                      renderAnnotationLayer={false}
                      scale={scale}
                      className="mb-2"
                    />
                    {/* Keep Annotation Rendering Logic, remove only Add Note Layer */}
                    {annotations
                      .filter((a) => a.page === (index + 1) && String(a.pdfDocumentId) === String(selectedPdfId))
                      .map((annotation) => {
                        // Keep rendering for TextAnnotation and HighlightAnnotation
                        if (isTextAnnotation(annotation)) {
                          const { id, page, position, text } = annotation;
                          const key = id || `${page}-${position.x}-${position.y}`;
                          return (
                            <div
                              key={key}
                              className="absolute bg-yellow-200 p-2 rounded shadow-md text-xs max-w-[200px] cursor-default z-10 pointer-events-auto"
                              style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                                transform: "translate(-50%, -50%)",
                              }}
                              onClick={(e) => e.stopPropagation()}
                              title={`Page ${page}: ${text}`}
                            >
                              {text}
                            </div>
                          );
                        } else if (isHighlightAnnotation(annotation)) {
                          const { id, page, rects } = annotation;
                          return rects.map((rect, index) => {
                            const key = `${id || 'highlight'}-${page}-${index}`;
                            return (
                              <div
                                key={key}
                                className="absolute bg-yellow-400 bg-opacity-50 pointer-events-none z-5"
                                style={{
                                  left: `${rect.left}%`,
                                  top: `${rect.top}%`,
                                  width: `${rect.width}%`,
                                  height: `${rect.height}%`,
                                  mixBlendMode: 'darken',
                                }}
                                title={`Page ${page}: Highlighted text`}
                              />
                            );
                          });
                        }
                        return null;
                      })}
                  </div>
                ))}
              </Document>
            ) : (!pdfLoadError && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <p>No PDF file associated with this document.</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 flex-grow overflow-auto">
          {error && <p className="col-span-full text-red-500 text-center">{error}</p>}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="uncategorized">Uncategorized</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="overflow-hidden group flex flex-col">
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-base line-clamp-1">{doc.title}</CardTitle>
                        <CardDescription>{doc.category}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow">
                        <div className="flex justify-center mb-3 aspect-[3/4] bg-muted rounded-md overflow-hidden">
                          {doc.thumbnail ? (
                            <img src={doc.thumbnail} alt={doc.title} className="object-cover w-full h-full" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              <File className="w-10 h-10" />
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>{doc.pages ?? '?'} pages</span>
                          <span>Opened: {new Date(doc.lastOpened).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 p-3 flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => handleOpenPdf(doc.id)}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Open
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive" size="sm" className="px-3"
                              disabled={isDeleting === String(doc.id)} aria-label={`Delete ${doc.title}`}
                            >
                              {isDeleting === String(doc.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isDeleting === String(doc.id)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePdf(doc.id, doc.title)}
                                disabled={isDeleting === String(doc.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {isDeleting === String(doc.id) ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground">
                    No documents found matching your search.
                  </p>
                )}

                <Card className="flex flex-col items-center justify-center border-2 border-dashed p-6 hover:border-primary cursor-pointer"
                      onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">Upload PDF</p>
                  <p className="mb-4 text-center text-sm text-muted-foreground">
                    Add a new PDF document to your library
                  </p>
                  <Button variant="outline" size="sm">Upload PDF</Button>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="uncategorized" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {libraryDocuments
                  .filter((doc) => doc.category === "Uncategorized")
                  .map((doc) => (
                    <Card key={doc.id} className="overflow-hidden group flex flex-col">
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-base line-clamp-1">{doc.title}</CardTitle>
                        <CardDescription>{doc.category}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow">
                        <div className="flex justify-center mb-3 aspect-[3/4] bg-muted rounded-md overflow-hidden">
                          {doc.thumbnail ? (
                            <img src={doc.thumbnail} alt={doc.title} className="object-cover w-full h-full" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              <File className="w-10 h-10" />
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>{doc.pages ?? '?'} pages</span>
                          <span>Opened: {new Date(doc.lastOpened).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 p-3 flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => handleOpenPdf(doc.id)}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Open
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive" size="sm" className="px-3"
                              disabled={isDeleting === String(doc.id)} aria-label={`Delete ${doc.title}`}
                            >
                              {isDeleting === String(doc.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isDeleting === String(doc.id)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePdf(doc.id, doc.title)}
                                disabled={isDeleting === String(doc.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {isDeleting === String(doc.id) ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                {libraryDocuments.filter((doc) => doc.category === "Uncategorized").length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground">No uncategorized documents.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
