// --- Data Initialization ---

// Data Projects dan Training dimuat dari localStorage, atau menggunakan data dummy jika belum ada
let projects = JSON.parse(localStorage.getItem('projects')) || [
    {
        id: 1,
        title: "Medical Record Web App",
        description: "A web application for managing patient medical records and appointments using MERN stack. Includes robust authentication and reporting features.",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        role: "Full-stack Developer",
        image: "https://via.placeholder.com/400x200/4a5568/ffffff?text=Medical+App",
        links: [{ name: "GitHub", url: "#" }, { name: "Demo", url: "#" }]
    },
    {
        id: 2,
        title: "IoT Health Monitor",
        description: "A system using Arduino/ESP32 to monitor heart rate and body temperature, sending data to a cloud platform for real-time analysis.",
        technologies: ["Arduino C++", "ESP32", "Firebase", "Python"],
        role: "Firmware Engineer",
        image: "https://via.placeholder.com/400x200/4a5568/ffffff?text=IoT+Monitor",
        links: [{ name: "Demo Video", url: "#" }]
    }
];

let trainingList = JSON.parse(localStorage.getItem('trainingList')) || [
    "AWS Certified Cloud Practitioner - Amazon Web Services (In Progress)",
    "Data Science Fundamentals with Python - Coursera (Completed)",
    "Introduction to IoT Development - EdX (Completed)",
    "Organizational Management Training - ITS Student Union"
];

// Inisialisasi DOM elements untuk modal
const projectModal = document.getElementById('projectModal');
const projectForm = document.getElementById('project-form');


// --- Core Functions ---

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
    });
    renderProjects();
    renderTraining();
    setupEventListeners();
});


// --- Data Persistence (localStorage) ---

function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function saveTraining() {
    localStorage.setItem('trainingList', JSON.stringify(trainingList));
}

function generateId() {
    // Menggunakan timestamp sebagai ID unik
    return Date.now();
}


// --- Project Section Functions ---

function renderProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    
    if (projects.length === 0) {
        container.innerHTML = '<p class="text-gray text-center">No projects added yet.</p>';
    }

    projects.forEach(project => {
        // Render Links
        const linksHtml = project.links.map(link => `
            <a href="${link.url}" target="_blank" class="project-link">
                <i class="fas fa-${link.name.toLowerCase().includes('github') ? 'github' : 'external-link-alt'}"></i>
                ${link.name}
            </a>
        `).join('');

        // Render Technology Tags
        const techTags = project.technologies.map(tech => `
            <span class="technology-tag">${tech}</span>
        `).join('');

        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-aos', 'zoom-in');
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-technologies">${techTags}</div>
                <p><strong>Role:</strong> ${project.role}</p>
                <div class="project-links">${linksHtml}</div>
                
                <div class="project-actions admin-only">
                    <button class="btn btn-warning btn-edit" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        container.appendChild(projectCard);
    });
}

function deleteProject(id) {
    if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
        projects = projects.filter(p => p.id !== id);
        saveProjects();
        renderProjects();
    }
}

function closeProjectModal() {
    projectModal.style.display = 'none';
    projectForm.reset();
    document.getElementById('modal-title').textContent = 'Add New Project';
    document.getElementById('project-id').value = '';
    // Reset persyaratan gambar
    document.getElementById('project-image').required = true; 
    document.getElementById('current-image-info-small').remove(); // Hapus elemen kecil jika ada
    
    // Reset elemen small info gambar (untuk mencegah error jika belum ada)
    const currentInfoElement = document.getElementById('current-image-info');
    if (currentInfoElement) currentInfoElement.remove();
}

/**
 * Menampilkan modal Add/Edit Project.
 * @param {object} project - Objek proyek yang akan diedit. Jika null, maka mode Add New.
 */
function showAddProjectModal(project = null) {
    // Panggil closeProjectModal untuk reset form dan elemen tersembunyi
    // Sebelum memanggil showAddProjectModal, pastikan form ter-reset
    projectForm.reset();
    
    // Hapus elemen current-image-info jika ada
    let currentInfoElement = document.getElementById('current-image-info-small');
    if (currentInfoElement) currentInfoElement.remove();


    if (project) {
        // --- Mode Edit ---
        document.getElementById('modal-title').textContent = 'Edit Project';
        document.getElementById('project-id').value = project.id;
        document.getElementById('project-title').value = project.title;
        document.getElementById('project-description').value = project.description;
        document.getElementById('project-technologies').value = project.technologies.join(', ');
        document.getElementById('project-role').value = project.role;
        
        // Konversi objek links ke string format: Deskripsi|URL,Deskripsi|URL
        const linksString = project.links.map(link => `${link.name}|${link.url}`).join(',');
        document.getElementById('project-links').value = linksString;
        
        // Gambar tidak wajib diubah saat edit, tampilkan info gambar saat ini
        document.getElementById('project-image').required = false; 
        
        // Tambahkan elemen small untuk info gambar saat ini
        const imageFormGroup = document.getElementById('project-image').closest('.form-group');
        const smallElement = document.createElement('small');
        smallElement.id = 'current-image-info-small';
        smallElement.textContent = `Current Image: View image link or choose new file to replace.`;
        if (imageFormGroup) {
            imageFormGroup.appendChild(smallElement);
        }

    } else {
        // --- Mode Add New ---
        document.getElementById('modal-title').textContent = 'Add New Project';
        document.getElementById('project-id').value = '';
        document.getElementById('project-image').required = true; // Wajib ada gambar saat menambahkan baru
    }
    projectModal.style.display = 'block';
}

function editProject(id) {
    const projectToEdit = projects.find(p => p.id === id);
    if (projectToEdit) {
        showAddProjectModal(projectToEdit);
    }
}

// Event listener untuk submit form
if (projectForm) {
    projectForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveProject(e);
    });
}


/**
 * Mengambil data dari form, menangani upload/dokumentasi foto, dan menyimpan/mengedit proyek.
 */
async function saveProject(e) {
    e.preventDefault();
    
    const id = document.getElementById('project-id').value;
    const title = document.getElementById('project-title').value;
    const description = document.getElementById('project-description').value;
    const technologies = document.getElementById('project-technologies').value.split(',').map(t => t.trim()).filter(t => t);
    const role = document.getElementById('project-role').value;
    const imageFile = document.getElementById('project-image').files[0];
    const linksString = document.getElementById('project-links').value;

    // Fungsi utilitas untuk mengonversi link string ke array of objects
    const parseLinks = (linkStr) => {
        return linkStr.split(',').map(item => {
            const parts = item.split('|');
            return {
                name: parts[0] ? parts[0].trim() : 'Link',
                url: parts[1] ? parts[1].trim() : '#'
            };
        }).filter(link => link.name && link.url && link.url !== '#');
    };

    const links = parseLinks(linksString);

    let imageUrl = '';
    
    // Logika untuk menangani foto/dokumentasi
    if (imageFile) {
        // Menggunakan FileReader untuk mendapatkan URL Data lokal (Data URL)
        imageUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsDataURL(imageFile);
        });
        
    }
    
    const newProject = {
        title,
        description,
        technologies,
        role,
        links
    };

    if (id) {
        // --- Mode Edit ---
        const index = projects.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                ...newProject,
                id: parseInt(id),
                // Ganti gambar hanya jika ada file baru, jika tidak, gunakan yang lama
                image: imageUrl || projects[index].image 
            };
        }
    } else {
        // --- Mode Add New ---
        if (!imageUrl) {
            alert('Please select an image for the new project (Foto/Dokumentasi wajib).');
            return;
        }
        projects.push({
            id: generateId(),
            ...newProject,
            image: imageUrl
        });
    }

    saveProjects();
    renderProjects();
    closeProjectModal();
}


// --- Training Section Functions ---

function renderTraining() {
    const container = document.getElementById('training-list');
    // Asumsi list item training di-render dalam <ul>
    container.innerHTML = `<ul>${trainingList.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

// --- Content Edit Mode Functions (Admin Panel) ---

function enableEditMode() {
    document.body.classList.add('edit-mode');
    document.getElementById('admin').style.display = 'block';
    renderProjects(); // Render ulang untuk menampilkan tombol edit/delete proyek
}

function disableEditMode() {
    document.body.classList.remove('edit-mode');
    document.getElementById('admin').style.display = 'none';
    renderProjects(); // Render ulang untuk menyembunyikan tombol edit/delete proyek
}

function toggleEdit(elementId) {
    const element = document.getElementById(elementId);
    const isEditing = element.classList.toggle('editing');
    
    if (isEditing) {
        const originalContent = element.innerHTML.trim();
        element.dataset.originalContent = originalContent;

        if (elementId === 'about-description') {
            // Logic untuk mengedit paragraf About
            const textarea = document.createElement('textarea');
            textarea.className = 'edit-textarea form-control';
            // Membersihkan tag <p> dan menggantinya dengan baris baru untuk memudahkan editing
            textarea.value = originalContent.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n').trim();
            element.innerHTML = '';
            element.appendChild(textarea);
            
            const saveButton = document.createElement('button');
            saveButton.className = 'btn btn-primary mt-3';
            saveButton.textContent = 'Save Changes';
            saveButton.onclick = () => saveContent(elementId, textarea.value);
            element.appendChild(saveButton);

        } else if (elementId === 'training-list') {
            // Logic untuk mengedit daftar Training
            const textarea = document.createElement('textarea');
            textarea.className = 'edit-textarea form-control';
            // Konversi array trainingList ke string dengan pemisah baris baru
            textarea.value = trainingList.join('\n');
            element.innerHTML = '';
            element.appendChild(textarea);
            
            const saveButton = document.createElement('button');
            saveButton.className = 'btn btn-primary mt-3';
            saveButton.textContent = 'Save Changes';
            saveButton.onclick = () => saveTrainingContent(textarea.value);
            element.appendChild(saveButton);
        } else {
             // Logic sederhana untuk elemen lain (e.g., Education/Experience card)
            const textarea = document.createElement('textarea');
            textarea.className = 'edit-textarea form-control';
            textarea.value = element.textContent.trim();
            element.innerHTML = '';
            element.appendChild(textarea);
            
            const saveButton = document.createElement('button');
            saveButton.className = 'btn btn-primary mt-3';
            saveButton.textContent = 'Save Changes';
            saveButton.onclick = () => saveContent(elementId, textarea.value);
            element.appendChild(saveButton);
        }
        
    } else {
        // Disabling edit mode (cancel or after save)
        if (elementId === 'training-list') {
            renderTraining();
        } else {
            // Kembalikan ke konten asli jika dibatalkan (asumsi tidak ada fungsi "Cancel")
            element.innerHTML = element.dataset.originalContent;
        }
    }
}

function saveTrainingContent(content) {
    // Memecah teks menjadi array, membersihkan spasi, dan memfilter item kosong
    trainingList = content.split('\n').map(item => item.trim()).filter(item => item);
    saveTraining();
    // Nonaktifkan mode edit dan render ulang list training
    const element = document.getElementById('training-list');
    element.classList.remove('editing');
    renderTraining();
}


function saveContent(elementId, newContent) {
    const element = document.getElementById(elementId);
    
    // Logika penyimpanan sederhana (hanya ke DOM)
    if (elementId === 'about-description') {
        // Konversi baris baru ganda menjadi paragraf
        const paragraphs = newContent.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('');
        element.innerHTML = paragraphs;
    } else {
        // Untuk Education/Experience atau elemen teks lainnya
        element.innerHTML = newContent; 
    }

    element.classList.remove('editing');
    alert('Content saved to DOM. Note: Only Projects and Training data are permanently saved to localStorage.');
}

// --- Utility/Event Listeners ---

function setupEventListeners() {
    // Navigasi Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Navigasi saat klik link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Event listener untuk menutup modal saat klik di luar
    window.addEventListener('click', (event) => {
        if (event.target === projectModal) {
            closeProjectModal();
        }
    });

    // Ganti foto profil (simulasi upload)
    document.getElementById('image-upload').addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('profile-image').src = event.target.result;
                alert('Profile photo changed successfully!');
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
}

function exportData() {
    const data = {
        projects: projects,
        training: trainingList,
        // Tambahkan data lain yang perlu diekspor jika diperlukan
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arya-portfolio-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetData() {
    if (confirm("Are you sure you want to reset all data to default? This action cannot be undone.")) {
        localStorage.removeItem('projects');
        localStorage.removeItem('trainingList');
        window.location.reload();
    }
}
