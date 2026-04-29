'use client';

import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface FormData {
  language: 'en' | 'el';
  fullName: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  linkedin: string;
}

interface SignaturePreviewProps {
  formData: FormData;
}

// Logo URLs
const logos = {
  // Top logo - same for all languages (ELKAK LOGO-15)
  topLogo: '/elkak-logo-top.white.png',
  // Bottom logo - language specific
  bottomLogo: {
    en: '/elkak-logo-bottom-en.white.png', // English (ELKAK LOGO-17)
    el: '/elkak-logo-bottom-el.white.png', // Greek (ELKAK LOGO-18)
  },
};

const companyData = {
  en: {
    address: 'Andrea Syngrou Ave. 350, Kallithea 176 74',
    website: 'www.elkak.gr',
  },
  el: {
    address: 'Λεωφ. Ανδρέα Συγγρού 350, Καλλιθέα 176 74',
    website: 'www.elkak.gr',
  },
};

export default function SignaturePreview({ formData }: SignaturePreviewProps) {
  const signatureRef = useRef<HTMLDivElement>(null);
  const company = companyData[formData.language];

  const handleDownload = async () => {
    if (signatureRef.current) {
      try {
        const image = await toPng(signatureRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
        });
        const link = document.createElement('a');
        link.href = image;
        link.download = `ELKAK-Signature-${formData.language}.png`;
        link.click();
        toast({
          title: formData.language === 'en' ? 'Downloaded' : 'Έγινε λήψη',
          description:
            formData.language === 'en'
              ? 'Signature image saved.'
              : 'Η εικόνα της υπογραφής αποθηκεύτηκε.',
        });
      } catch (err) {
        console.error('Failed to generate signature:', err);
        toast({
          variant: 'destructive',
          title: formData.language === 'en' ? 'Download failed' : 'Αποτυχία λήψης',
          description:
            formData.language === 'en'
              ? 'Could not generate the image. Try again.'
              : 'Δεν ήταν δυνατή η δημιουργία της εικόνας. Δοκιμάστε ξανά.',
        });
      }
    }
  };

  const handleCopyHTML = async () => {
    if (signatureRef.current) {
      try {
        const html = signatureRef.current.outerHTML;
        await navigator.clipboard.writeText(html);
        toast({
          title:
            formData.language === 'en'
              ? 'Copied HTML to clipboard'
              : 'Αντιγράφηκε HTML στο πρόχειρο',
          description:
            formData.language === 'en'
              ? 'Paste it into your signature editor.'
              : 'Επικολλήστε το στον επεξεργαστή υπογραφής σας.',
        });
      } catch (err) {
        console.error('Failed to copy HTML:', err);
        toast({
          variant: 'destructive',
          title: formData.language === 'en' ? 'Copy failed' : 'Αποτυχία αντιγραφής',
          description:
            formData.language === 'en'
              ? 'Clipboard access was blocked. Try a different browser or copy from the HTML source.'
              : 'Δεν επιτράπηκε η πρόσβαση στο πρόχειρο. Δοκιμάστε άλλο browser ή αντιγράψτε από τον HTML κώδικα.',
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Signature Preview */}
      <div
        ref={signatureRef}
        className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        style={{
          fontFamily: 'Arial, sans-serif',
          maxWidth: '700px',
        }}
      >
        {/* Top Logo (ELKAK LOGO-15) - Same for all languages */}
        <div style={{ marginBottom: '12px' }}>
          <img
            src={logos.topLogo}
            alt="ELKAK Logo"
            style={{ height: '70px', objectFit: 'contain' }}
          />
        </div>

        {/* User Info */}
        <div style={{ marginBottom: '0px' }}>
          {formData.fullName && (
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#0000FF',
              margin: '0px',
              lineHeight: '1'
            }}>
              {formData.fullName}
            </div>
          )}
          {formData.position && (
            <div style={{
              fontSize: '12px',
              color: '#0000FF',
              margin: '0px',
              lineHeight: '1'
            }}>
              {formData.position}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div style={{ fontSize: '11px', color: '#0000FF', lineHeight: '1' }}>
          {formData.email && (
            <div style={{ margin: '0px' }}>
              <a href={`mailto:${formData.email}`} style={{ color: '#0000FF', textDecoration: 'none' }}>
                {formData.email}
              </a>
            </div>
          )}
          {(formData.phone || formData.mobile) && (
            <div style={{ margin: '0px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {formData.phone && (
                <span>
                  <span>{formData.language === 'en' ? 'T: ' : 'Τ: '}</span>
                  {formData.phone}
                </span>
              )}
              {formData.mobile && (
                <span>
                  <span>{formData.language === 'en' ? 'M: ' : 'Κ: '}</span>
                  {formData.mobile}
                </span>
              )}
            </div>
          )}
          {formData.linkedin && (
            <div style={{ margin: '0px' }}>
              <a href={formData.linkedin} style={{ color: '#0000FF', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          )}
        </div>

        {/* Address & Website */}
        <div style={{ fontSize: '11px', color: '#0000FF', lineHeight: '1' }}>
          <div style={{ margin: '0px' }}>{company.address}</div>
          <div style={{ margin: '0px' }}>
            <a href={`https://${company.website}`} style={{ color: '#0000FF', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
              {company.website}
            </a>
          </div>
        </div>

        {/* Bottom Logo (Language specific - LOGO-17 for EN, LOGO-18 for EL) */}
        <div style={{ marginTop: '12px' }}>
          <img
            src={logos.bottomLogo[formData.language]}
            alt="ELKAK"
            style={{ height: '42px', objectFit: 'contain', display: 'block' }}
          />
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <Button
          onClick={handleDownload}
          className="flex-1 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          style={{ backgroundColor: '#0000FF' }}
        >
          {formData.language === 'en' ? 'Download as Image' : 'Λήψη ως Εικόνα'}
        </Button>
        <Button
          onClick={handleCopyHTML}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          {formData.language === 'en' ? 'Copy HTML' : 'Αντιγραφή HTML'}
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: '#f0f0ff', borderColor: '#0000FF20' }}>
        <p className="text-xs text-gray-700">
          {formData.language === 'en' ? (
            <>
              <strong>For Outlook:</strong> Download as image, then go to File → Options → Mail → Signatures and insert the image. Or copy HTML for email signature editors.
            </>
          ) : (
            <>
              <strong>Για Outlook:</strong> Κατεβάστε ως εικόνα, μεταβείτε στο Αρχείο → Επιλογές → Αλληλογραφία → Υπογραφές και εισάγετε την εικόνα. Ή αντιγράψτε HTML για επεξεργαστές υπογραφής email.
            </>
          )}
        </p>
      </div>


    </div>
  );
}
