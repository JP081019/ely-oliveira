const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (id, ...args) { return originalResolve.call(this, id.startsWith('@/') ? path.join(process.cwd(), id.slice(2)) : id, ...args); };
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, file);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { octoberRoseCampaign } = require('../lib/campaigns.ts');
const { OctoberRoseBanner, OctoberRoseCampaign } = require('../components/october-rose.tsx');
const originalEnabled = octoberRoseCampaign.enabled;
try {
  for (const enabled of [true, false]) {
    octoberRoseCampaign.enabled = enabled;
    const banner = renderToStaticMarkup(React.createElement(OctoberRoseBanner));
    const section = renderToStaticMarkup(React.createElement(OctoberRoseCampaign));
    if (enabled) { assert(banner.includes('#outubro-rosa')); assert(section.includes('600,00')); }
    else { assert.equal(banner, ''); assert.equal(section, ''); }
    console.log(`PASS enabled=${enabled}: real banner and section render`);
  }
} finally { octoberRoseCampaign.enabled = originalEnabled; Module._resolveFilename = originalResolve; }
