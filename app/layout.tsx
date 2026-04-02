import { WebpackChunkRecovery } from '@/components/WebpackChunkRecovery';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

/** Runs before React; layout chunk timeout/404 would otherwise skip WebpackChunkRecovery. */
const CHUNK_RELOAD_SCRIPT = `
(function(){
  var k='pk_chunk_reload';
  function allowReload(){
    if(sessionStorage.getItem(k)) return false;
    sessionStorage.setItem(k,'1');
    setTimeout(function(){ try{ sessionStorage.removeItem(k);}catch(e){} }, 15000);
    return true;
  }
  window.addEventListener('error', function(e){
    var t = e && e.target;
    if (t && t.tagName === 'SCRIPT' && t.src && t.src.indexOf('/_next/static/') !== -1) {
      if (allowReload()) window.location.reload();
      return;
    }
    var m = (e && e.message) ? String(e.message) : '';
    if (m.indexOf('ChunkLoadError') !== -1 || /Loading chunk .+ failed/.test(m) || /timeout:\\s*http/.test(m)) {
      if (allowReload()) window.location.reload();
    }
  }, true);
}());
`;

export default function RootLayout({ children }: Props) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: CHUNK_RELOAD_SCRIPT }}
      />
      <WebpackChunkRecovery />
      {children}
    </>
  );
}
