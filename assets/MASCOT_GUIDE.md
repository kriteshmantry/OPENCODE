# BYTE – OpenCode NITR 3D Mascot

## 1. Design Brief

**Concept:** "BYTE", a friendly terminal-bot. It keeps the silhouette of your pencil sketch (boxy CRT-style head, dark rounded visor, two oval eyes, capsule module on the side, chunky chest plate) and re-skins it for the OpenCode hacker-terminal look.

**Explicitly excluded:** no flag, no flagpole, no antenna, no held accessories. Both hands are empty and relaxed. No logos, text or third-party branding on the model.

**Personality:** approachable and curious, professional. Soft rounded boxes and big eyes keep it friendly; the graphite and neon palette keeps it on-brand for a cybersecurity club.

**Style:** stylized low-poly, soft-edged hard-surface. Rounded boxes, capsules and spheres only, with no fine detail that would need textures.

| Part | Spec |
|---|---|
| Head | Rounded box 1.6 × 1.15 × 1.1, graphite `#16211c` |
| Visor | Recessed rounded panel, near-black `#030806`, glossy |
| Eyes | Two flattened ovals, neon green `#00FF41`, unlit (always glow) |
| Side modules | Rounded capsule each side, green emissive slit |
| Torso | Rounded box with lighter chest plate `#22322b` and a thin green LED strip (a nod to the prompt/terminal UI) |
| Accent | One tiny cyan `#00D4FF` status LED, matching the `>` prompt cyan on the site |
| Arms | Capsule limbs, sphere shoulders, cube hands, hanging relaxed |

**Palette:** `#16211c` shell · `#22322b` plates · `#030806` visor · `#00FF41` glow · `#00D4FF` accent (sparingly).

**Lighting match:** dark transparent canvas background so the site's grid and particles show through, a green rim light from behind-left, and a cool-green hemisphere fill.

**Idle animation:** floating bob and slight body yaw, head follows the cursor (damped), arms sway in opposite phase, randomized blink every 2–5 s. Honors `prefers-reduced-motion`.

**Performance budget:** about 15 meshes, ~3–4k triangles, 6 shared materials, **no textures**, no HDR/environment map. The render loop pauses when the canvas is off-screen, and pixel ratio is capped at 1.75.

## 2. Implementation

See `OpenCodeMascot.jsx`.

```bash
npm i three @react-three/fiber @react-three/drei
```

```jsx
import { MascotCanvas } from './OpenCodeMascot'

export default function Hero() {
  return (
    <section style={{ position: 'relative' }}>
      {/* ...your OPENCODE headline... */}
      <MascotCanvas style={{ position: 'absolute', right: 0, bottom: 0, width: 360, height: 420 }} />
    </section>
  )
}
```

Next.js: the component uses browser APIs, so wrap it with `dynamic(() => import('./OpenCodeMascot'), { ssr: false })`.

## 3. Integration Guide

**Option A – procedural (default, nothing to host).** The model is built in code, so there is no file to download. This is the lightest option.

**Option B – GLB file (if you want to hand the model to an artist, or edit it in Blender).**

1. Export once: render `<ProceduralByte />` in dev, grab its root group, and call `exportGLB(group)`. This downloads `opencode-byte.glb`. Name the nodes `Head`, `EyeL`, `EyeR`, `ArmL`, `ArmR` (in code via `name="Head"` props, or in Blender) so the idle animation can find them.
2. Optimize it (target under about 150 KB):
   ```bash
   npx @gltf-transform/cli optimize opencode-byte.glb public/models/opencode-byte.glb \
     --compress meshopt --texture-compress webp
   ```
3. Host it as a static file at `public/models/opencode-byte.glb` (Vite/Next/CRA) or on any CDN with CORS and gzip/brotli enabled. Set long cache headers: `Cache-Control: public, max-age=31536000, immutable`.
4. Use it with `<MascotCanvas useGLB />`. If you compressed with meshopt, register the decoder: `useGLTF.setDecoderPath(...)` for Draco, or `useGLTF(url, true, true, (l) => l.setMeshoptDecoder(MeshoptDecoder))`.
5. Preload it for faster first paint: `useGLTF.preload('/models/opencode-byte.glb')`.

**Tips:** lazy-load the mascot below the fold (`React.lazy`), give the canvas a fixed height to avoid layout shift, and hide it on very small screens if you need to save battery.
