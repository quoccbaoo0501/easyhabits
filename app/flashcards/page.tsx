"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample flashcard data
const flashcardDecks = [
  {
    id: 1,
    name: "Spanish Vocabulary",
    cards: [
      { id: 1, front: "Hello", back: "Hola" },
      { id: 2, front: "Goodbye", back: "Adiós" },
      { id: 3, front: "Thank you", back: "Gracias" },
      { id: 4, front: "Please", back: "Por favor" },
      { id: 5, front: "Yes", back: "Sí" },
      { id: 6, front: "No", back: "No" },
      { id: 7, front: "Good morning", back: "Buenos días" },
      { id: 8, front: "Good night", back: "Buenas noches" },
    ],
    progress: 65,
  },
  {
    id: 2,
    name: "JavaScript Concepts",
    cards: [
      { id: 1, front: "Variable declaration", back: "let, const, var" },
      { id: 2, front: "Function declaration", back: "function name() {}" },
      { id: 3, front: "Arrow function", back: "() => {}" },
      { id: 4, front: "Object destructuring", back: "const { prop } = object" },
    ],
    progress: 80,
  },
  {
    id: 3,
    name: "World Capitals",
    cards: [
      { id: 1, front: "United States", back: "Washington D.C." },
      { id: 2, front: "United Kingdom", back: "London" },
      { id: 3, front: "France", back: "Paris" },
      { id: 4, front: "Japan", back: "Tokyo" },
    ],
    progress: 25,
  },
]

export default function FlashcardsPage() {
  const [selectedDeck, setSelectedDeck] = useState<number | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDecks = flashcardDecks.filter((deck) => deck.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelectDeck = (deckId: number) => {
    setSelectedDeck(deckId)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const handleBackToDecks = () => {
    setSelectedDeck(null)
  }

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNextCard = () => {
    if (!selectedDeck) return
    const deck = flashcardDecks.find((d) => d.id === selectedDeck)
    if (!deck) return

    setIsFlipped(false)
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      setCurrentCardIndex(0)
    }
  }

  const handlePrevCard = () => {
    if (!selectedDeck) return
    const deck = flashcardDecks.find((d) => d.id === selectedDeck)
    if (!deck) return

    setIsFlipped(false)
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    } else {
      setCurrentCardIndex(deck.cards.length - 1)
    }
  }

  const currentDeck = selectedDeck ? flashcardDecks.find((d) => d.id === selectedDeck) : null

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Flashcards</h1>
      </div>

      {selectedDeck ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div>
                <Button variant="ghost" size="sm" onClick={handleBackToDecks} className="mb-2 -ml-2">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Decks
                </Button>
                <CardTitle>{currentDeck?.name}</CardTitle>
                <CardDescription>
                  Card {currentCardIndex + 1} of {currentDeck?.cards.length}
                </CardDescription>
              </div>
              <div className="ml-auto">
                <Progress value={((currentCardIndex + 1) * 100) / (currentDeck?.cards.length || 1)} className="w-24" />
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div
                className={`relative h-64 w-full max-w-md cursor-pointer transition-all duration-500 ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                onClick={handleFlipCard}
              >
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 border-primary/20 bg-card p-6 text-center text-xl font-medium shadow-md transition-all duration-500 ${
                    isFlipped ? "rotate-y-180 opacity-0" : ""
                  }`}
                >
                  {currentDeck?.cards[currentCardIndex]?.front}
                </div>
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 border-primary/20 bg-card p-6 text-center text-xl font-medium shadow-md transition-all duration-500 ${
                    isFlipped ? "" : "rotate-y-180 opacity-0"
                  }`}
                >
                  {currentDeck?.cards[currentCardIndex]?.back}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevCard}>
                <ChevronLeft className="mr-1 h-5 w-5" />
                Previous
              </Button>
              <Button onClick={handleNextCard}>
                Next
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search decks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            {searchTerm && (
              <Button variant="ghost" size="icon" onClick={() => setSearchTerm("")}>
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Decks</TabsTrigger>
              <TabsTrigger value="recent">Recently Studied</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDecks.map((deck) => (
                  <Card key={deck.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{deck.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-sm text-muted-foreground">{deck.cards.length} cards</div>
                      <div className="mt-2 space-y-2">
                        <div className="text-xs text-muted-foreground">Progress</div>
                        <Progress value={deck.progress} />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 p-3">
                      <Button size="sm" className="w-full" onClick={() => handleSelectDeck(deck.id)}>
                        Study Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                <Card className="flex flex-col items-center justify-center border-2 border-dashed p-6">
                  <Plus className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">Create New Deck</p>
                  <p className="mb-4 text-center text-sm text-muted-foreground">Add a new flashcard deck to study</p>
                  <Button>Create Deck</Button>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="recent" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDecks.slice(0, 2).map((deck) => (
                  <Card key={deck.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{deck.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-sm text-muted-foreground">{deck.cards.length} cards</div>
                      <div className="mt-2 space-y-2">
                        <div className="text-xs text-muted-foreground">Progress</div>
                        <Progress value={deck.progress} />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 p-3">
                      <Button size="sm" className="w-full" onClick={() => handleSelectDeck(deck.id)}>
                        Study Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="favorites" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDecks.slice(1, 3).map((deck) => (
                  <Card key={deck.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{deck.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-sm text-muted-foreground">{deck.cards.length} cards</div>
                      <div className="mt-2 space-y-2">
                        <div className="text-xs text-muted-foreground">Progress</div>
                        <Progress value={deck.progress} />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 p-3">
                      <Button size="sm" className="w-full" onClick={() => handleSelectDeck(deck.id)}>
                        Study Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
