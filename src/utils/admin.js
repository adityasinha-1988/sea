export const ADMIN_EMAILS = [
  'hod.cse@university.edu',
  'dean@university.edu',
  'sea.admin@university.edu'
];

export const isAdminEmail = (email = '') => ADMIN_EMAILS.includes(email.toLowerCase());
