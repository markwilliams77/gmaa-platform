import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

export const detectCountryFromDialCode = (
  phone: string,
): CountryCode | undefined => {
  try {
    const parsed = parsePhoneNumberFromString(phone);

    if (parsed?.country) {
      return parsed.country;
    }
  } catch {}

  const value = phone.replace(/\D/g, "");

  if (!value) {
    return undefined;
  }

  let detected: CountryCode | undefined;
  let longestMatch = 0;

  for (const country of getCountries()) {
    const code = getCountryCallingCode(country);

    if (value.startsWith(code) && code.length > longestMatch) {
      detected = country;
      longestMatch = code.length;
    }
  }

  return detected;
};