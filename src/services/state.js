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
                colorPrimary: '#646cff', // Brand color
                colorText: '#646cff', // Text color
                colorBackground: '#030c25',
                colorDanger: '#F9740A',
                buttonColorText: '#646cff',
            },
            css: `
                .rebilly-instruments-button {
                    color: #030c25;
                }
                .rebilly-instruments-form-field-label {
                    color: #646cff;
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
