import { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { resolveAssetUrl } from '../../../lib/api/client';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILES = 8;
const MAX_SIZE = 8 * 1024 * 1024;

// Multi-file picker with preview thumbnails, wired to addListingImages().
// Existing images (edit mode) render read-only — the backend has no
// delete-image endpoint, so there's no remove control for them.
export default function ImagePicker({ existingImages = [], files, onFilesChange }) {
  const [previews, setPreviews] = useState([]);
  const [pickError, setPickError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [files]);

  function handlePick(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    setPickError('');

    const accepted = [];
    for (const file of picked) {
      if (!ACCEPTED.includes(file.type)) {
        setPickError(`${file.name} isn't a supported image type (PNG, JPEG, WEBP only).`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setPickError(`${file.name} is larger than 8MB.`);
        continue;
      }
      accepted.push(file);
    }

    const total = existingImages.length + files.length + accepted.length;
    if (total > MAX_FILES) {
      setPickError(`You can have at most ${MAX_FILES} photos per listing.`);
      const room = Math.max(0, MAX_FILES - existingImages.length - files.length);
      onFilesChange([...files, ...accepted.slice(0, room)]);
      return;
    }
    onFilesChange([...files, ...accepted]);
  }

  function removeFile(index) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
        {existingImages.map((img, i) => (
          <div key={i} style={{
            width: 72, height: 72, borderRadius: 10, backgroundImage: `url(${resolveAssetUrl(img)})`,
            backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border)',
          }} />
        ))}
        {previews.map((url, i) => (
          <div key={url} style={{ position: 'relative', width: 72, height: 72 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 10, backgroundImage: `url(${url})`,
              backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border)',
            }} />
            <button type="button" onClick={() => removeFile(i)} style={{
              position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%',
              background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}><X size={12} /></button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()} style={{
          width: 72, height: 72, borderRadius: 10, border: '1px dashed var(--border)',
          background: 'var(--bg2)', color: 'var(--text3)', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <Upload size={16} />
          <span style={{ fontSize: 10 }}>Add photo</span>
        </button>
      </div>
      <input
        ref={inputRef} type="file" multiple accept={ACCEPTED.join(',')}
        onChange={handlePick} style={{ display: 'none' }}
      />
      {pickError && <div style={{ color: 'var(--red)', fontSize: 12.5 }}>{pickError}</div>}
    </div>
  );
}
