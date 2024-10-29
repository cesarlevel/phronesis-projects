export default class Router {
    constructor() {
        this.appEl = null;
        this.navItemsEls = [];
        this.currentRoute = '/home';
        this.init().then(() => {
            console.log('Router initialization complete');
        });
    }

    static homeRouteRegex = new RegExp(/^\/home$|^\/$/);

    cleanRoute(route) {
        return route.replace('/', '');
    }

    async fetchHTML(url) {
        const response = await fetch(url);
        return response.text();
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

    async init() {
        this.navItemsEls = document.querySelectorAll('.nav-item');
        this.appEl = document.getElementById('app');

        this.navItemsEls.forEach((item) => {
            if (Router.homeRouteRegex.test(item.getAttribute('href'))) {
                item.classList.add('is-active');
            }
            this.bindNavItemEvents(item);
        });

        window.addEventListener('popstate', async (e) => {
            const route = e.state?.route;
            if (route) {
                this.updateNavItemStyles(route);
                await this.go(route, false);
                window.dispatchEvent(new CustomEvent('executemodule', { detail: { module: this.cleanRoute(route) } }));
            }
        });

        const initialRoute = this.checkValidRoute(window.location.pathname) ? window.location.pathname : '/';
        await this.go(initialRoute);
    }

    async go(route, addToHistory = true) {
        let template = null;
        if (route.includes('debriefs')) {
            template = await this.fetchHTML(`${window.location.origin}/debriefs/index.html`);
        } else {
            template = await this.fetchHTML(`${window.location.origin}/src/modules${Router.homeRouteRegex.test(route) ? '/home' : route}.html`);
        }
        this.appEl.innerHTML = template;

        if (addToHistory) {
            history.pushState({ route }, null, Router.homeRouteRegex.test(route) ? '/' : route);
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('executemodule', { detail: { module: this.cleanRoute(route) } }));
            }, 100);
        }
        this.updateNavItemStyles(route);
    }
}
