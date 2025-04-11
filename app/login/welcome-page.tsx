'use client';

import Link from "next/link"
import Image from "next/image"
import { FileText, CheckCircle } from "lucide-react"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user data exists in localStorage (replace 'userData' if using a different key)
    const userData = localStorage.getItem('userData'); 
    if (userData) {
      // Redirect to the dashboard page if user data is found
      router.push('/dashboard');
    }
    // No 'else' needed: if no data, the component renders normally
  }, [router]); // Empty dependency array means this runs once on mount

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Hero section */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-xl font-semibold">HabitTracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login-page">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                Login
              </Button>
            </Link>
            <Link href="/login-page?tab=signup">
              <Button className="bg-green-500 hover:bg-green-600 text-white">Sign Up</Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row">
          <div className="flex-1 flex flex-col justify-center p-6 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Track Your Habits, <span className="text-green-400">Transform Your Life</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              HabitTracker helps you build better habits, stay focused, and achieve your goals with powerful tools for
              productivity and personal growth.
            </p>

            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-medium">Habit Tracking</h3>
                  <p className="text-sm text-gray-400">Build consistency with daily habit tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-medium">Pomodoro Timer</h3>
                  <p className="text-sm text-gray-400">Stay focused with time management techniques</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-medium">Flashcards</h3>
                  <p className="text-sm text-gray-400">Enhance learning with spaced repetition</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-medium">PDF Library</h3>
                  <p className="text-sm text-gray-400">Access your study materials anywhere</p>
                </div>
              </div>
            </div>

            <Link href="/login-page?tab=signup">
              <Button size="lg" className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white">
                Get Started — It's Free
              </Button>
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center p-12 bg-gray-900/30">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden border border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black/40 z-10"></div>
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="HabitTracker Dashboard Preview"
                width={600}
                height={800}
                className="object-cover"
              />
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">HabitTracker</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-white"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <h3 className="font-medium mb-2">Your Progress</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily Meditation</span>
                      <span className="text-sm font-medium">7 day streak</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
