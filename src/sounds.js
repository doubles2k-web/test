// ============================================================
// 📁 sounds.js — 게임 효과음 전담 파일
// 효과음을 수정하거나 새로 추가하려면 이 파일만 열면 돼요!
// 외부 mp3 파일 없이 Web Audio API로 소리를 직접 만들어요.
// ============================================================

// ── 전역 오디오 상태 ─────────────────────────────────────────
// 📱 iOS/Android 핵심 규칙:
//   AudioContext는 사용자 터치/클릭 후에만 소리를 낼 수 있어요.
let _ctx = null;
let _unlocked = false;

// 오디오 컨텍스트 가져오기 (없으면 새로 만들기)
const getCtx = () => {
  if (!_ctx) {
    try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e) { return null; }
  }
  return _ctx;
};

// ============================================================
// 🔓 오디오 잠금 해제 (모바일 필수!)
// 화면을 터치할 때마다 호출해서 소리가 나올 수 있도록 해요.
// ============================================================
export const unlockAudio = () => {
  if (!_ctx) {
    try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e) { return; }
  }
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
  if (!_unlocked) {
    try {
      const buf = _ctx.createBuffer(1, 1, _ctx.sampleRate);
      const src = _ctx.createBufferSource();
      src.buffer = buf;
      src.connect(_ctx.destination);
      src.start(0);
      src.onended = () => { src.disconnect(); _unlocked = true; };
    } catch(e) {}
  }
};

// ============================================================
// 🔊 효과음 재생
// sound('pan')   → 반죽 올릴 때
// sound('sell')  → 판매 성공
// sound('ready') → 붕어빵 완성
// sound('combo') → 콤보 달성
// sound('warning') → 경고/실패
// sound('vip')   → VIP 등장
// sound('gameover') → 게임 오버
// sound('levelup') → 레벨 업
// ============================================================
export const sound = (type) => {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  if (audioCtx.state === 'closed') return;

  const now = audioCtx.currentTime;

  // 오실레이터(음 발생기) 빠르게 만드는 도우미 함수
  const makeOsc = (type, freq, gainVal, startTime, duration) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const sounds = {

    // 🍞 반죽 올리기 — 통통! 귀여운 물방울 소리
    pan: () => {
      const o1 = audioCtx.createOscillator(), g1 = audioCtx.createGain();
      o1.connect(g1); g1.connect(audioCtx.destination);
      o1.type = 'sine';
      o1.frequency.setValueAtTime(600, now);
      o1.frequency.exponentialRampToValueAtTime(400, now + 0.08);
      g1.gain.setValueAtTime(0.35, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      o1.start(now); o1.stop(now + 0.1);

      const o2 = audioCtx.createOscillator(), g2 = audioCtx.createGain();
      o2.connect(g2); g2.connect(audioCtx.destination);
      o2.type = 'sine';
      o2.frequency.setValueAtTime(750, now + 0.06);
      o2.frequency.exponentialRampToValueAtTime(500, now + 0.15);
      g2.gain.setValueAtTime(0.25, now + 0.06);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      o2.start(now + 0.06); o2.stop(now + 0.18);
    },

    // 💰 판매 성공 — 경쾌한 3음
    sell: () => {
      [523, 659, 784].forEach((freq, i) => makeOsc('square', freq, 0.25, now + i * 0.08, 0.15));
    },

    // ✨ 붕어빵 완성 — 반짝이는 상승음
    ready: () => {
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now); osc.stop(now + 0.2);
    },

    // 🔥 콤보! — 신나는 상승 3음
    combo: () => {
      [523, 784, 1047].forEach((freq, i) => makeOsc('square', freq, 0.3, now + i * 0.06, 0.12));
    },

    // ⚠️ 경고/실패 — 낮게 떨어지는 소리
    warning: () => {
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now); osc.stop(now + 0.25);
    },

    // ⭐ VIP 등장 — 화려한 4음
    vip: () => {
      [523, 659, 784, 1047].forEach((freq, i) => makeOsc('square', freq, 0.25, now + i * 0.07, 0.14));
    },

    // 💀 게임오버 — 하강 음
    gameover: () => {
      [330, 277, 220, 185].forEach((freq, i) => makeOsc('sawtooth', freq, 0.3, now + i * 0.15, 0.2));
    },

    // 🎊 레벨업 — 상승 5음
    levelup: () => {
      [523, 659, 784, 1047, 1319].forEach((freq, i) => makeOsc('square', freq, 0.25, now + i * 0.1, 0.18));
    },

    // ✏️ 새 효과음 추가 예시:
    // mySound: () => {
    //   makeOsc('sine', 1000, 0.3, now, 0.2);
    // },
  };

  if (sounds[type]) sounds[type]();
};
