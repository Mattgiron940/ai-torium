import AuthButton from '@/components/auth/AuthButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthButton />
      </div>
    </div>
  )
}