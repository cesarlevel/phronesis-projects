export default class Router {
    constructor(routes = {}) {
        this.routes = routes;
        this.appEl = null;
        this.navItemsEls = [];
        this.currentRoute = '/home';
        this.init();
    }

    static homeRouteRegex = new RegExp(/^\/home$|^\/$/);

    cleanRoute(route) {
        return route.replace('/', '');
    }

    updateNavItemStyles(route) {
        this.navItemsEls.forEach((item) => {
            item.classList.remove('is-active');
            if (item.getAttribute('href') === route || (item.getAttribute('href') === '/home' && route === '/')) {
                item.classList.add('is-active');
            }
        });
    }

    checkValidRoute(route) {
        const validRoutes = [...this.navItemsEls].map(item => item.getAttribute('href'));
        return validRoutes.includes(route);
    }

    bindNavItemEvents(item) {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const route = e.target.getAttribute('href');
            this.updateNavItemStyles(route);
            this.go(route);
        });
    }

    init() {
        this.navItemsEls = document.querySelectorAll('.nav-item');
        this.appEl = document.getElementById('app');

        this.navItemsEls.forEach((item) => {
            if (Router.homeRouteRegex.test(item.getAttribute('href'))) {
                item.classList.add('is-active');
            }
            this.bindNavItemEvents(item);
        });

        window.addEventListener('popstate', (e) => {
            const route = e.state?.route;
            if (route) {
                this.updateNavItemStyles(route);
                this.go(route, false);
                window.dispatchEvent(new CustomEvent('executemodule', { detail: { module: this.cleanRoute(route) } }));
            }
        });

        const initialRoute = this.checkValidRoute(window.location.pathname) ? window.location.pathname : '/';
        this.go(initialRoute);
    }

    go(route, addToHistory = true) {
        this.appEl.innerHTML = this.routes[Router.homeRouteRegex.test(route) ? '/home' : route];

        if (addToHistory) {
            history.pushState({ route }, null, Router.homeRouteRegex.test(route) ? '/' : route);
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('executemodule', { detail: { module: this.cleanRoute(route) } }));
            }, 100);
        }
        this.updateNavItemStyles(route);
    }
}
