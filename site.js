// NEXTUP DRAG - official Windows installer and live signed-channel version display
const OFFICIAL_INSTALLER_URL = "https://github.com/olielmejor2013-spec/nextup-drag-beta-web/releases/download/nextup-drag-installer-v9-20261107/NEXTUP.DRAG.-.INSTALADOR.V9.exe";
const intro = document.getElementById('intro');
window.addEventListener('load', () => setTimeout(() => intro?.classList.add('done'), 650));
const statusNode = document.getElementById('update-status');

// Use a stable, publicly published installer URL; do not read the legacy installer URL.
function configureDownloadLinks() {
  document.querySelectorAll('.nav-download, .hero-actions .button-primary, #release-download, .big-download').forEach(a => {
    a.href = OFFICIAL_INSTALLER_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.removeAttribute('download');
  });
}
configureDownloadLinks();

// The current V5 game channel is updates/v2.json. Legacy latest.json is left unchanged
// because older clients may depend on its original format and signature.
fetch('updates/v2.json?bust=' + Date.now(), {cache: 'no-store'})
  .then(r => { if (!r.ok) throw Error('V2 manifest HTTP ' + r.status); return r.json(); })
  .then(data => {
    const p = data.payload || {};
    const version = String(p.version || '0.5.2 Beta');
    const build = String(p.build || '');
    const compactVersion = version.replace(/\s*Beta\s*$/i, '');
    const versionNode = document.getElementById('release-version');
    if (versionNode) versionNode.textContent = compactVersion;
    const titleNode = document.getElementById('release-title');
    if (titleNode) titleNode.textContent = 'NEXTUP DRAG ' + version;
    const dateNode = document.getElementById('release-date');
    if (dateNode) dateNode.textContent = build ? 'COMPILACIÓN ' + build : 'ÚLTIMA BETA DISPONIBLE';
    const notes = document.getElementById('release-notes');
    if (notes && Array.isArray(p.notes)) notes.replaceChildren(...p.notes.map(t => {
      const li = document.createElement('li'); li.textContent = String(t); return li;
    }));
    if (statusNode) statusNode.textContent = 'VERSIÓN MÁS RECIENTE · ' + version.toUpperCase();
    const heroVersion = document.querySelector('.hero-meta span b');
    if (heroVersion) heroVersion.textContent = compactVersion;
  })
  .catch(() => {
    if (statusNode) statusNode.textContent = 'BETA 0.5.2 · VERSIÓN PUBLICADA';
  });

// Preserve multiplayer endpoint from the existing public status file, never its installer.
fetch('updates/latest.json?bust=' + Date.now(), {cache: 'no-store'})
  .then(r => { if (!r.ok) throw Error('legacy info'); return r.json(); })
  .then(data => {
    const endpoint = document.getElementById('endpoint');
    if (endpoint && data.multiplayer_endpoint) endpoint.textContent = data.multiplayer_endpoint;
  }).catch(() => {});

document.getElementById('copy-endpoint')?.addEventListener('click', async e => {
  const button = e.currentTarget;
  const original = button.innerHTML;
  try {
    await navigator.clipboard.writeText(document.getElementById('endpoint').textContent);
    button.innerHTML = 'DIRECCIÓN COPIADA <span>✓</span>';
  } catch {
    button.textContent = 'COPIA LA DIRECCIÓN DEL SERVIDOR';
  }
  setTimeout(() => button.innerHTML = original, 2200);
});
