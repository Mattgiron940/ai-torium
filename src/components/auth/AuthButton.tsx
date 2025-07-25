'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Brain, Mail, Github } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AuthButton() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (error) {
      toast.error('Failed to sign in with Google')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (error) {
      toast.error('Failed to sign in with GitHub')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (email: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
      toast.success('Check your email for the login link!')
    } catch (error) {
      toast.error('Failed to send magic link')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome to AI-TORIUM</h1>
        <p className="text-gray-600">Your AI-powered learning companion</p>
      </div>

      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      <Button
        onClick={handleGithubSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white hover:bg-gray-800"
      >
        <Github className="w-5 h-5" />
        Continue with GitHub
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const email = formData.get('email') as string
          handleEmailSignIn(email)
        }}
        className="space-y-3"
      >
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3"
        >
          <Mail className="w-5 h-5" />
          {loading ? 'Sending...' : 'Send Magic Link'}
        </Button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-6">
        By continuing, you agree to our{' '}
        <a href="/terms" className="underline hover:text-gray-700">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </a>
      </p>
    </div>
  )
}