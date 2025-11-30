'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/ui/Button';
import { useTenant } from '@/components/shared/TenantProvider';
import { Calculator, Zap, MapPin, Star, TrendingUp, DollarSign, Clock, Shield, CheckCircle2, ArrowRight, Users, Award, BarChart3, Target } from 'lucide-react';

export function CalculatorLanding() {
  const { config } = useTenant();
  const [address, setAddress] = useState('');

  const handleCalculateClick = () => {
    if (address.trim()) {
      // Navigate to calculator with address
      window.location.href = `/calculator?address=${encodeURIComponent(address)}`;
    }
  };

  return (
    <div className="min-h-screen calculator-theme">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
        <div className="absolute inset-0 gradient-hero-radial"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-20 w-64 h-64 bg-tenant-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-tenant-accent/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-tenant-primary rounded-xl flex items-center justify-center">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {config.name}
              </h1>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-6xl sm:text-7xl font-bold tracking-tight">
                <span className="text-gray-900">Calculate Your</span>
                <br />
                <span className="text-gradient">Solar Savings</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get an instant, personalized estimate of your solar savings potential. 
                See exactly how much you could save with solar energy.
              </p>
            </div>

            {/* Address Input */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter your address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-0 focus:ring-2 focus:ring-tenant-primary focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleCalculateClick()}
                  />
                </div>
                <Button
                  onClick={handleCalculateClick}
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold btn-hover"
                >
                  Calculate Savings
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500 flex items-center justify-center">
                <Shield className="w-4 h-4 mr-2" />
                Your information is secure and never shared
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-tenant-primary">500K+</div>
                <div className="text-sm text-gray-600">Calculations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tenant-primary">$2.5B</div>
                <div className="text-sm text-gray-600">Savings Calculated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tenant-primary">13</div>
                <div className="text-sm text-gray-600">SREC States</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tenant-primary">95%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Our Calculator is Different
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the most accurate solar savings estimates in the industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Accuracy */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">95% Accuracy</h4>
              <p className="text-gray-600 mb-4">
                Our calculations are based on real utility data and local market conditions, not estimates.
              </p>
              <div className="text-sm text-green-600 font-semibold">Industry Leading</div>
            </div>

            {/* Instant Results */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Instant Results</h4>
              <p className="text-gray-600 mb-4">
                Get your personalized solar savings estimate in seconds, not days or weeks.
              </p>
              <div className="text-sm text-blue-600 font-semibold">Lightning Fast</div>
            </div>

            {/* Comprehensive Analysis */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Complete Analysis</h4>
              <p className="text-gray-600 mb-4">
                See your payback period, 25-year savings, and environmental impact all in one place.
              </p>
              <div className="text-sm text-purple-600 font-semibold">Full Picture</div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              What You'll Discover
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get a complete picture of your solar potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Monthly Savings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Monthly Savings</h4>
              <p className="text-gray-600">See exactly how much you'll save each month on your electricity bill</p>
            </div>

            {/* Payback Period */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Payback Period</h4>
              <p className="text-gray-600">Know exactly when your solar investment pays for itself</p>
            </div>

            {/* 25-Year Savings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">25-Year Savings</h4>
              <p className="text-gray-600">Total savings over the lifetime of your solar system</p>
            </div>

            {/* Environmental Impact */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Environmental Impact</h4>
              <p className="text-gray-600">See how much CO2 you'll offset and trees you'll save</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Real Results from Real People
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how our calculator has helped thousands save money with solar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The calculator showed me I could save $180/month. I was skeptical, but after 6 months with solar, 
                I'm actually saving $195/month. It was spot on!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah M.</div>
                  <div className="text-sm text-gray-600">Homeowner, California</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "I used this calculator to convince my wife to go solar. The 25-year savings projection of $67,000 
                was the clincher. We're now saving $220/month!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Mike R.</div>
                  <div className="text-sm text-gray-600">Homeowner, Texas</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "As a business owner, I needed accurate numbers for my commercial solar project. 
                This calculator gave me the data I needed to make the right decision."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  J
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Jennifer L.</div>
                  <div className="text-sm text-gray-600">Business Owner, Florida</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your solar savings estimate in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-tenant-primary to-tenant-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Enter Your Address</h4>
              <p className="text-gray-600">
                We use your location to get accurate local utility rates, weather data, and incentives.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-tenant-primary to-tenant-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">We Analyze Your Home</h4>
              <p className="text-gray-600">
                Our system analyzes your roof, local weather patterns, and energy usage to create a personalized estimate.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-tenant-primary to-tenant-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Get Your Results</h4>
              <p className="text-gray-600">
                Receive a detailed report showing your potential savings, payback period, and environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-tenant-primary to-tenant-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold mb-6">
            Ready to See Your Solar Savings?
          </h3>
          <p className="text-xl text-white/90 mb-8">
            Get your personalized solar savings estimate in seconds. No commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-tenant-primary hover:bg-gray-100 px-10 py-5 text-xl font-semibold shadow-lg">
              Calculate My Savings
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10 py-5 text-xl font-semibold">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}