export default class State {
    constructor() {
        this.websiteId = 'www.dc-games.com';
        this.organizationId = 'phronesis-dc-games';
        this.pAPIKey = 'pk_sandbox_KvdZ_dAGPjbBZvVGxKUnpOfqvABlIEbzWyngFw6';
        this.loaderEl = document.querySelector('.loader');
        this.customerId = 'cus_01JBEYJ3WQ4MYV9CZCQ9H6GARN';
        this.instrumentsBaseOptions = {
            apiMode: 'sandbox',
            theme: {
                colorPrimary: '#64ff8d', // Brand color
                colorText: '#64ff8d', // Text color
                colorBackground: '#0c2503',
                colorDanger: '#F9740A',
                buttonColorText: '#64ff8d',
            },
            css: `
                .rebilly-instruments-button {
                    color: #030c25;
                }
                .rebilly-instruments-form-field-label {
                    color: #64ff8d;
                }
            `,
        }
    }

    showLoader() {
        this.loaderEl.classList.add('is-active');
    }

    hideLoader() {
        this.loaderEl.classList.remove('is-active');
    }
}
