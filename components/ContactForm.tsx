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
import { contact } from '@/content/site';

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
        {/* Contact Form - Takes 2 rows */}
        <FadeInUp className="lg:row-span-2">
          <Card className="soft-card h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-brand-primary flex items-center gap-2">
                <Mail className="h-6 w-6 text-brand-accent" />
                {contact.form.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-white mb-2">
                    {contact.form.subjectLabel}
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={contact.form.subjectPlaceholder}
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
                    {contact.form.messageLabel}
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={contact.form.messagePlaceholder}
                    rows={8}
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
                    {contact.form.submitText}
                  </AnimatedButton>
                </motion.div>

                <motion.p
                  className="text-xs text-white/70 text-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}>
                  {contact.form.disclaimer}
                </motion.p>
              </form>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Right column with space between cards */}
        <div className="flex flex-col space-y-6 justify-center h-full">
          {/* Availability Section - Row 1 */}
          <FadeInUp delay={0.2}>
            <Card className="soft-card">
              <CardContent className="p-6">
                <h4 className="text-lg font-heading font-medium text-brand-accent mb-3">
                  {contact.availability.title}
                </h4>
                <p className="text-white">
                  {contact.availability.content}
                </p>
              </CardContent>
            </Card>
          </FadeInUp>

          {/* Social Links Section - Row 2 */}
          <FadeInUp delay={0.3}>
            <Card className="soft-card">
              <CardContent className="p-6">
                <h4 className="text-lg font-heading font-medium text-white mb-4">
                  {contact.social.title}
                </h4>
                <Socials variant="footer" className="justify-start" />
              </CardContent>
            </Card>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
