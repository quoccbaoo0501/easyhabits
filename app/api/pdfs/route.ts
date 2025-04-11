import { NextResponse } from 'next/server';

// Placeholder data - replace with database logic
let documents = [
  {
    id: 1,
    title: "Introduction to AI",
    category: "Learning",
    pages: 25,
    lastOpened: new Date(Date.now() - 86400000 * 2).toISOString(), // Opened 2 days ago
    thumbnail: "/placeholder.svg?height=120&width=90",
    fileUrl: "/pdfs/intro-ai.pdf" // Example file path
  },
  {
    id: 2,
    title: "Healthy Recipes",
    category: "Health",
    pages: 50,
    lastOpened: new Date(Date.now() - 86400000 * 5).toISOString(), // Opened 5 days ago
    thumbnail: "/placeholder.svg?height=120&width=90",
    fileUrl: "/pdfs/healthy-recipes.pdf"
  },
    {
    id: 3,
    title: "Advanced React Patterns",
    category: "Learning",
    pages: 120,
    lastOpened: new Date().toISOString(), // Opened today
    thumbnail: "/placeholder.svg?height=120&width=90",
    fileUrl: "/pdfs/react-patterns.pdf"
  },
];

export async function GET(request: Request) {
  console.log("API: Fetching PDF list");
  // In a real app, fetch from your database here
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate DB delay
  return NextResponse.json(documents);
} 