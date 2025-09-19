'use client';

import type React from 'react';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { FadeInUp } from '@/components/animations/FadeInUp';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Socials } from '@/components/Socials';
import { Send, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ContactForm() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in both subject and message fields.',
        variant: 'destructive',
      });
      return;
    }

    // Create mailto link with prefilled content
    const mailtoLink = `mailto:surya@theuntab.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(message)}`;

    // Open default email client
    window.location.href = mailtoLink;

    toast({
      title: 'Email client opened',
      description:
        'Your default email client should open with the prefilled message.',
    });

    // Reset form
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Contact Form */}
        <FadeInUp>
          <Card className="soft-card">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-brand-primary flex items-center gap-2">
                <Mail className="h-6 w-6 text-brand-accent" />
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-white mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What would you like to discuss?"
                    className="border-brand-accent/20 focus:border-brand-accent focus:ring-brand-accent/20 transition-colors"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project, question, or just say hello!"
                    rows={5}
                    className="border-brand-accent/20 focus:border-brand-accent focus:ring-brand-accent/20 resize-none transition-colors"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}>
                  <AnimatedButton
                    type="submit"
                    className="w-full bg-brand-cta hover:bg-brand-cta-hover text-white group shadow-lg">
                    <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </AnimatedButton>
                </motion.div>

                <motion.p
                  className="text-xs text-white/70 text-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}>
                  This will open your default email client with a prefilled
                  message. Your email address will not be stored or shared.
                </motion.p>
              </form>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Contact Info */}
        <FadeInUp delay={0.2}>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-heading font-semibold text-black mb-4">
                Let's Connect
              </h3>
              <p className="text-white leading-relaxed mb-6">
                I'm always interested in hearing about new opportunities,
                interesting projects, or just having a chat about technology and
                development.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-heading font-medium text-black mb-3">
                Find me elsewhere
              </h4>
              <Socials variant="footer" className="justify-start" />
            </div>

            <motion.div
              className="p-4 rounded-lg bg-white/10 border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}>
              <h4 className="text-sm font-medium text-white mb-2">
                Quick Response
              </h4>
              <p className="text-sm text-white/80">
                I typically respond to emails within 24-48 hours. For urgent
                matters, feel free to reach out via LinkedIn.
              </p>
            </motion.div>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
