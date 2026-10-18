import React, { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { MAX_IMAGES_PER_ITEM, useImageUrl } from '../state/images';
import { compressImage, splitLinks } from '../../utils/images';

/** Foto em tela cheia; toque fora ou no X para fechar */
const PhotoViewer: React.FC<{ src: string; onClose: () => void }> = ({ src, onClose }) => (
  <div className="absolute inset-0 z-[70] bg-black/90 flex items-center justify-center p-3 animate-fadeIn" role="dialog" aria-modal="true" aria-label="Foto" onClick={onClose}>
    <img src={src} alt="Foto anexada" className="max-w-full max-h-full object-contain rounded-lg" />
    <button onClick={onClose} aria-label="Fechar foto" className="absolute top-3 right-3 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer">
      <X className="w-5 h-5" />
    </button>
  </div>
);

const Thumb: React.FC<{ src: string | null; onOpen: () => void; onRemove?: () => void }> = ({ src, onOpen, onRemove }) => (
  <div className="relative w-16 h-16 shrink-0">
    <button onClick={onOpen} className="w-full h-full rounded-lg overflow-hidden bg-surface-2 border border-line cursor-pointer" aria-label="Ver foto">
      {src && <img src={src} alt="" className="w-full h-full object-cover" />}
    </button>
    {onRemove && (
      <button onClick={onRemove} aria-label="Tirar foto" className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-ink text-canvas flex items-center justify-center cursor-pointer">
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

const StoredThumb: React.FC<{ id: string; onRemove?: () => void; onOpen: (src: string) => void }> = ({ id, onRemove, onOpen }) => {
  const src = useImageUrl(id);
  return <Thumb src={src} onOpen={() => src && onOpen(src)} onRemove={onRemove} />;
};

/** Fotos já guardadas (por id) */
export const PhotoStrip: React.FC<{ ids?: string[]; onRemove?: (id: string) => void }> = ({ ids, onRemove }) => {
  const [open, setOpen] = useState<string | null>(null);
  if (!ids?.length) return null;
  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {ids.map((id) => (
          <StoredThumb key={id} id={id} onOpen={setOpen} onRemove={onRemove ? () => onRemove(id) : undefined} />
        ))}
      </div>
      {open && <PhotoViewer src={open} onClose={() => setOpen(null)} />}
    </>
  );
};

/** Fotos ainda não guardadas (rascunho de uma anotação nova) */
export const PendingPhotos: React.FC<{ blobs: Blob[]; onRemove: (i: number) => void }> = ({ blobs, onRemove }) => {
  const [urls, setUrls] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const u = blobs.map((b) => URL.createObjectURL(b));
    setUrls(u);
    return () => u.forEach((x) => URL.revokeObjectURL(x));
  }, [blobs]);
  if (!blobs.length) return null;
  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {urls.map((src, i) => (
          <Thumb key={src} src={src} onOpen={() => setOpen(src)} onRemove={() => onRemove(i)} />
        ))}
      </div>
      {open && <PhotoViewer src={open} onClose={() => setOpen(null)} />}
    </>
  );
};

/**
 * Botão de anexar foto: abre a galeria ou a câmera, reduz cada foto e devolve os arquivos prontos.
 * Vídeos não: ficam como link no texto (decisão do dono, etapa 31).
 */
export const AddPhotoButton: React.FC<{ count: number; onPick: (blobs: Blob[]) => void | Promise<void> }> = ({ count, onPick }) => {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const left = MAX_IMAGES_PER_ITEM - count;
  if (left <= 0) return <span className="text-xs text-muted">Até {MAX_IMAGES_PER_ITEM} fotos por item.</span>;
  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        aria-label="Escolher fotos"
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []).slice(0, left);
          e.target.value = '';
          if (!files.length) return;
          setBusy(true);
          setError('');
          const out: Blob[] = [];
          for (const f of files) {
            try {
              out.push(await compressImage(f));
            } catch {
              setError('Uma das fotos não pôde ser aberta. Tente outra.');
            }
          }
          if (out.length) await onPick(out);
          setBusy(false);
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className="min-h-9 px-2 inline-flex items-center gap-1 text-xs font-semibold text-primary cursor-pointer disabled:opacity-50"
      >
        <Camera className="w-3.5 h-3.5" /> {busy ? 'Preparando…' : 'Foto'}
      </button>
      {error && <span className="text-xs text-gold-ink">{error}</span>}
    </>
  );
};

/** Texto com links clicáveis (vídeos do YouTube, Drive etc. ficam como link) */
export const LinkedText: React.FC<{ text: string }> = ({ text }) => (
  <>
    {splitLinks(text).map((p, i) =>
      p.href ? (
        <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
          {p.text}
        </a>
      ) : (
        <React.Fragment key={i}>{p.text}</React.Fragment>
      ),
    )}
  </>
);
