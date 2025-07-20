'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Mail, User, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
  const [userInfo] = useState({
    email: 'dummyuser@example.com',
    handle: 'cool_coder123',
    solved: 42
  })

  const [submissions] = useState([
    { problem: 'Two Sum', verdict: 'Accepted' },
    { problem: 'Palindrome Number', verdict: 'Wrong Answer' },
    { problem: 'Longest Substring Without Repeating Characters', verdict: 'Time Limit Exceeded' },
    { problem: 'Valid Parentheses', verdict: 'Accepted' }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sticky Navbar */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Page Content with top padding to avoid navbar overlap */}
      <div className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Profile Info */}
        <Card className="bg-slate-800/60 border border-slate-600 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white text-3xl">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>{userInfo.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-green-400" />
              <span>{userInfo.handle}</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-yellow-400" />
              <span>Problems Solved: {userInfo.solved}</span>
            </div>
          </CardContent>
        </Card>

        {/* Heatmap Placeholder */}
        <Card className="bg-slate-800/60 border border-slate-600 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Activity Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400">
            <div className="flex items-center justify-center h-40 border-2 border-dashed border-slate-600 rounded-xl">
              <span className="text-sm">[Heatmap coming soon...]</span>
            </div>
          </CardContent>
        </Card>

        {/* Submissions */}
        <Card className="bg-slate-800/60 border border-slate-600 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submissions.map((sub, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b border-slate-700 pb-2 text-gray-300"
              >
                <span className="text-white font-medium">{sub.problem}</span>
                <Badge
                  className={
                    sub.verdict === 'Accepted'
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : sub.verdict === 'Wrong Answer'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }
                >
                  {sub.verdict}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
