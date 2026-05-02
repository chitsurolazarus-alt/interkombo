// Wait for everything to load
document.addEventListener('DOMContentLoaded', function() {

// ============================================
// INITIALIZE EMAILJS
// ============================================
if (typeof emailjs !== 'undefined') {
    emailjs.init("_2ZhzKs9qky3PrvXl");
    console.log('EmailJS ready');
} else {
    console.log('EmailJS not loaded - will use direct email');
}

// ============================================
// CHECK SUPABASE IS READY
// ============================================
function getSupabase() {
    if (typeof supabase !== 'undefined' && supabase) {
        return supabase;
    }
    if (typeof window.supabase !== 'undefined') {
        return window.supabase;
    }
    console.error('Supabase not found');
    return null;
}

console.log('Supabase available:', !!getSupabase());

// ============================================
// LOADING SCREEN
// ============================================
setTimeout(function() {
    var loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.classList.add('hidden');
    document.body.style.overflow = '';
}, 2000);
document.body.style.overflow = 'hidden';

// ============================================
// AOS
// ============================================
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });
}

// ============================================
// PARTICLES
// ============================================
if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: { number: { value: 35 }, color: { value: '#4B2E83' }, shape: { type: 'circle' }, opacity: { value: 0.25 }, size: { value: 3 }, line_linked: { enable: true, distance: 150, color: '#E4572E', opacity: 0.15 }, move: { enable: true, speed: 1.2 } },
        interactivity: { events: { onhover: { enable: true, mode: 'grab' } } }
    });
}

// ============================================
// NAVIGATION
// ============================================
var navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() { 
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50); 
});

var menuToggle = document.getElementById('menu-toggle');
var navMenu = document.getElementById('nav-menu');
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            if (navMenu) navMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ============================================
// COUNTER
// ============================================
document.querySelectorAll('.stat-number').forEach(function(el) {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var target = parseInt(el.getAttribute('data-count'));
                var current = 0;
                var step = target / 125;
                function update() {
                    current += step;
                    if (current < target) { el.textContent = Math.floor(current) + '+'; requestAnimationFrame(update); }
                    else { el.textContent = target + '+'; }
                }
                update();
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(el);
});

// ============================================
// ADMIN LOGIN
// ============================================
var ADMIN_EMAIL = 'info@interkombo.co.za';
var ADMIN_PASSWORD = 'inter@Kombo26';
var isAdminLoggedIn = false;

var adminModal = document.getElementById('admin-modal');
var adminPanel = document.getElementById('admin-panel');
var adminLogoutBtn = document.getElementById('admin-logout-btn');

document.querySelectorAll('.admin-login-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (adminModal) { adminModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    });
});

var adminModalClose = document.getElementById('admin-modal-close');
if (adminModalClose) {
    adminModalClose.addEventListener('click', function() {
        if (adminModal) { adminModal.classList.remove('active'); document.body.style.overflow = ''; }
    });
}
if (adminModal) {
    adminModal.addEventListener('click', function(e) {
        if (e.target === adminModal) { adminModal.classList.remove('active'); document.body.style.overflow = ''; }
    });
}

var adminLoginForm = document.getElementById('admin-login-form');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('admin-email').value.trim();
        var password = document.getElementById('admin-password').value.trim();
        var errorEl = document.getElementById('admin-login-error');
        
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            isAdminLoggedIn = true;
            localStorage.setItem('interkombo_admin_logged_in', 'true');
            adminModal.classList.remove('active');
            document.body.style.overflow = '';
            if (adminPanel) { 
                adminPanel.style.display = 'block'; 
                setTimeout(function() { adminPanel.scrollIntoView({ behavior: 'smooth' }); }, 300); 
            }
            if (adminLogoutBtn) adminLogoutBtn.style.display = 'block';
            document.getElementById('admin-email').value = '';
            document.getElementById('admin-password').value = '';
            if (errorEl) errorEl.style.display = 'none';
            loadAdminContent();
            loadAdminPortfolio();
            loadAdminTestimonials();
            alert('Welcome Admin! Panel is at the bottom.');
        } else {
            if (errorEl) { errorEl.textContent = 'Invalid email or password.'; errorEl.style.display = 'block'; }
        }
    });
}

if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', function() {
        isAdminLoggedIn = false;
        localStorage.removeItem('interkombo_admin_logged_in');
        if (adminPanel) adminPanel.style.display = 'none';
        adminLogoutBtn.style.display = 'none';
    });
}

var closeAdminBtn = document.getElementById('close-admin-panel');
if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', function() {
        if (adminPanel) adminPanel.style.display = 'none';
    });
}

if (localStorage.getItem('interkombo_admin_logged_in') === 'true') {
    isAdminLoggedIn = true;
    if (adminLogoutBtn) adminLogoutBtn.style.display = 'block';
}

document.querySelectorAll('.admin-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        document.querySelectorAll('.admin-tab-content').forEach(function(c) { c.classList.remove('active'); });
        
        var tabName = this.getAttribute('data-admin-tab');
        if (tabName === 'content') { 
            var el = document.getElementById('admin-content'); 
            if (el) el.classList.add('active'); 
            loadAdminContent(); 
        }
        if (tabName === 'portfolio') { 
            var el = document.getElementById('admin-portfolio'); 
            if (el) el.classList.add('active'); 
            loadAdminPortfolio(); 
        }
        if (tabName === 'testimonials-admin') { 
            var el = document.getElementById('admin-testimonials-admin'); 
            if (el) el.classList.add('active'); 
            loadAdminTestimonials(); 
        }
    });
});

// ============================================
// ADMIN CONTENT FUNCTIONS
// ============================================
function loadAdminContent() {
    var s = getSupabase();
    if (!s) { console.log('Supabase not available'); return; }
    
    s.from('site_content').select('*').then(function(result) {
        if (result.error) { console.log('Error loading content:', result.error); return; }
        if (!result.data || result.data.length === 0) return;
        
        var map = {};
        result.data.forEach(function(item) { map[item.section_key] = item.content; });
        
        var setVal = function(id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; };
        setVal('edit-hero-title', map['hero_title']);
        setVal('edit-hero-description', map['hero_description']);
        setVal('edit-about-who', map['about_who_we_are']);
        setVal('edit-about-vision', map['about_vision']);
        setVal('edit-about-mission', map['about_mission']);
        setVal('edit-phone', map['contact_phone']);
        setVal('edit-email', map['contact_email']);
        setVal('edit-address', map['contact_address']);
    }).catch(function(err) { console.log('Load content error:', err); });
}

var adminContentForm = document.getElementById('admin-content-form');
if (adminContentForm) {
    adminContentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var s = getSupabase();
        if (!s) { alert('Database not connected. Please refresh the page.'); return; }
        
        var updates = [
            { key: 'hero_title', value: document.getElementById('edit-hero-title').value },
            { key: 'hero_description', value: document.getElementById('edit-hero-description').value },
            { key: 'about_who_we_are', value: document.getElementById('edit-about-who').value },
            { key: 'about_vision', value: document.getElementById('edit-about-vision').value },
            { key: 'about_mission', value: document.getElementById('edit-about-mission').value },
            { key: 'contact_phone', value: document.getElementById('edit-phone').value },
            { key: 'contact_email', value: document.getElementById('edit-email').value },
            { key: 'contact_address', value: document.getElementById('edit-address').value }
        ];
        
        var promises = updates.map(function(u) {
            return s.from('site_content').upsert({ section_key: u.key, content: u.value, updated_at: new Date() });
        });
        
        Promise.all(promises).then(function() {
            alert('Content saved successfully!');
            loadSiteContent();
        }).catch(function(err) {
            console.log('Save error:', err);
            alert('Save failed. Check console for details.');
        });
    });
}

// ============================================
// LOAD SITE CONTENT
// ============================================
function loadSiteContent() {
    var s = getSupabase();
    if (!s) return;
    
    s.from('site_content').select('*').then(function(result) {
        if (result.error || !result.data || result.data.length === 0) return;
        var map = {};
        result.data.forEach(function(item) { map[item.section_key] = item.content; });
        
        if (map['hero_title']) {
            var parts = map['hero_title'].split(' With ');
            var el = document.getElementById('hero-title-display');
            if (el) el.innerHTML = '<span class="title-line animate-slide-left">' + (parts[0] || 'Transform Your Brand') + '</span><span class="title-line animate-slide-right">With <span class="gradient-text">' + (parts[1] || 'INTER KOMBO') + '</span></span>';
        }
        var setText = function(id, val) { var el = document.getElementById(id); if (el && val) el.textContent = val; };
        setText('hero-description-display', map['hero_description']);
        setText('display-about-who', map['about_who_we_are']);
        setText('display-about-vision', map['about_vision']);
        setText('display-about-mission', map['about_mission']);
        if (map['contact_phone']) { var el = document.getElementById('display-phone'); if (el) { el.textContent = map['contact_phone']; el.href = 'tel:' + map['contact_phone'].replace(/\s/g, ''); } }
        if (map['contact_email']) { var el = document.getElementById('display-email'); if (el) { el.textContent = map['contact_email']; el.href = 'mailto:' + map['contact_email']; } }
        if (map['contact_address']) { var el = document.getElementById('display-address'); if (el) el.textContent = map['contact_address']; }
    }).catch(function(err) { console.log(err); });
}
loadSiteContent();

// ============================================
// PORTFOLIO - ALL IMAGES
// ============================================
var ALL_IMAGES = [
    { category: 'screen-printing', title: 'Corporate T-Shirts', src: 'images/screen-printing/screen-printing-1.jpg' },
    { category: 'screen-printing', title: 'Event Merchandise', src: 'images/screen-printing/screen-printing-2.jpg' },
    { category: 'screen-printing', title: 'Bulk Order Tees', src: 'images/screen-printing/screen-printing-3.jpg' },
    { category: 'screen-printing', title: 'Promotional Wear', src: 'images/screen-printing/screen-printing-4.jpg' },
    { category: 'screen-printing', title: 'Branded Apparel', src: 'images/screen-printing/screen-printing-5.jpg' },
    { category: 'embroidery', title: 'Cap Embroidery', src: 'images/embroidery/embroidery-1.jpg' },
    { category: 'embroidery', title: 'Jacket Branding', src: 'images/embroidery/embroidery-2.jpg' },
    { category: 'embroidery', title: 'Corporate Wear', src: 'images/embroidery/embroidery-3.jpg' },
    { category: 'embroidery', title: 'Premium Stitching', src: 'images/embroidery/embroidery-4.jpg' },
    { category: 'embroidery', title: 'Logo Embroidery', src: 'images/embroidery/embroidery-5.jpg' },
    { category: 'embroidery', title: 'Custom Designs', src: 'images/embroidery/embroidery-6.jpg' },
    { category: 'uv-printing', title: 'UV Phone Cases', src: 'images/uv-printing/uv-printing-1.jpg' },
    { category: 'uv-printing', title: 'Durable Prints', src: 'images/uv-printing/uv-printing-2.jpg' },
    { category: 'uv-printing', title: 'Outdoor Signage', src: 'images/uv-printing/uv-printing-3.jpg' },
    { category: 'uv-printing', title: 'Premium Finish', src: 'images/uv-printing/uv-printing-4.jpg' },
    { category: 'pad-printing', title: 'Precision Pad Print', src: 'images/pad-printing/pad-printing-1.jpg' },
    { category: 'pad-printing', title: 'Curved Surface', src: 'images/pad-printing/pad-printing-2.jpg' },
    { category: 'pad-printing', title: 'Detailed Work', src: 'images/pad-printing/pad-printing-3.jpg' },
    { category: 'laser-engraving', title: 'Engraved Tumblers', src: 'images/laser-engraving/laser-engraving-1.jpg' },
    { category: 'laser-engraving', title: 'Wood Engraving', src: 'images/laser-engraving/laser-engraving-2.jpg' },
    { category: 'laser-engraving', title: 'Metal Marking', src: 'images/laser-engraving/laser-engraving-3.jpg' },
    { category: 'laser-engraving', title: 'Gift Items', src: 'images/laser-engraving/laser-engraving-4.jpg' },
    { category: 'laser-engraving', title: 'Precision Work', src: 'images/laser-engraving/laser-engraving-5.jpg' },
    { category: 'laser-engraving', title: 'Acrylic Awards', src: 'images/laser-engraving/laser-engraving-6.jpg' },
    { category: 'laser-engraving', title: 'Name Plates', src: 'images/laser-engraving/laser-engraving-7.jpg' },
    { category: 'laser-engraving', title: 'Custom Designs', src: 'images/laser-engraving/laser-engraving-8.jpg' },
    { category: 'laser-engraving', title: 'Detailed Engraving', src: 'images/laser-engraving/laser-engraving-9.jpg' },
    { category: 'dtf', title: 'DTF Transfers', src: 'images/dtf/dtf-1.jpg' },
    { category: 'dtf', title: 'Fabric Prints', src: 'images/dtf/dtf-2.jpg' },
    { category: 'dtf', title: 'Custom Apparel', src: 'images/dtf/dtf-3.jpg' },
    { category: 'dtf', title: 'Full Color DTF', src: 'images/dtf/dtf-4.jpg' },
    { category: 'heat-press', title: 'Heat Transfer', src: 'images/heat-press/heat-press-1.jpg' },
    { category: 'heat-press', title: 'Apparel Pressing', src: 'images/heat-press/heat-press-2.jpg' },
    { category: 'sublimation', title: 'Mug Sublimation', src: 'images/sublimation/sublimation-1.jpg' },
    { category: 'sublimation', title: 'Full Color Items', src: 'images/sublimation/sublimation-2.jpg' },
    { category: 'vinyl-stickers', title: 'Dome Stickers', src: 'images/vinyl-stickers/vinyl-stickers-1.jpg' },
    { category: 'vinyl-stickers', title: 'Vinyl Decals', src: 'images/vinyl-stickers/vinyl-stickers-2.jpg' },
    { category: 'vinyl-stickers', title: 'Weatherproof Stickers', src: 'images/vinyl-stickers/vinyl-stickers-3.jpg' },
    { category: 'vinyl-stickers', title: '3D Dome Labels', src: 'images/vinyl-stickers/vinyl-stickers-4.jpg' },
    { category: 'vinyl-stickers', title: 'Custom Shapes', src: 'images/vinyl-stickers/vinyl-stickers-5.jpg' },
    { category: 'vinyl-stickers', title: 'Vehicle Graphics', src: 'images/vinyl-stickers/vinyl-stickers-6.jpg' },
    { category: 'vinyl-stickers', title: 'Durable Prints', src: 'images/vinyl-stickers/vinyl-stickers-7.jpg' },
    { category: 'signage', title: 'Large Banners', src: 'images/signage/signage-1.jpg' },
    { category: 'signage', title: 'Outdoor Signs', src: 'images/signage/signage-2.jpg' },
    { category: 'signage', title: 'Event Displays', src: 'images/signage/signage-3.jpg' },
    { category: 'signage', title: 'Pull-Up Banners', src: 'images/signage/signage-4.jpg' },
    { category: 'signage', title: 'Corporate Signage', src: 'images/signage/signage-5.jpg' },
    { category: 'signage', title: 'Promotional Boards', src: 'images/signage/signage-6.jpg' },
    { category: 'signage', title: 'Street Signs', src: 'images/signage/signage-7.jpg' }
];

function loadPortfolio() {
    var grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    
    var allItems = ALL_IMAGES.slice();
    
    var s = getSupabase();
    if (s) {
        s.from('portfolio_items').select('*').order('created_at', { ascending: false }).then(function(result) {
            if (!result.error && result.data && result.data.length > 0) {
                var dbItems = result.data.map(function(item) {
                    return { category: item.category, title: item.title, src: item.image_url };
                });
                allItems = dbItems.concat(ALL_IMAGES);
            }
            renderGrid(allItems);
        }).catch(function() {
            renderGrid(allItems);
        });
    } else {
        renderGrid(allItems);
    }
}

function renderGrid(items) {
    var grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    
    grid.innerHTML = items.map(function(item, i) {
        return '<div class="portfolio-item" data-category="' + item.category + '" data-src="' + item.src + '"><img src="' + item.src + '" alt="' + item.title + '" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>';
    }).join('');
    
    document.querySelectorAll('.portfolio-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var lightbox = document.getElementById('lightbox');
            if (lightbox) {
                document.getElementById('lightbox-img').src = this.getAttribute('data-src');
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.onclick = function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            var filter = this.getAttribute('data-filter');
            document.querySelectorAll('.portfolio-item').forEach(function(item) {
                item.style.display = (filter === 'all' || item.getAttribute('data-category') === filter) ? 'block' : 'none';
            });
        };
    });
}

loadPortfolio();

var lightbox = document.getElementById('lightbox');
if (lightbox) {
    lightbox.addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('lightbox-close')) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// ADMIN PORTFOLIO
// ============================================
function loadAdminPortfolio() {
    var container = document.getElementById('admin-portfolio-list');
    if (!container) return;
    
    var s = getSupabase();
    if (!s) { container.innerHTML = '<p style="color:red;text-align:center;">Database not connected.</p>'; return; }
    
    s.from('portfolio_items').select('*').order('created_at', { ascending: false }).then(function(result) {
        if (result.error) { container.innerHTML = '<p style="color:red;">Error: ' + result.error.message + '</p>'; return; }
        if (!result.data || result.data.length === 0) { container.innerHTML = '<p style="color:var(--text-light);text-align:center;">No items in database yet.</p>'; return; }
        
        container.innerHTML = result.data.map(function(item) {
            return '<div style="display:flex;align-items:center;justify-content:space-between;background:var(--light-grey);padding:12px;border-radius:8px;margin-bottom:10px;gap:10px;"><img src="' + item.image_url + '" style="width:80px;height:60px;object-fit:cover;border-radius:4px;"><div style="flex:1;"><strong>' + item.title + '</strong><br><small>' + item.category + '</small></div><button onclick="window.deletePortfolioItem(' + item.id + ')" style="padding:6px 12px;background:#EF4444;color:white;border:none;border-radius:6px;cursor:pointer;">Delete</button></div>';
        }).join('');
    }).catch(function(err) { container.innerHTML = '<p style="color:red;">Error loading.</p>'; });
}

window.deletePortfolioItem = function(id) {
    if (!confirm('Delete this item?')) return;
    var s = getSupabase();
    if (!s) return;
    s.from('portfolio_items').delete().eq('id', id).then(function() {
        loadAdminPortfolio();
        loadPortfolio();
    });
};

var portfolioForm = document.getElementById('admin-portfolio-form');
if (portfolioForm) {
    portfolioForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var s = getSupabase();
        if (!s) { alert('Database not connected. Refresh page.'); return; }
        
        var title = document.getElementById('portfolio-title').value.trim();
        var category = document.getElementById('portfolio-category').value;
        var file = document.getElementById('portfolio-image').files[0];
        
        if (!title || !category || !file) { alert('Please fill all fields.'); return; }
        
        var fileName = 'p-' + Date.now() + '.' + file.name.split('.').pop();
        
        s.storage.from('portfolio').upload(fileName, file).then(function(uploadResult) {
            if (uploadResult.error) { alert('Upload failed: ' + uploadResult.error.message); return; }
            
            var imageUrl = 'https://fwpjckkpsciqzfpmzktt.supabase.co/storage/v1/object/public/portfolio/' + fileName;
            
            s.from('portfolio_items').insert([{ title: title, category: category, image_url: imageUrl }]).then(function(insertResult) {
                if (insertResult.error) { alert('Save failed: ' + insertResult.error.message); return; }
                alert('Item added!');
                portfolioForm.reset();
                loadAdminPortfolio();
                loadPortfolio();
            });
        }).catch(function(err) { alert('Error: ' + err.message); });
    });
}

// ============================================
// TESTIMONIALS
// ============================================
var testimonialModal = document.getElementById('testimonial-modal');

var openBtn = document.getElementById('open-testimonial-form');
if (openBtn) {
    openBtn.addEventListener('click', function() {
        if (testimonialModal) { testimonialModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    });
}

document.querySelectorAll('#testimonial-modal .modal-close').forEach(function(btn) {
    btn.addEventListener('click', function() {
        if (testimonialModal) { testimonialModal.classList.remove('active'); document.body.style.overflow = ''; }
    });
});

if (testimonialModal) {
    testimonialModal.addEventListener('click', function(e) {
        if (e.target === testimonialModal) { testimonialModal.classList.remove('active'); document.body.style.overflow = ''; }
    });
}

document.querySelectorAll('.star-rating i').forEach(function(star) {
    star.addEventListener('click', function() {
        var r = parseInt(this.getAttribute('data-rating'));
        document.getElementById('review-rating').value = r;
        document.querySelectorAll('.star-rating i').forEach(function(s, i) {
            if (i < r) { s.classList.add('fas', 'active'); s.classList.remove('far'); }
            else { s.classList.remove('fas', 'active'); s.classList.add('far'); }
        });
    });
});

var reviewImageInput = document.getElementById('review-image');
if (reviewImageInput) {
    reviewImageInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        var preview = document.getElementById('image-preview');
        if (file && preview) {
            var reader = new FileReader();
            reader.onload = function(ev) { preview.innerHTML = '<img src="' + ev.target.result + '" style="max-width:180px;border-radius:8px;">'; };
            reader.readAsDataURL(file);
        }
    });
}

var testimonialForm = document.getElementById('testimonial-form');
if (testimonialForm) {
    testimonialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var name = document.getElementById('review-name').value.trim();
        var company = document.getElementById('review-company').value.trim();
        var rating = parseInt(document.getElementById('review-rating').value);
        var text = document.getElementById('review-text').value.trim();
        var file = document.getElementById('review-image').files[0];
        
        if (!name || !rating || !text) { alert('Please fill all required fields.'); return; }
        
        var s = getSupabase();
        
        function saveReview(imageUrl) {
            var reviewData = { name: name, company: company || null, rating: rating, review_text: text, image_url: imageUrl || null, approved: false };
            
            if (s) {
                s.from('testimonials').insert([reviewData]).then(function() {
                    finishSubmission();
                }).catch(function() {
                    finishSubmission();
                });
            } else {
                finishSubmission();
            }
        }
        
        function finishSubmission() {
            alert('Thank you! Your review has been submitted.');
            testimonialForm.reset();
            document.getElementById('image-preview').innerHTML = '';
            document.getElementById('review-rating').value = '';
            document.querySelectorAll('.star-rating i').forEach(function(s) { s.classList.remove('fas', 'active'); s.classList.add('far'); });
            if (testimonialModal) testimonialModal.classList.remove('active');
            document.body.style.overflow = '';
            loadTestimonials();
        }
        
        if (file && s) {
            var fileName = 'review-' + Date.now() + '.' + file.name.split('.').pop();
            s.storage.from('testimonials').upload(fileName, file).then(function(result) {
                var imageUrl = result.error ? null : ('https://fwpjckkpsciqzfpmzktt.supabase.co/storage/v1/object/public/testimonials/' + fileName);
                saveReview(imageUrl);
            }).catch(function() {
                saveReview(null);
            });
        } else {
            saveReview(null);
        }
    });
}

function loadTestimonials() {
    var container = document.getElementById('testimonials-container');
    if (!container) return;
    
    var s = getSupabase();
    if (s) {
        s.from('testimonials').select('*').eq('approved', true).order('created_at', { ascending: false }).limit(9).then(function(result) {
            if (result.data && result.data.length > 0) {
                renderTestimonials(result.data);
            } else {
                container.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-light);padding:30px;">No reviews yet. Be the first!</p>';
            }
        }).catch(function() {
            container.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-light);padding:30px;">No reviews yet.</p>';
        });
    } else {
        container.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-light);padding:30px;">No reviews yet. Be the first!</p>';
    }
}

function renderTestimonials(reviews) {
    var container = document.getElementById('testimonials-container');
    if (!container) return;
    
    container.innerHTML = reviews.map(function(t) {
        var initials = t.name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase();
        var stars = '';
        for (var i = 0; i < 5; i++) { stars += i < t.rating ? '★' : '☆'; }
        return '<div class="testimonial-card"><div class="testimonial-header"><div class="testimonial-avatar">' + initials + '</div><div class="testimonial-info"><h4>' + t.name + '</h4><span>' + (t.company||'') + '</span></div></div><div class="stars">' + stars + '</div><p class="testimonial-text">' + t.review_text + '</p>' + (t.image_url ? '<img src="' + t.image_url + '" class="testimonial-image" loading="lazy">' : '') + '</div>';
    }).join('');
}

loadTestimonials();

// ============================================
// ADMIN TESTIMONIALS
// ============================================
function loadAdminTestimonials() {
    var container = document.getElementById('admin-testimonials-list');
    if (!container) return;
    
    var s = getSupabase();
    if (!s) { container.innerHTML = '<p style="color:red;text-align:center;">Database not connected.</p>'; return; }
    
    s.from('testimonials').select('*').order('created_at', { ascending: false }).then(function(result) {
        if (!result.data || result.data.length === 0) { container.innerHTML = '<p style="text-align:center;">No reviews yet.</p>'; return; }
        
        container.innerHTML = result.data.map(function(t) {
            return '<div style="display:flex;justify-content:space-between;align-items:center;background:var(--light-grey);padding:12px;border-radius:8px;margin-bottom:10px;gap:10px;flex-wrap:wrap;"><div><strong>' + t.name + '</strong> ' + (t.company||'') + '<br><small>' + '★'.repeat(t.rating) + '☆'.repeat(5-t.rating) + '</small><br><small>' + t.review_text.substring(0,80) + '...</small><br><span style="padding:4px 10px;border-radius:12px;font-size:0.75rem;background:' + (t.approved?'#D1FAE5':'#FEF3C7') + ';color:' + (t.approved?'#065F46':'#92400E') + ';">' + (t.approved?'Approved':'Pending') + '</span></div><div>' + (t.approved ? '' : '<button onclick="window.approveTestimonial(' + t.id + ')" style="padding:6px 12px;background:#10B981;color:white;border:none;border-radius:6px;cursor:pointer;margin-right:5px;">Approve</button>') + '<button onclick="window.deleteTestimonial(' + t.id + ')" style="padding:6px 12px;background:#EF4444;color:white;border:none;border-radius:6px;cursor:pointer;">Delete</button></div></div>';
        }).join('');
    });
}

window.approveTestimonial = function(id) {
    var s = getSupabase();
    if (!s) return;
    s.from('testimonials').update({ approved: true }).eq('id', id).then(function() {
        loadAdminTestimonials();
        loadTestimonials();
    });
};

window.deleteTestimonial = function(id) {
    if (!confirm('Delete?')) return;
    var s = getSupabase();
    if (!s) return;
    s.from('testimonials').delete().eq('id', id).then(function() {
        loadAdminTestimonials();
        loadTestimonials();
    });
};

// ============================================
// QUOTE FORM - SIMPLE AND WORKS 100%
// ============================================
var quoteForm = document.getElementById('quote-form');
if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        var fullname = quoteForm.querySelector('input[name="fullname"]').value.trim();
        var email = quoteForm.querySelector('input[name="email"]').value.trim();
        var phone = quoteForm.querySelector('input[name="phone"]').value.trim();
        var company = quoteForm.querySelector('input[name="company"]').value.trim();
        var service = quoteForm.querySelector('select[name="service"]').value;
        var details = quoteForm.querySelector('textarea[name="details"]').value.trim();
        
        if (!fullname || !email || !service || !details) {
            alert('Please fill all required fields (Name, Email, Service, and Project Details).');
            return;
        }
        
        // Build email subject and body
        var subject = 'Quote Request from ' + fullname + ' - ' + service;
        var body = 'NEW QUOTE REQUEST\n';
        body += '==================\n\n';
        body += 'Name: ' + fullname + '\n';
        body += 'Email: ' + email + '\n';
        body += 'Phone: ' + (phone || 'N/A') + '\n';
        body += 'Company: ' + (company || 'N/A') + '\n';
        body += 'Service Requested: ' + service + '\n';
        body += '\nProject Details:\n' + details + '\n\n';
        body += '---\nSent from Inter Kombo Website';
        
        // SIMPLE mailto: link - always works
        var mailtoLink = 'mailto:interkombo1@outlook.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        alert('Thank you ' + fullname + '!\n\nYour email app should open with the quote request ready to send.\n\nIf nothing happens, please email us directly at:\ninterkombo1@outlook.com');
        
        // Reset form
        quoteForm.reset();
    });
}

// ============================================
// KEYBOARD ESCAPE
// ============================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var lb = document.getElementById('lightbox');
        if (lb) lb.classList.remove('active');
        if (testimonialModal) testimonialModal.classList.remove('active');
        if (adminModal) adminModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

console.log('Inter Kombo website ready!');
console.log('Quote emails go to: interkombo1@outlook.com');
console.log('Contact email: info@interkombo.co.za');
console.log('Admin: info@interkombo.co.za / inter@Kombo26');

}); // End DOMContentLoaded
