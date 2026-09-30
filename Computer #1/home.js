const preview = document.querySelector("#home-preview");
const previewLinks = document.querySelectorAll(".home-link[data-preview]");
const defaultPreview = {
    source: "Home.png",
    alt: "Home preview",
};
let currentSource = defaultPreview.source;
let requestedSource = defaultPreview.source;
let changeTimer;
let hoveredLink = null;
let focusedLink = null;

function setPreview(source, alt) {
    window.clearTimeout(changeTimer);
    if (source === requestedSource && preview.classList.contains("is-visible")) return;

    requestedSource = source;
    preview.classList.remove("is-visible");
    changeTimer = window.setTimeout(() => {
        currentSource = source;
        preview.alt = alt;
        const showPreview = () => {
            if (requestedSource === source) preview.classList.add("is-visible");
        };
        preview.addEventListener("load", showPreview, { once: true });
        preview.addEventListener("error", showPreview, { once: true });
        preview.src = source;
        if (preview.complete) showPreview();
    }, 120);
}

function syncPreview() {
    const activeLink = hoveredLink || focusedLink;
    if (activeLink) {
        setPreview(activeLink.dataset.preview, activeLink.dataset.previewAlt);
    } else {
        setPreview(defaultPreview.source, defaultPreview.alt);
    }
}

previewLinks.forEach((link) => {
    link.addEventListener("pointerenter", () => {
        hoveredLink = link;
        syncPreview();
    });
    link.addEventListener("pointerleave", () => {
        if (hoveredLink === link) hoveredLink = null;
        syncPreview();
    });
    link.addEventListener("focus", () => {
        focusedLink = link;
        syncPreview();
    });
    link.addEventListener("blur", () => {
        if (focusedLink === link) focusedLink = null;
        syncPreview();
    });
});