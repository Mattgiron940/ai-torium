import { Metadata } from 'next'
import Link from 'next/link'
import { SparklesIcon, UserGroupIcon, LightBulbIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'About - AI-TORIUM',
  description: 'Learn about AI-TORIUM\'s mission to revolutionize education with AI technology',
}

const team = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Founder & CEO',
    bio: 'Former Stanford AI researcher with 10+ years in educational technology.',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO',
    bio: 'Ex-Google engineer specializing in machine learning and scalable systems.',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Head of Education',
    bio: 'Former Harvard professor with expertise in cognitive science and learning.',
    image: '/api/placeholder/150/150'
  }
]

const values = [
  {
    icon: AcademicCapIcon,
    title: 'Education First',
    description: 'We believe quality education should be accessible to everyone, everywhere.'
  },
  {
    icon: LightBulbIcon,
    title: 'Innovation',
    description: 'Pushing the boundaries of what\'s possible with AI and education technology.'
  },
  {
    icon: UserGroupIcon,
    title: 'Community',
    description: 'Building a global community of learners who support each other\'s growth.'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI-TORIUM</h1>
                <p className="text-xs text-gray-600">Smart Learning</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-TORIUM</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize education by making world-class AI tutoring 
            accessible to every student, anywhere in the world.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Traditional education often leaves students struggling alone with complex concepts. 
                We believe every student deserves personalized, patient, and intelligent tutoring 
                that adapts to their unique learning style.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                AI-TORIUM combines cutting-edge artificial intelligence with proven educational 
                methodologies to create an learning experience that's both powerful and accessible.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900">1M+</div>
                  <div className="text-gray-600">Questions Answered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-gray-600">Subjects Covered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">99%</div>
                  <div className="text-gray-600">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">24/7</div>
                  <div className="text-gray-600">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at AI-TORIUM
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate educators and technologists working to transform learning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AI-TORIUM leverages the latest in artificial intelligence, including Claude 3.5 Sonnet, 
              advanced OCR technology, and machine learning algorithms to provide personalized, 
              intelligent tutoring that adapts to each student's needs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of students who are already transforming their education with AI-TORIUM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100 transition-colors">
                Get Started Free
              </button>
            </Link>
            <Link href="/pricing">
              <button className="px-8 py-4 border border-white text-white rounded-md font-medium hover:bg-white/10 transition-colors">
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}