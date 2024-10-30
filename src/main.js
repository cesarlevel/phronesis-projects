import Router from './services/router.js';
import State from './services/state.js';
const modules = import.meta.glob('./modules/*.js');
const templates = import.meta.glob('./modules/*.html', {query: '?raw'});

// console.log(import.meta.env.VITE_API_KEY);
async function init() {
  window.app = {};
  const routes = {};

  for await (const [path, mod] of Object.entries(templates)) {
    const {default: template} = await mod();
    routes[path.replace(/\.\/modules|(\.html)/gi, '')] = template;
  }

  for await (const path of Object.keys(modules)) {
    const mod = await modules[path]();
    app = {
      ...app,
      modules: {
        [path.replace(/\.\/modules\/|(\.js)/gi, '')]: mod.default,
        ...app.modules,
      }
    }
  }

  app.router = new Router(routes);
  app.state = new State();

  window.addEventListener('executemodule', async (e) => {
    if (app?.modules?.[e.detail.module]) {
      await app.modules[e.detail.module]();
    }
  });
}

window.addEventListener('DOMContentLoaded', init);