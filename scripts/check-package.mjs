import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const pnpm = process.env.npm_execpath;
assert(pnpm, 'Run through pnpm package:check');
const staging = join(root, '.package-check');
const consumer = join(staging, `consumer-${Date.now()}`);
await mkdir(consumer, { recursive: true });
await writeFile(join(consumer, 'pnpm-workspace.yaml'), 'packages:\n  - .\n');
const run = (args, cwd = consumer) =>
  execFileSync(process.execPath, [pnpm, ...args], { cwd, stdio: 'inherit' });
run(['pack', '--out', join(consumer, 'ui.tgz')], root);
await writeFile(
  join(consumer, 'package.json'),
  JSON.stringify({
    name: 'ui-package-consumer-check',
    private: true,
    type: 'module',
    dependencies: {
      [manifest.name]: 'file:./ui.tgz',
      react: manifest.devDependencies.react,
      'react-dom': manifest.devDependencies['react-dom'],
    },
    devDependencies: Object.fromEntries(
      ['typescript', 'vite', '@types/react', '@types/react-dom'].map((name) => [
        name,
        manifest.devDependencies[name],
      ]),
    ),
  }),
);
await writeFile(
  join(consumer, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      jsx: 'react-jsx',
      strict: true,
      skipLibCheck: true,
      noEmit: true,
    },
    include: ['main.tsx'],
  }),
);
await writeFile(
  join(consumer, 'index.html'),
  '<html lang="en"><head><title>Package consumer</title></head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>',
);
await writeFile(
  join(consumer, 'main.tsx'),
  `
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Input, Select, Modal, ThemeProvider, type ButtonProps } from '@doctor-cyclone/ui';
import '@doctor-cyclone/ui/styles.css';
// @ts-expect-error Internal paths must not be importable by consumers.
import type { ModalProps } from '@doctor-cyclone/ui/src/components/Modal';
const buttonProps: ButtonProps = { children: 'Open packaged dialog' };
function App() {
  const [open, setOpen] = useState(false);
  return <ThemeProvider defaultTheme="dark"><Button {...buttonProps} onClick={() => setOpen(true)} />
    <Input label="Packaged input" hint="Declarations and CSS loaded" />
    <Select label="Packaged select" options={[{ value: 'ok', label: 'Installed' }]} />
    <Modal open={open} onClose={() => setOpen(false)} title="Packaged modal"><Button onClick={() => setOpen(false)}>Close</Button></Modal>
  </ThemeProvider>;
}
createRoot(document.getElementById('root')!).render(<App />);
`,
);
run(['install', '--ignore-scripts']);
run(['exec', 'tsc']);
run(['exec', 'vite', 'build']);
const requireFromConsumer = createRequire(join(consumer, 'package.json'));
const entry = join(
  dirname(requireFromConsumer.resolve(`${manifest.name}/styles.css`)),
  'index.js',
);
const source = await readFile(entry, 'utf8');
assert.match(source, /from\s*["']react["']/);
assert.match(source, /from\s*["']react-dom["']/);
assert.throws(
  () => requireFromConsumer.resolve(`${manifest.name}/src/index.ts`),
  { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' },
);
const assets = join(consumer, 'dist', 'assets');
const cssFiles = (await readdir(assets)).filter((name) =>
  name.endsWith('.css'),
);
assert(cssFiles.length > 0, 'Consumer must include the library CSS');
const css = (
  await Promise.all(
    cssFiles.map((name) => readFile(join(assets, name), 'utf8')),
  )
).join('\n');
assert.match(css, /--color-accent/);
assert.match(css, /data-theme/);
// SSR-load the package entry: every public runtime export must be present.
const exports = await import(pathToFileURL(entry).href);
assert.equal(exports.libraryVersion, manifest.version);
for (const name of [
  'Button',
  'Input',
  'Select',
  'Modal',
  'Checkbox',
  'Radio',
  'Switch',
  'Dropdown',
  'Tooltip',
  'Tabs',
  'ToastProvider',
  'toast',
  'ThemeProvider',
  'useTheme',
]) {
  assert(name in exports, `Missing public export: ${name}`);
}
console.log(
  'Packed tarball: installation, strict types, ESM exports, CSS and consumer build passed.',
);
