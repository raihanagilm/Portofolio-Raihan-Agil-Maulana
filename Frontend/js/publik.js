/* ═══════════════════════════════════════════
   publik.js — Portfolio Public Page Logic
   Pure JS, no Jinja tags. Data comes from window.PD set in HTML template.
   ═══════════════════════════════════════════ */

// ═══════ STATE ═══════
const state = {
  isOpen: false,
  currentSection: 'profil',
  isAnimating: false,
  mobileShowRight: false,
  navExpanded: false
};

// ═══════ DOM ═══════
const $ = id => document.getElementById(id);
const book3d = $('book3d');
const bookScene = $('bookScene');
const shelf = $('shelf');
const openBookView = $('openBookView');
const openBookPages = $('openBookPages');
const pageLeft = $('pageLeft');
const pageRight = $('pageRight');
const chapterNav = $('chapterNav');
const statusText = $('statusText');
const statusDot = $('statusDot');
const headerHint = $('headerHint');
const bookmark = $('bookmark');
const navToggle = $('navToggle');

// ═══════ DATA SHORTHAND ═══════
const PD = window.PD || { profile: {}, educations: [], certificates: [], skills: [], experiences: [], projects: [] };
const p = PD.profile;

// ═══════ MOBILE DETECTION ═══════
function isMobile() { return window.innerWidth < 768; }

// ═══════ HELPERS ═══════
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')
    .replace(/\r/g, '');
}

// ═══════ SVG ICONS ═══════
const icons = {
  github: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  linkedin: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
  instagram: '<svg class="icon icon-sm" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  twitter: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M4 4l11.733 16H20L8.267 4z"/><path d="M4 20l6.768-6.768M20 4l-6.768 6.768"/></svg>',
  globe: '<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  mail: '<svg class="icon icon-sm" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  phone: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M22 16.92V20a2 2 0 0 1-2 2h-4c-9.94 0-18-8.06-18-18V2a2 2 0 0 1 2-2h3.09a2 2 0 0 1 1.92 1.34l2.6 6.55a2 2 0 0 1-.48 2.22l-2.2 2.2a16 16 0 0 0 7.34 7.34l2.2-2.2a2 2 0 0 1 2.22-.48l6.55 2.6a2 2 0 0 1 1.34 1.92z"/></svg>',
  location: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  download: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  building: '<svg class="icon icon-sm" viewBox="0 0 24 24"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>',
  award: '<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  gradcap: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  external: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
  code: '<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  send: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  folder: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  user: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  briefcase: '<svg class="icon icon-sm" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  chevronRight: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>',
  chevronLeft: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>',
  menu: '<svg class="icon" viewBox="0 0 24 24"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="16" x2="20" y2="16"/></svg>',
  x: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'
};

// ═══════ SECTION BUILDERS ═══════
const sections = {
  profil: {
    color: '#3b82f6',
    left: function () {
      var html = '<div class="page-heading" style="color:#3b82f6;">' + icons.user + ' Volume I — Profil</div>';
      html += '<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;">';
      if (p.avatar_url) {
        html += '<img src="' + p.avatar_url + '" alt="' + esc(p.full_name) + '" style="width:80px;height:80px;border-radius:12px;object-fit:cover;border:3px solid #3b82f6;flex-shrink:0;"/>';
      }
      html += '<div><h2 class="page-title" style="margin-bottom:6px;font-size:18px;">' + esc(p.full_name) + '</h2>';
      html += '<p style="padding:6px;background:#eff6ff;border-radius:6px;font-style:italic;color:#3b82f6;font-size:11px;display:inline-block;margin-bottom:8px;">"' + esc(p.title) + '"</p>';
      html += '<p>' + esc(p.bio) + '</p></div></div>';
      
      html += '<div class="page-heading" style="color:#3b82f6;margin-top:20px;">' + icons.globe + ' Let\'s Connect</div><div class="page-body"><div style="margin-bottom:14px;">';
      if (p.show_email && p.email) html += '<div class="meta-line"><span class="meta-label">' + icons.mail + ' Email</span><span>' + esc(p.email) + '</span></div>';
      if (p.show_phone && p.phone) html += '<div class="meta-line"><span class="meta-label">' + icons.phone + ' Phone</span><span>' + esc(p.phone) + '</span></div>';
      if (p.show_location && p.location) html += '<div class="meta-line"><span class="meta-label">' + icons.location + ' Location</span><span>' + esc(p.location) + '</span></div>';
      html += '</div><div class="book-social">';
      if (p.github && p.show_github) html += '<a href="' + p.github + '" target="_blank">' + icons.github + ' GitHub</a>';
      if (p.linkedin && p.show_linkedin) html += '<a href="' + p.linkedin + '" target="_blank">' + icons.linkedin + ' LinkedIn</a>';
      if (p.instagram && p.show_instagram) html += '<a href="' + p.instagram + '" target="_blank">' + icons.instagram + ' Instagram</a>';
      if (p.twitter && p.show_twitter) html += '<a href="' + p.twitter + '" target="_blank">' + icons.twitter + ' Twitter/X</a>';
      if (p.show_website && p.website) html += '<a href="' + p.website + '" target="_blank">' + icons.globe + ' Website</a>';
      html += '</div>';
      if (p.resume_url && p.show_resume) html += '<div style="margin-top:16px;"><a href="' + p.resume_url + '" target="_blank" class="btn-primary">' + icons.download + ' Download CV</a></div>';
      html += '</div>';
      return html;
    },
    right: function () {
      var html = '<div class="page-heading" style="color:#10b981;">' + icons.gradcap + ' Volume II — Pendidikan & Sertifikat</div>' +
        '<h2 class="page-title" style="font-size:18px;">Pendidikan</h2><div class="page-body">';
      if (!PD.educations.length) {
        html += '<p style="font-style:italic;color:var(--ink-lighter);font-size:12px;">Belum ada data pendidikan.</p>';
      }
      PD.educations.forEach(function (edu) {
        html += '<div class="timeline-entry" style="padding:8px 0;"><div class="timeline-period" style="color:#10b981;">' + icons.gradcap + ' ' + esc(edu.period) + '</div>';
        html += '<div class="timeline-role" style="font-size:12px;">' + esc(edu.degree) + (edu.major ? ' — ' + esc(edu.major) : '') + '</div>';
        html += '<div class="timeline-company" style="font-size:10px;">' + icons.building + ' ' + esc(edu.institution) + '</div></div>';
      });
      html += '</div><h2 class="page-title" style="font-size:18px;margin-top:16px;">Sertifikat</h2><div class="page-body">';
      if (!PD.certificates.length) {
        html += '<p style="font-style:italic;color:var(--ink-lighter);font-size:12px;">Belum ada sertifikat.</p>';
      }
      PD.certificates.forEach(function (cert) {
        html += '<div class="timeline-entry" style="padding:6px 0;"><div class="timeline-period" style="color:#10b981;font-size:9px;">' + icons.award + ' ' + esc(cert.period) + '</div>';
        html += '<div class="timeline-role" style="font-size:11px;">' + esc(cert.degree) + '</div></div>';
      });
      html += '</div><div class="page-number">2</div>';
      return html;
    }
  },

  keahlian: {
    color: '#8b5cf6',
    left: function () {
      var html = '<div class="page-heading" style="color:#8b5cf6;">' + icons.code + ' Volume III — Keahlian</div>' +
        '<h2 class="page-title">Skills</h2><div class="page-body">';
      var cats = [];
      PD.skills.forEach(function (s) { if (cats.indexOf(s.category) === -1) cats.push(s.category); });
      cats.slice(0, 3).forEach(function (cat) {
        html += '<div style="margin-bottom:14px;"><div class="meta-label" style="margin-bottom:6px;color:#8b5cf6;">' + icons.code + ' ' + esc(cat) + '</div><div>';
        PD.skills.forEach(function (s) { if (s.category === cat) html += '<span class="skill-tag">' + esc(s.name) + '</span>'; });
        html += '</div></div>';
      });
      html += '</div>';
      return html;
    },
    right: function () {
      var html = '<div class="page-heading" style="color:#8b5cf6;">' + icons.code + ' More Skills</div>' +
        '<h2 class="page-title" style="font-size:18px;">Tech Stack</h2><div class="page-body">';
      var cats = [];
      PD.skills.forEach(function (s) { if (cats.indexOf(s.category) === -1) cats.push(s.category); });
      cats.slice(3).forEach(function (cat) {
        html += '<div style="margin-bottom:14px;"><div class="meta-label" style="margin-bottom:6px;color:#8b5cf6;">' + icons.code + ' ' + esc(cat) + '</div><div>';
        PD.skills.forEach(function (s) { if (s.category === cat) html += '<span class="skill-tag">' + esc(s.name) + '</span>'; });
        html += '</div></div>';
      });
      html += '<div style="margin-top:16px;padding:12px;background:#f5f3ff;border-radius:8px;text-align:center;">';
      html += '<p style="font-size:11px;color:#8b5cf6;font-weight:600;">' + PD.skills.length + ' teknologi dikuasai</p></div>';
      html += '</div><div class="page-number">6</div>';
      return html;
    }
  },

  pengalaman: {
    color: '#f59e0b',
    left: function () {
      var html = '<div class="page-heading" style="color:#f59e0b;">' + icons.briefcase + ' Volume IV — Pengalaman</div>' +
        '<h2 class="page-title">Experience</h2><div class="page-body">';
      if (!PD.experiences.length) {
        html += '<p style="font-style:italic;color:var(--ink-lighter);font-size:12px;">Belum ada pengalaman kerja.</p>';
      }
      PD.experiences.slice(0, 3).forEach(function (exp) {
        html += '<div class="timeline-entry"><div class="timeline-period" style="color:#f59e0b;">' + icons.briefcase + ' ' + esc(exp.period) + ' · ' + esc(exp.category) + '</div>';
        html += '<div class="timeline-role">' + esc(exp.position) + '</div>';
        html += '<div class="timeline-company">' + icons.building + ' ' + esc(exp.company) + '</div>';
        html += '<p style="font-size:11px;line-height:1.5;">' + esc(exp.description) + '</p></div>';
      });
      html += '</div>';
      return html;
    },
    right: function () {
      var html = '<div class="page-heading" style="color:#f59e0b;">' + icons.briefcase + ' Career Path</div>' +
        '<h2 class="page-title" style="font-size:18px;">More Experience</h2><div class="page-body">';
      var more = PD.experiences.slice(3);
      if (!more.length) {
        html += '<p style="font-style:italic;color:var(--ink-lighter);font-size:12px;">The journey continues...</p>';
      }
      more.forEach(function (exp) {
        html += '<div class="timeline-entry"><div class="timeline-period" style="color:#f59e0b;">' + icons.briefcase + ' ' + esc(exp.period) + ' · ' + esc(exp.category) + '</div>';
        html += '<div class="timeline-role">' + esc(exp.position) + '</div>';
        html += '<div class="timeline-company">' + icons.building + ' ' + esc(exp.company) + '</div>';
        html += '<p style="font-size:11px;line-height:1.5;">' + esc(exp.description) + '</p></div>';
      });
      html += '</div><div class="page-number">8</div>';
      return html;
    }
  },

  proyek: {
    color: '#ec4899',
    left: function () {
      var html = '<div class="page-heading" style="color:#ec4899;">' + icons.folder + ' Volume V — Proyek</div>' +
        '<h2 class="page-title">Projects</h2><div class="page-body">';
      if (!PD.projects.length) {
        html += '<p style="font-style:italic;color:var(--ink-lighter);font-size:12px;">Belum ada proyek.</p>';
      }
      PD.projects.slice(0, 1).forEach(function (proj) {
        html += '<div style="margin-bottom:16px;">';
        if (proj.image_url) {
          html += '<img src="' + proj.image_url + '" alt="' + esc(proj.title) + '" class="project-img" style="width:100%;height:220px;object-fit:cover;border-radius:8px;margin-bottom:12px;border:1px solid #e5e7eb;">';
        } else {
          html += '<div class="project-img" style="width:100%;height:220px;background:var(--card-bg, #f8fafc);display:flex;align-items:center;justify-content:center;color:var(--ink-light, #94a3b8);font-size:12px;border-radius:8px;border:1px dashed #cbd5e1;margin-bottom:12px;">' + icons.folder + ' <span style="margin-left:6px;font-style:italic;">No Image</span></div>';
        }
        html += '<div class="timeline-period" style="color:#ec4899;">' + icons.folder + ' ' + esc(proj.category) + '</div>';
        html += '<div class="timeline-role" style="font-size:13px;">' + esc(proj.title) + '</div>';
        html += '<p style="font-size:11px;line-height:1.5;margin:5px 0;">' + esc(proj.description) + '</p>';
        html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">';
        html += '<a href="' + proj.detail_url + '" class="btn-primary" style="padding:6px 12px;font-size:10px;">Detail</a>';
        if (proj.demo_url) html += '<a href="' + proj.demo_url + '" target="_blank" class="btn-outline" style="padding:5px 10px;font-size:10px;">' + icons.external + ' Demo</a>';
        html += '</div></div>';
      });
      html += '</div>';
      return html;
    },
    right: function () {
      var html = '<div class="page-heading" style="color:#ec4899;">' + icons.folder + ' More Works</div>' +
        '<h2 class="page-title" style="font-size:18px;">Other Projects</h2><div class="page-body">';
      var more = PD.projects.slice(1, 2);
      if (!more.length) {
        html += '<p style="font-style:italic;color:var(--ink-lighter);font-size:12px;">Lihat semua di halaman kiri.</p>';
      }
      more.forEach(function (proj) {
        html += '<div style="margin-bottom:14px;">';
        if (proj.image_url) {
          html += '<img src="' + proj.image_url + '" alt="' + esc(proj.title) + '" class="project-img" style="width:100%;height:220px;object-fit:cover;border-radius:6px;margin-bottom:8px;border:1px solid #e5e7eb;">';
        } else {
          html += '<div class="project-img" style="width:100%;height:220px;background:var(--card-bg, #f8fafc);display:flex;align-items:center;justify-content:center;color:var(--ink-light, #94a3b8);font-size:10px;border-radius:6px;border:1px dashed #cbd5e1;margin-bottom:8px;">' + icons.folder + ' <span style="margin-left:4px;font-style:italic;">No Image</span></div>';
        }
        html += '<div class="timeline-period" style="color:#ec4899;">' + icons.folder + ' ' + esc(proj.category) + '</div>';
        html += '<div class="timeline-role" style="font-size:12px;">' + esc(proj.title) + '</div>';
        html += '<p style="font-size:10px;line-height:1.5;margin:4px 0;">' + esc(proj.description.substring(0, 100)) + '...</p>';
        html += '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:5px;">';
        html += '<a href="' + proj.detail_url + '" class="btn-primary" style="padding:5px 10px;font-size:10px;">Detail</a>';
        if (proj.github_url) html += '<a href="' + proj.github_url + '" target="_blank" class="btn-outline" style="padding:4px 9px;font-size:10px;">' + icons.github + ' Repo</a>';
        html += '</div></div>';
      });
      html += '</div><div class="page-number">10</div>';
      return html;
    }
  },

  kontak: {
    color: '#14b8a6',
    left: function () {
      var html = '<div class="page-heading" style="color:#14b8a6;">' + icons.mail + ' Volume VI — Kontak</div>' +
        '<h2 class="page-title">Get In Touch</h2><div class="page-body">' +
        '<p style="font-style:italic;margin-bottom:14px;color:var(--ink-light);">Ada pertanyaan atau tawaran kerja sama? Kirim pesan.</p>' +
        '<div id="contactAlert" class="form-alert"></div>' +
        '<form id="publicContactForm" class="book-form">' +
        '<div class="form-group"><label>' + icons.user + ' Nama</label><input type="text" id="sender_name" required placeholder="Nama lengkap"></div>' +
        '<div class="form-group"><label>' + icons.mail + ' Email</label><input type="email" id="sender_email" required placeholder="email@domain.com"></div>' +
        '<div class="form-group"><label>' + icons.folder + ' Subjek</label><input type="text" id="subject" placeholder="Tawaran proyek / Pertanyaan"></div>' +
        '<div class="form-group"><label>' + icons.send + ' Pesan</label><textarea id="message_content" rows="3" required placeholder="Tuliskan pesan..."></textarea></div>' +
        '<button type="submit" class="btn-primary" id="submitContactBtn" style="width:100%;justify-content:center;">' + icons.send + ' Kirim Pesan</button>' +
        '</form></div>';
      return html;
    },
    right: function () {
      var html = '<div class="page-heading" style="color:#14b8a6;">' + icons.globe + ' Other Channels</div>' +
        '<h2 class="page-title" style="font-size:18px;">Hubungi Saya</h2><div class="page-body"><div style="margin-bottom:14px;">';
      if (p.show_email && p.email) html += '<div class="meta-line"><span class="meta-label">' + icons.mail + ' Email</span><span>' + esc(p.email) + '</span></div>';
      if (p.show_phone && p.phone) html += '<div class="meta-line"><span class="meta-label">' + icons.phone + ' Phone</span><span>' + esc(p.phone) + '</span></div>';
      if (p.show_location && p.location) html += '<div class="meta-line"><span class="meta-label">' + icons.location + ' Location</span><span>' + esc(p.location) + '</span></div>';
      html += '</div><div class="book-social">';
      if (p.github && p.show_github) html += '<a href="' + p.github + '" target="_blank">' + icons.github + ' GitHub</a>';
      if (p.linkedin && p.show_linkedin) html += '<a href="' + p.linkedin + '" target="_blank">' + icons.linkedin + ' LinkedIn</a>';
      if (p.instagram && p.show_instagram) html += '<a href="' + p.instagram + '" target="_blank">' + icons.instagram + ' Instagram</a>';
      html += '</div>';
      html += '<div style="margin-top:24px;padding:16px;background:#f0fdfa;border-radius:10px;text-align:center;">';
      html += '<p style="font-family:\'Playfair Display\',serif;font-style:italic;font-size:12px;color:#14b8a6;line-height:1.6;">"Every great collaboration<br>begins with a single message."</p>';
      html += '</div></div><div class="page-number">12</div>';
      return html;
    }
  }
};

// ═══════ SECTION ORDER ═══════
const sectionOrder = ['profil', 'keahlian', 'pengalaman', 'proyek', 'kontak'];
const sectionIndex = { profil: 0, keahlian: 1, pengalaman: 2, proyek: 3, kontak: 4 };

// ═══════ RENDER ═══════
function renderSection(sectionId) {
  const section = sections[sectionId];
  if (!section) return;

  state.mobileShowRight = false;

  pageLeft.innerHTML = section.left() + '<div class="page-number">' + (sectionIndex[sectionId] * 2 + 1) + '</div>';
  pageRight.innerHTML = section.right();

  // Mobile flip buttons
  if (isMobile()) {
    var idx = sectionIndex[sectionId];
    var hasPrevChapter = idx > 0;
    var hasNextChapter = idx < sectionOrder.length - 1;

    // --- Buttons for Left Page (Halaman 1) ---
    var leftNavContainer = document.createElement('div');
    leftNavContainer.style.position = 'absolute'; leftNavContainer.style.bottom = '16px'; leftNavContainer.style.left = '16px'; leftNavContainer.style.right = '16px'; leftNavContainer.style.display = 'flex'; leftNavContainer.style.justifyContent = 'space-between';

    if (hasPrevChapter) {
      var prevChapterBtn = document.createElement('button');
      prevChapterBtn.className = 'page-flip-btn back';
      prevChapterBtn.style.position = 'relative'; prevChapterBtn.style.left = '0'; prevChapterBtn.style.bottom = '0';
      prevChapterBtn.innerHTML = icons.chevronLeft + ' Sebelumnya';
      prevChapterBtn.addEventListener('click', function(e) { e.stopPropagation(); navigateTo(sectionOrder[idx - 1]); });
      leftNavContainer.appendChild(prevChapterBtn);
    } else {
      leftNavContainer.appendChild(document.createElement('div')); // spacer
    }

    var flipRightBtn = document.createElement('button');
    flipRightBtn.className = 'page-flip-btn';
    flipRightBtn.style.position = 'relative'; flipRightBtn.style.right = '0'; flipRightBtn.style.bottom = '0';
    flipRightBtn.innerHTML = 'Halaman 2 ' + icons.chevronRight;
    flipRightBtn.addEventListener('click', function(e) { e.stopPropagation(); flipToRight(); });
    leftNavContainer.appendChild(flipRightBtn);

    pageLeft.appendChild(leftNavContainer);

    // --- Buttons for Right Page (Halaman 2) ---
    var rightNavContainer = document.createElement('div');
    rightNavContainer.style.position = 'absolute'; rightNavContainer.style.bottom = '16px'; rightNavContainer.style.left = '16px'; rightNavContainer.style.right = '16px'; rightNavContainer.style.display = 'flex'; rightNavContainer.style.justifyContent = 'space-between';

    var flipLeftBtn = document.createElement('button');
    flipLeftBtn.className = 'page-flip-btn back';
    flipLeftBtn.style.position = 'relative'; flipLeftBtn.style.left = '0'; flipLeftBtn.style.bottom = '0';
    flipLeftBtn.innerHTML = icons.chevronLeft + ' Halaman 1';
    flipLeftBtn.addEventListener('click', function(e) { e.stopPropagation(); flipToLeft(); });
    rightNavContainer.appendChild(flipLeftBtn);

    if (hasNextChapter) {
      var nextChapterBtn = document.createElement('button');
      nextChapterBtn.className = 'page-flip-btn';
      nextChapterBtn.style.position = 'relative'; nextChapterBtn.style.right = '0'; nextChapterBtn.style.bottom = '0';
      nextChapterBtn.innerHTML = 'Selanjutnya ' + icons.chevronRight;
      nextChapterBtn.addEventListener('click', function(e) { e.stopPropagation(); navigateTo(sectionOrder[idx + 1]); });
      rightNavContainer.appendChild(nextChapterBtn);
    }

    pageRight.appendChild(rightNavContainer);
  }

  if (sectionId === 'kontak') setTimeout(attachContactForm, 50);
}

// ═══════ MOBILE PAGE FLIP ═══════
function flipToRight() {
  if (state.mobileShowRight) return;
  state.mobileShowRight = true;
  const flipAnim = document.createElement('div');
  flipAnim.className = 'turning-page';
  openBookPages.appendChild(flipAnim);
  setTimeout(function () {
    pageLeft.style.display = 'none';
    pageRight.style.display = 'block';
    flipAnim.remove();
  }, 220);
}

function flipToLeft() {
  if (!state.mobileShowRight) return;
  state.mobileShowRight = false;
  const flipAnim = document.createElement('div');
  flipAnim.className = 'turning-page';
  openBookPages.appendChild(flipAnim);
  setTimeout(function () {
    pageRight.style.display = 'none';
    pageLeft.style.display = 'block';
    flipAnim.remove();
  }, 220);
}

// ═══════ OPEN / CLOSE ═══════
function openBookFn() {
  if (state.isOpen || state.isAnimating) return;
  state.isAnimating = true;
  state.isOpen = true;
  state.currentSection = 'profil';

  // 1. Dramatic GSAP open sequence
  gsap.killTweensOf(book3d);
  var tl = gsap.timeline({
    onComplete: function() {
      bookScene.style.opacity = '0';
      bookScene.style.pointerEvents = 'none';
      openBookView.classList.add('active');
      chapterNav.classList.add('active');

      pageLeft.style.display = 'block';
      pageRight.style.display = isMobile() ? 'none' : 'block';

      renderSection('profil');
      updateNav();
      statusText.textContent = 'Open — Browse with navigation';
      statusDot.classList.add('open');
      headerHint.innerHTML = icons.x + ' ESC to close';
      state.isAnimating = false;
    }
  });

  tl.to(book3d, { rotateY: 0, rotateX: 6, y: -14, scale: 1.06, duration: 0.45, ease: 'power2.in' })
    .to(book3d, { scale: 1, y: 0, duration: 0.25, ease: 'power2.out' });

  bookScene.classList.add('opened');
  book3d.classList.add('opened');
  shelf.classList.add('hidden');
}

function closeBookFn() {
  if (!state.isOpen || state.isAnimating) return;
  state.isAnimating = true;
  state.isOpen = false;

  openBookView.classList.remove('active');
  chapterNav.classList.remove('active');
  chapterNav.classList.remove('expanded');
  state.navExpanded = false;
  if (navToggle) navToggle.innerHTML = icons.menu;

  setTimeout(function () {
    bookScene.style.opacity = '1';
    bookScene.style.pointerEvents = '';
    bookScene.classList.remove('opened');
    book3d.classList.remove('opened');
    shelf.classList.remove('hidden');
    statusText.textContent = 'Closed — Click book to open';
    statusDot.classList.remove('open');
    headerHint.innerHTML = icons.chevronRight + ' Click the book to open';
    state.isAnimating = false;

    // Return-to-shelf dramatic drop
    gsap.fromTo(book3d,
      { y: -30, rotateY: 5, rotateX: 12, opacity: 0 },
      { y: 0, rotateY: -12, rotateX: 4, opacity: 1,
        duration: 0.9, ease: 'back.out(1.7)',
        onComplete: startIdleSway
      }
    );
  }, 500);
}

// ═══════ NAVIGATE ═══════
function navigateTo(sectionId) {
  if (state.isAnimating || sectionId === state.currentSection) return;
  state.isAnimating = true;

  if (!isMobile()) {
    const turningPage = document.createElement('div');
    turningPage.className = 'turning-page';
    openBookPages.appendChild(turningPage);
    setTimeout(function () {
      state.currentSection = sectionId;
      pageLeft.style.display = 'block';
      pageRight.style.display = 'block';
      renderSection(sectionId);
      updateNav();
      turningPage.remove();
      state.isAnimating = false;
    }, 700);
  } else {
    openBookPages.style.opacity = '0.4';
    openBookPages.style.transform = 'scale(0.98)';
    openBookPages.style.transition = 'opacity 0.2s, transform 0.2s';
    setTimeout(function () {
      state.currentSection = sectionId;
      pageLeft.style.display = 'block';
      pageRight.style.display = 'none';
      renderSection(sectionId);
      updateNav();
      openBookPages.style.opacity = '1';
      openBookPages.style.transform = 'scale(1)';
      state.isAnimating = false;
      setTimeout(function () { openBookPages.style.transition = ''; }, 300);
    }, 200);
  }
}

function updateNav() {
  document.querySelectorAll('.chapter-nav-item').forEach(function (item) {
    item.classList.toggle('active', item.dataset.section === state.currentSection);
  });
}

// ═══════ NAV TOGGLE ═══════
function toggleNav() {
  state.navExpanded = !state.navExpanded;
  chapterNav.classList.toggle('expanded', state.navExpanded);
}

// ═══════ CONTACT FORM ═══════
function attachContactForm() {
  const form = $('publicContactForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const alertBox = $('contactAlert');
    const btn = $('submitContactBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Mengirim...';
    const data = {
      name: $('sender_name').value,
      email: $('sender_email').value,
      subject: $('subject').value,
      message: $('message_content').value
    };
    try {
      const res = await fetch('/dashboard/messages/send-public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      alertBox.style.display = 'block';
      alertBox.className = 'form-alert ' + (res.ok && result.success ? 'success' : 'error');
      alertBox.textContent = (res.ok && result.success ? 'Terkirim: ' : 'Gagal: ') + (result.message || 'Terjadi kesalahan.');
      if (res.ok && result.success) form.reset();
    } catch (err) {
      alertBox.style.display = 'block';
      alertBox.className = 'form-alert error';
      alertBox.textContent = 'Connection error.';
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });
}

// ═══════ EVENTS ═══════
// Book cover click — right half = next/open, left half = prev chapter
book3d.addEventListener('click', function (e) {
  if (state.isAnimating) return;
  var rect = book3d.getBoundingClientRect();
  var relX = e.clientX - rect.left;
  var isRightHalf = relX > rect.width / 2;

  if (!state.isOpen) {
    // Right half opens book, left half also opens (first time)
    openBookFn();
  } else {
    // Fallback if they manage to click the 3D book behind the open view
    var idx = sectionIndex[state.currentSection];
    if (isRightHalf) {
      navigateTo(sectionOrder[Math.min(idx + 1, sectionOrder.length - 1)]);
    } else {
      if (idx === 0) closeBookFn();
      else navigateTo(sectionOrder[Math.max(idx - 1, 0)]);
    }
  }
});

// Open pages click — right half = next, left half = prev (Mainly for desktop)
openBookPages.addEventListener('click', function(e) {
  if (state.isAnimating) return;
  // Let the mobile buttons handle their own clicks
  if (e.target.closest('button')) return;

  var rect = openBookPages.getBoundingClientRect();
  var relX = e.clientX - rect.left;
  var isRightHalf = relX > rect.width / 2;
  
  // On mobile, the click to turn is disabled so it doesn't conflict with explicit buttons
  if (isMobile()) return;

  var idx = sectionIndex[state.currentSection];
  if (isRightHalf) {
    if (idx < sectionOrder.length - 1) {
      navigateTo(sectionOrder[idx + 1]);
    } else {
      closeBookFn(); // Close if at end
    }
  } else {
    if (idx > 0) {
      navigateTo(sectionOrder[idx - 1]);
    } else {
      closeBookFn(); // Close if at start
    }
  }
});

document.querySelectorAll('.chapter-nav-item').forEach(function (item) {
  item.addEventListener('click', function () { navigateTo(item.dataset.section); });
});

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && state.isOpen) closeBookFn();
  if (state.isOpen) {
    const idx = sectionIndex[state.currentSection];
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      navigateTo(sectionOrder[Math.min(idx + 1, sectionOrder.length - 1)]);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      navigateTo(sectionOrder[Math.max(idx - 1, 0)]);
    }
  }
});


document.addEventListener('click', function (e) {
  if (state.navExpanded && chapterNav && !chapterNav.contains(e.target)) {
    state.navExpanded = false;
    chapterNav.classList.remove('expanded');
  }
});


// ═══════ CUSTOM CURSOR ═══════
(function() {
  var dot  = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  var rx = window.innerWidth/2, ry = window.innerHeight/2; // ring position (lagged)
  var dx = rx, dy = ry; // dot position (instant)

  document.addEventListener('mousemove', function(e) {
    dx = e.clientX; dy = e.clientY;
    dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
  });

  // Ring follows with lag via rAF
  (function animRing() {
    rx += (dx - rx) * 0.12;
    ry += (dy - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Hover state on interactives
  var hoverEls = 'a, button, .book-3d, .chapter-nav-item, [role="button"]';
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover');
  });
})();

// ═══════ AUDIO TOGGLE ═══════
(function() {
  var audioToggle = document.getElementById('audioToggle');
  var pageSfx = document.getElementById('pageSfx');
  if (!audioToggle) return;

  var soundEnabled = false; // off by default, user must opt in

  audioToggle.addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    audioToggle.style.color = soundEnabled ? 'var(--accent)' : '';
    audioToggle.style.borderColor = soundEnabled ? 'var(--border-glow)' : '';
    audioToggle.innerHTML = soundEnabled
      ? '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> Sound ON'
      : '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> Sound';
  });

  // Expose so openBookFn can use it
  window.playPageSfx = function() {
    if (!soundEnabled || !pageSfx) return;
    pageSfx.currentTime = 0;
    pageSfx.volume = 0.35;
    pageSfx.play().catch(function(){});
  };
})();

// ═══════ GSAP IDLE SWAY ═══════
function startIdleSway() {
  if (!state.isOpen) {
    gsap.to(book3d, {
      rotateY: -11.5, rotateX: 3, y: -8, duration: 3.5,
      ease: 'sine.inOut',
      onComplete: function() {
        gsap.to(book3d, {
          rotateY: -8.5, rotateX: 1.5, y: 2, duration: 3.5,
          ease: 'sine.inOut',
          onComplete: startIdleSway
        });
      }
    });
  }
}

// ═══════ CINEMATIC ENTRANCE ═══════
// Initial flash of light on scene-bg
var sceneBg = document.querySelector('.scene-bg');
if (sceneBg) {
  gsap.fromTo(sceneBg, { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.out' });
}

gsap.set(book3d, { opacity: 0, y: 120, rotateY: -30, rotateX: 15, scale: 0.85 });
gsap.to(book3d, {
  opacity: 1, y: 0, rotateY: -12, rotateX: 4, scale: 1,
  duration: 1.8,
  ease: 'back.out(1.4)',
  delay: 0.4,
  onComplete: startIdleSway
});

// Shelf light sweep on entrance
gsap.fromTo(document.getElementById('shelf'), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.2 });


// ═══════ MOUSE 3D PARALLAX ═══════
(function() {
  var curMx = 0, curMy = 0;
  document.addEventListener('mousemove', function(e) {
    if (state.isOpen) return;
    var mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    var my = (e.clientY / window.innerHeight - 0.5) * 2;
    curMx += (mx - curMx) * 0.05;
    curMy += (my - curMy) * 0.05;
    gsap.to(book3d, {
      rotateY: -12 + curMx * 16,
      rotateX:   4 - curMy * 10,
      y: curMy * -12,
      duration: 0.7, ease: 'power2.out', overwrite: 'auto'
    });
  });
})();

// ═══════ RICH PARTICLE FIELD ═══════
(function initParticles() {
  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var CX = function() { return W / 2; };
  var CY = function() { return H / 2 + 30; };

  // Three types of particles
  function mkRising() {
    return {
      type: 'rising',
      x: Math.random() * W,
      y: H + Math.random() * 20,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.5 + 0.2),
      alpha: Math.random() * 0.45 + 0.05,
      color: Math.random() > 0.5 ? '96,165,250' : '167,139,250'
    };
  }

  function mkOrbit(i, total) {
    var angle = (i / total) * Math.PI * 2;
    var radius = 180 + Math.random() * 80;
    return {
      type: 'orbit',
      angle: angle,
      radius: radius,
      speed: (Math.random() > 0.5 ? 1 : -1) * (0.002 + Math.random() * 0.002),
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.3 + 0.1,
      color: Math.random() > 0.5 ? '96,165,250' : '167,139,250'
    };
  }

  function mkStar() {
    return {
      type: 'star',
      x: Math.random() * W,
      y: Math.random() * H * 0.7,
      r: Math.random() * 0.8 + 0.2,
      alpha: Math.random() * 0.4 + 0.05,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03
    };
  }

  function mkLeaf() {
    return {
      type: 'leaf',
      x: Math.random() * W,
      y: -50 - Math.random() * 200,
      size: Math.random() * 6 + 3,
      vx: 1 + Math.random() * 1.5,
      vy: 1 + Math.random() * 1.5,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      alpha: Math.random() * 0.5 + 0.2
    };
  }

  function mkFog() {
    return {
      type: 'fog',
      x: Math.random() * W,
      y: H - (Math.random() * 300),
      r: 100 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.04 + 0.01
    };
  }

  var particles = [];
  // Rising particles
  for (var i = 0; i < 70; i++) particles.push(mkRising());
  // Orbit particles around the book center
  for (var j = 0; j < 30; j++) particles.push(mkOrbit(j, 30));
  // Background stars
  for (var k = 0; k < 80; k++) particles.push(mkStar());
  // Drifting leaves
  for (var l = 0; l < 15; l++) particles.push(mkLeaf());
  // Fog wisps
  for (var m = 0; m < 6; m++) particles.push(mkFog());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var cx = CX(), cy = CY();

    particles.forEach(function(p) {
      if (p.type === 'rising') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { Object.assign(p, mkRising()); }

      } else if (p.type === 'orbit') {
        p.angle += p.speed;
        var px = cx + Math.cos(p.angle) * p.radius * (W < 600 ? 0.6 : 1);
        var py = cy + Math.sin(p.angle) * p.radius * 0.35;
        // Only draw if not covered by book area
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
        ctx.fill();

      } else if (p.type === 'star') {
        p.pulse += p.pulseSpeed;
        var a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,220,255,' + a + ')';
        ctx.fill();

      } else if (p.type === 'leaf') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        // Leaf shape
        ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20, 24, 40, ' + p.alpha + ')'; // Dark silhouette leaf
        ctx.fill();
        ctx.restore();
        
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        
        // Reset leaf if out of bounds
        if (p.x > W + 50 || p.y > H + 50) {
          Object.assign(p, mkLeaf());
          p.x = -50 - Math.random() * 100; // Come from left
          p.y = Math.random() * H * 0.5; // Upper half
        }

      } else if (p.type === 'fog') {
        ctx.beginPath();
        var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gradient.addColorStop(0, 'rgba(139, 92, 246, ' + p.alpha + ')');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        p.x += p.vx;
        if (p.x < -p.r || p.x > W + p.r) p.vx *= -1; // Bounce slowly
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ═══════ PLAY SOUND ON BOOK OPEN/NAV ═══════
// Patch navigateTo to play sound
var _origNav = navigateTo;
navigateTo = function(sectionId) {
  if (window.playPageSfx) window.playPageSfx();
  _origNav(sectionId);
};


