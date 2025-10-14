export const validateName = (name) => {
  if (!name || name.trim().length < 20 || name.trim().length > 60) {
    return 'Name must be between 20 and 60 characters';
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return null;
};

export const validateAddress = (address) => {
  if (!address || address.trim().length === 0) {
    return 'Address is required';
  }
  if (address.trim().length > 400) {
    return 'Address must not exceed 400 characters';
  }
  return null;
};

export const validateRating = (rating) => {
  const numRating = parseInt(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return 'Rating must be between 1 and 5';
  }
  return null;
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const error = rules[field](formData[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
