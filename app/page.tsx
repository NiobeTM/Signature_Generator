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
    <div className="min-h-screen bg-transparent">
      <div className="min-h-screen p-6 md:p-10">
        <div className="mx-auto w-full max-w-7xl rounded-2xl bg-titanium shadow-sm ring-1 ring-black/5">
          <div className="grid min-h-screen grid-cols-1 gap-10 p-6 md:min-h-[calc(100vh-5rem)] md:grid-cols-2 md:p-8">
            {/* Left Panel - Form */}
            <div className="overflow-y-auto">
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
            <div className="overflow-y-auto flex flex-col items-center justify-start md:justify-center">
              <div className="w-full max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Signature Preview</h2>
                <SignaturePreview formData={formData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
