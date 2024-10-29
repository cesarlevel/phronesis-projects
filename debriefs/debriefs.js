
import markdown from '@wcj/markdown-to-html';
const modules = import.meta.glob('./*.md', {query: '?raw'});

export async function debriefs() {
    const debriefsEl = document.querySelector('.debriefs-items');
    const debriefsApp = document.querySelector('#debriefs-app');
    const debriefsItems = {};

    for await (const [path] of Object.entries(modules)) {
        const mod = await modules[path]();
        debriefsItems[path] = mod?.default;
    }

    debriefsEl.innerHTML = Object.keys(debriefsItems).map(path => `
        <li>
            <a class="debriefs-item" data-md="${path}">${path.replace(/\.\/|\.md/gi, '')}</a>
        </li>`).join('');

    const debriefsItemEls = document.querySelectorAll('.debriefs-item');

    debriefsItemEls.forEach(el => {
        el.addEventListener('click', (e) => {
            debriefsItemEls.forEach(el => el.classList.remove('is-active'));
            e.preventDefault();
            const str = debriefsItems[el.dataset.md];
            debriefsApp.innerHTML = markdown(str);
            el.classList.add('is-active');
        });
    });
}