const CACHE='eloquncy-v1'
const ASSETS=['/','/index.html','/og.svg','/manifest.webmanifest']
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))
})
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))
})
self.addEventListener('fetch',e=>{
  const {request}=e
  if(request.method!=='GET') return
  const url=new URL(request.url)
  if(url.origin!==location.origin) return
  // network-first for HTML navigation, cache-first for static assets
  if(request.mode==='navigate'){
    e.respondWith(fetch(request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(request,cp));return r}).catch(()=>caches.match(request).then(r=>r||caches.match('/index.html'))))
    return
  }
  e.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(request,cp))}return r})))
})
