/**
 * Returns the language code (e.g. 'en') from a culture code (e.g. 'en-GB').
 *
 * @export
 * @param {string} locale
 * @returns {string}
 */
export function v1LanguageGetCode(locale: string): string {
  const regex = /^([^-]+)-/;
  const match = locale.match(regex);
  if (match) {
    return match[1];
  } else {
    // If no match is found, return the original string
    return locale;
  }
}

/**
 * Returns the language name (e.g. 'English') from a culture code (e.g. 'en-GB').
 *
 * @export
 * @param {string} locale
 * @param {boolean} [includeRegion=false]
 * @returns {string}
 */
export function v1LanguageGetName(
  locale: string,
  includeRegion = false,
): string {
  // Helper function to strip region from language name.
  const stripRegionFromLanguageName = (fullLanguageName: string): string => {
    // Known region descriptors
    const knownRegions = [
      'British',
      'American',
      'European',
      'France',
      'Canadian',
      'Australian',
      'New Zealand',
      'South African',
      'India',
      'Irish',
      'Singapore',
      'Malaysian',
    ];
    // Split the name by spaces and parentheses
    const parts = fullLanguageName.split(/[\s()]+/);
    // Filter out known region descriptors
    const filteredParts = parts.filter((part) => !knownRegions.includes(part));
    // Join remaining parts, assuming the language name is the first one
    return filteredParts.length > 0 ? filteredParts[0] : fullLanguageName;
  };

  // Check if the Intl API is available, and if it is use it to get the language
  // name from the culture code.
  if (Intl && typeof Intl.DisplayNames === 'function') {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
    const langName = displayNames.of(locale);
    if (langName) {
      if (!includeRegion) return stripRegionFromLanguageName(langName);
      return langName;
    }
  }
  return locale;
}
