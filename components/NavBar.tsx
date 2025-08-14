"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { Socials } from "@/components/Socials"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Resources", href: "#resources" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
]

export function NavBar() {
  const [activeSection, setActiveSection] = useState("home")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Simple scroll spy - find the section that's currently in view
      const sections = navItems.map((item) => item.href.slice(1))
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" : "bg-transparent",
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Name */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("#home")}
              className="text-xl font-heading font-semibold text-brand-primary hover:text-brand-accent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Go to home section"
            >
              Surya
            </button>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-accent hover:bg-brand-accent/10 focus:ring-2 focus:ring-brand-accent focus:ring-offset-2",
                  activeSection === item.href.slice(1) ? "text-brand-accent bg-brand-accent/10" : "text-brand-primary",
                )}
                aria-current={activeSection === item.href.slice(1) ? "page" : undefined}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right side - Socials, Theme Toggle, and Mobile Menu */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block">
              <Socials />
            </div>
            <ThemeToggle />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 px-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.href)}
                  className={cn(
                    "w-full justify-start text-sm font-medium transition-colors hover:text-brand-accent hover:bg-brand-accent/10",
                    activeSection === item.href.slice(1)
                      ? "text-brand-accent bg-brand-accent/10"
                      : "text-brand-primary",
                  )}
                  aria-current={activeSection === item.href.slice(1) ? "page" : undefined}
                >
                  {item.label}
                </Button>
              ))}
              <div className="pt-2 border-t border-border/50 mt-2">
                <Socials />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
