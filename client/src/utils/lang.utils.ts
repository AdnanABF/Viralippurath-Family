/**
 * A robust helper to extract localized strings from database entities.
 * * Logic Flow:
 * 1. If language is 'ml', look for 'field_ml'.
 * 2. If 'field_ml' is empty/null, or language is 'en', look for 'field_en'.
 * 3. As a final fallback (for current legacy data), look for the 'field' itself.
 */
export const getLocalized = (
  entity: any,
  field: string,
  currentLang: string
): string => {
  if (!entity) return "";

  const fieldEn = `${field}_en`;
  const fieldMl = `${field}_ml`;

  // 1. If user wants Malayalam
  if (currentLang === "ml") {
    // Return Malayalam if it exists and isn't just whitespace
    if (entity[fieldMl] && String(entity[fieldMl]).trim() !== "") {
      return entity[fieldMl];
    }
  }

  // 2. If Malayalam is missing OR user wants English
  // Try 'field_en' first
  if (entity[fieldEn] && String(entity[fieldEn]).trim() !== "") {
    return entity[fieldEn];
  }

  // 3. Final Fallback: if your DB currently just has 'title' instead of 'title_en'
  return entity[field] || "";
};
