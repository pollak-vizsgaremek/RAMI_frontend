// services/validationService.js
// Validates the exact fields used in Login.jsx and Register.jsx.
// Every function returns an error string or null.
// validateLoginForm / validateRegisterForm return a { field: errorString } object.
// isValid() returns true when that object is empty (no errors).

// ─── Field validators ─────────────────────────────────────────────────────────

const validateEmail = (email) => {
  if (!email || email.trim() === "") return "Az e-mail cím megadása kötelező.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "Érvénytelen e-mail cím formátum.";
  return null;
};

const validatePassword = (password) => {
  if (!password || password === "") return "A jelszó megadása kötelező.";
  if (password.length < 8) return "A jelszónak legalább 8 karakternek kell lennie.";
  return null;
};

const validateName = (value, label) => {
  if (!value || value.trim() === "") return `${label} megadása kötelező.`;
  if (value.trim().length < 2) return `${label} legalább 2 karakter legyen.`;
  return null;
};

// ─── Form validators ──────────────────────────────────────────────────────────

// Used by Login.jsx
// Checks: email, password
export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;

  if (!password || password === "") errors.password = "A jelszó megadása kötelező.";

  return errors;
};

// Used by Register.jsx
// Checks: surname, lastname, email, password (length), password2 (match)
export const validateRegisterForm = ({ surname, lastname, email, password, password2 }) => {
  const errors = {};

  const surnameErr = validateName(surname, "Vezetéknév");
  if (surnameErr) errors.surname = surnameErr;

  const lastnameErr = validateName(lastname, "Keresztnév");
  if (lastnameErr) errors.lastname = lastnameErr;

  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;

  const passwordErr = validatePassword(password);
  if (passwordErr) errors.password = passwordErr;

  if (!password2 || password2 === "") {
    errors.password2 = "Jelszó megerősítése kötelező.";
  } else if (password !== password2) {
    errors.password2 = "A két jelszó nem egyezik.";
  }

  return errors;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

// Returns true when there are zero errors — used in both components like:
// if (!isValid(formErrors)) { setErrors(formErrors); return; }
export const isValid = (errors) => Object.keys(errors).length === 0;