import Router from './services/router.js';
import State from './services/state.js';
const modules = import.meta.glob('./modules/*.js');
const templates = import.meta.glob('./modules/*.html', {query: '?raw'});
import RebillyAPI from "rebilly-js-sdk";

async function init() {
  window.app = {};
  app.api = RebillyAPI({
    apiKey: import.meta.env.VITE_API_KEY,
    organizationId: this.organizationId,
    sandbox: true,
  });
  const routes = {};

  app.state = new State();
  app.state.showLoader();

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

  window.addEventListener('executemodule', async (e) => {
    if (app?.modules?.[e.detail.module]) {
      await app.modules[e.detail.module]();
    }
  });

  app.state.hideLoader();
}

window.addEventListener('DOMContentLoaded', init);