(function () {
    const path = window.location.pathname;
    document.querySelectorAll<HTMLAnchorElement>('nav a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (!href) { return; }
        const pageMatch = path.endsWith('/' + href);
        const homeMatch = href === 'index.html' && (path === '/' || path.endsWith('/'));
        if (pageMatch || homeMatch) {
            link.classList.add('active');
        }
    });
}());
