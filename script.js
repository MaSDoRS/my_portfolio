// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Global variables
let isEditMode = false;
let portfolioData = {};

// Initialize portfolio data
function initializePortfolioData() {
    // Check if data exists in localStorage
    const savedData = localStorage.getItem('portfolioData');
    
    if (savedData) {
        portfolioData = JSON.parse(savedData);
        loadPortfolioData();
    } else {
        // Load default data
        loadDefaultData();
    }
    
    // Check for admin mode in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        enableEditMode();
    }
}

// Load default data
function loadDefaultData() {
    portfolioData = {
        profile: {
            image: 'https://via.placeholder.com/300x300/2d3748/ffffff?text=Profile+Photo',
            description: `<p>I am a highly adaptable, disciplined, and proactive individual with a keen interest in both organizational management and fundamental programming concepts. My commitment to student life is demonstrated by my active roles in several key committees during my second year at ITS.</p>
                         <p>Simultaneously, I possess a strong foundation and practical interest in programming, having executed projects that utilize Python for data processing, Arduino C++ for firmware development, and C++ for implementing core algorithms.</p>`,
            phone: '+6281250058588',
            email: 'arya.dutaptn@gmail.com',
            location: 'Surabaya, Indonesia',
            linkedin: 'linkedin.com/in/arya-muhammad-duta-syafinda'
        },
        education: {
            its: {
                title: 'Sepuluh Nopember Institute of Technology (ITS)',
                date: 'Jul 2024 - Present',
                details: 'Undergraduate in Medical Technology - GPA: 3.75/4.00',
                achievements: [
                    'Best Team 1, PKTI-TD FKK Competition 2024',
                    '3rd Place Winner, Medical Technology Final Project OKKBK 2024'
                ]
            },
            sma: {
                title: 'State Senior High School 1 Balikpapan',
                date: 'Jun 2021 - May 2024',
                details: 'Science Major - Score: 95.40/100.00',
                achievements: [
                    'Active in Biology Olympiads',
                    'Achieved 5th rank in eligibility list',
                    'Recognized as one of top 4 best graduates'
                ]
            }
        },
        experience: {
            gerigi: {
                title: 'GERIGI X UKM EXPO 2025',
                date: 'Jul 2025 - Aug 2025',
                role: 'Staff/Medical Subdivision',
                description: 'Responsible for providing basic medical assistance to participants and coordinating with health teams.'
            },
            okkbk: {
                title: 'OKKBK Medical Technology 2025',
                date: 'Jul 2025 - Aug 2025',
                role: 'Staff/Operational Division',
                description: 'Managed operational aspects including planning, procurement, and logistics for the event.'
            },
            ipfkk: {
                title: 'IPFKK 2025',
                date: 'Jul 2025 - Aug 2025',
                role: 'Staff/Operational Division',
                description: 'Handled operational management from pre-event to post-event stages.'
            },
            ilits: {
                title: 'ILITS x BALIKPAPAN 2025',
                date: 'Jan 2025 - Feb 2025',
                role: 'Staff PDD Division',
                description: 'Managed social media, documentation, and public relations activities.'
            }
        },
        training: [
            'LKMM Pra-TD I FKK (2024)',
            'PKTI TD (2024)',
            'LKMW TD (2024)',
            'ITS ROBOCON Programming Internship (2024)',
            'LKMM TD II FKK (2025)',
            'PP LKMM I FKK (2025)'
        ],
        projects: [
            {
                id: 1,
                title: "NLP Pipeline for Biomedical Terminology Extraction",
                description: "Data Science project implementing Natural Language Processing (NLP) and Text Mining to extract and filter medical terms related to Tuberculosis (TB) from scientific literature.",
                technologies: ["Python", "SciSpaCy", "rapidfuzz"],
                role: "Developer and Pipeline Executor",
                image: "https://via.placeholder.com/350x200/2d3748/ffffff?text=NLP+Project",
                links: [
                    { text: "Reference Code", url: "https://gist.github.com/muchad/5d8011862cdde754e75ccf11d772eeff" }
                ]
            },
            {
                id: 2,
                title: "Real-time Temperature Monitoring & Control System",
                description: "IoT system that monitors room temperature and humidity in real-time using DHT11 sensor connected to ESP32, with automatic fan control and web dashboard.",
                technologies: ["ESP32", "Arduino C++", "PHP", "MySQL", "HTML/CSS/JS"],
                role: "Full-Stack IoT Developer & System Integrator",
                image: "https://via.placeholder.com/350x200/2d3748/ffffff?text=IoT+Project",
                links: []
            },
            {
                id: 3,
                title: "Turtlesim Logo Drawing with ROS 2",
                description: "Demonstration of basic virtual robot control using ROS 2 through turtlesim package to draw predefined shapes or logos in simulation window.",
                technologies: ["ROS 2", "Python", "Linux/Bash"],
                role: "Lead Developer",
                image: "https://via.placeholder.com/350x200/2d3748/ffffff?text=ROS+Project",
                links: [
                    { text: "GitHub", url: "https://github.com/MaSDoRS/Turtlesim-Logo" },
                    { text: "Demo", url: "https://drive.google.com/file/d/1sOsWklZtKUbmkkTGDDFxCKwS4m_4sCCl/view?usp=sharing" }
                ]
            },
            {
                id: 4,
                title: "Inverse Kinematics for Differential Drive Robot",
                description: "Implementation of Inverse Kinematics (IK) for Differential Drive Robot using C++ with Object-Oriented Programming approach.",
                technologies: ["C++", "OOP", "File Handling"],
                role: "Lead Developer",
                image: "https://via.placeholder.com/350x200/2d3748/ffffff?text=Robotics+Project",
                links: [
                    { text: "GitHub", url: "https://github.com/MaSDoRS/OOP-IK-File" }
                ]
            }
        ]
    };
    
    savePortfolioData();
    loadPortfolioData();
}

// Load data to the page
function loadPortfolioData() {
    // Load profile data
    document.getElementById('profile-image').src = portfolioData.profile.image;
    document.getElementById('about-description').innerHTML = portfolioData.profile.description;
    document.getElementById('phone-text').textContent = portfolioData.profile.phone;
    document.getElementById('email-text').textContent = portfolioData.profile.email;
    document.getElementById('location-text').textContent = portfolioData.profile.location;
    document.getElementById('linkedin-text').textContent = portfolioData.profile.linkedin;
    
    // Load education data
    loadEducationData();
    
    // Load experience data
    loadExperienceData();
    
    // Load training data
    loadTrainingData();
    
    // Load projects
    loadProjects();
}

// Load education data
function loadEducationData() {
    const its = portfolioData.education.its;
    document.getElementById('education-its').innerHTML = `
        <h3>${its.title}</h3>
        <span class="timeline-date">${its.date}</span>
        <p>${its.details}</p>
        <ul>
            ${its.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
        </ul>
    `;
    
    const sma = portfolioData.education.sma;
    document.getElementById('education-sma').innerHTML = `
        <h3>${sma.title}</h3>
        <span class="timeline-date">${sma.date}</span>
        <p>${sma.details}</p>
        <ul>
            ${sma.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
        </ul>
    `;
}

// Load experience data
function loadExperienceData() {
    const experiences = portfolioData.experience;
    
    for (const [key, experience] of Object.entries(experiences)) {
        const element = document.getElementById(`experience-${key}`);
        if (element) {
            element.innerHTML = `
                <h3>${experience.title}</h3>
                <span class="experience-date">${experience.date}</span>
                <span class="experience-role">${experience.role}</span>
                <p>${experience.description}</p>
            `;
        }
    }
}

// Load training data
function loadTrainingData() {
    const trainingList = document.getElementById('training-list');
    trainingList.innerHTML = `
        <ul>
            ${portfolioData.training.map(item => `<li>${item}</li>`).join('')}
        </ul>
    `;
}

// Load projects
function loadProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    
    portfolioData.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-aos', 'zoom-in');
        
        const technologiesHTML = project.technologies.map(tech => 
            `<span class="technology-tag">${tech}</span>`
        ).join('');
        
        const linksHTML = project.links.map(link => 
            `<a href="${link.url}" target="_blank" class="project-link">
                <i class="fas fa-external-link-alt"></i> ${link.text}
            </a>`
        ).join('');
        
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-technologies">
                    ${technologiesHTML}
                </div>
                <p><strong>Role:</strong> ${project.role}</p>
                <div class="project-links">
                    ${linksHTML}
                </div>
                ${isEditMode ? `<button class="btn-edit" onclick="deleteProject(${project.id})">Delete Project</button>` : ''}
            </div>
        `;
        
        container.appendChild(projectCard);
    });
}

// Save data to localStorage
function savePortfolioData() {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
}

// Toggle edit mode
function enableEditMode() {
    isEditMode = true;
    document.body.classList.add('edit-mode');
    document.getElementById('admin').style.display = 'block';
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'block';
    });
    loadProjects(); // Reload projects to show delete buttons
}

function disableEditMode() {
    isEditMode = false;
    document.body.classList.remove('edit-mode');
    document.getElementById('admin').style.display = 'none';
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'none';
    });
    loadProjects(); // Reload projects to hide delete buttons
}

// Toggle edit for specific section
function toggleEdit(sectionId) {
    if (!isEditMode) return;
    
    const element = document.getElementById(sectionId);
    const isEditing = element.classList.contains('editing');
    
    if (isEditing) {
        // Save changes
        saveSectionChanges(sectionId, element);
        element.classList.remove('editing');
        element.querySelector('.edit-textarea')?.remove();
        element.querySelectorAll('.edit-input').forEach(input => input.remove());
    } else {
        // Enter edit mode
        element.classList.add('editing');
        enableSectionEditing(sectionId, element);
    }
}

// Enable editing for different section types
function enableSectionEditing(sectionId, element) {
    if (sectionId === 'about-description') {
        const currentHTML = element.innerHTML;
        element.innerHTML = '';
        const textarea = document.createElement('textarea');
        textarea.className = 'edit-textarea';
        textarea.value = portfolioData.profile.description;
        element.appendChild(textarea);
    } 
    else if (sectionId === 'training-list') {
        const currentHTML = element.innerHTML;
        element.innerHTML = '';
        const textarea = document.createElement('textarea');
        textarea.className = 'edit-textarea';
        textarea.value = portfolioData.training.join('\n');
        element.appendChild(textarea);
    }
    else if (sectionId.startsWith('education-')) {
        const eduKey = sectionId.replace('education-', '');
        const education = portfolioData.education[eduKey];
        
        let editHTML = `
            <input type="text" class="edit-input" value="${education.title}" placeholder="Institution Name">
            <input type="text" class="edit-input" value="${education.date}" placeholder="Date Range">
            <input type="text" class="edit-input" value="${education.details}" placeholder="Details">
            <textarea class="edit-textarea" placeholder="Achievements (one per line)">${education.achievements.join('\n')}</textarea>
        `;
        element.innerHTML = editHTML;
    }
    else if (sectionId.startsWith('experience-')) {
        const expKey = sectionId.replace('experience-', '');
        const experience = portfolioData.experience[expKey];
        
        let editHTML = `
            <input type="text" class="edit-input" value="${experience.title}" placeholder="Organization/Event">
            <input type="text" class="edit-input" value="${experience.date}" placeholder="Date Range">
            <input type="text" class="edit-input" value="${experience.role}" placeholder="Your Role">
            <textarea class="edit-textarea" placeholder="Description">${experience.description}</textarea>
        `;
        element.innerHTML = editHTML;
    }
}

// Save section changes
function saveSectionChanges(sectionId, element) {
    if (sectionId === 'about-description') {
        const textarea = element.querySelector('.edit-textarea');
        portfolioData.profile.description = textarea.value;
    }
    else if (sectionId === 'training-list') {
        const textarea = element.querySelector('.edit-textarea');
        portfolioData.training = textarea.value.split('\n').filter(item => item.trim() !== '');
    }
    else if (sectionId.startsWith('education-')) {
        const eduKey = sectionId.replace('education-', '');
        const inputs = element.querySelectorAll('.edit-input, .edit-textarea');
        
        portfolioData.education[eduKey] = {
            title: inputs[0].value,
            date: inputs[1].value,
            details: inputs[2].value,
            achievements: inputs[3].value.split('\n').filter(item => item.trim() !== '')
        };
    }
    else if (sectionId.startsWith('experience-')) {
        const expKey = sectionId.replace('experience-', '');
        const inputs = element.querySelectorAll('.edit-input, .edit-textarea');
        
        portfolioData.experience[expKey] = {
            title: inputs[0].value,
            date: inputs[1].value,
            role: inputs[2].value,
            description: inputs[3].value
        };
    }
    
    savePortfolioData();
    loadPortfolioData();
}

// Project management
function showAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'block';
}

function closeAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'none';
    document.getElementById('project-form').reset();
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        portfolioData.projects = portfolioData.projects.filter(project => project.id !== projectId);
        savePortfolioData();
        loadProjects();
    }
}

// Add new project
document.getElementById('project-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('project-title').value;
    const description = document.getElementById('project-description').value;
    const technologies = document.getElementById('project-technologies').value.split(',').map(tech => tech.trim());
    const role = document.getElementById('project-role').value;
    const linksInput = document.getElementById('project-links').value;
    const imageFile = document.getElementById('project-image').files[0];
    
    // Process links
    const links = [];
    if (linksInput) {
        const linkPairs = linksInput.split(',').map(l => l.trim());
        linkPairs.forEach(pair => {
            const [text, url] = pair.split('|').map(s => s.trim());
            if (text && url) {
                links.push({ text, url });
            }
        });
    }
    
    // Handle image
    let imageURL = 'https://via.placeholder.com/350x200/2d3748/ffffff?text=New+Project';
    if (imageFile) {
        imageURL = URL.createObjectURL(imageFile);
    }
    
    // Add new project
    const newProject = {
        id: portfolioData.projects.length > 0 ? Math.max(...portfolioData.projects.map(p => p.id)) + 1 : 1,
        title,
        description,
        technologies,
        role,
        image: imageURL,
        links
    };
    
    portfolioData.projects.push(newProject);
    savePortfolioData();
    loadProjects();
    closeAddProjectModal();
    
    // Show success message
    showNotification('Project added successfully!', 'success');
});

// Profile image upload
document.getElementById('image-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            portfolioData.profile.image = event.target.result;
            savePortfolioData();
            loadPortfolioData();
            showNotification('Profile image updated!', 'success');
        };
        reader.readAsDataURL(file);
    }
});

// Contact info editing (simplified - would need more complex implementation for individual field editing)

// Admin functions
function exportData() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-data.json';
    link.click();
    showNotification('Data exported successfully!', 'success');
}

function resetData() {
    if (confirm('Are you sure you want to reset all data to default? This cannot be undone.')) {
        localStorage.removeItem('portfolioData');
        loadDefaultData();
        showNotification('Data reset to default!', 'success');
    }
}

function addNewSection() {
    // Implementation for adding new sections would go here
    showNotification('New section feature coming soon!', 'warning');
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'warning' ? '#ed8936' : '#e53e3e'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Mobile menu toggle
document.querySelector('.hamburger').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.hamburger').classList.remove('active');
        document.querySelector('.nav-menu').classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolioData();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .notification button {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
});