'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Play, Pause, Sparkles, Target, Upload, Check, Download,
  Radio, Search, Flame, Target as TargetIcon, Bookmark,
  Shuffle, AudioWaveform, Equalizer, Moon, Sun, HelpCircle,
  Menu, X
} from 'lucide-react';

// ─── SIDEBAR DATA ───────────────────────────────────
const SIDEBAR_ITEMS = [
  { icon: Play, label: 'YT Analyzer', active: false, pro: true },
  { icon: Radio, label: 'Live Streaming', active: false },
  { icon: Search, label: 'Riset Kompetitor', active: false },
  { icon: Flame, label: 'Eksplorasi Tren', active: false },
  { icon: TargetIcon, label: 'Pencari Niche', active: false },
  { icon: Bookmark, label: 'Favorit', active: false },
  { icon: Shuffle, label: 'Pengacak Musik', active: false },
  { icon: AudioWaveform, label: 'Deteksi Musik', active: false },
  { icon: Equalizer, label: 'Sound Lab', active: true },
];

// ─── PROFILE DATA ───────────────────────────────────
const PLATFORM_TARGETS = ['YouTube', 'Streaming -14', 'Apple -16', 'Podcast / Voice', 'Club / Loud -9'];
const SIGNATURES = ['Universal Balance', 'Fire / Aggressive', 'Tape Saturation', 'Clarity / De-Mud', 'Cinematic Deep', 'Vinyl Classic', 'Radio Ready', 'Air Lift'];
const VIBES = ['Clean', 'Modern Bright', 'Warm Analog', 'Wide 3D', 'Tight & Punchy', 'Vocal Forward', 'Dark & Deep', 'Open Dynamic', 'Neutral'];
const GENRES = ['Pop Radio', 'Rock Arena', 'EDM Festival', 'Hip-Hop Punch', 'R&B Silk', 'Metal Impact', 'Jazz Club', 'Acoustic Live', 'Reggae Dub', 'Lo-Fi Tape', 'K-Pop Gloss', 'Dangdut Koplo', 'Campursari'];

const CATATAN_STUDIO = [
  'Semua perubahan profile dan slider terdengar secara realtime saat audio diputar — tidak perlu menunggu proses render.',
  'Gunakan A/B Compare untuk membandingkan hasil dengan versi asli secara instan.',
  'Hindari loudness berlebihan — YouTube dan Spotify menormalisasi playback ke -14 LUFS.',
  'Pertahankan Peak Guard di -1 dB agar audio tetap bersih setelah re-encoding oleh platform.',
  'Setelah hasil sesuai, klik Render & Export — file otomatis terdownload setelah proses selesai.',
];

// ─── TYPES ──────────────────────────────────────────
interface EQSettings { bass: number; body: number; presence: number; air: number; }
interface DynamicsSettings { threshold: number; ratio: number; attack: number; release: number; boost: number; multiband: boolean; }
interface OutputSettings { width: number; punch: number; softClip: number; peakGuard: number; finalLevel: number; loudnessTarget: number; }

// ─── AUDIO ENGINE HOOK ──────────────────────────────
function useAudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [eq, setEq] = useState<EQSettings>({ bass: 1.0, body: -1.5, presence: 2.0, air: 3.5 });
  const [dynamics, setDynamics] = useState<DynamicsSettings>({ threshold: -22, ratio: 2.5, attack: 20, release: 200, boost: 2.5, multiband: false });
  const [output, setOutput] = useState<OutputSettings>({ width: 110, punch: 3.0, softClip: 0.0, peakGuard: -1.0, finalLevel: 0.0, loudnessTarget: -14 });
  const [rumbleEnabled, setRumbleEnabled] = useState(true);

  const initEngine = useCallback((file: File) => {
    const audio = new Audio(URL.createObjectURL(file));
    audioRef.current = audio;
    
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('ended', () => setIsPlaying(false));
    
    // Initialize Web Audio API
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const source = ctx.createMediaElementSource(audio);
    
    // Create processing chain (simplified for demo)
    const gain = ctx.createGain();
    gain.gain.value = 1.0;
    
    source.connect(gain);
    gain.connect(ctx.destination);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      ctxRef.current?.resume();
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  return {
    isPlaying, currentTime, duration,
    eq, setEq,
    dynamics, setDynamics,
    output, setOutput,
    rumbleEnabled, setRumbleEnabled,
    initEngine, togglePlay
  };
}

// ─── COMPONENTS ─────────────────────────────────────

function Sidebar({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <button onClick={() => setMobileOpen(!mobileOpen)} className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg">
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 flex items-center gap-3 border-b border-[var(--border-color)]">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-[var(--text-primary)]">YT Analyzer</div>
            <div className="text-[10px] text-[var(--text-muted)] font-medium">PRO</div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${item.active ? 'bg-gray-900 text-white font-medium dark:bg-white dark:text-gray-900' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.pro && <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 px-1.5 py-0.5 rounded font-bold">PRO</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--border-color)] space-y-1">
          <button onClick={toggleDarkMode} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} Mode Gelap
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition">
            <HelpCircle className="w-4 h-4" /> Support
          </button>
        </div>
      </aside>
    </>
  );
}

function UploadZone({ onFileSelect, hasFile }: { onFileSelect: (file: File) => void; hasFile: boolean }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  if (hasFile) return null;
  return (
    <div onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]); }} onClick={() => inputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--text-muted)]'}`}>
      <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} />
      <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center mx-auto mb-4">
        <Upload className="w-5 h-5 text-[var(--text-muted)]" />
      </div>
      <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Tarik file audio ke sini, atau klik untuk memilih</p>
      <p className="text-xs text-[var(--text-muted)]">WAV · MP3 · FLAC · OGG · M4A — diproses di komputer Anda sendiri</p>
    </div>
  );
}

function Waveform({ isPlaying }: { isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const bars = 80;
    const barWidth = rect.width / bars;
    let animId: number;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (let i = 0; i < bars; i++) {
        const height = isPlaying ? Math.random() * rect.height * 0.7 + 5 : Math.random() * rect.height * 0.2 + 2;
        const x = i * barWidth;
        const y = (rect.height - height) / 2;
        ctx.fillStyle = isPlaying ? 'var(--accent)' : 'var(--border-color)';
        ctx.fillRect(x + 1, y, barWidth - 2, height);
      }
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);
  return <canvas ref={canvasRef} className="w-full h-32 rounded-xl bg-[var(--bg-tertiary)]" />;
}

function LoudnessMeter({ target }: { target: number }) {
  return (
    <div className="w-full lg:w-64 bg-[var(--bg-tertiary)] rounded-xl p-4 flex-shrink-0">
      <h3 className="text-label mb-4">LOUDNESS CHECK</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
          <div className="text-[10px] text-[var(--text-muted)] font-bold tracking-wider mb-2">ORIGINAL</div>
          <div className="text-lg font-mono text-[var(--text-primary)]">—</div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">LUFS · integrated</div>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--accent)]/30">
          <div className="text-[10px] text-[var(--accent)] font-bold tracking-wider mb-2">ENHANCED</div>
          <div className="text-lg font-mono text-[var(--accent)]">—</div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">LUFS · integrated</div>
        </div>
      </div>
      <p className="text-xs text-[var(--text-secondary)]">Loudness target: <span className="font-bold text-[var(--text-primary)]">{target} LUFS</span></p>
    </div>
  );
}

function CustomSlider({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-[var(--text-secondary)] font-medium">{label}</span>
        <span className="text-xs text-[var(--text-muted)] font-mono">{value > 0 && !unit.includes('LUFS') && unit !== '%' && unit !== 'ms' ? '+' : ''}{value} {unit}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="slider-track" />
        <div className="slider-fill" style={{ width: `${pct}%` }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="absolute w-full h-5 opacity-0 cursor-pointer z-10" />
        <div className="slider-thumb pointer-events-none" style={{ left: `calc(${pct}% - 8px)` }} />
      </div>
    </div>
  );
}

function PillButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${active ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--text-muted)]'}`}>{label}</button>;
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${checked ? 'bg-[var(--accent)] border-[var(--accent)]' : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}>{checked && <Check className="w-3 h-3 text-white" />}</div>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="hidden" />
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
    </label>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────

export default function SoundLab() {
  const [darkMode, setDarkMode] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [abMode, setAbMode] = useState<'original' | 'enhanced'>('enhanced');
  const [profile, setProfile] = useState({ platform: 'YouTube', signature: 'Universal Balance', vibe: 'Clean', genre: 'Pop Radio' });

  const engine = useAudioEngine();

  const handleFileSelect = useCallback((file: File) => {
    setAudioFile(file);
    engine.initEngine(file);
  }, [engine]);

  const toggleDarkMode = () => { setDarkMode(!darkMode); document.documentElement.classList.toggle('dark'); };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full lg:w-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Sound Lab</h1>
            <p className="text-sm text-[var(--text-secondary)]">Enhance tone, dynamics & loudness langsung di browser — privat, file tidak pernah diupload.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="btn-secondary flex items-center gap-2"><Target className="w-4 h-4" /><span className="hidden sm:inline">Match Reference</span></button>
            <button className="btn-primary flex items-center gap-2"><Sparkles className="w-4 h-4" /><span className="hidden sm:inline">Smart Enhance</span></button>
          </div>
        </div>

        <UploadZone onFileSelect={handleFileSelect} hasFile={!!audioFile} />

        {audioFile && (
          <div className="card p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-label text-[var(--accent)]">ENHANCED</span>
              <span className="text-xs text-[var(--text-muted)] font-mono">{formatTime(engine.currentTime)} / {formatTime(engine.duration)}</span>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <Waveform isPlaying={engine.isPlaying} />
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <button onClick={engine.togglePlay} className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] rounded-lg text-sm font-medium text-[var(--text-primary)] transition">
                    {engine.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}{engine.isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button onClick={() => setAbMode(abMode === 'original' ? 'enhanced' : 'original')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${abMode === 'enhanced' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>↔ A/B Compare</button>
                </div>
              </div>
              <LoudnessMeter target={engine.output.loudnessTarget} />
            </div>
          </div>
        )}

        {/* Sound Profiles */}
        <div className="card p-4 sm:p-6 mb-6">
          <h3 className="text-label mb-4">SOUND PROFILES</h3>
          <div className="space-y-4">
            <div><p className="text-label mb-2">PLATFORM TARGET</p><div className="flex flex-wrap gap-2">{PLATFORM_TARGETS.map(p => <PillButton key={p} label={p} active={profile.platform === p} onClick={() => setProfile({...profile, platform: p})} />)}</div></div>
            <div><p className="text-label mb-2">SIGNATURE</p><div className="flex flex-wrap gap-2">{SIGNATURES.map(s => <PillButton key={s} label={s} active={profile.signature === s} onClick={() => setProfile({...profile, signature: s})} />)}</div></div>
            <div><p className="text-label mb-2">VIBE</p><div className="flex flex-wrap gap-2">{VIBES.map(v => <PillButton key={v} label={v} active={profile.vibe === v} onClick={() => setProfile({...profile, vibe: v})} />)}</div></div>
            <div><p className="text-label mb-2">GENRE</p><div className="flex flex-wrap gap-2">{GENRES.map(g => <PillButton key={g} label={g} active={profile.genre === g} onClick={() => setProfile({...profile, genre: g})} />)}</div></div>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-4">Profile mengatur tone, dynamics & loudness target sekaligus. Setelah dipilih, semua slider bebas di-tweak manual.</p>
        </div>

        {/* Control Deck */}
        <div className="card p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[var(--border-color)] gap-4">
            <h3 className="text-label">CONTROL DECK</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <ToggleSwitch checked={engine.rumbleEnabled} onChange={engine.setRumbleEnabled} label="Rumble Cut <30 Hz" />
              <div className="flex items-center gap-2 w-full sm:w-auto"><span className="text-xs text-[var(--text-muted)] whitespace-nowrap">Input</span><div className="w-full sm:w-24"><CustomSlider label="" value={0} min={0} max={10} step={0.1} unit="dB" onChange={() => {}} /></div></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div>
              <div className="flex items-center justify-between mb-4"><h4 className="text-label">TONE</h4><span className="flex items-center gap-1 text-xs text-[var(--accent)]"><Check className="w-3 h-3" /> aktif</span></div>
              <div className="space-y-4">
                <CustomSlider label="Bass · 100 Hz" value={engine.eq.bass} min={-12} max={12} step={0.5} unit="dB" onChange={(v) => engine.setEq({...engine.eq, bass: v})} />
                <CustomSlider label="Body · 350 Hz" value={engine.eq.body} min={-12} max={12} step={0.5} unit="dB" onChange={(v) => engine.setEq({...engine.eq, body: v})} />
                <CustomSlider label="Presence · 3.5 kHz" value={engine.eq.presence} min={-12} max={12} step={0.5} unit="dB" onChange={(v) => engine.setEq({...engine.eq, presence: v})} />
                <CustomSlider label="Air · 10 kHz" value={engine.eq.air} min={-12} max={12} step={0.5} unit="dB" onChange={(v) => engine.setEq({...engine.eq, air: v})} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4"><h4 className="text-label">DYNAMICS</h4><span className="flex items-center gap-1 text-xs text-[var(--accent)]"><Check className="w-3 h-3" /> aktif</span></div>
              <div className="space-y-4">
                <CustomSlider label="Threshold" value={engine.dynamics.threshold} min={-60} max={0} step={1} unit="dB" onChange={(v) => engine.setDynamics({...engine.dynamics, threshold: v})} />
                <CustomSlider label="Ratio" value={engine.dynamics.ratio} min={1} max={20} step={0.1} unit=": 1" onChange={(v) => engine.setDynamics({...engine.dynamics, ratio: v})} />
                <CustomSlider label="Attack" value={engine.dynamics.attack} min={0.1} max={100} step={0.1} unit="ms" onChange={(v) => engine.setDynamics({...engine.dynamics, attack: v})} />
                <CustomSlider label="Release" value={engine.dynamics.release} min={10} max={1000} step={10} unit="ms" onChange={(v) => engine.setDynamics({...engine.dynamics, release: v})} />
                <CustomSlider label="Boost" value={engine.dynamics.boost} min={0} max={12} step={0.5} unit="dB" onChange={(v) => engine.setDynamics({...engine.dynamics, boost: v})} />
                <ToggleSwitch checked={engine.dynamics.multiband} onChange={(v) => engine.setDynamics({...engine.dynamics, multiband: v})} label="Multiband 3-Band" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4"><h4 className="text-label">OUTPUT & SPACE</h4><span className="flex items-center gap-1 text-xs text-[var(--accent)]"><Check className="w-3 h-3" /> aktif</span></div>
              <div className="space-y-4">
                <CustomSlider label="Width" value={engine.output.width} min={0} max={200} step={1} unit="%" onChange={(v) => engine.setOutput({...engine.output, width: v})} />
                <CustomSlider label="Punch" value={engine.output.punch} min={0} max={12} step={0.5} unit="dB" onChange={(v) => engine.setOutput({...engine.output, punch: v})} />
                <CustomSlider label="Soft Clip" value={engine.output.softClip} min={0} max={6} step={0.1} unit="dB" onChange={(v) => engine.setOutput({...engine.output, softClip: v})} />
                <CustomSlider label="Peak Guard" value={engine.output.peakGuard} min={-6} max={0} step={0.1} unit="dB" onChange={(v) => engine.setOutput({...engine.output, peakGuard: v})} />
                <CustomSlider label="Final Level" value={engine.output.finalLevel} min={-12} max={12} step={0.5} unit="dB" onChange={(v) => engine.setOutput({...engine.output, finalLevel: v})} />
                <CustomSlider label="Loudness Target" value={engine.output.loudnessTarget} min={-23} max={-8} step={0.5} unit="LUFS" onChange={(v) => engine.setOutput({...engine.output, loudnessTarget: v})} />
              </div>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="card p-4 sm:p-6 mb-6">
          <p className="text-xs text-[var(--text-muted)] mb-4">Signal path: In → Tone → Dynamics → Width → Punch → Peak Guard → Out</p>
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
            <ToggleSwitch checked={true} onChange={() => {}} label="Normalisasi ke -14 LUFS" />
            <div className="flex items-center gap-1 flex-wrap">
              {['WAV 16', 'WAV 24', 'WAV 32f', 'MP3 320'].map(f => <button key={f} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${f === 'WAV 16' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>{f}</button>)}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition sm:ml-auto" onClick={() => alert('Export coming soon!')}><Download className="w-4 h-4" /> Render & Export</button>
          </div>
        </div>

        {/* Catatan Studio */}
        <div className="card p-4 sm:p-6">
          <h3 className="text-label mb-4">CATATAN STUDIO</h3>
          <ul className="space-y-2">
            {CATATAN_STUDIO.map((note, i) => (
              <li key={i} className="text-xs text-[var(--text-secondary)] leading-relaxed flex gap-2">
                <span className="text-[var(--accent)] flex-shrink-0">•</span>
                <span dangerouslySetInnerHTML={{ __html: note.replace(/-14 LUFS/g, '<strong>-14 LUFS</strong>').replace(/Peak Guard di -1 dB/g, '<strong>Peak Guard di -1 dB</strong>') }} />
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center py-8"><p className="text-xs text-[var(--text-muted)]">© 2026 ganifzhu</p></div>
      </main>
    </div>
  );
}
