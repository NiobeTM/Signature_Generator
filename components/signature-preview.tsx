'use client';

import { useRef, useState } from 'react';
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
    address: 'ANDREA SYNGROU AVENUE 350, 176 74, KALLITHEA',
    website: 'ELKAK.GR',
  },
  el: {
    address: 'ΛΕΩΦ. ΑΝΔΡΕΑ ΣΥΓΓΡΟΥ 350, 176 74,ΚΑΛΛΙΘΕΑ',
    website: 'ELKAK.GR',
  },
};

type ModalKey = 'outlook' | 'android' | 'ios' | null;

const instructions = {
  outlook: {
    icon: '/instruction-outlook.png',
    label: { en: 'For Outlook Mail', el: 'Για Outlook Mail' },
    steps: {
      en: [
        'Click the "Copy Signature" button above.',
        'Open Outlook and go to File → Options.',
        'Select Mail → Signatures → New.',
        'Give the signature a name, then paste (Ctrl+V) in the text area.',
        'Set it as default for new messages and/or replies.',
        'Click OK to save.',
      ],
      el: [
        'Κάντε κλικ στο κουμπί "Αντιγραφή Υπογραφής" παραπάνω.',
        'Ανοίξτε το Outlook και πηγαίνετε στο Αρχείο → Επιλογές.',
        'Επιλέξτε Αλληλογραφία → Υπογραφές → Νέα.',
        'Δώστε ένα όνομα στην υπογραφή και επικολλήστε (Ctrl+V) στο πεδίο κειμένου.',
        'Ορίστε την ως προεπιλογή για νέα μηνύματα ή/και απαντήσεις.',
        'Πατήστε ΟΚ για αποθήκευση.',
      ],
    },
  },
  android: {
    icon: '/instruction-android.png',
    label: { en: 'For Android', el: 'Για Android' },
    steps: {
      en: [
        'Click the "Copy Signature" button above.',
        'Open the Gmail app on your Android device.',
        'Tap the Menu (☰) → Settings.',
        'Select your email account.',
        'Tap "Mobile Signature".',
        'Paste the signature and tap OK to save.',
      ],
      el: [
        'Κάντε κλικ στο κουμπί "Αντιγραφή Υπογραφής" παραπάνω.',
        'Ανοίξτε την εφαρμογή Gmail στη συσκευή Android.',
        'Πατήστε το Μενού (☰) → Ρυθμίσεις.',
        'Επιλέξτε τον λογαριασμό email σας.',
        'Πατήστε "Υπογραφή για κινητά".',
        'Επικολλήστε την υπογραφή και πατήστε ΟΚ για αποθήκευση.',
      ],
    },
  },
  ios: {
    icon: '/instruction-ios.png',
    label: { en: 'For iOS', el: 'Για iOS' },
    steps: {
      en: [
        'Click the "Copy Signature" button above.',
        'Open the Settings app on your iPhone or iPad.',
        'Scroll down and tap Mail → Signature.',
        'Select "All Accounts" or your specific account.',
        'Clear the existing text and paste the signature.',
        'Go back — changes are saved automatically.',
      ],
      el: [
        'Κάντε κλικ στο κουμπί "Αντιγραφή Υπογραφής" παραπάνω.',
        'Ανοίξτε τις Ρυθμίσεις στο iPhone ή iPad σας.',
        'Κάντε κύλιση και πατήστε Mail → Υπογραφή.',
        'Επιλέξτε "Όλοι οι λογαριασμοί" ή τον συγκεκριμένο λογαριασμό σας.',
        'Διαγράψτε το υπάρχον κείμενο και επικολλήστε την υπογραφή.',
        'Πηγαίνετε πίσω — οι αλλαγές αποθηκεύονται αυτόματα.',
      ],
    },
  },
} as const;

export default function SignaturePreview({ formData }: SignaturePreviewProps) {
  const signatureRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<ModalKey>(null);
  const company = companyData[formData.language];
  const isElkakEmail = (value: string) => /^[A-Z0-9._%+-]+@ELKAK\.GR$/i.test(value.trim());

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
        link.download = `ELKAK-Signature-${formData.language}-${formData.fullName}.png`;
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

  const handleCopySignature = async () => {
    if (signatureRef.current) {
      try {
        const origin = window.location.origin;
        const blue = '#0000FF';
        const safe = (s: string) =>
          s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        const topLogoSrc = `${origin}${logos.topLogo}`;
        const bottomLogoSrc = `${origin}${logos.bottomLogo[formData.language]}`;

        const email = formData.email?.trim();
        const showEmail = !!email && isElkakEmail(email);
        const tel = formData.phone?.trim();
        const mob = formData.mobile?.trim();
        const telLabel = formData.language === 'en' ? 'T:' : 'Τ:';
        const mobLabel = formData.language === 'en' ? 'M:' : 'Κ:';
        const telValue = formData.language === 'en' && tel ? `+30 ${tel}` : tel;
        const mobValue = formData.language === 'en' && mob ? `+30 ${mob}` : mob;

        // Email-signature-friendly markup: tables + redundant font/color styles.
        const htmlForClipboard = `
          <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: ${blue}; max-width: 700px;">
            <tr>
              <td style="padding: 12px 0 12px 0;">
                <img src="${topLogoSrc}" alt="ELKAK" height="70" style="height:70px; max-height:70px; width:auto; display:block; object-fit:contain;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 0; margin:0;">
                <div style="margin:0; padding:0;">
                  <div style="margin:0; padding:0; font-size:14px; font-weight:700; line-height:1.15; color:${blue};">
                    <font face="Arial" color="${blue}">${safe(formData.fullName || '')}</font>
                  </div>
                  <div style="margin:0; padding:0; font-size:12px; line-height:1.15; color:${blue};">
                    <font face="Arial" color="${blue}">${safe(formData.position || '')}</font>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0 6px 0;">
                <div style="border-top: 1px solid ${blue}; font-size:0; line-height:0;">&nbsp;</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0; margin:0;">
                <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color:${blue};">
                  ${showEmail ? `
                  <tr>
                    <td style="padding:0; margin:0; font-size:11px; line-height:1.15; color:${blue};">
                      <font face="Arial" color="${blue}">
                        <a href="mailto:${safe(email!)}" style="color:${blue}; text-decoration:none;">
                          ${safe(email!)}
                        </a>
                      </font>
                    </td>
                  </tr>` : ''}
                  ${(telValue || mobValue) ? `
                  <tr>
                    <td style="padding:0; margin:0; font-size:11px; line-height:1.15; color:${blue};">
                      <font face="Arial" color="${blue}">
                        ${telValue ? `${safe(telLabel)}&nbsp;${safe(telValue)}` : ''}
                        ${telValue && mobValue ? '&nbsp;&nbsp;&nbsp;&nbsp;' : ''}
                        ${mobValue ? `${safe(mobLabel)}&nbsp;${safe(mobValue)}` : ''}
                      </font>
                    </td>
                  </tr>` : ''}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0; margin:0; font-size:11px; line-height:1.15; color:${blue};">
                <font face="Arial" color="${blue}">${safe(company.address)}</font>
              </td>
            </tr>
            <tr>
              <td style="padding:0; margin:0; font-size:11px; line-height:1.15; color:${blue};">
                <font face="Arial" color="${blue}">
                  <a href="https://${safe(company.website)}" style="color:${blue}; text-decoration:none;" target="_blank" rel="noopener noreferrer">
                    ${safe(company.website)}
                  </a>
                </font>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0 0 0;">
                <img src="${bottomLogoSrc}" alt="ELKAK" height="42" style="height:42px; max-height:42px; width:auto; display:block; object-fit:contain;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0 0 0; font-family: Arial, sans-serif; font-size: 8px; color: #555555; line-height: 1.4;">
                <font face="Arial" color="#555555">
                  ${formData.language === 'en'
                    ? '<strong>DISCLAIMER:</strong> This communication may contain confidential information and is intended exclusively for the recipient for whom it is intended, and only for that recipient. Any reproduction, review, distribution, copying, or other use or action of this communication as such or of its contents, in whole or in part, or of information derived from it, by anyone other than the intended recipient is strictly prohibited. If you have received this communication in error, please inform the sender immediately by replying to this e-mail and delete this communication from any computer or other device or storage location.'
                    : '<strong>ΔΗΛΩΣΗ ΑΠΟΠΟΙΗΣΗΣ ΕΥΘΥΝΗΣ:</strong> Η παρούσα επικοινωνία δύναται να περιλαμβάνει εμπιστευτικές πληροφορίες και απευθύνεται αποκλειστικά στον αποδέκτη για τον οποίο προορίζεται και μόνο. Οποιαδήποτε αναπαραγωγή, θεώρηση, διανομή, αντιγραφή ή άλλη χρήση ή ενέργεια της παρούσας ως έχει ή του περιεχομένου της εν όλω ή εν μέρει ή πληροφοριών που απορρέουν από αυτή, από οποιονδήποτε άλλον εκτός από τον αποδέκτη για τον οποίο προορίζεται, απαγορεύεται αυστηρά. Αν λάβατε την παρούσα επικοινωνία κατά λάθος, παρακαλούμε όπως ενημερώσετε άμεσα τον αποστολέα απαντώντας στο παρόν e-mail και διαγράψετε την παρούσα επικοινωνία από κάθε υπολογιστή ή άλλη συσκευή ή τόπο αποθήκευσης.'
                  }
                </font>
              </td>
            </tr>
          </table>`.trim();

        // Write both HTML and plain text to the clipboard.
        // Using `writeText()` only provides text/plain, which some editors paste as raw HTML text.
        const plainText =
          signatureRef.current.innerText?.trim() ||
          htmlForClipboard.replace(/<[^>]*>/g, ' ');

        const ClipboardItemCtor = (window as any).ClipboardItem;
        if (navigator.clipboard && typeof (navigator.clipboard as any).write === 'function' && ClipboardItemCtor) {
          await (navigator.clipboard as any).write([
            new ClipboardItemCtor({
              'text/html': htmlForClipboard,
              'text/plain': plainText,
            }),
          ]);
        } else {
          await navigator.clipboard.writeText(htmlForClipboard);
        }
        toast({
          title:
            formData.language === 'en'
              ? 'Copied signature to clipboard'
              : 'Αντιγράφηκε η υπογραφή στο πρόχειρο',
          description:
            formData.language === 'en'
              ? 'Paste it into your email signature editor.'
              : 'Επικολλήστε το στον επεξεργαστή υπογραφής σας στο email.',
        });
      } catch (err) {
        console.error('Failed to copy signature:', err);
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
        <div style={{ marginBottom: formData.position ? '6px' : '0px' }}>
          {formData.fullName && (
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#0000FF',
              margin: '0px',
              lineHeight: '1.5'
            }}>
              {formData.fullName}
            </div>
          )}
          {formData.position && (
            <div style={{
              fontSize: '12px',
              color: '#0000FF',
              margin: '0px',
              lineHeight: '1.5'
            }}>
              {formData.position}
            </div>
          )}
        </div>
        {formData.position && (
          <div
            style={{
              borderTop: '1px solid #0000FF',
              margin: '0 0 6px 0',
              width: '100%',
            }}
          />
        )}

        {/* Contact Info */}
        <div style={{ fontSize: '11px', color: '#0000FF', lineHeight: '1.5' }}>
          {formData.email && isElkakEmail(formData.email) && (
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
                  {formData.language === 'en' ? `+30 ${formData.phone}` : formData.phone}
                </span>
              )}
              {formData.mobile && (
                <span>
                  <span>{formData.language === 'en' ? 'M: ' : 'Κ: '}</span>
                  {formData.language === 'en' ? `+30 ${formData.mobile}` : formData.mobile}
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
        <div style={{ fontSize: '11px', color: '#0000FF', lineHeight: '1.5' }}>
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

        {/* Disclaimer */}
        <div style={{ marginTop: '12px', fontSize: '8px', color: '#555555', lineHeight: '1.4' }}>
          {formData.language === 'en' ? (
            <span><strong>DISCLAIMER:</strong> This communication may contain confidential information and is intended exclusively for the recipient for whom it is intended, and only for that recipient. Any reproduction, review, distribution, copying, or other use or action of this communication as such or of its contents, in whole or in part, or of information derived from it, by anyone other than the intended recipient is strictly prohibited. If you have received this communication in error, please inform the sender immediately by replying to this e-mail and delete this communication from any computer or other device or storage location.</span>
          ) : (
            <span><strong>ΔΗΛΩΣΗ ΑΠΟΠΟΙΗΣΗΣ ΕΥΘΥΝΗΣ:</strong> Η παρούσα επικοινωνία δύναται να περιλαμβάνει εμπιστευτικές πληροφορίες και απευθύνεται αποκλειστικά στον αποδέκτη για τον οποίο προορίζεται και μόνο. Οποιαδήποτε αναπαραγωγή, θεώρηση, διανομή, αντιγραφή ή άλλη χρήση ή ενέργεια της παρούσας ως έχει ή του περιεχομένου της εν όλω ή εν μέρει ή πληροφοριών που απορρέουν από αυτή, από οποιονδήποτε άλλον εκτός από τον αποδέκτη για τον οποίο προορίζεται, απαγορεύεται αυστηρά. Αν λάβατε την παρούσα επικοινωνία κατά λάθος, παρακαλούμε όπως ενημερώσετε άμεσα τον αποστολέα απαντώντας στο παρόν e-mail και διαγράψετε την παρούσα επικοινωνία από κάθε υπολογιστή ή άλλη συσκευή ή τόπο αποθήκευσης.</span>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-12">
        <p className="mb-3 text-md" style={{ color: '#FFFFFF' }}>
          {formData.language === 'en' ? 'Instructions' : 'Οδηγίες'}
        </p>
        <div className="flex gap-3">
          {(['outlook', 'android', 'ios'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setActiveModal(key)}
              className="flex flex-1 flex-col items-center gap-2 rounded-lg border p-3 transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#000038', borderColor: '#ffffff20' }}
            >
              <img src={instructions[key].icon} alt={instructions[key].label[formData.language]} width={32} height={32} />
              <span className="text-center text-xs font-medium leading-tight" style={{ color: '#ffffff' }}>
                {instructions[key].label[formData.language]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12">
        <p className="mb-3 text-md" style={{ color: '#FFFFFF' }}>
          {formData.language === 'en' ? 'Get Your Signature' : 'Λήψη Υπογραφής'}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={handleCopySignature}
          className="flex-1 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          style={{ backgroundColor: '#0000FF' }}
        >
          {formData.language === 'en' ? 'Copy Signature' : 'Αντιγραφή Υπογραφής'}
        </Button>
        <Button
          onClick={handleDownload}
          className="flex-1 bg-gray-100 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors hover:bg-gray-200"
        >
          {formData.language === 'en' ? 'Download as Image' : 'Λήψη ως Εικόνα'}
        </Button>
      </div>

      {/* Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl p-8 shadow-2xl"
            style={{ backgroundColor: '#84868C' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={instructions[activeModal].icon} alt="" width={36} height={36} />
                <h3 className="text-lg font-bold" style={{ color: '#ffffff' }}>
                  {instructions[activeModal].label[formData.language]}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm transition-opacity hover:opacity-60"
                style={{ backgroundColor: '#0000FF', color: '#ffffff' }}
              >
                ✕
              </button>
            </div>

            {/* Steps — timeline connector */}
            <ol className="flex flex-col">
              {instructions[activeModal].steps[formData.language].map((step, i, arr) => (
                <li key={i} className="flex gap-4">
                  {/* Left column: circle + connector line */}
                  <div className="flex flex-col items-center">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{ backgroundColor: '#0000FF', color: '#ffffff' }}
                    >
                      {i + 1}
                    </span>
                    {i < arr.length - 1 && (
                      <div
                        className="w-px flex-1 my-1"
                        style={{ backgroundColor: '#0000FF', opacity: 0.35, minHeight: '24px' }}
                      />
                    )}
                  </div>
                  {/* Right column: text */}
                  <div className={i < arr.length - 1 ? 'pb-6' : ''}>
                    <p className="text-sm leading-relaxed pt-1" style={{ color: '#e0e0ff' }}>
                      {step}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      

    </div>
  );
}
