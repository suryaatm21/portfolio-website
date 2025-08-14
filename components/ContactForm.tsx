"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Socials } from "@/components/Socials"
import { Send, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ContactForm() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      })
      return
    }

    // Create mailto link with prefilled content
    const mailtoLink = `mailto:surya@theuntab.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

    // Open default email client
    window.location.href = mailtoLink

    toast({
      title: "Email client opened",
      description: "Your default email client should open with the prefilled message.",
    })

    // Reset form
    setSubject("")
    setMessage("")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Contact Form */}
        <Card className="soft-card">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-brand-primary flex items-center gap-2">
              <Mail className="h-6 w-6 text-brand-accent" />
              Send a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-brand-primary mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What would you like to discuss?"
                  className="border-brand-accent/20 focus:border-brand-accent focus:ring-brand-accent/20"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-primary mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project, question, or just say hello!"
                  rows={5}
                  className="border-brand-accent/20 focus:border-brand-accent focus:ring-brand-accent/20 resize-none"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-brand-cta hover:bg-brand-cta-hover text-white group">
                <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Send Message
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                This will open your default email client with a prefilled message. Your email address will not be stored
                or shared.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-heading font-semibold text-brand-primary mb-4">Let's Connect</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              I'm always interested in hearing about new opportunities, interesting projects, or just having a chat
              about technology and development.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-heading font-medium text-brand-primary mb-3">Find me elsewhere</h4>
            <Socials variant="footer" className="justify-start" />
          </div>

          <div className="p-4 rounded-lg bg-brand-accent/5 border border-brand-accent/10">
            <h4 className="text-sm font-medium text-brand-accent mb-2">Quick Response</h4>
            <p className="text-sm text-muted-foreground">
              I typically respond to emails within 24-48 hours. For urgent matters, feel free to reach out via LinkedIn.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
