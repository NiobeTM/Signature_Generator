'use client';

import { useState } from 'react';

interface FormData {
  language: 'en' | 'el';
  fullName: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  linkedin: string;
}

interface SignatureFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

const languageLabels = {
  en: {
    language: 'Language',
    fullName: 'Full Name *',
    position: 'Role / Position *',
    email: 'Email Address *',
    phone: 'Telephone *',
    mobile: 'Mobile Phone',
    linkedin: 'LinkedIn Profile URL',
    english: 'English',
    greek: 'Greek',
    required: '* Required fields',
    privacy: 'Your data stays on this device. Nothing is sent anywhere.',
    clear: 'Clear form',
  },
  el: {
    language: 'Γλώσσα',
    fullName: 'Ονοματεπώνυμο *',
    position: 'Ρόλος / Θέση *',
    email: 'Διεύθυνση Email *',
    phone: 'Τηλέφωνο *',
    mobile: 'Κινητό Τηλέφωνο',
    linkedin: 'LinkedIn Profile URL',
    english: 'Αγγλικά',
    greek: 'Ελληνικά',
    required: '* Υποχρεωτικά πεδία',
    privacy: 'Τα δεδομένα παραμένουν στη συσκευή σας. Δεν αποστέλλονται πουθενά.',
    clear: 'Καθαρισμός φόρμας',
  },
};

export default function SignatureForm({ formData, setFormData }: SignatureFormProps) {
  const labels = languageLabels[formData.language];
  const [emailTouched, setEmailTouched] = useState(false);

  const sanitizeTenDigitNumber = (value: string) => value.replace(/\D/g, '').slice(0, 10);
  const isElkakEmail = (value: string) => /^[A-Z0-9._%+-]+@ELKAK\.GR$/.test(value);
  const showEmailError = emailTouched && formData.email.length > 0 && !isElkakEmail(formData.email);

  const handleLanguageChange = (lang: 'en' | 'el') => {
    setFormData({
      ...formData,
      language: lang,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleClear = () => {
    setFormData({
      ...formData,
      fullName: '',
      position: '',
      email: '',
      phone: '',
      mobile: '',
      linkedin: '',
    });
  };

  return (
    <form className="space-y-5">
      {/* Language Selection */}
      <fieldset>
        <legend className="block text-sm font-semibold text-gray-900 mb-3">
          {labels.language}
        </legend>
        <div className="flex flex-col gap-3 sm:flex-row">
        <button
            type="button"
            onClick={() => handleLanguageChange('el')}
            aria-pressed={formData.language === 'el'}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
              formData.language === 'el'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={formData.language === 'el' ? { backgroundColor: '#0000FF' } : {}}
          >
            {labels.greek}
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            aria-pressed={formData.language === 'en'}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
              formData.language === 'en'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={formData.language === 'en' ? { backgroundColor: '#0000FF' } : {}}
          >
            {labels.english}
          </button>
          
        </div>
      </fieldset>

      {/* Required Fields Notice */}
      <p className="text-xs text-gray-500">{labels.required}</p>
      <p className="text-xs text-gray-600">{labels.privacy}</p>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
          {labels.fullName}
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder={formData.language === 'en' ? 'John Doe' : 'Ιωάννης Παπαδόπουλος'}
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': '#0000FF' } as React.CSSProperties}
          autoComplete="name"
          required
        />
      </div>

      {/* Position */}
      <div>
        <label htmlFor="position" className="block text-sm font-semibold text-gray-900 mb-2">
          {labels.position}
        </label>
        <input
          id="position"
          name="position"
          type="text"
          placeholder={formData.language === 'en' ? 'Manager' : 'Διευθυντής'}
          value={formData.position}
          onChange={(e) => handleInputChange('position', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': '#0000FF' } as React.CSSProperties}
          autoComplete="organization-title"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="NAME@ELKAK.GR"
          value={formData.email}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            const valid =
              value.length === 0 || /^[A-Z0-9._%+-]+@ELKAK\.GR$/.test(value);
            e.target.setCustomValidity(
              valid
                ? ''
                : formData.language === 'en'
                  ? 'Only @elkak.gr emails are allowed.'
                  : 'Επιτρέπονται μόνο emails @elkak.gr.'
            );
            handleInputChange('email', value);
          }}
          onBlur={(e) => {
            setEmailTouched(true);
          }}
          aria-invalid={showEmailError}
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent uppercase ${
            showEmailError ? 'border-red-500' : 'border-gray-300'
          }`}
          style={{ '--tw-ring-color': '#0000FF' } as React.CSSProperties}
          autoComplete="email"
          pattern="^[A-Z0-9._%+-]+@ELKAK\\.GR$"
          title={formData.language === 'en' ? 'Only @elkak.gr emails are allowed.' : 'Επιτρέπονται μόνο emails @elkak.gr.'}
          required
        />
        {showEmailError && (
          <p className="mt-1 text-xs text-red-600">
            {formData.language === 'en'
              ? 'Only @elkak.gr emails are allowed.'
              : 'Επιτρέπονται μόνο emails @elkak.gr.'}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
          {labels.phone}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="210 XXX XXXX"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', sanitizeTenDigitNumber(e.target.value))}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': '#0000FF' } as React.CSSProperties}
          inputMode="numeric"
          pattern="^\\d{10}$"
          maxLength={10}
          title={formData.language === 'en' ? 'Telephone must be exactly 10 digits.' : 'Το τηλέφωνο πρέπει να είναι ακριβώς 10 ψηφία.'}
          autoComplete="tel"
          required
        />
      </div>

      {/* Mobile Phone */}
      <div>
        <label htmlFor="mobile" className="block text-sm font-semibold text-gray-900 mb-2">
          {labels.mobile}
        </label>
        <input
          id="mobile"
          name="mobile"
          type="tel"
          placeholder="69X XXX XXXX"
          value={formData.mobile}
          onChange={(e) => handleInputChange('mobile', sanitizeTenDigitNumber(e.target.value))}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': '#0000FF' } as React.CSSProperties}
          inputMode="numeric"
          pattern="^\\d{10}$"
          maxLength={10}
          title={formData.language === 'en' ? 'Mobile must be exactly 10 digits.' : 'Το κινητό πρέπει να είναι ακριβώς 10 ψηφία.'}
          autoComplete="tel-national"
        />
      </div>

      {/* LinkedIn */}
      <div>
        <label htmlFor="linkedin" className="block text-sm font-semibold text-gray-900 mb-2">
          {labels.linkedin}
        </label>
        <input
          id="linkedin"
          name="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          value={formData.linkedin}
          onChange={(e) => handleInputChange('linkedin', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': '#0000FF' } as React.CSSProperties}
          autoComplete="url"
        />
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleClear}
          className="w-full py-2.5 px-4 rounded-lg font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {labels.clear}
        </button>
      </div>
    </form>
  );
}
