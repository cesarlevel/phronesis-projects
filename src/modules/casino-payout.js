let authorization = null;
let currency = 'USD';
export default async function casinoPayout() {
    authorization = await getToken(app.state.customerId);

    document
        .querySelector(".payout")
        .addEventListener("click", () => requestPayout(document.getElementById("amount").value));

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            await selectCurrency(button, button.textContent);
        });
    });
}

async function selectCurrency(button, _currency) {
    document.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('is-active');
    });

    button.classList.add('is-active');
    currency = _currency;

    document.getElementById("rebilly-instruments").style.display = "none";
    document.getElementById("payout-request").style.display = "block";
}

async function getPayoutRequest (amount) {
    const { fields: payoutRequest } = await app.api.payoutRequests.create({
        data: {
            websiteId: app.state.websiteId,
            customerId: app.state.customerId,
            currency,
            amount,
        },
    });

    return payoutRequest;
}

async function requestPayout(amount) {
    const payoutRequest = await getPayoutRequest(amount);

    document.getElementById("payout-request").style.display = "none";
    document.getElementById("rebilly-instruments").style.display = "block";
    document.getElementById("buttons").style.display = "none";

    console.log("Payout request created", payoutRequest);

    RebillyInstruments.mount({
        jwt: authorization,
        payout: {
            payoutRequestId: payoutRequest.id,
        },
        ...app.state.instrumentsBaseOptions,
    });
}

async function getToken(customerId) {
    const data = {
        mode: "passwordless",
        customerId,
    };

    const { fields: login } = await app.api.customerAuthentication.login({
        data,
    });

    const { fields: exchangeToken } =
        await app.api.customerAuthentication.exchangeToken({
            token: login.token,

            data: {
                acl: [
                    {
                        scope: {
                            organizationId: [app.state.organizationId],
                        },

                        permissions: [
                            "PostToken",
                            "StorefrontGetPaymentInstrumentCollection",
                            "StorefrontPostPaymentInstrument",
                            "StorefrontGetPaymentInstrument",
                            "StorefrontPatchPaymentInstrument",
                            "StorefrontGetAccount",
                            "StorefrontGetWebsite",
                            "StorefrontPostReadyToPay",
                            "StorefrontGetPayoutRequestCollection",
                            "StorefrontGetPayoutRequest",
                            "StorefrontPatchPayoutRequest",
                            "StorefrontPostReadyToPayout",
                        ],
                    },
                ],

                customClaims: {
                    websiteId: app.state.websiteId,
                },
            },
        });

    return exchangeToken.token;
};
