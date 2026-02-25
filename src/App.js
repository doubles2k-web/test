import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================
// 🎨 색상 테마 - 여기서 전체 색상을 한 번에 바꿀 수 있어요
// ============================================================
const THEME = {
  bgDark: '#2d1b00',        // 배경 가장 어두운 색
  bgMid: '#4a2c00',         // 배경 중간 색
  bgLight: '#6b3d00',       // 배경 밝은 색
  headerBg: '#1a0f00',      // 헤더 배경색
  boardColor: '#3d1f00',    // 붕어빵 판 색
  signBg: '#fff3e0',        // 간판 배경색
  accentOrange: '#ff6b00',  // 포인트 색 (주황)
  accentYellow: '#ffd600',  // 포인트 색 (노란)
  accentGold: '#ffab00',    // 골드 색
  text: '#fff8f0',          // 기본 텍스트
  textDark: '#3d1f00',      // 어두운 텍스트
};

// ============================================================
// 🍞 메뉴판 - 새 메뉴를 추가하려면 이 배열에 항목을 추가하세요!
// ============================================================
// const NEW_MENU = {
//   name: '초코붕어빵',  // 이름
//   cookStages: ['empty', 'dough', 'red', 'cooking', 'ready', 'burnt'],  // 굽는 단계
//   cookTime: 5,   // 전체 굽는 시간 (초)
//   price: 1500,   // 판매 가격
// };

// ============================================================
// 👥 손님 종류 - 새 손님을 추가하려면 이 배열에 항목을 추가하세요!
// ============================================================
const customerTypes = [
  { name: '학생',   patience: 20, pay: 1000, img: process.env.PUBLIC_URL + '/images/student.png' },
  { name: '직장인', patience: 15, pay: 1500, img: process.env.PUBLIC_URL + '/images/worker.png'  },
  { name: '할머니', patience: 25, pay: 800,  img: process.env.PUBLIC_URL + '/images/grandma.png' },
  { name: '아이',   patience: 12, pay: 2000, img: process.env.PUBLIC_URL + '/images/child.png'   },
];
const vipCustomer = { name: 'VIP', patience: 8, pay: 5000, img: process.env.PUBLIC_URL + '/images/vip.png' };

// ============================================================
// 📖 튜토리얼 내용 - 각 단계별 설명을 여기서 바꿀 수 있어요!
// ============================================================
const TUTORIAL_STEPS = [
  {
    emoji: '🐟',
    title: '붕어빵 굽기',
    desc: '화면 아래쪽 판을 탭하면 붕어빵을 구울 수 있어요.\n반죽 → 빨간색 → 노릇노릇 → 완성! 단계를 거쳐요.',
    tip: '진행 바가 초록색일 때 탭하면 딱 좋아요!',
  },
  {
    emoji: '⚡',
    title: '타이밍이 중요해요',
    desc: '진행 바가 빨간색이 되기 전에 다음 단계로 넘겨야 해요.\n너무 늦으면 붕어빵이 타버려요! 🔥',
    tip: '타면 생명이 1개 줄어요. 총 5개의 생명이 있어요.',
  },
  {
    emoji: '👥',
    title: '손님에게 팔기',
    desc: '완성된 붕어빵을 재고에 모아두고,\n위쪽 손님을 탭하면 판매할 수 있어요!',
    tip: '손님 머리 위 숫자가 필요한 개수예요. 재고가 충분한지 확인하세요.',
  },
  {
    emoji: '⏰',
    title: '손님 인내심',
    desc: '손님마다 기다리는 시간이 달라요.\n인내심 바가 다 줄기 전에 팔아야 해요!',
    tip: '손님이 화나서 떠나면 생명이 줄어요 💔',
  },
  {
    emoji: '🔥',
    title: '콤보 보너스',
    desc: '연속으로 판매하면 콤보가 쌓여요!\n콤보가 높을수록 더 많은 보너스 수익이 생겨요.',
    tip: '5콤보 이상이면 화면이 번쩍여요! 🎆',
  },
  {
    emoji: '⭐',
    title: 'VIP 손님',
    desc: '레벨 5 이상이 되면 VIP 손님이 등장해요.\n인내심은 짧지만 수익이 훨씬 커요!',
    tip: '금색으로 빛나는 손님이 VIP예요 ✨',
  },
];

// ============================================================
// 🎬 타이틀 화면 컴포넌트
// ============================================================
const TitleScreen = ({ onStart, onTutorial }) => {
  return (
    <div style={titleStyles.container}>
      {/* 배경 */}
      <div style={titleStyles.bg} />

      {/* 떠다니는 장식 이모지들 */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {['🐟','🐟','✨','🪙','🔥','⭐','🐟','💰'].map((emoji, i) => (
          <span key={i} style={{
            position: 'absolute',
            fontSize: `${16 + (i % 3) * 8}px`,
            left: `${10 + i * 11}%`,
            top: `${5 + (i % 4) * 20}%`,
            opacity: 0.18,
            animation: `floatEmoji ${3 + i * 0.4}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
          }}>{emoji}</span>
        ))}
      </div>

      {/* 중앙 콘텐츠 */}
      <div style={titleStyles.content}>

        {/* 간판 */}
        <div style={titleStyles.signBoard}>
          <div style={titleStyles.signDecor}>✦ ────── ✦</div>
          <div style={titleStyles.fishRow}>🐟 🐟 🐟</div>
          <div style={titleStyles.mainTitle}>서경이네</div>
          <div style={titleStyles.subTitle}>붕어빵 타이쿤</div>
          <div style={titleStyles.signDecor}>✦ ────── ✦</div>
        </div>

        {/* 설명 문구 */}
        <div style={titleStyles.catchCopy}>
          달콤한 붕어빵 가게를 운영해보세요! 🍞
        </div>

        {/* 버튼 영역 */}
        <div style={titleStyles.buttonArea}>
          {/* 게임 시작 버튼 */}
          <button
            onClick={onStart}
            style={titleStyles.startButton}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '22px' }}>🐟</span>
            <span>게임 시작</span>
          </button>

          {/* 튜토리얼 버튼 */}
          <button
            onClick={onTutorial}
            style={titleStyles.tutorialButton}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,171,0,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,171,0,0.08)'}
          >
            <span style={{ fontSize: '18px' }}>📖</span>
            <span>게임 튜토리얼</span>
          </button>
        </div>

        {/* 하단 힌트 */}
        <div style={titleStyles.hint}>
          탭하고, 굽고, 팔아요!
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 📖 튜토리얼 팝업 컴포넌트
// ============================================================
const TutorialModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const total = TUTORIAL_STEPS.length;
  const current = TUTORIAL_STEPS[step];
  const isLast = step === total - 1;

  return (
    <>
      {/* 어두운 배경 */}
      <div style={tutorialStyles.dim} onClick={onClose} />

      {/* 팝업 창 */}
      <div style={tutorialStyles.modal}>

        {/* 닫기 버튼 */}
        <button onClick={onClose} style={tutorialStyles.closeBtn}>✕</button>

        {/* 제목 */}
        <div style={tutorialStyles.modalTitle}>📖 튜토리얼</div>

        {/* 단계 표시 점 */}
        <div style={tutorialStyles.dots}>
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                ...tutorialStyles.dot,
                background: i === step ? THEME.accentGold : 'rgba(255,171,0,0.25)',
                transform: i === step ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* 현재 단계 내용 */}
        <div style={tutorialStyles.stepContent}>
          <div style={tutorialStyles.stepEmoji}>{current.emoji}</div>
          <div style={tutorialStyles.stepTitle}>{current.title}</div>
          <div style={tutorialStyles.stepDesc}>
            {current.desc.split('\n').map((line, i) => (
              <span key={i}>{line}{i < current.desc.split('\n').length - 1 && <br />}</span>
            ))}
          </div>
          <div style={tutorialStyles.tipBox}>
            💡 {current.tip}
          </div>
        </div>

        {/* 이전 / 다음 버튼 */}
        <div style={tutorialStyles.navButtons}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            style={{
              ...tutorialStyles.navBtn,
              opacity: step === 0 ? 0.3 : 1,
            }}
          >
            ← 이전
          </button>

          {isLast ? (
            <button onClick={onClose} style={tutorialStyles.doneBtn}>
              시작하기! 🐟
            </button>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              style={tutorialStyles.navBtn}
            >
              다음 →
            </button>
          )}
        </div>

        {/* 단계 숫자 */}
        <div style={tutorialStyles.stepCount}>
          {step + 1} / {total}
        </div>
      </div>
    </>
  );
};

// ============================================================
// 💰 파티클 이펙트 컴포넌트 - 돈 튀는 효과
// ============================================================
const ParticleEffect = ({ particles }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3000 }}>
    {particles.map(p => (
      <div
        key={p.id}
        style={{
          position: 'absolute',
          left: p.x,
          top: p.y,
          fontSize: p.size,
          fontWeight: 'bold',
          color: p.color,
          textShadow: `0 0 10px ${p.color}`,
          animation: `particleFly ${p.duration}ms ease-out forwards`,
          '--dx': `${p.dx}px`,
          '--dy': `${p.dy}px`,
          transformOrigin: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {p.emoji}
      </div>
    ))}
  </div>
);

// ============================================================
// 🏆 콤보 연출 컴포넌트
// ── 위치: 화면 상단 중앙 (토스트 메시지와 겹치지 않도록 분리)
// ── 오류 수정: scale을 transform 대신 inner div에 적용해서 위치 꼬임 방지
// ============================================================
const ComboDisplay = ({ combo, fading }) => {
  if (combo < 2) return null;
  const colors = ['#ffd600','#ff6b00','#ff1744','#d500f9','#00e5ff'];
  const color = colors[Math.min(combo - 2, colors.length - 1)];
  // scale 값 계산 (콤보가 높을수록 커짐, 최대 1.6배)
  const scale = Math.min(1 + (combo - 1) * 0.08, 1.6);

  return (
    // 위치를 잡는 wrapper — transform은 translate만 담당
    <div style={{
      position: 'fixed',
      top: '18%',          // 화면 상단 쪽 배치 (토스트는 화면 중간에 있음)
      left: '50%',
      transform: 'translateX(-50%)',   // ← translate만! scale은 아래 inner에서 처리
      zIndex: 2500,
      textAlign: 'center',
      pointerEvents: 'none',
      animation: fading
        ? 'comboFadeOut 0.5s ease forwards'
        : 'comboSlideIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
    }}>
      {/* scale을 여기서 처리 → wrapper의 translate와 충돌 없음 */}
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}>
        <div style={{
          fontSize: combo >= 5 ? '30px' : '22px',
          fontWeight: '900',
          color: color,
          textShadow: `0 0 20px ${color}, 0 2px 4px rgba(0,0,0,0.8)`,
          letterSpacing: '-1px',
          fontFamily: "'Impact', sans-serif",
          whiteSpace: 'nowrap',
        }}>
          {combo >= 10 ? '🔥' : ''}{combo} COMBO!{combo >= 5 ? ' 🔥' : ''}
        </div>
        {combo >= 5 && (
          <div style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold', marginTop: '2px',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)', whiteSpace: 'nowrap' }}>
            {combo >= 10 ? '🎆 대박 콤보!!' : '🎉 콤보 보너스!'}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// 🌟 스크린 플래시 효과 (콤보 5 이상)
// ============================================================
const ScreenFlash = ({ flash }) => {
  if (!flash) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'radial-gradient(circle, rgba(255,214,0,0.3) 0%, transparent 70%)',
      zIndex: 2400,
      pointerEvents: 'none',
      animation: 'flashFade 0.5s ease-out forwards',
    }} />
  );
};

// ============================================================
// 🎮 메인 게임 컴포넌트
// ============================================================
const BungeoppangTycoon = () => {
  // ── 화면 상태: 'title' | 'playing' | 'gameover' ───────────
  // 'title' = 시작 화면, 'playing' = 게임 중, 'gameover' = 게임 오버
  const [screen, setScreen] = useState('title');

  // ── 튜토리얼 팝업 표시 여부 ───────────────────────────────
  const [showTutorial, setShowTutorial] = useState(false);

  const [money, setMoney]       = useState(0);
  const [score, setScore]       = useState(0);
  const [level, setLevel]       = useState(1);
  const [combo, setCombo]       = useState(0);
  const [lives, setLives]       = useState(5);
  const [inventory, setInventory] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [particles, setParticles] = useState([]);
  const [screenFlash, setScreenFlash] = useState(false);
  const [comboKey, setComboKey] = useState(0);
  const [comboFading, setComboFading] = useState(false);
  const [pans, setPans] = useState(
    Array(6).fill(null).map((_, i) => ({ id: i, state: 'empty', progress: 0 }))
  );
  const [gameState, setGameState]     = useState('playing');
  const [currentToast, setCurrentToast] = useState(null);
  const [shakeId, setShakeId]         = useState(null);
  const [enteringCustomers, setEnteringCustomers] = useState(new Set());
  const [leavingCustomers, setLeavingCustomers]   = useState(new Set());

  const customerSpawnTimer = useRef(null);
  const toastTimer = useRef(null);
  const comboTimer = useRef(null);
  const particleIdRef = useRef(0);

  // ── 스크롤/줌 방지 ─────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.documentElement.style.overscrollBehavior = 'none';
    const preventZoom = (e) => { if (e.touches.length > 1) e.preventDefault(); };
    const preventDoubleTapZoom = (e) => e.preventDefault();
    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('dblclick', preventDoubleTapZoom);
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('dblclick', preventDoubleTapZoom);
    };
  }, []);

  // ── 이미지 경로 ───────────────────────────────────────────
  const IMAGES = {
    empty: process.env.PUBLIC_URL + '/images/empty.png',
    dough: process.env.PUBLIC_URL + '/images/dough.png',
    red: process.env.PUBLIC_URL + '/images/cooking1.png',
    cooking: process.env.PUBLIC_URL + '/images/cooking2.png',
    ready: process.env.PUBLIC_URL + '/images/ready.png',
    burnt: process.env.PUBLIC_URL + '/images/burnt.png',
    child: process.env.PUBLIC_URL + '/images/child.png'
  };

  // ── 💰 파티클 생성 함수 ───────────────────────────────────
  const spawnParticles = useCallback((x, y, count = 6, type = 'money') => {
    const emojiSets = {
      money: ['💰', '🪙', '✨', '💵'],
      star:  ['⭐', '🌟', '✨', '💫'],
      combo: ['🔥', '⭐', '💥', '🎉', '✨'],
    };
    const colorSets = {
      money: ['#ffd600', '#ff6b00', '#ffab00', '#fff176'],
      star:  ['#ffd600', '#fff176', '#ffee58', '#ffe082'],
      combo: ['#ff1744', '#ff6b00', '#ffd600', '#d500f9', '#00e5ff'],
    };
    const emojis = emojiSets[type] || emojiSets.money;
    const colors = colorSets[type] || colorSets.money;
    const newParticles = Array.from({ length: count }, () => {
      const id = ++particleIdRef.current;
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 100;
      return {
        id,
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 20,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 60,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: `${14 + Math.random() * 10}px`,
        duration: 700 + Math.random() * 400,
      };
    });
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1200);
  }, []);

  // ── 토스트 메시지 ─────────────────────────────────────────
  const showToast = useCallback((text, type = 'normal') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setCurrentToast({ id: Date.now(), text, type, fading: false });
    toastTimer.current = setTimeout(() => {
      setCurrentToast(prev => prev ? { ...prev, fading: true } : null);
      setTimeout(() => setCurrentToast(null), 500);
    }, 800);
  }, []);

  // ── 게임 완전 리셋 (시작 화면으로 돌아갈 때도 사용) ───────
  const resetGame = () => {
    setMoney(0); setScore(0); setLevel(1); setCombo(0); setLives(5); setInventory(0);
    setCustomers([]); setParticles([]);
    setPans(Array(6).fill(null).map((_, i) => ({ id: i, state: 'empty', progress: 0 })));
    setGameState('playing');
  };

  // ── 게임 시작 버튼 눌렀을 때 ──────────────────────────────
  const handleStartGame = () => {
    resetGame();
    setScreen('playing');
    showToast('붕어빵 장사 시작! 화이팅! 💪', 'normal');
  };

  // ── 손님 스폰 ─────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'playing' || gameState !== 'playing') return;
    const spawnInterval = Math.max(1500, 3500 - level * 250);
    customerSpawnTimer.current = setInterval(() => {
      if (customers.length < 5) {
        const isVIP = level >= 5 && Math.random() < 0.1;
        const type = isVIP ? vipCustomer : customerTypes[Math.floor(Math.random() * customerTypes.length)];
        const baseOrder = Math.min(level, 3);
        const orderCount = baseOrder + Math.floor(Math.random() * 2) + 1;
        const newId = Date.now();

        setEnteringCustomers(prev => new Set(prev).add(newId));
        setTimeout(() => {
          setEnteringCustomers(prev => { const s = new Set(prev); s.delete(newId); return s; });
        }, 600);

        setCustomers(prev => [...prev, {
          id: newId, ...type, orderCount,
          currentPatience: type.patience, waiting: true, satisfied: false, isVIP,
        }]);
      }
    }, spawnInterval);
    return () => clearInterval(customerSpawnTimer.current);
  }, [customers.length, level, gameState, screen]);

  // ── 인내심/굽기 타이머 ────────────────────────────────────
  useEffect(() => {
    if (screen !== 'playing' || gameState !== 'playing') return;
    const patienceSpeed = Math.max(1500, 3000 - level * 150);

    const patienceTimer = setInterval(() => {
      setCustomers(prev => {
        const updated = prev.map(c => {
          if (c.satisfied) return c;
          if (c.currentPatience > 0) return { ...c, currentPatience: c.currentPatience - 1 };
          setLives(l => {
            const nl = l - 1;
            if (nl <= 0) {
              setGameState('gameover');
              setScreen('gameover');
            }
            return nl;
          });
          showToast('손님이 화나서 떠났어요! 💔', 'warning');
          setCombo(0);
          return null;
        }).filter(Boolean);
        return updated;
      });
    }, patienceSpeed);

    const cookingTimer = setInterval(() => {
      setPans(prev => prev.map(pan => {
        if (pan.state !== 'empty' && pan.state !== 'burnt') {
          const newProgress = pan.progress + 2;
          if (newProgress >= 100) return { ...pan, state: 'burnt', progress: 100 };
          return { ...pan, progress: newProgress };
        }
        return pan;
      }));
    }, 100);

    return () => { clearInterval(patienceTimer); clearInterval(cookingTimer); };
  }, [screen, gameState, level, showToast]);

  // ── 붕어빵 판 클릭 ────────────────────────────────────────
  const handlePanClick = (panId) => {
    if (screen !== 'playing' || gameState !== 'playing') return;
    setPans(prev => prev.map(pan => {
      if (pan.id !== panId) return pan;
      if (pan.state === 'empty')   return { ...pan, state: 'dough',   progress: 0 };
      if (pan.state === 'dough'   && pan.progress >= 60) return { ...pan, state: 'red',     progress: 0 };
      if (pan.state === 'red'     && pan.progress >= 60) return { ...pan, state: 'cooking', progress: 0 };
      if (pan.state === 'cooking' && pan.progress >= 60) return { ...pan, state: 'ready',   progress: 0 };
      if (pan.state === 'ready') {
        setInventory(i => i + 1);
        return { ...pan, state: 'empty', progress: 0 };
      }
      if (pan.state === 'burnt') {
        setLives(l => {
          const nl = l - 1;
          if (nl <= 0) {
            setGameState('gameover');
            setScreen('gameover');
          }
          return nl;
        });
        showToast('붕어빵이 탔어요! 생명 -1 💔', 'warning');
        setCombo(0);
        return { ...pan, state: 'empty', progress: 0 };
      }
      return pan;
    }));
  };

  // ── 손님 클릭 (판매) ──────────────────────────────────────
  const handleCustomerClick = (id, event) => {
    if (screen !== 'playing' || gameState !== 'playing') return;
    const customer = customers.find(c => c.id === id);
    if (!customer || customer.satisfied) return;

    if (inventory < customer.orderCount) {
      setShakeId(id);
      setTimeout(() => setShakeId(null), 400);
      showToast(`붕어빵이 부족합니다! (필요: ${customer.orderCount}개)`, 'warning');
      return;
    }

    const nc = combo + 1;
    const comboBonus = combo * 100 * customer.orderCount;
    const totalPay = customer.pay * customer.orderCount + comboBonus;

    const rect = event?.currentTarget?.getBoundingClientRect?.();
    const px = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const py = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const particleCount = customer.isVIP ? 12 : Math.min(4 + customer.orderCount * 2, 10);
    spawnParticles(px, py, particleCount, customer.isVIP ? 'star' : 'money');

    if (nc >= 5) {
      setScreenFlash(true);
      setTimeout(() => setScreenFlash(false), 500);
      spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 15, 'combo');
    }
    if (comboTimer.current) clearTimeout(comboTimer.current);
    setComboFading(false);
    setComboKey(k => k + 1);
    comboTimer.current = setTimeout(() => {
      setComboFading(true);
    }, 800);

    setInventory(inv => inv - customer.orderCount);
    setMoney(m => m + totalPay);
    setScore(s => {
      const newScore = s + totalPay;
      if (Math.floor(newScore / 10000) > Math.floor(s / 10000)) {
        setLevel(l => l + 1);
        showToast(`레벨 ${level + 1}! 🎊`, 'normal');
      }
      return newScore;
    });
    setCombo(nc);

    setCustomers(prev => prev.map(c => c.id === id ? { ...c, satisfied: true } : c));
    setLeavingCustomers(prev => new Set(prev).add(id));

    const message = customer.isVIP
      ? `VIP 판매 성공! ⭐×${customer.orderCount} +${totalPay.toLocaleString()}원`
      : `${customer.orderCount}개 판매! +${totalPay.toLocaleString()}원${comboBonus > 0 ? ` (콤보+${comboBonus.toLocaleString()})` : ''}`;
    showToast(message, 'normal');

    setTimeout(() => {
      setCustomers(curr => curr.filter(c => c.id !== id));
      setLeavingCustomers(prev => { const s = new Set(prev); s.delete(id); return s; });
    }, 1200);
  };

  // ── 프로그레스 바 색상 ────────────────────────────────────
  const getProgressColor = (progress) => {
    if (progress < 60) return '#3b82f6';
    if (progress < 84) return '#22c55e';
    return '#ef4444';
  };

  // ── 손님 애니메이션 계산 ──────────────────────────────────
  const getCustomerAnimation = (c) => {
    if (c.satisfied || leavingCustomers.has(c.id)) return 'customerLeave 1.2s ease-in forwards';
    if (enteringCustomers.has(c.id)) return 'customerEnter 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards';
    if (shakeId === c.id) return 'shake 0.4s';
    return 'none';
  };

  // ============================================================
  // 🎨 렌더링
  // ============================================================

  // ── 타이틀 화면 ──────────────────────────────────────────
  if (screen === 'title') {
    return (
      <>
        <TitleScreen
          onStart={handleStartGame}
          onTutorial={() => setShowTutorial(true)}
        />
        {showTutorial && (
          <TutorialModal onClose={() => setShowTutorial(false)} />
        )}
      </>
    );
  }

  // ── 게임 화면 ────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <div style={styles.background}>

        <ParticleEffect particles={particles} />

        <div key={comboKey}>
          <ComboDisplay combo={combo} fading={comboFading} />
        </div>

        <ScreenFlash flash={screenFlash} />

        {/* ── 헤더 ── */}
        <div style={styles.header}>
          <div style={styles.signBoard}>
            <div style={styles.signDecor}>⊱ ─────── ⊰</div>
            <div style={styles.signText}>🐟 서경이네 붕어빵 🐟</div>
            <div style={styles.signDecor}>⊱ ─────── ⊰</div>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.statBox}>🪙 {money.toLocaleString()}원</div>
            <div style={styles.statBox}>⭐ Lv.{level}</div>
            <div style={{
              ...styles.statBox,
              background: inventory > 0 ? 'linear-gradient(135deg,#065f46,#047857)' : 'linear-gradient(135deg,#7f1d1d,#991b1b)',
              border: `2px solid ${inventory > 0 ? '#34d399' : '#f87171'}`,
              color: '#fff',
            }}>
              🐟 재고: {inventory}개
            </div>
          </div>
          <div style={styles.lifeBox}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{
                opacity: i < lives ? 1 : 0.15,
                filter: i < lives ? 'drop-shadow(0 0 4px #ff4757)' : 'none',
                transition: 'all 0.3s',
                fontSize: i < lives ? '16px' : '14px',
              }}>❤️</span>
            ))}
          </div>
        </div>

        {/* ── 콘텐츠 영역 ── */}
        <div style={styles.content}>

          {/* ── 손님 영역 ── */}
          <div style={styles.customerArea}>
            {customers.length === 0 ? (
              <div style={styles.noCustomers}>손님 기다리는 중... 🌬️</div>
            ) : (
              customers.map(c => (
                <div
                  key={c.id}
                  style={{
                    ...styles.customerWrapper,
                    animation: getCustomerAnimation(c),
                  }}
                  onClick={(e) => handleCustomerClick(c.id, e)}
                >
                  {c.satisfied ? (
                    <div style={styles.satisfiedBubble}>잘먹겠습니다! 😋</div>
                  ) : (
                    <div style={{
                      ...styles.orderBadge,
                      background: c.isVIP
                        ? 'linear-gradient(135deg,#b45309,#d97706)'
                        : 'linear-gradient(135deg,#dc2626,#ef4444)',
                      boxShadow: c.isVIP ? '0 0 8px rgba(251,191,36,0.8)' : '0 2px 8px rgba(239,68,68,0.5)',
                    }}>
                      ×{c.orderCount}
                    </div>
                  )}

                  <img
                    src={c.img}
                    alt={c.name}
                    style={{
                      ...styles.customerImage,
                      filter: c.isVIP
                        ? 'drop-shadow(0 0 10px gold) drop-shadow(0 0 20px rgba(255,214,0,0.5))'
                        : 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))',
                    }}
                  />

                  <div style={styles.patienceBar}>
                    <div style={{
                      ...styles.patienceFill,
                      width: `${(c.currentPatience / c.patience) * 100}%`,
                      backgroundColor: c.currentPatience / c.patience > 0.5
                        ? '#4ade80'
                        : c.currentPatience / c.patience > 0.25
                          ? '#facc15'
                          : '#f87171',
                      boxShadow: c.currentPatience / c.patience <= 0.25
                        ? '0 0 6px #f87171'
                        : 'none',
                    }} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── 붕어빵 판 ── */}
          <div style={{ paddingLeft: 'max(15px, env(safe-area-inset-left))', paddingRight: 'max(15px, env(safe-area-inset-right))' }}>
            <div style={styles.cookingBoard}>
              <div style={styles.pansGrid}>
                {pans.map(pan => {
                  const isGoodTiming = pan.state !== 'empty' && pan.state !== 'burnt' && pan.state !== 'ready' && pan.progress >= 60;
                  const isReady = pan.state === 'ready';
                  return (
                    <button
                      key={pan.id}
                      onClick={() => handlePanClick(pan.id)}
                      style={{
                        ...styles.panButton,
                        animation: isReady
                          ? 'readyGlow 0.8s ease-in-out infinite alternate'
                          : isGoodTiming
                            ? 'panShake 0.3s infinite'
                            : 'none',
                        boxShadow: isReady
                          ? '0 0 16px rgba(255,214,0,0.7), inset 0 0 8px rgba(255,214,0,0.2)'
                          : isGoodTiming
                            ? '0 0 6px rgba(140,160,200,0.25)'
                            : '0 2px 8px rgba(0,0,0,0.4)',
                        border: isReady
                          ? '2px solid #fbbf24'
                          : isGoodTiming
                            ? '2px solid rgba(150,170,210,0.45)'
                            : '2px solid transparent',
                      }}
                    >
                      <img
                        src={IMAGES[pan.state]}
                        alt={pan.state}
                        style={{
                          ...styles.panImage,
                          filter: pan.state === 'burnt' ? 'grayscale(1) brightness(0.4)' : 'none',
                        }}
                      />
                      {pan.state !== 'empty' && pan.state !== 'burnt' && (
                        <div style={styles.progressContainer}>
                          <div style={styles.progressBarOuter}>
                            <div style={{
                              ...styles.progressBarInner,
                              width: `${pan.progress}%`,
                              backgroundColor: getProgressColor(pan.progress),
                            }} />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── 토스트 ── */}
        <div style={styles.toastContainer}>
          {currentToast && (
            <div
              key={currentToast.id}
              style={{
                ...styles.toast,
                background: currentToast.type === 'warning'
                  ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                  : 'linear-gradient(135deg, #1a0f00ee, #4a2c00ee)',
                animation: currentToast.fading
                  ? 'toastFadeOut 0.5s ease forwards'
                  : 'toastPop 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
              }}
            >
              {currentToast.text}
            </div>
          )}
        </div>
      </div>

      {/* ── 게임 오버 ── */}
      {screen === 'gameover' && (
        <>
          <div style={styles.dimBackground} onClick={(e) => e.stopPropagation()} />
          <div style={styles.gameoverContainer}>
            <div style={styles.gameoverBox}>
              <div style={styles.gameoverTitle}>게임 오버!</div>
              <div style={styles.gameoverEmoji}>😭</div>
              <div style={styles.gameoverStats}>
                {[
                  { label: '최종 점수', value: `${score.toLocaleString()}점` },
                  { label: '최종 레벨', value: `레벨 ${level}` },
                  { label: '총 수입',   value: `${money.toLocaleString()}원` },
                ].map(({ label, value }) => (
                  <div key={label} style={styles.gameoverStat}>
                    <span style={styles.gameoverLabel}>{label}</span>
                    <span style={styles.gameoverValue}>{value}</span>
                  </div>
                ))}
              </div>

              {/* 다시 시작 / 타이틀로 버튼 두 개 */}
              <button onClick={() => {
                resetGame();
                setScreen('playing');
                showToast('다시 시작! 화이팅! 💪', 'normal');
              }} style={styles.restartButton}>
                다시 시작 🔥
              </button>
              <button onClick={() => {
                resetGame();
                setScreen('title');
              }} style={styles.titleButton}>
                타이틀로 돌아가기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================
// 🎨 타이틀 화면 스타일
// ============================================================
const titleStyles = {
  container: {
    width: '100%', minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
    position: 'relative', overflow: 'hidden',
  },
  bg: {
    position: 'absolute', inset: 0,
    background: `radial-gradient(ellipse at 50% 30%, #7a3800 0%, #3d1800 40%, #1a0900 100%)`,
    zIndex: 0,
  },
  content: {
    position: 'relative', zIndex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '20px', maxWidth: '360px', width: '100%',
    animation: 'titleEnter 0.8s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
  },
  signBoard: {
    background: 'linear-gradient(135deg, #fff8e1, #ffe0b2)',
    border: `3px solid ${THEME.accentGold}`,
    borderRadius: '16px',
    padding: '18px 28px',
    textAlign: 'center',
    boxShadow: `0 0 40px rgba(255,171,0,0.4), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8)`,
    marginBottom: '20px',
    width: '100%',
  },
  signDecor: {
    fontSize: '10px', color: THEME.accentGold, letterSpacing: '2px',
    opacity: 0.7, lineHeight: '1.4',
  },
  fishRow: {
    fontSize: '28px', letterSpacing: '8px',
    margin: '6px 0',
    animation: 'fishBounce 1.5s ease-in-out infinite',
  },
  mainTitle: {
    fontSize: '32px', fontWeight: '900',
    color: THEME.textDark,
    letterSpacing: '-1px',
    lineHeight: '1.1',
    textShadow: '0 1px 0 rgba(255,255,255,0.6)',
  },
  subTitle: {
    fontSize: '18px', fontWeight: '800',
    color: '#7b3f00',
    letterSpacing: '2px',
    marginBottom: '6px',
  },
  catchCopy: {
    color: THEME.accentYellow, fontSize: '13px', fontWeight: '700',
    marginBottom: '28px',
    textShadow: '0 0 12px rgba(255,214,0,0.5)',
    letterSpacing: '0.5px',
  },
  buttonArea: {
    display: 'flex', flexDirection: 'column', gap: '12px',
    width: '100%',
  },
  startButton: {
    width: '100%', padding: '16px',
    background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '30px',
    color: '#fff', fontSize: '18px', fontWeight: '900',
    cursor: 'pointer', letterSpacing: '1px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    boxShadow: '0 6px 24px rgba(255,107,0,0.5)',
    transition: 'transform 0.15s',
    WebkitTapHighlightColor: 'transparent',
    animation: 'pulseBtn 2s ease-in-out infinite',
  },
  tutorialButton: {
    width: '100%', padding: '13px',
    background: 'rgba(255,171,0,0.08)',
    border: `2px solid rgba(255,171,0,0.4)`,
    borderRadius: '30px',
    color: THEME.accentGold, fontSize: '15px', fontWeight: '800',
    cursor: 'pointer', letterSpacing: '0.5px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    transition: 'background 0.2s',
    WebkitTapHighlightColor: 'transparent',
  },
  hint: {
    marginTop: '24px',
    color: 'rgba(255,214,0,0.45)', fontSize: '11px', fontWeight: '600',
    letterSpacing: '1px',
  },
};

// ============================================================
// 📖 튜토리얼 모달 스타일
// ============================================================
const tutorialStyles = {
  dim: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.8)',
    zIndex: 8000,
  },
  modal: {
    position: 'fixed',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 8001,
    background: 'linear-gradient(135deg, #1a0f00, #2d1b00)',
    border: `2px solid rgba(255,171,0,0.5)`,
    borderRadius: '20px',
    padding: '24px 20px 20px',
    width: '90%', maxWidth: '340px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(255,107,0,0.2)',
    animation: 'modalPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
    maxHeight: '85vh', overflowY: 'auto',
  },
  closeBtn: {
    position: 'absolute', top: '12px', right: '14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.6)',
    width: '28px', height: '28px', borderRadius: '50%',
    fontSize: '12px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: {
    textAlign: 'center', fontSize: '15px', fontWeight: '800',
    color: THEME.accentGold, marginBottom: '14px', letterSpacing: '1px',
  },
  dots: {
    display: 'flex', justifyContent: 'center', gap: '7px',
    marginBottom: '18px',
  },
  dot: {
    width: '8px', height: '8px', borderRadius: '50%',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  stepContent: {
    textAlign: 'center', padding: '4px 0 12px',
  },
  stepEmoji: {
    fontSize: '48px', marginBottom: '10px',
    animation: 'emojiPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
  },
  stepTitle: {
    fontSize: '18px', fontWeight: '900', color: '#fff',
    marginBottom: '10px',
  },
  stepDesc: {
    fontSize: '13px', color: 'rgba(255,248,240,0.85)',
    lineHeight: '1.7', marginBottom: '14px',
  },
  tipBox: {
    background: 'rgba(255,171,0,0.12)',
    border: '1px solid rgba(255,171,0,0.3)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '12px', color: THEME.accentYellow,
    fontWeight: '700', lineHeight: '1.5',
  },
  navButtons: {
    display: 'flex', gap: '10px', marginTop: '16px',
  },
  navBtn: {
    flex: 1, padding: '11px',
    background: 'rgba(255,171,0,0.1)',
    border: '1.5px solid rgba(255,171,0,0.35)',
    borderRadius: '20px',
    color: THEME.accentGold, fontSize: '13px', fontWeight: '800',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  },
  doneBtn: {
    flex: 1, padding: '11px',
    background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
    border: 'none', borderRadius: '20px',
    color: '#fff', fontSize: '14px', fontWeight: '900',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(255,107,0,0.4)',
    WebkitTapHighlightColor: 'transparent',
  },
  stepCount: {
    textAlign: 'center', fontSize: '11px',
    color: 'rgba(255,255,255,0.3)', marginTop: '10px',
    fontWeight: '600',
  },
};

// ============================================================
// 🎨 게임 스타일 정의
// ============================================================
const styles = {
  container: {
    width: '100%', minHeight: '100vh',
    fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
    position: 'relative',
  },
  background: {
    background: `linear-gradient(180deg, ${THEME.bgDark} 0%, ${THEME.bgMid} 40%, ${THEME.bgLight} 100%)`,
    minHeight: '100vh', position: 'relative',
    paddingBottom: 'env(safe-area-inset-bottom, 20px)',
  },
  header: {
    padding: '12px 20px 16px',
    paddingTop: 'max(12px, env(safe-area-inset-top))',
    background: `linear-gradient(180deg, ${THEME.headerBg} 0%, ${THEME.bgDark} 100%)`,
    textAlign: 'center',
    borderBottom: `2px solid ${THEME.accentOrange}44`,
  },
  signBoard: {
    background: `linear-gradient(135deg, #fff8e1, #ffe0b2)`,
    padding: '10px 16px',
    borderRadius: '10px',
    marginBottom: '12px',
    border: `2px solid ${THEME.accentGold}`,
    boxShadow: `0 0 20px rgba(255,171,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)`,
  },
  signDecor: {
    fontSize: '9px', color: THEME.accentGold, letterSpacing: '2px',
    opacity: 0.7, lineHeight: '1.2',
  },
  signText: {
    fontSize: '20px', fontWeight: '900', color: THEME.textDark,
    letterSpacing: '-0.5px', padding: '4px 0',
    textShadow: `0 1px 0 rgba(255,255,255,0.5)`,
  },
  headerStats: {
    display: 'flex', justifyContent: 'center', gap: '6px',
    marginBottom: '10px', flexWrap: 'wrap',
  },
  statBox: {
    background: `linear-gradient(135deg, #78350f, #92400e)`,
    padding: '5px 10px', borderRadius: '20px', fontWeight: '800',
    color: '#fde68a', fontSize: '11px', minWidth: '65px',
    border: '1px solid rgba(251,191,36,0.4)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  lifeBox: { fontSize: '15px', letterSpacing: '3px' },
  content: {
    maxWidth: '480px', margin: '0 auto',
    paddingTop: '12px', paddingBottom: '12px', overflow: 'visible',
  },
  customerArea: {
    display: 'flex', gap: '4px', marginBottom: '0',
    overflowX: 'auto', overflowY: 'visible',
    paddingTop: '40px', paddingBottom: '8px',
    paddingLeft: 'max(15px, env(safe-area-inset-left))',
    paddingRight: 'max(15px, env(safe-area-inset-right))',
    WebkitOverflowScrolling: 'touch',
    alignItems: 'flex-start', minHeight: '130px',
  },
  customerWrapper: {
    position: 'relative', display: 'flex', flexDirection: 'column',
    alignItems: 'center', cursor: 'pointer', flexShrink: 0,
    width: '31vw', maxWidth: '110px', height: '115px',
    justifyContent: 'flex-start',
  },
  orderBadge: {
    position: 'absolute', top: '-22px', right: '2px',
    color: 'white', fontSize: '11px', fontWeight: '900',
    padding: '3px 8px', borderRadius: '12px',
    border: '2px solid rgba(255,255,255,0.6)', zIndex: 1000,
  },
  satisfiedBubble: {
    position: 'absolute', top: '-22px', right: '2px',
    background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)',
    color: '#065f46', fontSize: '10px', fontWeight: '800',
    padding: '3px 7px', borderRadius: '10px',
    border: '2px solid #34d399', zIndex: 1000,
    whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(52,211,153,0.4)',
    animation: 'bubbleFadeIn 0.4s ease forwards',
  },
  customerImage: {
    width: '80px', height: '80px', objectFit: 'contain',
  },
  patienceBar: {
    width: '72px', height: '5px',
    background: 'rgba(0,0,0,0.4)', borderRadius: '3px',
    marginTop: '6px', overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  patienceFill: {
    height: '100%', borderRadius: '3px', transition: 'width 3.1s linear, background-color 0.5s',
  },
  noCustomers: {
    width: '100%', textAlign: 'center',
    color: THEME.accentGold, fontWeight: 'bold', fontSize: '13px',
    padding: '30px 0', opacity: 0.7,
  },
  cookingBoard: {
    background: `linear-gradient(180deg, #1e2433, #252d3d)`,
    padding: '12px', borderRadius: '14px',
    border: `2px solid rgba(80,100,150,0.35)`,
    boxShadow: `0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(100,130,200,0.1)`,
  },
  pansGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
  },
  panButton: {
    width: '100%', aspectRatio: '1', position: 'relative',
    borderRadius: '12px',
    background: `linear-gradient(135deg, #2a3147, #313a52)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 0, cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  },
  panImage: { width: '75%', height: '75%', objectFit: 'contain' },
  progressContainer: { position: 'absolute', bottom: '6%', left: '8%', right: '8%' },
  progressBarOuter: {
    width: '100%', height: '4px',
    background: 'rgba(0,0,0,0.6)', borderRadius: '2px', overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%', transition: 'width 0.1s, background-color 0.3s',
    borderRadius: '2px',
  },
  toastContainer: {
    position: 'fixed', bottom: '50%',
    left: 'env(safe-area-inset-left, 20px)',
    right: 'env(safe-area-inset-right, 20px)',
    display: 'flex', justifyContent: 'center', zIndex: 2000,
    pointerEvents: 'none', padding: '0 20px',
  },
  toast: {
    color: 'white', padding: '12px 24px', borderRadius: '25px',
    fontSize: '14px', fontWeight: '800',
    boxShadow: '0 5px 20px rgba(0,0,0,0.4)',
    maxWidth: '90%', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  dimBackground: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)', zIndex: 9998, pointerEvents: 'auto',
  },
  gameoverContainer: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Pretendard', sans-serif",
    padding: 'env(safe-area-inset-top,20px) env(safe-area-inset-right,20px) env(safe-area-inset-bottom,20px) env(safe-area-inset-left,20px)',
    zIndex: 9999, pointerEvents: 'none',
  },
  gameoverBox: {
    background: 'linear-gradient(135deg, #1a0f00, #2d1b00)',
    border: '2px solid rgba(255,171,0,0.5)',
    padding: '28px 20px', borderRadius: '20px',
    maxWidth: '300px', width: '90%', textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(255,107,0,0.2)',
    maxHeight: '80vh', overflowY: 'auto', pointerEvents: 'auto',
  },
  gameoverTitle: {
    fontSize: '22px', fontWeight: '900', color: '#ff4757',
    marginBottom: '8px', textShadow: '0 0 20px rgba(255,71,87,0.5)',
  },
  gameoverEmoji: { fontSize: '48px', marginBottom: '16px' },
  gameoverStats: {
    background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px',
    marginBottom: '16px', border: '1px solid rgba(255,171,0,0.2)',
  },
  gameoverStat: {
    display: 'flex', justifyContent: 'space-between',
    padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  gameoverLabel: { fontSize: '12px', color: '#a78bfa', fontWeight: '600' },
  gameoverValue: { fontSize: '13px', color: '#fde68a', fontWeight: '900' },
  restartButton: {
    background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
    color: 'white', border: 'none', padding: '14px 24px',
    borderRadius: '25px', fontSize: '15px', fontWeight: '900',
    cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.5)',
    width: '100%', WebkitTapHighlightColor: 'transparent',
    letterSpacing: '0.5px', marginBottom: '10px',
  },
  // ── 게임 오버 화면에 추가된 "타이틀로 돌아가기" 버튼 스타일
  titleButton: {
    background: 'transparent',
    color: 'rgba(255,248,240,0.55)', border: '1.5px solid rgba(255,255,255,0.15)',
    padding: '11px 24px', borderRadius: '25px', fontSize: '13px', fontWeight: '700',
    cursor: 'pointer', width: '100%', WebkitTapHighlightColor: 'transparent',
  },
};

// ============================================================
// 🎬 CSS 애니메이션 등록
// ============================================================
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    /* 토스트 팝업 */
    @keyframes toastPop {
      0%   { transform: scale(0.5) translateY(10px); opacity: 0; }
      100% { transform: scale(1)   translateY(0);    opacity: 1; }
    }
    @keyframes toastFadeOut {
      0%   { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.9); }
    }

    /* 손님 흔들기 (재고 부족) */
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      25%      { transform: translateX(-5px); }
      75%      { transform: translateX(5px); }
    }

    /* 손님 등장 */
    @keyframes customerEnter {
      0%   { opacity: 0; transform: translateY(20px) scale(0.7); }
      60%  { opacity: 1; transform: translateY(-6px) scale(1.05); }
      100% { opacity: 1; transform: translateY(0)   scale(1); }
    }

    /* 손님 퇴장 */
    @keyframes customerLeave {
      0%   { opacity: 1; transform: translateY(0)    scale(1); }
      30%  { opacity: 1; transform: translateY(-10px) scale(1.05); }
      100% { opacity: 0; transform: translateY(-30px) scale(0.6); }
    }

    /* 말풍선 페이드인 */
    @keyframes bubbleFadeIn {
      0%   { opacity: 0; transform: translateY(6px) scale(0.8); }
      100% { opacity: 1; transform: translateY(0)   scale(1); }
    }

    /* 붕어빵 판 흔들림 */
    @keyframes panShake {
      0%,100% { transform: translateY(0)    rotate(0deg); }
      25%      { transform: translateY(-3px) rotate(-1.5deg); }
      75%      { transform: translateY(-3px) rotate(1.5deg); }
    }

    /* 완성된 붕어빵 빛나기 */
    @keyframes readyGlow {
      0%   { box-shadow: 0 0 12px rgba(255,214,0,0.5), inset 0 0 4px rgba(255,214,0,0.1); }
      100% { box-shadow: 0 0 24px rgba(255,214,0,0.9), inset 0 0 10px rgba(255,214,0,0.3); }
    }

    /* 💰 파티클 날아오름 */
    @keyframes particleFly {
      0%   { transform: translate(0,0) scale(1) rotate(0deg); opacity: 1; }
      70%  { opacity: 1; }
      100% {
        transform: translate(var(--dx), var(--dy)) scale(0.5) rotate(360deg);
        opacity: 0;
      }
    }

    /* 🏆 콤보 등장 - translateX(-50%)와 충돌하지 않도록 Y축만 사용 */
    @keyframes comboSlideIn {
      0%   { opacity: 0; transform: translateX(-50%) translateY(-12px); }
      60%  { opacity: 1; transform: translateX(-50%) translateY(3px); }
      100% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    /* 🏆 콤보 퇴장 */
    @keyframes comboFadeOut {
      0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-8px); }
    }

    /* 화면 플래시 */
    @keyframes flashFade {
      0%   { opacity: 1; }
      100% { opacity: 0; }
    }

    /* ─────────────────────────────────────── */
    /* 타이틀 화면 전용 애니메이션              */
    /* ─────────────────────────────────────── */

    /* 타이틀 화면 등장 */
    @keyframes titleEnter {
      0%   { opacity: 0; transform: translateY(30px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0)    scale(1); }
    }

    /* 시작 버튼 맥박 */
    @keyframes pulseBtn {
      0%,100% { box-shadow: 0 6px 24px rgba(255,107,0,0.5); }
      50%      { box-shadow: 0 8px 36px rgba(255,107,0,0.8); }
    }

    /* 물고기 바운스 */
    @keyframes fishBounce {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-5px); }
    }

    /* 배경 떠다니는 이모지 */
    @keyframes floatEmoji {
      0%   { transform: translateY(0)    rotate(0deg); }
      100% { transform: translateY(-18px) rotate(8deg); }
    }

    /* 튜토리얼 모달 팝업 */
    @keyframes modalPop {
      0%   { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
    }

    /* 튜토리얼 이모지 팝 */
    @keyframes emojiPop {
      0%   { transform: scale(0.5) rotate(-10deg); opacity: 0; }
      70%  { transform: scale(1.15) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }

    /* 버튼 눌림 */
    button:active { transform: scale(0.94); }

    /* 스크롤바 숨김 */
    ::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(styleSheet);
}

export default BungeoppangTycoon;