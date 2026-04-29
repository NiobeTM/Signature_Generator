'use client';

import { useState } from 'react';
import SignatureForm from '@/components/signature-form';
import SignaturePreview from '@/components/signature-preview';

export default function Home() {
  const [formData, setFormData] = useState({
    language: 'el' as 'en' | 'el',
    fullName: '',
    position: '',
    email: '',
    phone: '',
    mobile: '',
    linkedin: '',
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col md:h-screen md:flex-row">
        {/* Left Panel - Form */}
        <div className="w-full border-b border-gray-200 overflow-y-auto p-6 md:w-1/2 md:border-b-0 md:border-r md:p-8">
          <div className="max-w-md mx-auto">
            <img
              src="/elkak-logo-top.white.png"
              alt="ELKAK"
              className="mb-4"
              style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
            />
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#0000FF' }}>Email Signature Generator</h1>
            <SignatureForm formData={formData} setFormData={setFormData} />
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-full bg-gray-50 overflow-y-auto p-6 flex flex-col items-center justify-start md:w-1/2 md:p-8 md:justify-center">
          <div className="w-full max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Signature Preview</h2>
            <SignaturePreview formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
