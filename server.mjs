import {createServer} from 'node:http';
import {createReadStream,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(fileURLToPath(new URL('./dist/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.ico':'image/x-icon','.woff2':'font/woff2'};
const port=Number(process.env.PORT)||8080;
createServer((req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{Allow:'GET, HEAD'}).end();return}
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 if(pathname.includes('\\')||pathname.split('/').includes('..')){res.writeHead(400).end();return}
 const requested=resolve(root,'.'+pathname);
 if(requested!==root&&!requested.startsWith(root+sep)){res.writeHead(403).end();return}
 let target=requested;
 try{if(statSync(target).isDirectory())target=resolve(target,'index.html');else if(!statSync(target).isFile())throw Error('not file')}
 catch{
  // HTML routes are served by the client router. Missing assets and API routes stay 404.
  if(pathname.startsWith('/api/')||extname(pathname)){res.writeHead(404).end();return}
  target=resolve(root,'index.html');
 }
 const info=statSync(target),headers={'Content-Type':mime[extname(target)]||'application/octet-stream','Cache-Control':extname(target)==='.html'?'no-cache':'public, max-age=3600','Accept-Ranges':'bytes'};
 let start=0,end=info.size-1,status=200;
 if(req.headers.range){const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!match){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return}start=match[1]?Number(match[1]):Math.max(0,info.size-Number(match[2]||0));end=match[1]&&match[2]?Number(match[2]):end;if(start>end||end>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return}status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`}
 headers['Content-Length']=end-start+1;res.writeHead(status,headers);if(req.method==='HEAD'){res.end();return}createReadStream(target,{start,end}).pipe(res);
}).listen(port,'0.0.0.0',()=>process.stdout.write(`Bubbles Win: porta ${port}\n`));
