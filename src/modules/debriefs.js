
const templates = import.meta.glob('../debriefs/*.html', {query: '?raw'});

export default async function debriefs() {
    // Show global loader while importing HTML templates
    app.state.showLoader();
    
    const debriefsEl = document.querySelector('.debriefs-items');
    const debriefsApp = document.querySelector('#debriefs-app');
    const debriefsItems = {};

    for await (const [path, mod] of Object.entries(templates)) {
        const {default: template} = await mod();
        debriefsItems[path.replace(/.*\/|(\.html)/gi, '')] = template;
    }

    debriefsEl.innerHTML = Object.keys(debriefsItems).map(path => `
        <li>
            <a class="debriefs-item" data-template="${path}">${path.replace(/\.\//gi, '')}</a>
        </li>`).join('');

    const debriefsItemEls = document.querySelectorAll('.debriefs-item');

    debriefsItemEls.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            debriefsItemEls.forEach(el => el.classList.remove('is-active'));
            debriefsApp.innerHTML = debriefsItems[el.dataset.template];
            el.classList.add('is-active');
        });
    });

    // Hide global loader after templates are loaded and DOM is updated
    app.state.hideLoader();
}