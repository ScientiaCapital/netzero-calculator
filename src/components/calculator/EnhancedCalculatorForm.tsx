'use client';

interface EnhancedCalculatorFormProps {
  onCalculate: (data: any) => void;
  loading: boolean;
}

export function EnhancedCalculatorForm({ onCalculate, loading }: EnhancedCalculatorFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Enhanced Calculator Form</h3>
      <div className="text-center py-8">
        <p className="text-gray-600">Enhanced calculator form will be displayed here</p>
        {loading && <p className="text-sm text-blue-600 mt-2">Loading...</p>}
      </div>
    </div>
  );
}
