import { depositPermissions } from '../data/deposit-permissions';

export default async function casinoDeposit() {
    const localState = {
        currency: 'USD',
        depositRequestId: null,
        token: null,
        strategies: {
            USD: 'dep_str_01JBEZ1MZTS6SKB8F1VAAPPX3Q',
            CAD: 'dep_str_01JBEZ06C753GDAS1XSR24WT3N',
        },
        buttons: document.querySelectorAll('button'),
        loaderEl: document.querySelector('.instruments-loader'),
    }

    async function selectCurrency(button, currency) {
        localState.buttons.forEach(btn => {
            btn.classList.remove('is-active');
        });
    
        button.classList.add('is-active');
        localState.currency = currency;
        localState.depositRequestId = await getDepositRequestId();
    
        RebillyInstruments.update({
            deposit: {
                depositRequestId: localState.depositRequestId,
            },
        });
    }

    async function getDepositRequestId() {
        const requestDepositData = {
            websiteId: app.state.websiteId,
            customerId: app.state.customerId,
            strategyId: localState.strategies[localState.currency],
            currency: localState.currency
        };
    
        const {fields: depositFields} = await app.api.depositRequests.create({
            data: requestDepositData,
        });
    
        return depositFields.id;
    }

    async function initRequest() {
        const response = {};
        const data = {
            mode: "passwordless",
            customerId: app.state.customerId,
        };
        const {fields: login} = await app.api.customerAuthentication.login({
            data,
        });
        const {fields: exchangeToken} =
            await app.api.customerAuthentication.exchangeToken({
                token: login.token,
                data: {
                    acl: [
                        {
                            scope: {
                                organizationId: app.state.organizationId,
                            },
                            permissions: depositPermissions,
                        },
                    ],
                    customClaims: {
                        websiteId: app.state.websiteId,
                    },
                },
            });
        
        response.token = exchangeToken.token;
        response.depositRequestId = await getDepositRequestId();
    
        localState.token = response.token;
        localState.depositRequestId = response.depositRequestId;
    }

    async function initInstruments() {
        let options = {
            ...app.state.instrumentsBaseOptions,
            deposit: {
                depositRequestId: localState.depositRequestId,
            },
            jwt: localState.token,
        };
    
        RebillyInstruments.mount(options);
    }

    function toggleLoader(show = true) {
        localState.loaderEl.classList.toggle('is-active', show);
    }

    localState.buttons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            await selectCurrency(button, button.textContent);
        });
    });

    toggleLoader(true);
    await initRequest();
    await initInstruments();
    toggleLoader(false);
}