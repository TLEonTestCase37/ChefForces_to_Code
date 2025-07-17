"use client"

import { useState, useEffect } from "react"
import { Menu, X, Code, Zap, Users, ArrowRight, Calendar, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const newsArticles = [
    {
      id: 1,
      title: "Revolutionary AI-Powered Development Tools",
      excerpt: "Discover how artificial intelligence is transforming the way we write and debug code.",
      date: "2024-01-15",
      author: "Alex Chen",
      category: "AI & Development",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "The Future of Web Development: What's Next?",
      excerpt: "Exploring emerging technologies and frameworks that will shape web development in 2024.",
      date: "2024-01-12",
      author: "Sarah Johnson",
      category: "Web Development",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "Building Scalable Applications with Modern Architecture",
      excerpt: "Learn best practices for creating applications that can handle millions of users.",
      date: "2024-01-10",
      author: "Mike Rodriguez",
      category: "Architecture",
      readTime: "12 min read",
    },
  ]

  const services = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Custom Development",
      description: "Tailored solutions built with cutting-edge technologies to meet your unique requirements.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Performance Optimization",
      description: "Boost your application's speed and efficiency with our advanced optimization techniques.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "Expert guidance and support to help your development team reach new heights.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-slate-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-white cursor-pointer" href="/" />
              </div>
              <span className="text-2xl font-bold text-white">ChefForces toCode</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                Home
              </a>
              <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                About
              </a>
              <a href="#news" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                News
              </a>
              <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                Contact
              </a>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-slate-800/95 backdrop-blur-md rounded-lg mt-2 p-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Home
                </a>
                <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  About
                </a>
                <a href="#news" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  News
                </a>
                <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Contact
                </a>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white w-full">
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-400/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              ChefForces
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {" "}
                toCode
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into powerful, scalable applications with our cutting-edge development solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-4 text-lg group"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg bg-transparent"
              >
                View Our Work
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-blue-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-blue-400">ChefForces toCode</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We combine innovation, expertise, and passion to deliver exceptional digital solutions that drive your
              business forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">{service.icon}</div>
                  </div>
                  <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-gradient-to-r from-slate-900 to-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Latest <span className="text-blue-400">News & Insights</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay updated with the latest trends, technologies, and insights from the world of software development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article, index) => (
              <Card
                key={article.id}
                className="bg-slate-800/60 border-slate-600 hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 group cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {article.category}
                    </Badge>
                    <span className="text-sm text-gray-400">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-white text-xl group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-3">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Build Something Amazing?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Let's collaborate and turn your vision into reality. Get in touch with our team of experts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Start Your Project
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg bg-transparent"
            >
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">ChefForces toCode</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Crafting exceptional digital experiences through innovative development solutions and cutting-edge
                technology.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                    About
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#news" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                    News
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>amankumarsingh2904@gmail.com</li>
                <li>Dial 100</li>
                <li>Varanasi, UP, India</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} CodeCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
