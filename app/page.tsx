'use client';

import { useState } from 'react';
import SignatureForm from '@/components/signature-form';
import SignaturePreview from '@/components/signature-preview';
import { UserMenu } from '@/components/user-menu';
import type { AddressKey } from '@/lib/signature-addresses';

export default function Home() {
  const [formData, setFormData] = useState({
    language: 'el' as 'en' | 'el',
    fullName: '',
    position: '',
    email: '',
    phone: '',
    mobile: '',
    addressKey: 'syngrou' as AddressKey,
    linkedin: '',
  });

  return (
    <div className="min-h-screen bg-transparent">
      <div className="min-h-screen p-6 md:p-10">
        <div
          className="mx-auto flex w-full max-w-7xl flex-col rounded-2xl shadow-sm ring-1 ring-black/5"
          style={{ backgroundColor: '#84868C' }}
        >
          {/* ── Header (full width) ── */}
          <div className="flex items-start justify-between gap-6 px-8 pt-8 pb-6">
            <div className="flex gap-6">
              <img
                src="/elkak-logo-header.png"
                alt="ELKAK"
                style={{ height: '56px', width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }}
              />
              <h1 className="text-3xl font-bold mt-3" style={{ color: '#FFFFFF' }}>
                Email Signature Generator
              </h1>
            </div>
            <UserMenu />
          </div>

          <div className="mx-8 border-t border-white" />

          {/* ── Two columns ── */}
          <div className="grid flex-1 grid-cols-1 gap-8 p-8 md:grid-cols-2">
            {/* Left – Form */}
            <div className="overflow-y-auto">
              <SignatureForm formData={formData} setFormData={setFormData} />
            </div>

            {/* Right – Preview */}
            <div className="overflow-y-auto">
              <h2 className="mb-4 text-lg " style={{ color: '#FFFFFF' }}>
                {formData.language === 'en' ? 'Signature Preview' : 'Προεπισκόπηση Υπογραφής'}
              </h2>
              <SignaturePreview formData={formData} />
            </div>
          </div>

          <div className="mx-8 border-t border-white" />

          {/* ── Footer (full width) ── */}
          <div className="px-8 py-5 text-center" style={{ fontSize: '11px', color: '#ffffff', lineHeight: '1.6' }}>
            Copyright © 2026 IT Department for ΕΛΚΑΚ. All rights reserved.
            {' · '}
            For support please contact: +30 210 013 3070 or{' '}
            <a href="mailto:it-support@elkak.gr" style={{ color: '#ffffff', textDecoration: 'underline' }}>
              it-support@elkak.gr
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
