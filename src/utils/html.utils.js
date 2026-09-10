export const escapeHtml = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

export const looksLikeHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s ?? '');

import DOMPurify from 'dompurify';

export const legacyToHtml = (raw) => {
  if (!raw) return '';
  if (looksLikeHtml(raw)) {
    return DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: ['p', 'ul', 'li', 'br', 'strong', 'em', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
  }

  const text = raw.replace(/\\n/g, '\n'); // jika \n masih escaped
  const lines = text.split('\n');

  let html = '';
  let inList = false;

  for (const line of lines) {
    const t = line.trim();
    const bul = t.match(/^<bul>\s*(.*)$/i); // marker bullet
    if (bul) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${escapeHtml(bul[1])}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      if (t) html += `<p>${escapeHtml(t)}</p>`;
      else html += '<p><br></p>'; // baris kosong
    }
  }
  if (inList) html += '</ul>';
  return html;
};
