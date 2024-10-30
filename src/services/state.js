export default class State {
    constructor() {
        this.websiteId = 'www.dc-games.com';
        this.organizationId = 'phronesis-dc-games';
        this.pAPIKey = 'pk_sandbox_KvdZ_dAGPjbBZvVGxKUnpOfqvABlIEbzWyngFw6';
        this.loaderEl = document.querySelector('.loader');
    }

    showLoader() {
        this.loaderEl.classList.add('is-active');
    }

    hideLoader() {
        this.loaderEl.classList.remove('is-active');
    }
}
