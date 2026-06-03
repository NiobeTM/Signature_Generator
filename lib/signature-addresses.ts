export type AddressKey = 'syngrou' | 'fakinou';

export const SIGNATURE_ADDRESSES: Record<
  AddressKey,
  { en: string; el: string }
> = {
  syngrou: {
    en: 'ANDREA SYNGROU AVENUE 350, 176 74, KALLITHEA',
    el: 'ΛΕΩΦ. ΑΝΔΡΕΑ ΣΥΓΓΡΟΥ 350, 176 74,ΚΑΛΛΙΘΕΑ',
  },
  fakinou: {
    en: 'P. KANELLOPOULOU AVE. 6, FAKINOU CAMP, 115 27, ATHENS',
    el: 'ΛΕΩΦ. Π. ΚΑΝΕΛΛΟΠΟΥΛΟΥ 6, ΣΤΡ/ΔΟ ΦΑΚΙΝΟΥ, 115 27, ΑΘΗΝΑ',
  },
};

/** Readable labels for the dropdown (signature uses SIGNATURE_ADDRESSES — all caps). */
export const ADDRESS_OPTIONS: Record<
  AddressKey,
  { en: string; el: string }
> = {
  syngrou: {
    en: 'Andrea Syngrou Ave. 350, Kallithea',
    el: 'Λεωφ. Ανδρέα Συγγρού 350, Καλλιθέα',
  },
  fakinou: {
    en: 'P. Kanellopoulou Ave. 6, FAKINOU Camp, Athens',
    el: 'Λεωφ. Π. Κανελλοπούλου 6, Στρ/δο ΦΑΚΙΝΟΥ, Αθήνα',
  },
};

export function getSignatureAddress(
  language: 'en' | 'el',
  addressKey: AddressKey,
): string {
  return SIGNATURE_ADDRESSES[addressKey][language];
}
