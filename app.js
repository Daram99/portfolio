document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    const navLinks = document.querySelectorAll(".site-nav a");
    const sections = [...document.querySelectorAll("main section[id]")];

    function closeNav() {
        nav?.classList.remove("open");
        navToggle?.setAttribute("aria-expanded", "false");
    }

    navToggle?.addEventListener("click", () => {
        const isOpen = nav?.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeNav);
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                });
            });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeNav();
    });
});
