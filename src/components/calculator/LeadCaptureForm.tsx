'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, User, Mail, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface LeadCaptureFormProps {
  sessionId?: string;
  systemSize?: number;
  annualSavings?: number;
  address?: string;
  onSubmit?: (data: LeadFormData) => void;
  className?: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  systemSize?: number;
  annualSavings?: number;
}

type FormState = 'form' | 'submitting' | 'submitted' | 'error';

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  sessionId,
  systemSize,
  annualSavings,
  address,
  onSubmit,
  className = ''
}) => {
  const [formState, setFormState] = useState<FormState>('form');
  const [formData, setFormData] = useState<LeadFormData>(() => {
    const data: LeadFormData = {
      name: '',
      email: '',
      phone: '',
      address: address || ''
    };
    if (systemSize !== undefined) data.systemSize = systemSize;
    if (annualSavings !== undefined) data.annualSavings = annualSavings;
    return data;
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/calculator/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          address: formData.address || null,
          systemSizeKW: systemSize,
          annualSavings: annualSavings
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit lead');
      }

      const result = await response.json();

      setFormState('submitted');

      // Call optional callback
      if (onSubmit) {
        onSubmit(formData);
      }

    } catch (error) {
      console.error('Lead submission error:', error);
      setFormState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    }
  };

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Success state
  if (formState === 'submitted') {
    return (
      <Card className={`bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 ${className}`}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-700">
                We've received your information and will be in touch shortly to discuss your solar savings potential.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Form state
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Get Your Free Solar Consultation</CardTitle>
        <CardDescription>
          Enter your contact information to receive a detailed solar proposal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                disabled={formState === 'submitting'}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                disabled={formState === 'submitting'}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number <span className="text-gray-400 text-xs">(optional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10"
                disabled={formState === 'submitting'}
              />
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800">
              🔒 Your information is secure and will never be shared with third parties.
              We'll only use it to provide your personalized solar proposal.
            </p>
          </div>

          {/* Error Message */}
          {formState === 'error' && errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={formState === 'submitting'}
          >
            {formState === 'submitting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Get Free Solar Proposal'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadCaptureForm;
