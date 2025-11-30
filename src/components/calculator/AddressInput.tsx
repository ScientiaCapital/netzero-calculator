'use client';

import { useEffect, useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];

export interface AddressInputProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Simple fallback component when Google Maps is not available
function SimpleFallbackInput({ value, onChange, className = '' }: { value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <div className={className}>
      <input
        type="text"
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tenant-primary focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your full address (e.g., 123 Main St, San Francisco, CA 94105)"
      />
      <p className="mt-1 text-xs text-gray-500">
        Address autocomplete is temporarily unavailable. Please enter your full address.
      </p>
    </div>
  );
}

export default function AddressInput({
  onPlaceSelect,
  value,
  onChange,
  className = ''
}: AddressInputProps) {
  // Check for API key - if missing, use simple fallback immediately
  const hasApiKey = !!process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'];

  // If no API key, return simple fallback without loading Google Maps at all
  if (!hasApiKey) {
    return <SimpleFallbackInput value={value} onChange={onChange} className={className} />;
  }

  return <AddressInputWithGoogleMaps value={value} onChange={onChange} onPlaceSelect={onPlaceSelect} className={className} />;
}

// Separate component that handles Google Maps integration
function AddressInputWithGoogleMaps({
  onPlaceSelect,
  value,
  onChange,
  className = ''
}: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY']!,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    // Create autocomplete instance
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry', 'address_components']
    });

    // Add listener for place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place && place.geometry && place.geometry.location) {
        onPlaceSelect(place);
        onChange(place.formatted_address || '');
      }
    });
  }, [isLoaded, onPlaceSelect, onChange]);

  // If Google Maps fails to load, show fallback
  if (loadError) {
    console.error('Google Maps API load error:', loadError);
    return <SimpleFallbackInput value={value} onChange={onChange} className={className} />;
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className={`w-full px-4 py-3 text-base border border-gray-200 rounded-lg bg-gray-50 ${className}`}>
        Loading address search...
      </div>
    );
  }

  // Loaded state with Google Maps autocomplete
  return (
    <input
      ref={inputRef}
      type="text"
      className={`w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tenant-primary focus:border-transparent transition-colors ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="123 Main St, San Francisco, CA"
    />
  );
}
