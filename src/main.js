import Router from './services/router.js';
import { debriefs } from '../debriefs/debriefs.js';
const modules = import.meta.glob('./modules/*.js');

// console.log(import.meta.env.VITE_API_KEY);
async function init() {
  window.app = {};
  app.router = new Router();
  app.debriefs = debriefs;
  
  for await (const path of Object.keys(modules)) {
    const mod = await modules[path]();
    app = {
      ...app,
      [path.replace(/\.\/modules\/|(\.js)/gi, '')]: mod.default,
    }
  }

  window.addEventListener('executemodule', async (e) => {
    if (app?.[e.detail.module]) {
      await app[e.detail.module]();
    }
  });
}

window.addEventListener('DOMContentLoaded', init);