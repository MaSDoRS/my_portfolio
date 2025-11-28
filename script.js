// ---------- helper & initial data ----------
const PROJECTS_KEY = 'portfolio_projects_v1';
const PROFILE_IMG_KEY = 'portfolio_profile_img_v1';

const defaultProjects = [
  {
    id: genId(),
    title: "Smart Health IoT",
    description: "Prototype alat monitoring vital sign berbasis Arduino + ESP8266, dashboard sederhana.",
    technologies: ["Arduino", "ESP8266", "HTML"],
    role: "Firmware & Frontend",
    image: "https://via.placeholder.com/800x400?text=Smart+Health+IoT",
    links: [{desc:"GitHub", url:"https://github.com/"}]
  },
  {
    id: genId(),
    title: "Data Processing Python",
    description: "Pipeline untuk preprocessing dataset biosignal dan analisis statistik awal.",
    technologies: ["Python", "Pandas", "NumPy"],
    role: "Data Engineer",
    image: "https://via.placeholder.com/800x400?text=Data+Processing",
    links: [{desc:"Report", url:"https://example.com"}]
  }
];

function genId() {
  return 'p_' + Math.random().toString(36).slice(2,9);
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch(e) { return null; }
}
function writeJson(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// ---------- DOM references ----------
const projectsContainer = document.getElementById('projects-container');
const projectModal = document.getElementById('projectModal');
const projectForm = document.getElementById('project-form');
const projectTitle = document.getElementById('project-title');
const projectDescription = document.getElementById('project-description');
const projectTechnologies = document.getElementById('project-technologies');
const projectRole = document.getElementById('project-role');
const projectImage = document.getElementById('project-image');
const projectLinks = document.getElementById('project-links');
const projectIdInput = document.getElementById('project-id');
const modalTitle = document.getElementById('modal-title');
const profileImageInput = document.getElementById('image-upload');
const profileImageEl = document.getElementById('profile-image');

// ---------- Load / init ----------
document.addEventListener('DOMContentLoaded', () => {
  // init AOS if available
  if (window.AOS) AOS.init();

  // ensure admin nav visible if mode active in body
  toggleAdminNavVisibility();

  // load profile image
  const savedProfile = localStorage.getItem(PROFILE_IMG_KEY);
  if (savedProfile) profileImageEl.src = savedProfile;

  // load projects (fallback default)
  let stored = readJson(PROJECTS_KEY);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    writeJson(PROJECTS_KEY, defaultProjects);
    stored = defaultProjects;
  }
  renderProjects(stored);

  // hamburger toggle (responsive)
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
});

// ---------- Projects rendering ----------
function renderProjects(list) {
  projectsContainer.innerHTML = '';
  list.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = proj.id;
    card.innerHTML = `
      <img class="project-image" src="${escapeHtml(proj.image || 'https://via.placeholder.com/800x400?text=No+Image')}" alt="${escapeHtml(proj.title)}">
      <div class="project-content">
        <h3>${escapeHtml(proj.title)}</h3>
        <p>${escapeHtml(proj.description)}</p>
        <div class="project-technologies">${(proj.technologies||[]).map(t=>`<span class="technology-tag">${escapeHtml(t)}</span>`).join('')}</div>
        <div class="project-role"><strong>Role:</strong> ${escapeHtml(proj.role || '')}</div>
        <div class="project-links">
          ${(proj.links||[]).map(l => `<a class="project-link" href="${escapeAttr(l.url)}" target="_blank">${escapeHtml(l.desc)}</a>`).join('')}
        </div>
        <div class="project-actions">
          <button class="btn btn-primary admin-only" onclick="openEditProject('${proj.id}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn btn-danger admin-only" onclick="deleteProject('${proj.id}')"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>
    `;
    projectsContainer.appendChild(card);
  });
  // ensure admin-only elements visibility tied to body class
  applyAdminVisibility();
}

// ---------- Modal show/hide ----------
function showAddProjectModal() {
  modalTitle.innerText = 'Add New Project';
  projectIdInput.value = '';
  projectTitle.value = '';
  projectDescription.value = '';
  projectTechnologies.value = '';
  projectRole.value = '';
  projectImage.value = '';
  projectLinks.value = '';
  openModal();
}

function openEditProject(id) {
  const projects = readJson(PROJECTS_KEY) || [];
  const proj = projects.find(p => p.id === id);
  if (!proj) return alert('Project not found');
  modalTitle.innerText = 'Edit Project';
  projectIdInput.value = proj.id;
  projectTitle.value = proj.title || '';
  projectDescription.value = proj.description || '';
  projectTechnologies.value = (proj.technologies || []).join(', ');
  projectRole.value = proj.role || '';
  projectImage.value = ''; // empty file input - optional replace
  projectLinks.value = (proj.links || []).map(l => `${l.desc}|${l.url}`).join(',');
  openModal();
}

function openModal() {
  projectModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeProjectModal() {
  projectModal.style.display = 'none';
  document.body.style.overflow = '';
}

// close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target === projectModal) closeProjectModal();
});

// ---------- Form submit (add/edit) ----------
projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = projectIdInput.value || null;
  const title = projectTitle.value.trim();
  const description = projectDescription.value.trim();
  const technologies = projectTechnologies.value.split(',').map(s=>s.trim()).filter(Boolean);
  const role = projectRole.value.trim();
  const linksRaw = projectLinks.value.split(',').map(s=>s.trim()).filter(Boolean);
  const links = linksRaw.map(item => {
    const [desc, url] = item.split('|').map(x => x && x.trim());
    return { desc: desc||'Link', url: url||'#' };
  });

  // handle image file input -> base64
  const file = projectImage.files[0];
  let imageData = null;
  if (file) {
    try {
      imageData = await fileToDataUrl(file);
    } catch (err) {
      console.error(err);
      alert('Gagal membaca gambar.');
      return;
    }
  }

  const projects = readJson(PROJECTS_KEY) || [];

  if (id) {
    // edit existing
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) {
      alert('Project tidak ditemukan');
      return;
    }
    projects[idx].title = title;
    projects[idx].description = description;
    projects[idx].technologies = technologies;
    projects[idx].role = role;
    projects[idx].links = links;
    if (imageData) projects[idx].image = imageData; // replace only if new image selected
  } else {
    // add new
    projects.unshift({
      id: genId(),
      title,
      description,
      technologies,
      role,
      image: imageData || 'https://via.placeholder.com/800x400?text=New+Project',
      links
    });
  }

  writeJson(PROJECTS_KEY, projects);
  renderProjects(projects);
  closeProjectModal();
});

// ---------- Delete ----------
function deleteProject(id) {
  if (!confirm('Hapus project ini?')) return;
  let projects = readJson(PROJECTS_KEY) || [];
  projects = projects.filter(p => p.id !== id);
  writeJson(PROJECTS_KEY, projects);
  renderProjects(projects);
}

// ---------- utils ----------
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

function escapeHtml(str='') {
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;');
}
function escapeAttr(str='') {
  return (String(str)).replaceAll('"','%22');
}

// ---------- admin / edit mode ----------
function enableEditMode() {
  document.body.classList.add('edit-mode');
  toggleAdminNavVisibility();
  applyAdminVisibility();
  // show admin panel link
  document.querySelectorAll('.nav-item.admin-only').forEach(el => el.style.display = '');
  // also show admin section
  document.getElementById('admin').style.display = '';
}

function disableEditMode() {
  document.body.classList.remove('edit-mode');
  toggleAdminNavVisibility();
  applyAdminVisibility();
  // hide admin nav and panel
  document.querySelectorAll('.nav-item.admin-only').forEach(el => el.style.display = 'none');
  document.getElementById('admin').style.display = 'none';
}

function applyAdminVisibility() {
  const adminEnabled = document.body.classList.contains('edit-mode');
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = adminEnabled ? '' : 'none';
  });
}

function toggleAdminNavVisibility() {
  const adminNav = document.querySelector('.nav-item.admin-only');
  if (!adminNav) return;
  // show/hide handled in applyAdminVisibility called after
}

// ---------- export / reset ----------
function exportData() {
  const projects = readJson(PROJECTS_KEY) || [];
  const profile = localStorage.getItem(PROFILE_IMG_KEY) || '';
  const payload = {projects, profile};
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio-data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function resetData() {
  if (!confirm('Reset semua data ke default?')) return;
  writeJson(PROJECTS_KEY, defaultProjects);
  localStorage.removeItem(PROFILE_IMG_KEY);
  profileImageEl.src = 'https://via.placeholder.com/300x300/2d3748/ffffff?text=Profile+Photo';
  renderProjects(defaultProjects);
  alert('Reset selesai');
}

// ---------- profile image change ----------
profileImageInput?.addEventListener('change', async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    const dataUrl = await fileToDataUrl(f);
    profileImageEl.src = dataUrl;
    localStorage.setItem(PROFILE_IMG_KEY, dataUrl);
  } catch (err) {
    console.error(err);
    alert('Gagal upload foto profil');
  }
});

// ---------- inline editable helper for other sections ----------
function toggleEdit(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const isEditing = el.classList.contains('editing');
  if (!isEditing) {
    // enter editing mode: replace content with textarea for convenience
    el.classList.add('editing');
    const current = el.innerHTML;
    const ta = document.createElement('textarea');
    ta.className = 'edit-textarea';
    ta.value = stripHtml(current);
    ta.dataset.prev = current;
    el.dataset.prev = current;
    el.innerHTML = '';
    el.appendChild(ta);
    const btn = event?.currentTarget;
    if (btn && btn.tagName === 'BUTTON') btn.innerText = 'Save';
  } else {
    // save
    const ta = el.querySelector('textarea');
    if (ta) {
      el.innerHTML = ta.value.replaceAll('\n','<br>');
    }
    el.classList.remove('editing');
    const btn = event?.currentTarget;
    if (btn && btn.tagName === 'BUTTON') btn.innerText = 'Edit';
    // (optionally) persist to localStorage - skipping per-section naming complexity
  }
}

function stripHtml(html='') {
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
}
