const registerValidator = (email, username, fullName, password) => {
  const errors = {};

  if (email.trim() === "") {
    errors.email = "Email field must not be empty.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email must be a valid email address.";
  }

  if (username.trim() === "" || username.length > 20 || username.length < 3) {
    errors.username = "Username must be in range of 3-20 characters length .";
  }

  if (!/^[a-zA-Z0-9-_]*$/.test(username)) {
    errors.username = "Username must have alphanumeric characters only.";
  }

  if (fullName.trim() === "" || fullName.length > 20 || fullName.length < 2) {
    errors.fullName = "Full name must be in range of 2-20 characters length.";
  }

  if (!/^[a-zA-Z-_ ]*$/.test(fullName)) {
    errors.fullName =
      "Full name must have alphabet, dash, underscore & space characters only.";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const loginValidator = (username, password) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username field must not be empty.";
  }

  if (!password) {
    errors.password = "Password field must not be empty.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const questionValidator = (tags) => {
  const errors = {};

  if (tags.filter((t, index) => tags.indexOf(t) !== index).length > 0) {
    errors.tags = "Duplicate tags cannot be added.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports = { registerValidator, loginValidator, questionValidator };
