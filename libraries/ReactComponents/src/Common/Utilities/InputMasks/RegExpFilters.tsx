
/* 
  ? Simple RegExp expressions for quickly filtering strings for things like masking.
    ! Do not evaluate for RegExp_CHARS_NUMS_SPC with large strings, it accepts spaces and arrays of symbols, 
      ! and this can cause ReDoS errors in react
*/

// ? These are filtered expressions explicitly for the InputMask class
// Match anything that is NOT a letter
export const Filter_CHARS_ONLY = /[^A-Za-z]/g;

// Match anything that is NOT a digit
export const Filter_NUMS_ONLY = /[^\d]/g;

// Match anything that is NOT a letter or a digit
export const Filter_CHARS_NUMS = /[^A-Za-z0-9]/g;

// Match anything that is NOT a letter, number, space, or standard symbol
export const Filter_CHARS_NUMS_SPC = /[^A-Za-z0-9\s!@#$%^&*()_+=\-[\]{}|;:'",.<>/?`~]/g;



// ! These are validation expressions, not filter expressions
/** Characters only (Case-insensitive) */
export const Validate_CHARS_ONLY: RegExp = /^[A-Za-z]+$/;

/** Numbers only */
export const Validate_NUMS_ONLY: RegExp = /^\d+$/;

/** Characters and numbers */
export const Validate_CHARS_NUMS: RegExp = /^[A-Za-z0-9]+$/;

/** Characters, numbers, spaces, and common special characters. */
export const Validate_CHARS_NUMS_SPC: RegExp = /^[A-Za-z0-9\s!@#$%^&*()_+=\-[\]{}|;:'",.<>/?`~]+$/;

/** All valid email characters */
export const Validate_EMAIL: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** Min 8 characters, one upper, one lower, one special character. */
export const Validate_PASS: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/** Min 8 characters, one upper, one lower, one number, one special character. */
export const Validate_PASS_HS: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

