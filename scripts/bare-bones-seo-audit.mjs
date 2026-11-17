// Bare Bones SEO advisory output audit. No dependencies or build-blocking checks.
// Works with Astro dist/ and with plain public/ HTML sites.
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative, join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
const root = process.cwd();
const folder = process.argv[2] || (existsSync('dist') ? 'dist' : 'public');
const outputRoot = resolve(root, folder);
const reportDir = resolve(root, '.seo-reports');
const read = async path => readFile(path,'utf8').catch(()=> '');
const txt = s => String(s||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const tag = (html,re) => txt(html.match(re)?.[1] ?? '');
const attr = (html,name) => html.match(new RegExp('\\b'+name+'\\s*=\\s*["\\\']([^"\\\']*)["\\\']','i'))?.[1] ?? '';
const normalize = value => {
  let p = String(value || '/').split(/[?#]/)[0].replace(/\\/g,'/');
  p = ('/'+p.replace(/^\/+/, '')).replace(/\/index\.html$/,'/').replace(/\/+/g,'/');
  return p==='/' || p.endsWith('/') || /\.[a-z0-9]+$/i.test(p) ? p : p+'/';
};
const list = async dir => {
  const items = await readdir(dir,{withFileTypes:true}).catch(()=>[]);
  const groups = await Promise.all(items.map(x=>x.isDirectory()?list(join(dir,x.name)):[join(dir,x.name)]));
  return groups.flat();
};
const config = JSON.parse((await read('seo/search-exclusions.json')) || '{"defaults":{"index":true,"sitemap":true},"sections":{},"pages":{}}');
const policy = path => {
  let effective = {...config.defaults};
  for (const [pattern,settings] of Object.entries(config.sections||{}).filter(([p])=>p.endsWith('/*') && path.startsWith(normalize(p.slice(0,-1))) && path !== normalize(p.slice(0,-1))).sort((a,b)=>a[0].length-b[0].length)) effective={...effective,...settings};
  return {...effective,...(config.pages?.[path]||{})};
};
const files = (await list(outputRoot)).filter(p=>p.endsWith('.html'));
const sitemap = await read(join(outputRoot,'sitemap.xml'));
const xmlUrls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m=>normalize(new URL(m[1].replace(/&amp;/g,'&')).pathname));
const sitemapSet = new Set(xmlUrls);
const pages = [], external = [], warnings = [];
for (const file of files) {
  const rel = relative(outputRoot,file).replace(/\\/g,'/');
  const path = normalize(rel);
  if (path==='/404/' || path==='/404.html') continue;
  const html = await read(file);
  const titles=[...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  const canonicals=[...html.matchAll(/<link\b[^>]*rel\s*=\s*["']canonical["'][^>]*>/gi)].map(m=>attr(m[0],'href'));
  const desc=html.match(/<meta\b[^>]*name\s*=\s*["']description["'][^>]*>/i)?.[0] || '';
  const robots=html.match(/<meta\b[^>]*name\s*=\s*["']robots["'][^>]*>/i)?.[0] || '';
  const noindex=/\bnoindex\b/i.test(attr(robots,'content'));
  const robotsExpected = policy(path).index===false;
  const sitemapExpected = policy(path).sitemap!==false && !robotsExpected;
  const schemaBlocks=[...html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const b of schemaBlocks) {try{JSON.parse(b[1])}catch{warnings.push(path+': invalid JSON-LD')}}
  if(titles.length!==1)warnings.push(path+': expected one title, found '+titles.length);
  if(canonicals.length!==1)warnings.push(path+': expected one canonical, found '+canonicals.length);
  if(robotsExpected!==noindex)warnings.push(path+': noindex differs from exclusion policy');
  if(sitemap && (sitemapExpected!==sitemapSet.has(path)))warnings.push(path+': sitemap inclusion differs from policy');
  for(const m of html.matchAll(/<a\b[^>]*href\s*=\s*["'](https?:\/\/[^"']+)["']/gi))external.push({external_url:m[1],source_page:path});
  pages.push({url:path,h1:tag(html,/<h1\b[^>]*>([\s\S]*?)<\/h1>/i),title:tag(html,/<title\b[^>]*>([\s\S]*?)<\/title>/i),description:attr(desc,'content'),canonical:canonicals[0]||null,schemas:schemaBlocks.length,noindex,sitemap:sitemapSet.has(path)});
}
if(!sitemap)warnings.push('No generated sitemap.xml found (check output or hosting-specific sitemap)');
const seenCanonicals = new Map();
for(const p of pages){if(p.canonical){const existing=seenCanonicals.get(p.canonical);if(existing)warnings.push('Duplicate canonical: '+existing+' and '+p.url);else seenCanonicals.set(p.canonical,p.url)}}
const redirectPath = join(outputRoot,'_redirects');
const redirects = await read(redirectPath) || await read('public/_redirects');
const seen = new Set(),targets = new Map();
for(const line of redirects.split(/\r?\n/)){
  const match=line.trim().match(/^(\/\S+)\s+(\S+)\s+301(?:\s|$)/);
  if(!match)continue;
  const source=match[1], target=match[2];
  if(seen.has(source))warnings.push('Duplicate 301 source: '+source);
  seen.add(source);targets.set(source,target);
}
for(const [src,dest] of targets){if(dest.startsWith('/')){const norm=dest.split(/[?#]/)[0];if(src===norm||targets.get(norm)===src)warnings.push('Redirect loop: '+src);else if(targets.has(norm))warnings.push('Redirect chain: '+src+' → '+norm)}}
let known = [];
try{known=JSON.parse(await read('seo/known-urls.json'))}catch{}
if(Array.isArray(known)&&known.length){const now=new Set(pages.map(p=>p.url));for(const old of known.map(normalize)){if(!now.has(old))warnings.push('Previously published URL missing: '+old)}}
else warnings.push('Historical URL baseline not set; disappearance detection unverified');
await mkdir(reportDir,{recursive:true});
const csvValue=v=>'"'+String(v).replaceAll('"','""')+'"';
const distinct=[...new Map(external.map(x=>[x.external_url+'\t'+x.source_page,x])).values()];
await writeFile(join(reportDir,'external-links.csv'),'external_url,source_page\n'+distinct.map(x=>csvValue(x.external_url)+','+csvValue(x.source_page)).join('\n'));
await writeFile(join(reportDir,'seo-inventory.json'),JSON.stringify({generatedAt:new Date().toISOString(),source:folder,coverage:folder==='public'?'Static public HTML only; dynamic routes not audited':'Built HTML pages',pages,warnings},null,2)+'\n');
console.log('Bare Bones SEO advisory audit: '+pages.length+' HTML pages; '+warnings.length+' notices; '+distinct.length+' external links. Reports: .seo-reports/');
for(const w of warnings.slice(0,30))console.warn('SEO notice: '+w);
if(warnings.length>30)console.warn('... and '+(warnings.length-30)+' more notices in inventory report');
