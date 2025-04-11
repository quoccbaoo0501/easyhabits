"use client";

import { createClient } from '@/lib/supabase/client'; // Use the client helper
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        const checkSession = async () => {
             const { data: { session } } = await supabase.auth.getSession();
             if (session) {
                 router.replace('/pdf-reader'); // Redirect to main app page
             }
        };
        checkSession();

         // Listen for auth changes (e.g., successful login)
         const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                router.replace('/pdf-reader'); // Redirect after sign in
            }
            // Handle other events like SIGNED_OUT if needed
         });

         // Cleanup subscription on unmount
         return () => {
             subscription?.unsubscribe();
         };
    }, [supabase, router]);


    return (
        <div className="flex justify-center items-center min-h-screen">
             <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
                 <h1 className="text-2xl font-bold text-center text-card-foreground">Welcome</h1>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme="dark" // Or "light", or use your theme provider
                    providers={['google', 'github']} // Optional: Add OAuth providers configured in Supabase
                    redirectTo={process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` : undefined} // Necessary for OAuth redirects
                 />
             </div>
        </div>
    );
} 