const intro=document.getElementById('intro');window.addEventListener('load',()=>setTimeout(()=>intro?.classList.add('done'),650));
const statusNode=document.getElementById('update-status');
fetch('updates/latest.json?'+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('manifest');return r.json()}).then(data=>{
  const version=String(data.version||'0.4.7');
  document.getElementById('release-version').textContent=version;
  document.getElementById('release-date').textContent=data.date||'ÚLTIMA BETA DISPONIBLE';
  document.getElementById('endpoint').textContent=data.multiplayer_endpoint||'malls-unplanned.tun.ply.gg:37447';
  const notes=document.getElementById('release-notes');
  if(Array.isArray(data.notes)){notes.replaceChildren(...data.notes.map(text=>{const li=document.createElement('li');li.textContent=text;return li}))}
  if(data.installer){document.querySelectorAll('a[href*="_Instalador.exe"]').forEach(a=>a.href=data.installer)}
  statusNode.textContent='VERSIÓN MÁS RECIENTE · '+version.toUpperCase();
}).catch(()=>{statusNode.textContent='BETA 0.4.7 · NO SE PUDO VERIFICAR LA VERSIÓN'});
document.getElementById('copy-endpoint')?.addEventListener('click',async e=>{const button=e.currentTarget;try{await navigator.clipboard.writeText(document.getElementById('endpoint').textContent);button.innerHTML='DIRECCIÓN COPIADA <span>✓</span>'}catch{button.innerHTML='COPIA: malls-unplanned.tun.ply.gg:37447 <span>↗</span>'}setTimeout(()=>button.innerHTML='COPIAR DIRECCIÓN <span>▣</span>',2200)});
