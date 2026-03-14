
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navActions = document.getElementById('navActions');
const navActionsLoggedIn = document.getElementById('navActionsLoggedIn');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    if (navMenu.classList.contains('active')) {
        const currentActions = isLoggedIn() ? navActionsLoggedIn : navActions;
        if (!navMenu.querySelector('.nav-actions')) {
            const mobileActions = currentActions.cloneNode(true);
            mobileActions.classList.add('mobile');
            navMenu.appendChild(mobileActions);
        }
    } else {
        const mobileActions = navMenu.querySelector('.nav-actions.mobile');
        if (mobileActions) mobileActions.remove();
    }
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');

        const mobileActions = navMenu.querySelector('.nav-actions.mobile');
        if (mobileActions) mobileActions.remove();
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 60,
                behavior: 'smooth'
            });
        }
    });
});

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.style.boxShadow = '0 3px 5px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

function getUsers() {
    const users = localStorage.getItem('skilllink_users');
    return users ? JSON.parse(users) : {};
}

function saveUsers(users) {
    localStorage.setItem('skilllink_users', JSON.stringify(users));
}

function getCurrentUser() {
    return localStorage.getItem('skilllink_current_user');
}

function setCurrentUser(username) {
    if (username) {
        localStorage.setItem('skilllink_current_user', username);
    } else {
        localStorage.removeItem('skilllink_current_user');
    }
}

function getUserProfile(username) {
    const users = getUsers();
    return users[username] || null;
}

function saveUserProfile(username, profile) {
    const users = getUsers();
    if (!users[username]) {
        users[username] = {};
    }
    users[username] = { ...users[username], ...profile };
    saveUsers(users);
}

function isLoggedIn() {
    return !!getCurrentUser();
}

function updateNavigation() {
    if (isLoggedIn()) {
        navActions.style.display = 'none';
        navActionsLoggedIn.style.display = 'flex';
    } else {
        navActions.style.display = 'flex';
        navActionsLoggedIn.style.display = 'none';
    }
}

function showProfile() {
    const profileSection = document.getElementById('profile');
    if (profileSection) {
        profileSection.style.display = 'block';
        setTimeout(() => {
            window.scrollTo({
                top: profileSection.offsetTop - 60,
                behavior: 'smooth'
            });
        }, 100);
    }
}

function hideProfile() {
    const profileSection = document.getElementById('profile');
    if (profileSection) {
        profileSection.style.display = 'none';
    }
}

function loadProfile() {
    const username = getCurrentUser();
    if (!username) return;

    const profile = getUserProfile(username);
    if (profile) {
        document.getElementById('profile-username').textContent = profile.username || username;
        document.getElementById('profile-email').textContent = profile.email || '';
        document.getElementById('profile-name').value = profile.name || '';
        document.getElementById('profile-location').value = profile.location || '';
        document.getElementById('profile-bio').value = profile.bio || '';

        const skillsList = document.getElementById('skillsList');
        skillsList.innerHTML = '';
        if (profile.skills && profile.skills.length > 0) {
            profile.skills.forEach(skill => {
                addSkillToDOM(skill, 'skillsList');
            });
        }

        const learnSkillsList = document.getElementById('learnSkillsList');
        learnSkillsList.innerHTML = '';
        if (profile.skillsToLearn && profile.skillsToLearn.length > 0) {
            profile.skillsToLearn.forEach(skill => {
                addSkillToDOM(skill, 'learnSkillsList');
            });
        }
    }
}

const loginModal = document.getElementById('loginModal');
const openLoginModal = document.getElementById('openLoginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');

if (openLoginModal) {
    openLoginModal.addEventListener('click', e => {
        e.preventDefault();
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (closeLoginModal) {
    closeLoginModal.addEventListener('click', () => {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

loginModal?.addEventListener('click', e => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const users = getUsers();

        if (users[username] && users[username].password === password) {
            setCurrentUser(username);
            updateNavigation();
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
            
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                alert('Login successful! Redirecting to profile...');
                window.location.href = 'profile.html';
            } else {
                alert('Login successful!');
                if (typeof loadProfile === 'function') {
                    loadProfile();
                }
            }
        } else {
            alert('Invalid username or password!');
        }
    });
}

const signupModal = document.getElementById('signupModal');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const closeSignupModal = document.getElementById('closeSignupModal');
const signupForm = document.getElementById('signupForm');

if (showSignup) {
    showSignup.addEventListener('click', e => {
        e.preventDefault();
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    });
}

if (showLogin) {
    showLogin.addEventListener('click', e => {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    });
}

if (closeSignupModal) {
    closeSignupModal.addEventListener('click', () => {
        signupModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

signupModal?.addEventListener('click', e => {
    if (e.target === signupModal) {
        signupModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (loginModal.classList.contains('active')) {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (signupModal.classList.contains('active')) {
            signupModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();

        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const users = getUsers();
        if (users[username]) {
            alert('Username already exists!');
            return;
        }

        users[username] = {
            username,
            email,
            password,
            name: '',
            location: '',
            bio: '',
            skills: [],
            skillsToLearn: []
        };
        saveUsers(users);

        setCurrentUser(username);
        updateNavigation();
        signupModal.classList.remove('active');
        document.body.style.overflow = '';
        
        alert('Account created successfully! Redirecting to profile...');
        window.location.href = 'profile.html';
    });
}

const profileForm = document.getElementById('profileForm');
const profileLink = document.getElementById('profileLink');

if (profileLink) {
    profileLink.addEventListener('click', e => {
        if (!profileLink.href || profileLink.href === '#' || profileLink.href.includes('#')) {
            e.preventDefault();
            if (isLoggedIn()) {
                window.location.href = 'profile.html';
            }
        }
    });
}

if (profileForm) {
    profileForm.addEventListener('submit', e => {
        e.preventDefault();
        const username = getCurrentUser();
        if (!username) return;

        const profile = {
            name: document.getElementById('profile-name').value,
            location: document.getElementById('profile-location').value,
            bio: document.getElementById('profile-bio').value,
            skills: Array.from(document.querySelectorAll('#skillsList .skill-tag')).map(tag => tag.dataset.skill),
            skillsToLearn: Array.from(document.querySelectorAll('#learnSkillsList .skill-tag')).map(tag => tag.dataset.skill)
        };

        saveUserProfile(username, profile);
        alert('Profile saved successfully!');
        
        if (window.location.pathname.includes('browse-users.html')) {
            setTimeout(() => {
                displayUsers();
                populateLocationFilter();
            }, 100);
        }
    });
}

function addSkillToDOM(skill, containerId) {
    const container = document.getElementById(containerId);
    const skillTag = document.createElement('div');
    skillTag.className = 'skill-tag';
    skillTag.dataset.skill = skill;
    skillTag.innerHTML = `
        <span>${skill}</span>
        <button type="button" class="skill-remove" onclick="removeSkill(this, '${containerId}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(skillTag);
}

function removeSkill(button, containerId) {
    const skillTag = button.closest('.skill-tag');
    skillTag.remove();
}

const addSkillBtn = document.getElementById('addSkillBtn');
const skillInput = document.getElementById('skill-input');

if (addSkillBtn) {
    addSkillBtn.addEventListener('click', () => {
        const skill = skillInput.value.trim();
        if (skill) {
            addSkillToDOM(skill, 'skillsList');
            skillInput.value = '';
        }
    });
}

if (skillInput) {
    skillInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkillBtn.click();
        }
    });
}

const addLearnSkillBtn = document.getElementById('addLearnSkillBtn');
const learnSkillInput = document.getElementById('learn-skill-input');

if (addLearnSkillBtn) {
    addLearnSkillBtn.addEventListener('click', () => {
        const skill = learnSkillInput.value.trim();
        if (skill) {
            addSkillToDOM(skill, 'learnSkillsList');
            learnSkillInput.value = '';
        }
    });
}

if (learnSkillInput) {
    learnSkillInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addLearnSkillBtn.click();
        }
    });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        setCurrentUser(null);
        updateNavigation();
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    });
}

window.removeSkill = removeSkill;

function getAllUsers() {
    const users = getUsers();
    const currentUser = getCurrentUser();
    return Object.keys(users)
        .filter(username => username !== currentUser)
        .map(username => ({
            username,
            ...users[username]
        }));
}

function displayUsers(usersToDisplay = null) {
    const usersGrid = document.getElementById('usersGrid');
    if (!usersGrid) return;

    const users = usersToDisplay || getAllUsers();

    if (users.length === 0) {
        usersGrid.innerHTML = `
            <div class="no-users-message">
                <i class="fas fa-users"></i>
                <p>No users found. Be the first to sign up!</p>
            </div>
        `;
        return;
    }

    usersGrid.innerHTML = users.map(user => {
        const skills = user.skills && user.skills.length > 0 
            ? user.skills.map(skill => `<span class="user-skill-tag">${skill}</span>`).join('')
            : '<span class="no-skills">No skills listed</span>';
        
        const skillsToLearn = user.skillsToLearn && user.skillsToLearn.length > 0
            ? user.skillsToLearn.map(skill => `<span class="user-skill-tag learn">${skill}</span>`).join('')
            : '';

        const reviews = user.reviews || [];
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;
        const ratingStars = getStarRatingHTML(avgRating);
        const reviewCount = reviews.length;

        return `
            <div class="user-card">
                <div class="user-card-header">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-info">
                        <h3>${user.name || user.username}</h3>
                        <p class="user-username">@${user.username}</p>
                        ${user.location ? `<p class="user-location"><i class="fas fa-map-marker-alt"></i> ${user.location}</p>` : ''}
                    </div>
                </div>
                ${user.bio ? `<p class="user-bio">${user.bio}</p>` : ''}
                <div class="user-rating-section">
                    <div class="user-rating-display">
                        ${ratingStars}
                        <span class="rating-text">${avgRating > 0 ? `${avgRating} (${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})` : 'No reviews yet'}</span>
                    </div>
                    ${reviewCount > 0 ? `
                    <button class="btn-link" onclick="showUserReviews('${user.username}')">
                        View Reviews
                    </button>
                    ` : ''}
                </div>
                <div class="user-skills-section">
                    <h4><i class="fas fa-tools"></i> Skills I Can Teach</h4>
                    <div class="user-skills-list">${skills}</div>
                </div>
                ${skillsToLearn ? `
                <div class="user-skills-section">
                    <h4><i class="fas fa-graduation-cap"></i> Skills I Want to Learn</h4>
                    <div class="user-skills-list">${skillsToLearn}</div>
                </div>
                ` : ''}
                <div class="user-card-footer">
                    <button class="btn-secondary btn-small" onclick="viewUserProfile('${user.username}')">
                        <i class="fas fa-eye"></i> View Profile
                    </button>
                    ${isLoggedIn() && getCurrentUser() !== user.username ? `
                    <button class="btn-primary btn-small" onclick="openReviewModal('${user.username}')">
                        <i class="fas fa-star"></i> Leave Review
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
    const locationFilter = document.getElementById('locationFilter')?.value || '';
    const allUsers = getAllUsers();

    let filtered = allUsers;
    if (searchTerm) {
        filtered = filtered.filter(user => {
            const name = (user.name || user.username || '').toLowerCase();
            const location = (user.location || '').toLowerCase();
            const skills = (user.skills || []).join(' ').toLowerCase();
            const bio = (user.bio || '').toLowerCase();
            
            return name.includes(searchTerm) || 
                   location.includes(searchTerm) || 
                   skills.includes(searchTerm) ||
                   bio.includes(searchTerm);
        });
    }

    if (locationFilter) {
        filtered = filtered.filter(user => 
            (user.location || '').toLowerCase().includes(locationFilter.toLowerCase())
        );
    }

    displayUsers(filtered);
}

function populateLocationFilter() {
    const locationFilter = document.getElementById('locationFilter');
    if (!locationFilter) return;

    const users = getAllUsers();
    const locations = [...new Set(users.map(user => user.location).filter(Boolean))].sort();
                                                
    locationFilter.innerHTML = '<option value="">All Locations</option>';
    
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

function viewUserProfile(username) {
    const user = getUserProfile(username);
    if (!user) {
        alert('User not found!');
        return;
    }

    const profileInfo = `
        Username: ${user.username}
        Name: ${user.name || 'Not provided'}
        Email: ${user.email || 'Not provided'}
        Location: ${user.location || 'Not provided'}
        Bio: ${user.bio || 'Not provided'}
        Skills: ${(user.skills || []).join(', ') || 'None'}
        Skills to Learn: ${(user.skillsToLearn || []).join(', ') || 'None'}
    `;
    
    alert(profileInfo);
}

window.viewUserProfile = viewUserProfile;

function getStarRatingHTML(rating) {
    const numRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    return html;
}

function addReview(targetUsername, reviewerUsername, rating, comment) {
    const users = getUsers();
    if (!users[targetUsername]) return false;
    
    if (!users[targetUsername].reviews) {
        users[targetUsername].reviews = [];
    }

    const existingReviewIndex = users[targetUsername].reviews.findIndex(
        r => r.reviewer === reviewerUsername
    );
    
    const review = {
        reviewer: reviewerUsername,
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toISOString()
    };
    
    if (existingReviewIndex >= 0) {
        users[targetUsername].reviews[existingReviewIndex] = review;
    } else {
        users[targetUsername].reviews.push(review);
    }
    
    saveUsers(users);
    return true;
}

function getUserReviews(username) {
    const user = getUserProfile(username);
    return user?.reviews || [];
}

function openReviewModal(targetUsername) {
    if (!isLoggedIn()) {
        alert('Please log in to leave a review');
        return;
    }
    
    const reviewModal = document.getElementById('reviewModal');
    const reviewTargetUser = document.getElementById('reviewTargetUser');
    const reviewRating = document.getElementById('reviewRating');
    const reviewComment = document.getElementById('reviewComment');
    
    if (reviewModal && reviewTargetUser) {
        reviewTargetUser.value = targetUsername;
        reviewRating.value = 0;
        if (reviewComment) reviewComment.value = '';
        reviewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        updateStarDisplay(0);
    }
}

function showUserReviews(username) {
    const reviews = getUserReviews(username);
    const user = getUserProfile(username);
    const reviewsModal = document.getElementById('reviewsDisplayModal');
    const reviewsList = document.getElementById('reviewsList');
    const reviewsModalTitle = document.getElementById('reviewsModalTitle');
    
    if (!reviewsModal || !reviewsList) return;
    
    if (reviewsModalTitle) {
        reviewsModalTitle.textContent = `Reviews for ${user.name || user.username}`;
    }
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="text-align: center; color: var(--text-gray);">No reviews yet.</p>';
    } else {
        reviewsList.innerHTML = reviews.map(review => {
            const reviewer = getUserProfile(review.reviewer);
            const reviewerName = reviewer ? (reviewer.name || reviewer.username) : review.reviewer;
            const reviewDate = new Date(review.date).toLocaleDateString();
            const stars = getStarRatingHTML(review.rating);
            
            return `
                <div class="review-item">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <strong>${reviewerName}</strong>
                            <span class="review-date">${reviewDate}</span>
                        </div>
                        <div class="review-rating">
                            ${stars}
                        </div>
                    </div>
                    <p class="review-comment">${review.comment}</p>
                </div>
            `;
        }).join('');
    }
    
    reviewsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('#starRatingInput .star');
    stars.forEach((star, index) => {
        const starRating = index + 1;
        if (starRating <= rating) {
            star.innerHTML = '<i class="fas fa-star"></i>';
        } else {
            star.innerHTML = '<i class="far fa-star"></i>';
        }
    });
}

window.openReviewModal = openReviewModal;
window.showUserReviews = showUserReviews;

const reviewModal = document.getElementById('reviewModal');
const closeReviewModal = document.getElementById('closeReviewModal');
const reviewForm = document.getElementById('reviewForm');
const reviewsDisplayModal = document.getElementById('reviewsDisplayModal');
const closeReviewsModal = document.getElementById('closeReviewsModal');

if (closeReviewModal) {
    closeReviewModal.addEventListener('click', () => {
        if (reviewModal) {
            reviewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

if (reviewModal) {
    reviewModal.addEventListener('click', e => {
        if (e.target === reviewModal) {
            reviewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

if (closeReviewsModal) {
    closeReviewsModal.addEventListener('click', () => {
        if (reviewsDisplayModal) {
            reviewsDisplayModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

if (reviewsDisplayModal) {
    reviewsDisplayModal.addEventListener('click', e => {
        if (e.target === reviewsDisplayModal) {
            reviewsDisplayModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}


const starRatingInput = document.getElementById('starRatingInput');
if (starRatingInput) {
    starRatingInput.addEventListener('click', e => {
        const star = e.target.closest('.star');
        if (star) {
            const rating = parseInt(star.dataset.rating);
            const reviewRating = document.getElementById('reviewRating');
            if (reviewRating) {
                reviewRating.value = rating;
                updateStarDisplay(rating);
            }
        }
    });
    
    starRatingInput.addEventListener('mouseover', e => {
        const star = e.target.closest('.star');
        if (star) {
            const rating = parseInt(star.dataset.rating);
            updateStarDisplay(rating);
        }
    });
    
    starRatingInput.addEventListener('mouseleave', () => {
        const reviewRating = document.getElementById('reviewRating');
        if (reviewRating) {
            const currentRating = parseInt(reviewRating.value) || 0;
            updateStarDisplay(currentRating);
        }
    });
}

if (reviewForm) {
    reviewForm.addEventListener('submit', e => {
        e.preventDefault();
        
        if (!isLoggedIn()) {
            alert('Please log in to leave a review');
            return;
        }
        
        const targetUsername = document.getElementById('reviewTargetUser')?.value;
        const rating = document.getElementById('reviewRating')?.value;
        const comment = document.getElementById('reviewComment')?.value;
        const reviewerUsername = getCurrentUser();
        
        if (!targetUsername || !rating || rating === '0' || !comment) {
            alert('Please provide a rating and comment');
            return;
        }
        
        if (targetUsername === reviewerUsername) {
            alert('You cannot review yourself');
            return;
        }
        
        if (addReview(targetUsername, reviewerUsername, rating, comment)) {
            alert('Review submitted successfully!');
            reviewModal.classList.remove('active');
            document.body.style.overflow = '';
            
            if (window.location.pathname.includes('browse-users.html')) {
                displayUsers();
            }
        } else {
            alert('Failed to submit review');
        }
    });
}

const userSearch = document.getElementById('userSearch');
const locationFilter = document.getElementById('locationFilter');

if (userSearch) {
    userSearch.addEventListener('input', filterUsers);
}

if (locationFilter) {
    locationFilter.addEventListener('change', filterUsers);
}


function initializeDemoUsers() {
    const users = getUsers();
    
    const demoUsers = [
        {
            username: 'sarah_photographer',
            email: 'sarah.chen@email.com',
            password: 'demo123',
            name: 'Sarah Chen',
            location: 'Vancouver, Canada',
            bio: 'Professional photographer with 8 years of experience. Love teaching composition and lighting techniques.',
            skills: ['Photography', 'Photo Editing', 'Lightroom', 'Portrait Photography'],
            skillsToLearn: ['Video Editing', 'Graphic Design']
        },
        {
            username: 'emily_yoga',
            email: 'emily.wong@email.com',
            password: 'demo123',
            name: 'Emily Wong',
            location: 'Richmond, Canada',
            bio: 'Certified yoga instructor. Passionate about mindfulness and helping others find balance.',
            skills: ['Yoga', 'Meditation', 'Stretching', 'Breathing Techniques'],
            skillsToLearn: ['Pilates', 'Nutrition']
        },
        {
            username: 'david_coder',
            email: 'david.kim@email.com',
            password: 'demo123',
            name: 'David Kim',
            location: 'Coquitlam, Canada',
            bio: 'Software developer by day, coding teacher by night. Love sharing knowledge about web development.',
            skills: ['JavaScript', 'Python', 'Web Development', 'React'],
            skillsToLearn: ['Photography', 'Guitar']
        },
        {
            username: 'anna_designer',
            email: 'anna.singh@email.com',
            password: 'demo123',
            name: 'Anna Singh',
            location: 'Westminster, Canada',
            bio: 'Graphic designer with expertise in branding and digital design. Always happy to share design tips.',
            skills: ['Graphic Design', 'Adobe Photoshop', 'Illustrator', 'Branding'],
            skillsToLearn: ['Web Development', 'Photography']
        },
        {
            username: 'robert_fitness',
            email: 'robert.lee@email.com',
            password: 'demo123',
            name: 'Robert Lee',
            location: 'Burnaby, Canada',
            bio: 'Personal trainer and fitness coach. Specialized in strength training and nutrition.',
            skills: ['Fitness Training', 'Nutrition', 'Weightlifting', 'Cardio'],
            skillsToLearn: ['Yoga', 'Meditation']
        }
    ];

    // List of valid demo usernames
    const validDemoUsernames = demoUsers.map(u => u.username);
    const currentUser = getCurrentUser();
    
    // List of old demo usernames that should be removed
    const oldDemoUsernames = [
        'mike_chef',
        'lisa_gardener',
        'james_musician',
        'maria_language',
        'alex_handyman',
        'sophie_baker',
        'tom_writer'
    ];
    
    // Remove old demo users that are no longer in the list (but keep the current logged-in user)
    let usersChanged = false;
    Object.keys(users).forEach(username => {
        // Remove if it's an old demo user and not the current logged-in user
        if (oldDemoUsernames.includes(username) && username !== currentUser) {
            delete users[username];
            usersChanged = true;
        }
    });

    let hasNewUsers = false;
    demoUsers.forEach(demoUser => {
        if (!users[demoUser.username]) {
            // Initialize with empty reviews array
            users[demoUser.username] = {
                ...demoUser,
                reviews: []
            };
            hasNewUsers = true;
        } else if (!users[demoUser.username].reviews) {
            // Add reviews array to existing users
            users[demoUser.username].reviews = [];
            hasNewUsers = true;
        }
    });

    // Save if we made any changes
    if (hasNewUsers || usersChanged) {
        saveUsers(users);
    }
}


initializeDemoUsers();
updateNavigation();

if (window.location.pathname.includes('profile.html')) {
    if (isLoggedIn()) {
        loadProfile();
    } else {
        window.location.href = 'index.html';
    }
} else if (window.location.pathname.includes('browse-users.html')) {
    displayUsers();
    populateLocationFilter();
} else {
}

console.log('%cSkillLink', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('Local skill exchange platform.');
