'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { SRECCalculator } from '@/lib/calculator';
import type { SRECCalculationResult } from '@/lib/calculator';

export interface SRECIncomeProps {
  srecData: SRECCalculationResult;
  className?: string;
  onClick?: () => void;
}

export const SRECIncome: React.FC<SRECIncomeProps> = ({ srecData, className = '', onClick }) => {
  // Don't render if not eligible for SREC income
  if (!srecData.isEligible) {
    return null;
  }

  const display = SRECCalculator.formatSRECDisplay(srecData);

  return (
    <div
      className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-green-900">
              Energy Certificates (SRECs)
            </h3>
            <div className="group relative">
              <Info className="h-4 w-4 text-green-600 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
                <p className="mb-1">Solar Renewable Energy Certificates</p>
                <p className="text-xs text-gray-300">
                  Your solar panels earn certificates for every 1,000 kWh of clean power produced. Sell these certificates to utilities for bonus income on top of your electricity savings.
                </p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between p-3 bg-white/60 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Annual Certificate Income:</span>
              <span className="text-2xl font-bold text-green-700">
                {display.incomeText}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-600">Production:</span>
              <span className="text-sm font-medium text-gray-900">
                {display.productionText}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-600">Program:</span>
              <span className="text-sm font-medium text-gray-900">
                {display.programText}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-600">Current Value:</span>
              <span className="text-sm font-medium text-gray-900">
                {display.valueText}
              </span>
            </div>

            {srecData.eligibilityYears && (
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-600">Eligibility Period:</span>
                <span className="text-sm font-medium text-gray-900">
                  {srecData.eligibilityYears} years
                </span>
              </div>
            )}

            {srecData.lifetimeIncome > 0 && (
              <div className="flex items-baseline justify-between pt-2 border-t border-green-200">
                <span className="text-sm font-medium text-gray-700">
                  Total SREC Income ({srecData.eligibilityYears} years):
                </span>
                <span className="text-lg font-bold text-green-700">
                  ${srecData.lifetimeIncome.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {srecData.notes && (
            <p className="text-xs text-gray-600 mt-2 italic">
              {srecData.notes}
            </p>
          )}
        </div>
      </div>

      {/* State Associations */}
      {srecData.associations && srecData.associations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-xs text-gray-600 mb-2">Learn more from:</p>
          <div className="flex flex-wrap gap-2">
            {srecData.associations.map((assoc, index) => (
              <a
                key={index}
                href={assoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 hover:text-green-700 underline"
              >
                {assoc.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SRECIncome;
