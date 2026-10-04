// Single source for contact data. In phase 2 these move to Firestore (settings/contacts)
// and become editable in TALANT ADMIN. TODO: confirm country code and Telegram handle format.
export const SITE = {
  founded: '2023-09-01',
  phone: '884342525',
  whatsapp: 'https://wa.me/992884342525', // TODO: confirm +992 prefix
  telegram: 'https://t.me/+992884342525', // TODO: confirm Telegram link/username
  instagram: 'https://instagram.com/talant_edu.tj',
  instagramHandle: '@talant_edu.tj',
  // TODO: working hours, map link are not provided yet.
};
// Prices in somoni per month. Only the price is shown on the site.
export const GRADES = [
  { grade: 11, price: 1000 },
  { grade: 10, price: 700 },
  { grade: 9, price: 700 },
];
export const SUBJECT_LESSONS = [2, 2, 1, 1]; // chemistry, biology, physics, Tajik
