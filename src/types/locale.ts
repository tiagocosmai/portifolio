export type Locale = "pt" | "en" | "es";

export type Tri = Record<Locale, string>;

export const LOCALES: { value: Locale; label: string }[] = [
  { value: "pt", label: "PT" },
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
];

export function isLocale(value: string): value is Locale {
  return LOCALES.some((item) => item.value === value);
}

export function isTri(v: unknown): v is Tri {
  return (
    typeof v === "object" &&
    v !== null &&
    "pt" in v &&
    "en" in v &&
    "es" in v &&
    typeof (v as Tri).pt === "string"
  );
}
