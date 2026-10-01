import rawContent from "../data/content.json";
import rawResources from "../data/resources.json";
import coursesData from "../data/courses.json";
import { deepPick } from "../i18n/deepPick";
import {
  localizeCourseLine,
  localizeCourseProvider,
  type CoursesDataPt,
} from "../lib/courseI18n";
import { sortCourseItemsByYearDesc } from "../lib/courseSort";
import type { PickedContent } from "../types/content";
import type { Locale } from "../types/locale";

const AI_STYLES = `
  @page { margin: 12mm; size: A4; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", system-ui, sans-serif;
    font-size: 11pt;
    line-height: 1.45;
    color: #111827;
    background: #fff;
    max-width: 180mm;
    margin: 0 auto;
    padding: 8mm 0;
  }
  h1 { font-size: 20pt; line-height: 1.2; margin: 0 0 4px; }
  h2 { font-size: 13pt; margin: 18px 0 8px; padding-bottom: 2px; border-bottom: 1px solid #d1d5db; }
  h3 { font-size: 11.5pt; margin: 12px 0 4px; }
  h4 { font-size: 11pt; margin: 10px 0 4px; }
  p { margin: 0 0 8px; }
  a { color: #14532d; }
  ul { margin: 4px 0 8px; padding-left: 1.2em; }
  li { margin-bottom: 2px; }
  .doc-note { font-size: 9.5pt; color: #374151; margin: 0 0 12px; }
  .lang-nav { font-size: 9.5pt; margin: 0 0 16px; }
  .lang-nav a { margin-right: 10px; }
  dl { margin: 0 0 8px; }
  .field { margin: 0 0 2px; }
  .field dt, .field dd { display: inline; margin: 0; }
  .field dt { font-weight: 700; }
  .field dt::after { content: ": "; }
  .field dd::after { content: ""; display: block; }
  section { break-inside: avoid; }
`;

function esc(s: string): string {
  if (s == null || s === "") return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function t(locale: Locale, key: string): string {
  const resources = rawResources as Record<string, Record<string, string>>;
  const row = resources[key];
  if (!row) return key;
  return row[locale] ?? row.en ?? key;
}

function textField(label: string, value: string | undefined): string {
  if (!value?.trim()) return "";
  return `<div class="field"><dt>${esc(label)}</dt><dd>${esc(value.trim())}</dd></div>`;
}

function htmlField(label: string, html: string): string {
  if (!html.trim()) return "";
  return `<div class="field"><dt>${esc(label)}</dt><dd>${html}</dd></div>`;
}

function link(href: string | undefined): string {
  const value = href?.trim() ?? "";
  if (!value || value === "-") return "";
  return `<a href="${esc(value)}">${esc(value)}</a>`;
}

function section(id: string, title: string, inner: string): string {
  if (!inner.trim()) return "";
  return `<section id="${id}"><h2>${esc(title)}</h2>${inner}</section>`;
}

function jsonLd(data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

export function buildAiResumeHtml(
  locale: Locale,
  options: { portfolioUrl: string },
): string {
  const c = deepPick(rawContent, locale) as unknown as PickedContent;
  const portfolio = options.portfolioUrl.trim().replace(/\/$/, "");
  const langAttr = locale === "pt" ? "pt-BR" : locale === "es" ? "es" : "en";
  const selfPath = locale === "pt" ? "/curriculo" : `/curriculo/${locale}`;

  const contact = [
    textField(t(locale, "resume_field_role"), c.main.role),
    htmlField(t(locale, "resume_contact_email"), link(`mailto:${c.main.social.email}`)),
    textField(t(locale, "resume_contact_phone"), c.main.social.phone),
    htmlField(t(locale, "resume_contact_whatsapp"), link(c.main.social.whatsapp_url)),
    htmlField(t(locale, "resume_contact_linkedin"), link(c.main.social.linkedin)),
    htmlField(t(locale, "resume_contact_github"), link(c.main.social.github)),
    htmlField(t(locale, "resume_contact_credly"), link(c.main.social.credly)),
    htmlField(t(locale, "resume_contact_hackerrank"), link(c.main.social.hackerrank)),
    portfolio
      ? htmlField(t(locale, "resume_contact_portfolio"), link(portfolio))
      : "",
    htmlField(
      t(locale, "resume_contact_location"),
      c.main.social.location_maps_url?.trim()
        ? `<a href="${esc(c.main.social.location_maps_url)}">${esc(c.main.social.location_label)}</a>`
        : esc(c.main.social.location_label),
    ),
  ].join("");

  const summary = (c.main.intro_paragraphs ?? [])
    .map((paragraph) => `<p>${esc(paragraph)}</p>`)
    .join("");

  let expertise = "";
  for (const card of c.expertise.cards) {
    expertise += `<h3>${esc(card.title)}</h3>`;
    expertise += `<ul>${card.descriptions.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>`;
    if (card.stack?.length) {
      expertise += textField("Stack", card.stack.join(", "));
    }
  }

  let history = "";
  for (const entry of c.history.entries) {
    const hard = (entry.hard_skills ?? []).filter(Boolean).join(", ");
    const soft = (entry.soft_skills ?? []).filter(Boolean).join(", ");
    history += `<article><h3>${esc(entry.role)}</h3><dl>`;
    history += textField(t(locale, "resume_field_company"), entry.company);
    history += textField(t(locale, "resume_field_period"), entry.date);
    history += textField(t(locale, "resume_contact_location"), entry.location);
    history += `</dl>`;
    if (entry.description?.length) {
      history += `<ul>${entry.description.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>`;
    }
    history += textField(t(locale, "history_hard_skills"), hard);
    history += textField(t(locale, "history_soft_skills"), soft);
    history += `</article>`;
  }

  let education = "";
  for (const entry of c.education.entries) {
    education += `<article><h3>${esc(entry.title)}</h3><dl>`;
    education += textField(t(locale, "resume_field_period"), entry.date);
    education += textField(t(locale, "resume_contact_location"), entry.location);
    education += textField(t(locale, "resume_section_summary"), entry.description);
    education += `</dl></article>`;
  }

  let certifications = "";
  for (const item of c.certifications.items) {
    const verify = item.verify_url?.trim() || item.credly_url?.trim() || "";
    certifications += `<article><h3>${esc(item.title)}</h3>`;
    if (item.description?.trim()) certifications += `<p>${esc(item.description)}</p>`;
    if (verify) {
      certifications += `<dl>${htmlField(t(locale, "resume_field_verification"), link(verify))}</dl>`;
    }
    certifications += `</article>`;
  }

  const skillLabels = [
    t(locale, "lang_skill_communication"),
    t(locale, "lang_skill_conversation"),
    t(locale, "lang_skill_reading"),
    t(locale, "lang_skill_writing"),
  ];
  const skillFields = ["communication", "conversation", "reading", "writing"] as const;
  let languages = "";
  for (const item of c.languages.items) {
    languages += `<article><h3>${esc(item.name)}</h3><dl>`;
    languages += textField(t(locale, "resume_field_status"), item.level);
    skillFields.forEach((field, index) => {
      languages += textField(skillLabels[index], item[field]);
    });
    languages += textField(t(locale, "lang_note_label"), item.note);
    languages += `</dl></article>`;
  }

  let projects = "";
  for (const project of c.projects.items) {
    projects += `<article><h3>${esc(project.title)}</h3><dl>`;
    projects += textField(t(locale, "resume_field_period"), project.period);
    projects += textField(t(locale, "resume_field_organization"), project.organization);
    projects += `</dl><p>${esc(project.description)}</p></article>`;
  }

  let personal = "";
  for (const project of c.personal_projects.items) {
    personal += `<article><h3>${esc(project.title)}</h3><dl>`;
    personal += textField(t(locale, "resume_field_status"), project.status);
    personal += htmlField(t(locale, "resume_contact_github"), link(project.github_url));
    personal += htmlField(t(locale, "resume_contact_portfolio"), link(project.live_url));
    personal += `</dl><p>${esc(project.description)}</p></article>`;
  }

  const hobbies = c.hobbies?.items?.length
    ? `<ul>${c.hobbies.items.map((item) => `<li>${esc(item.label)}</li>`).join("")}</ul>`
    : "";

  const courses = coursesHtml(locale);
  const sameAs = [
    c.main.social.linkedin,
    c.main.social.github,
    c.main.social.credly,
    c.main.social.hackerrank,
    portfolio,
  ].filter((url) => url?.trim());

  const structured = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: c.main.name,
    jobTitle: c.main.role,
    email: c.main.social.email,
    telephone: c.main.social.phone,
    url: portfolio || undefined,
    address: c.main.social.location_label,
    sameAs,
    knowsLanguage: c.languages.items.map((item) => item.name),
    knowsAbout: c.expertise.cards.flatMap((card) => card.stack ?? []),
    hasOccupation: c.history.entries.map((entry) => ({
      "@type": "Occupation",
      name: entry.role,
      occupationLocation: entry.location,
    })),
    alumniOf: c.education.entries.map((entry) => entry.title),
  };

  const nav = [
    ["pt", "/curriculo", "Português"],
    ["en", "/curriculo/en", "English"],
    ["es", "/curriculo/es", "Español"],
  ]
    .map(([code, href, label]) => {
      const current = code === locale ? ` aria-current="page"` : "";
      return `<a href="${href}" hreflang="${code === "pt" ? "pt-BR" : code}"${current}>${label}</a>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="${langAttr}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${esc(c.main.name)} — CV</title>
  <meta name="description" content="${esc(t(locale, "resume_ai_doc_note"))}"/>
  <link rel="canonical" href="${esc(`${portfolio}${selfPath}`)}"/>
  ${jsonLd(structured)}
  <style>${AI_STYLES}</style>
</head>
<body>
<article id="resume" data-resume-format="ai-reading" data-resume-completeness="complete">
  <nav class="lang-nav" aria-label="${esc(t(locale, "resume_ai_languages_nav"))}">${nav}<a href="${esc(portfolio || "/")}">${esc(t(locale, "resume_contact_portfolio"))}</a></nav>
  <header>
    <h1>${esc(c.main.name)}</h1>
    <p>${esc(c.main.role)}</p>
    <p class="doc-note">${esc(t(locale, "resume_ai_doc_note"))}</p>
  </header>
  ${section("contact", t(locale, "resume_contacts_section"), `<dl>${contact}</dl>`)}
  ${section("summary", t(locale, "resume_section_summary"), summary)}
  ${section("expertise", t(locale, "nav_expertise"), expertise)}
  ${section("history", t(locale, "nav_history"), history)}
  ${section("education", t(locale, "nav_education"), education)}
  ${section("certifications", t(locale, "nav_certifications"), certifications)}
  ${section("languages", t(locale, "nav_languages"), languages)}
  ${section("projects", t(locale, "nav_projects"), projects)}
  ${section("personal-projects", t(locale, "nav_personal_projects"), personal)}
  ${section("courses", t(locale, "nav_courses"), courses)}
  ${section("hobbies", t(locale, "nav_hobbies"), hobbies)}
</article>
</body>
</html>`;
}

function coursesHtml(locale: Locale): string {
  const data = coursesData as CoursesDataPt;
  let html = "";
  if (data.distance.length) {
    html += `<h3>${esc(t(locale, "courses_section_distance"))}</h3>`;
    for (const group of data.distance) {
      const items = sortCourseItemsByYearDesc(group.items);
      html += `<h4>${esc(localizeCourseProvider(group.provider, locale))}</h4>`;
      if (group.url?.trim()) {
        html += `<dl>${htmlField(t(locale, "resume_contact_portfolio"), link(group.url))}</dl>`;
      }
      html += `<ul>${items
        .map((item) => {
          const certificate = item.certificate_url?.trim()
            ? ` ${link(item.certificate_url)}`
            : "";
          return `<li>${esc(localizeCourseLine(item.pt, locale))}${certificate}</li>`;
        })
        .join("")}</ul>`;
    }
  }

  const presential = sortCourseItemsByYearDesc(data.presential);
  if (presential.length) {
    html += `<h3>${esc(t(locale, "courses_section_presential"))}</h3><ul>`;
    html += presential
      .map((item) => `<li>${esc(localizeCourseLine(item.pt, locale))}</li>`)
      .join("");
    html += `</ul>`;
  }

  const events = sortCourseItemsByYearDesc(data.events);
  if (events.length) {
    html += `<h3>${esc(t(locale, "courses_section_events"))}</h3><ul>`;
    html += events
      .map((item) => {
        const speaker =
          item.role === "speaker"
            ? `<strong>${esc(t(locale, "courses_role_speaker"))}.</strong> `
            : "";
        const page = item.url?.trim() ? ` ${link(item.url)}` : "";
        return `<li>${speaker}${esc(localizeCourseLine(item.pt, locale))}${page}</li>`;
      })
      .join("");
    html += `</ul>`;
  }

  return html;
}
