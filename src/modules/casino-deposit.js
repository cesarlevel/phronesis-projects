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
        mountElement: document.querySelector('.deposit-wrapper'),
        cashierToken: null,
    }

    async function selectCurrency(button, currency) {
        localState.buttons.forEach(btn => {
            btn.classList.remove('is-active');
        });
    
        button.classList.add('is-active');
        localState.currency = currency;
        await getDepositRequestToken();
    
        await initDeposit();
    }

    async function getDepositRequestToken() {
        const requestDepositData = {
            websiteId: app.state.websiteId,
            customerId: app.state.customerId,
            currency: localState.currency
        };
        const {fields: depositFields} = await app.api.cashiers.create({
            data: requestDepositData,
        });
    
        localState.cashierToken = depositFields.cashierToken;
    }

    async function initDeposit() {
        await getDepositRequestToken();

        if (window.RebillyCashier) {
            RebillyCashier.renderDeposit({
                mountElement: localState.mountElement,
                cashierToken: localState.cashierToken,
            });
        } else {
            console.error('RebillyCashier library not loaded');
        }
    }

    localState.buttons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            await selectCurrency(button, button.textContent);
        });
    });

    await initDeposit();
}