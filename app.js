document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('sidebar');
    const triggerZone = document.getElementById('sidebar-trigger-zone');

    // === 1. Tab Navigation Routing (Hash-based) ===
    function switchTab(tabId) {
        if (!tabId) return;

        // Active Nav Link Update
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
        });

        // Active Panel Update
        tabPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === tabId);
        });

        // Scroll content to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Close sidebar on mobile after choosing a tab
        if (window.innerWidth <= 992 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            updateMenuToggleIcon(false);
        }
    }

    function handleHashChange() {
        const hash = window.location.hash.substring(1) || 'home';
        const validTabs = ['home', 'resume', 'projects', 'stories'];
        
        // Deep linking for projects
        const parts = hash.split('?');
        const tabId = parts[0];
        
        if (validTabs.includes(tabId)) {
            switchTab(tabId);
            
            // If projects tab is targeted with query parameter (e.g. #projects?p1)
            if (tabId === 'projects') {
                const query = parts[1];
                if (query) {
                    const projectPanel = document.getElementById(query);
                    if (projectPanel) {
                        showProjectDetail(query);
                        return;
                    }
                }
                resetTimelineView();
            }
        } else {
            switchTab('home');
        }
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load routing

    // Nav Links click handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const tabId = link.getAttribute('data-tab');
            window.location.hash = tabId;
        });
    });

    // Home CTA buttons routing support
    document.querySelectorAll('.hero-actions a, .stat-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const href = btn.getAttribute('href');
            if (href) {
                window.location.hash = href.substring(1);
            } else {
                const targetTab = btn.getAttribute('data-link-tab');
                const targetProject = btn.getAttribute('data-link-project');
                if (targetProject) {
                    window.location.hash = `${targetTab}?${targetProject}`;
                } else if (targetTab) {
                    window.location.hash = targetTab;
                }
            }
        });
    });

    // === 2. Sidebar Open / Close Menu Logic ===
    let sidebarTimeout = null;

    function updateMenuToggleIcon(isOpen) {
        if (!menuToggleBtn) return;
        menuToggleBtn.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
        lucide.createIcons();
    }

    // Toggle button click handler
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = sidebar.classList.toggle('open');
            updateMenuToggleIcon(isOpen);
        });
    }

    // Desktop hover logic
    if (triggerZone) {
        triggerZone.addEventListener('mouseenter', () => {
            if (window.innerWidth > 992) {
                clearTimeout(sidebarTimeout);
                sidebar.classList.add('open');
                updateMenuToggleIcon(true);
            }
        });

        triggerZone.addEventListener('mouseleave', () => {
            if (window.innerWidth > 992) {
                sidebarTimeout = setTimeout(() => {
                    sidebar.classList.remove('open');
                    updateMenuToggleIcon(false);
                }, 350);
            }
        });
    }

    if (sidebar) {
        sidebar.addEventListener('mouseenter', () => {
            if (window.innerWidth > 992) {
                clearTimeout(sidebarTimeout);
            }
        });

        sidebar.addEventListener('mouseleave', () => {
            if (window.innerWidth > 992) {
                sidebarTimeout = setTimeout(() => {
                    sidebar.classList.remove('open');
                    updateMenuToggleIcon(false);
                }, 350);
            }
        });
    }

    // Clicking outside sidebar closes it
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !menuToggleBtn.contains(e.target)) {
            sidebar.classList.remove('open');
            updateMenuToggleIcon(false);
        }
    });

    // === 3. Key Projects Timeline Interaction ===
    const timelineContainer = document.getElementById('projects-timeline');
    const detailViewContainer = document.getElementById('projects-detail-view');
    const backToTimelineBtn = document.getElementById('tl-back-btn');
    const tlCards = document.querySelectorAll('.tl-card');
    const detailPanels = document.querySelectorAll('.project-detail-panel');

    function resetTimelineView() {
        if (detailViewContainer) detailViewContainer.classList.add('hidden');
        if (timelineContainer) {
            timelineContainer.style.display = '';
            
            // Re-trigger timeline layout animations
            const spine = timelineContainer.querySelector('.timeline-spine');
            if (spine) {
                spine.style.animation = 'none';
                spine.offsetHeight; // reflow
                spine.style.animation = '';
            }
            timelineContainer.querySelectorAll('.tl-item, .tl-dot, .tl-branch').forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = '';
            });
        }
    }

    function showProjectDetail(projectId) {
        if (timelineContainer) timelineContainer.style.display = 'none';
        if (detailViewContainer) {
            detailViewContainer.classList.remove('hidden');
            
            // Activate selected project detail panel
            detailPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === projectId);
            });
            
            // Smooth scroll to top of details
            detailViewContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Click tl-card event
    tlCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.closest('.tl-item').getAttribute('data-target');
            window.location.hash = `projects?${targetId}`;
        });
    });

    // Click back to timeline button
    if (backToTimelineBtn) {
        backToTimelineBtn.addEventListener('click', () => {
            window.location.hash = 'projects';
        });
    }

    // Initialize Lucide icons on load
    lucide.createIcons();
});
