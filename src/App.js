// ============================================================
// 📁 App.js — 게임 화면 메인 파일
// 데이터는 gameData.js에서, 효과음은 sounds.js에서 가져와요.
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

// 게임 데이터 불러오기 (손님, 색상, 튜토리얼 등)
import { THEME, PAN_IMAGES, customerTypes, vipCustomer, TUTORIAL_STEPS, GAME_CONFIG } from './gameData';
// 효과음 불러오기
import { sound, unlockAudio } from './sounds';

// ============================================================
// 🔥 Firebase 설정
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyA8DTzhTjfEecRogZolb03c5q7KvXFMhkk",
  authDomain: "bungeoppang-tycoon.firebaseapp.com",
  projectId: "bungeoppang-tycoon",
  storageBucket: "bungeoppang-tycoon.firebasestorage.app",
  messagingSenderId: "614099740181",
  appId: "1:614099740181:web:5413df48ac6cb29b17d01c"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ============================================================
// 🎬 CSS 애니메이션 (한 번만 추가됨)
// ============================================================
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes toastPop { 0%{transform:scale(0.5) translateY(10px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
    @keyframes toastFadeOut { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0.9)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
    @keyframes customerEnter { 0%{opacity:0;transform:translateY(20px) scale(0.7)} 60%{opacity:1;transform:translateY(-6px) scale(1.05)} 100%{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes customerLeave { 0%{opacity:1;transform:translateY(0) scale(1)} 30%{opacity:1;transform:translateY(-10px) scale(1.05)} 100%{opacity:0;transform:translateY(-30px) scale(0.6)} }
    @keyframes bubbleFadeIn { 0%{opacity:0;transform:translateY(6px) scale(0.8)} 100%{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes panShake { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-3px) rotate(-1.5deg)} 75%{transform:translateY(-3px) rotate(1.5deg)} }
    @keyframes readyGlow { 0%{box-shadow:0 0 12px rgba(255,214,0,0.5),inset 0 0 4px rgba(255,214,0,0.1)} 100%{box-shadow:0 0 24px rgba(255,214,0,0.9),inset 0 0 10px rgba(255,214,0,0.3)} }
    @keyframes particleFly { 0%{transform:translate(0,0) scale(1) rotate(0deg);opacity:1} 70%{opacity:1} 100%{transform:translate(var(--dx),var(--dy)) scale(0.5) rotate(360deg);opacity:0} }
    @keyframes comboSlideIn { 0%{opacity:0;transform:translateX(-50%) translateY(-12px)} 60%{opacity:1;transform:translateX(-50%) translateY(3px)} 100%{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes comboFadeOut { 0%{opacity:1;transform:translateX(-50%) translateY(0)} 100%{opacity:0;transform:translateX(-50%) translateY(-8px)} }
    @keyframes flashFade { 0%{opacity:1} 100%{opacity:0} }
    @keyframes titleEnter { 0%{opacity:0;transform:translateY(30px) scale(0.95)} 100%{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes pulseBtn { 0%,100%{box-shadow:0 6px 24px rgba(255,107,0,0.5)} 50%{box-shadow:0 8px 36px rgba(255,107,0,0.8)} }
    @keyframes fishBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    @keyframes floatEmoji { 0%{transform:translateY(0) rotate(0deg)} 100%{transform:translateY(-18px) rotate(8deg)} }
    @keyframes modalPop { 0%{transform:translate(-50%,-50%) scale(0.8);opacity:0} 100%{transform:translate(-50%,-50%) scale(1);opacity:1} }
    @keyframes emojiPop { 0%{transform:scale(0.5) rotate(-10deg);opacity:0} 70%{transform:scale(1.15) rotate(5deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
    @keyframes dimFadeIn { 0%{opacity:0} 100%{opacity:1} }
    @keyframes resultBoxPop { 0%{transform:scale(0.82);opacity:0} 70%{transform:scale(1.03);opacity:1} 100%{transform:scale(1);opacity:1} }
    @keyframes gameoverSlideUp { 0%{opacity:0;transform:translate(-50%,-50%) translateY(60px)} 65%{opacity:1;transform:translate(-50%,-50%) translateY(-8px)} 100%{opacity:1;transform:translate(-50%,-50%) translateY(0)} }
    @keyframes gameoverTitlePulse { 0%,100%{text-shadow:0 0 20px rgba(255,71,87,0.7),0 0 40px rgba(255,71,87,0.4)} 50%{text-shadow:0 0 40px rgba(255,71,87,1),0 0 80px rgba(255,71,87,0.6)} }
    button:active { transform:scale(0.94); }
    ::-webkit-scrollbar { display:none; }
    .ranking-list::-webkit-scrollbar { display:block; width:4px; }
    .ranking-list::-webkit-scrollbar-track { background:rgba(255,255,255,0.05); border-radius:2px; }
    .ranking-list::-webkit-scrollbar-thumb { background:rgba(255,171,0,0.4); border-radius:2px; }
    .ranking-list::-webkit-scrollbar-thumb:hover { background:rgba(255,171,0,0.7); }
  `;
  document.head.appendChild(styleSheet);
}

// ============================================================
// 💰 파티클 이펙트 (돈, 별 등 날아가는 이모지)
// ============================================================
const ParticleEffect = ({ particles }) => (
  <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:3000 }}>
    {particles.map(p => (
      <div key={p.id} style={{
        position:'absolute', left:p.x, top:p.y, fontSize:p.size,
        fontWeight:'bold', color:p.color, textShadow:`0 0 10px ${p.color}`,
        animation:`particleFly ${p.duration}ms ease-out forwards`,
        '--dx':`${p.dx}px`, '--dy':`${p.dy}px`,
        transformOrigin:'center', pointerEvents:'none', userSelect:'none',
      }}>{p.emoji}</div>
    ))}
  </div>
);

// ============================================================
// 🏆 콤보 표시
// ============================================================
const ComboDisplay = ({ combo, fading }) => {
  if (combo < 2) return null;
  const colors = ['#ffd600','#ff6b00','#ff1744','#d500f9','#00e5ff'];
  const color = colors[Math.min(combo - 2, colors.length - 1)];
  const scale = Math.min(1 + (combo - 1) * 0.08, 1.6);
  return (
    <div style={{
      position:'fixed', top:'18%', left:'50%', transform:'translateX(-50%)',
      zIndex:2500, textAlign:'center', pointerEvents:'none',
      animation: fading ? 'comboFadeOut 0.5s ease forwards' : 'comboSlideIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
    }}>
      <div style={{ transform:`scale(${scale})`, transformOrigin:'center top' }}>
        <div style={{ fontSize:combo>=5?'30px':'22px', fontWeight:'900', color,
          textShadow:`0 0 20px ${color}, 0 2px 4px rgba(0,0,0,0.8)`,
          letterSpacing:'-1px', fontFamily:"'Impact', sans-serif", whiteSpace:'nowrap' }}>
          {combo >= 10 ? '🔥' : ''}{combo} COMBO!{combo >= 5 ? ' 🔥' : ''}
        </div>
        {combo >= 5 && (
          <div style={{ fontSize:'12px', color:'#fff', fontWeight:'bold', marginTop:'2px',
            textShadow:'0 1px 4px rgba(0,0,0,0.8)', whiteSpace:'nowrap' }}>
            {combo >= 10 ? '🎆 대박 콤보!!' : '🎉 콤보 보너스!'}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// 🌟 화면 번쩍임 효과
// ============================================================
const ScreenFlash = ({ flash }) => {
  if (!flash) return null;
  return (
    <div style={{
      position:'fixed', top:0, left:0, right:0, bottom:0,
      background:'radial-gradient(circle, rgba(255,214,0,0.3) 0%, transparent 70%)',
      zIndex:2400, pointerEvents:'none', animation:'flashFade 0.5s ease-out forwards',
    }} />
  );
};

// ============================================================
// 🏆 랭킹 화면 (일간 / 전체 탭 구분)
// ============================================================
const RankingScreen = ({ onClose, currentScore, currentLevel, currentPlayTime = 0, onStartGame }) => {
  // ── 탭 상태: 'daily' = 일간 랭킹, 'alltime' = 전체 랭킹
  const [activeTab, setActiveTab]   = useState('daily');

  // ── 전체 랭킹 관련 상태
  const [allRankings, setAllRankings]   = useState([]);
  const [allLoading, setAllLoading]     = useState(true);
  const [allCanEnter, setAllCanEnter]   = useState(null);
  const [allTotalRank, setAllTotalRank] = useState(null);

  // ── 일간 랭킹 관련 상태
  const [dailyRankings, setDailyRankings] = useState([]);
  const [dailyLoading, setDailyLoading]   = useState(true);
  const [dailyCanEnter, setDailyCanEnter] = useState(null);
  const [dailyTotalRank, setDailyTotalRank] = useState(null);

  // ── 공통 닉네임 / 등록 상태
  const [nickname, setNickname]     = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(''); // 등록 실패 시 에러 메시지
  const [myAllRank, setMyAllRank]   = useState(null);
  const [myDailyRank, setMyDailyRank] = useState(null);

  // 오늘 날짜를 "2025년 6월 15일" 형식으로 만들어요
  const todayLabel = (() => {
    const d = new Date();
    return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
  })();

  // 오늘 자정(00:00:00) 기준 Date 객체 — 일간 랭킹 필터링에 사용해요
  const todayStart = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  // ── 전체 랭킹 불러오기
  const fetchAllRankings = useCallback(async () => {
    setAllLoading(true);
    try {
      const qAll = query(collection(db, 'rankings'), orderBy('score', 'desc'));
      const snapAll = await getDocs(qAll);
      const allScores = snapAll.docs.map(d => d.data().score);
      const myPosition = allScores.filter(s => s > currentScore).length + 1;
      const top10 = snapAll.docs.slice(0, 10).map((doc, i) => ({ id: doc.id, rank: i + 1, ...doc.data() }));
      setAllRankings(top10);
      if (currentScore > 0) {
        const isInTop10 = top10.length < 10 || currentScore > (top10[top10.length - 1]?.score ?? 0);
        setAllCanEnter(isInTop10);
        if (!isInTop10) setAllTotalRank(myPosition);
      }
      return top10;
    } catch(e) { console.error('전체 랭킹 불러오기 실패:', e); return []; }
    finally { setAllLoading(false); }
  }, [currentScore]);

  // ── 일간 랭킹 불러오기 (오늘 날짜 기록만 필터링)
  const fetchDailyRankings = useCallback(async () => {
    setDailyLoading(true);
    try {
      const qAll = query(collection(db, 'rankings'), orderBy('score', 'desc'));
      const snapAll = await getDocs(qAll);

      // 오늘 자정 이후에 등록된 기록만 골라요
      const todayDocs = snapAll.docs.filter(doc => {
        const data = doc.data();
        // Firebase Timestamp → JS Date 변환
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        return createdAt >= todayStart;
      });

      const dailyScores = todayDocs.map(d => d.data().score);
      const myPosition = dailyScores.filter(s => s > currentScore).length + 1;
      const top10 = todayDocs.slice(0, 10).map((doc, i) => ({ id: doc.id, rank: i + 1, ...doc.data() }));
      setDailyRankings(top10);

      if (currentScore > 0) {
        const isInTop10 = top10.length < 10 || currentScore > (top10[top10.length - 1]?.score ?? 0);
        setDailyCanEnter(isInTop10);
        if (!isInTop10) setDailyTotalRank(myPosition);
      }
      return top10;
    } catch(e) { console.error('일간 랭킹 불러오기 실패:', e); return []; }
    finally { setDailyLoading(false); }
  }, [currentScore]);

  useEffect(() => {
    fetchAllRankings();
    fetchDailyRankings();
  }, [fetchAllRankings, fetchDailyRankings]);

  // ── 점수 등록 (전체 + 일간 동시에 반영)
  const handleSubmit = async () => {
    if (!nickname.trim() || submitting) return;

    setSubmitting(true);
    try {
      setSubmitError(''); // 이전 에러 초기화
      await addDoc(collection(db, 'rankings'), {
        nickname: nickname.trim().slice(0, 10),
        score: currentScore,
        level: currentLevel,
        playTime: currentPlayTime,
        createdAt: new Date(),
      });
      setSubmitted(true);
      // 등록 후 양쪽 랭킹 모두 새로고침
      const [updatedAll, updatedDaily] = await Promise.all([fetchAllRankings(), fetchDailyRankings()]);
      const myAllIdx   = updatedAll.findIndex(r => r.nickname === nickname.trim() && r.score === currentScore);
      const myDailyIdx = updatedDaily.findIndex(r => r.nickname === nickname.trim() && r.score === currentScore);
      if (myAllIdx   !== -1) setMyAllRank(myAllIdx + 1);
      if (myDailyIdx !== -1) setMyDailyRank(myDailyIdx + 1);
    } catch(e) {
      console.error('점수 등록 실패:', e);
      setSubmitError('등록에 실패했어요. 인터넷 연결을 확인하고 다시 시도해보세요 📶');
    }
    finally { setSubmitting(false); }
  };

  const medals = ['🥇','🥈','🥉'];
  const RS = rankingStyles;

  // ── 현재 탭에 맞는 데이터 선택
  const isDaily    = activeTab === 'daily';
  const rankings   = isDaily ? dailyRankings   : allRankings;
  const loading    = isDaily ? dailyLoading    : allLoading;
  const canEnter   = isDaily ? dailyCanEnter   : allCanEnter;
  const totalRank  = isDaily ? dailyTotalRank  : allTotalRank;
  const myRank     = isDaily ? myDailyRank     : myAllRank;

  // ── 랭킹 목록 렌더링 (탭 공통 사용)
  const renderList = () => {
    if (loading) return <div style={RS.loading}>불러오는 중... 🐟</div>;

    // 일간 랭킹이 비어있을 때 → 게임 유도 버튼 표시
    if (rankings.length === 0 && isDaily) {
      return (
        <div style={{ textAlign:'center', padding:'24px 12px', flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontSize:'36px', marginBottom:'10px' }}>🏆</div>
          <div style={{ fontSize:'14px', fontWeight:'800', color:'#fff', marginBottom:'6px' }}>
            오늘의 1등 자리가 비어있어요!
          </div>
          <div style={{ fontSize:'12px', color:'rgba(255,248,240,0.5)', marginBottom:'18px' }}>
            {todayLabel} 첫 번째 주인공이 되세요 🌟
          </div>
          {/* 게임 시작 유도 버튼 — 클릭하면 랭킹 팝업 닫고 게임 즉시 시작 */}
          <button
            onClick={() => { onClose(); if (onStartGame) onStartGame(); }}
            style={{
              background:'linear-gradient(135deg,#ff6b00,#ff8c00)',
              border:'none', borderRadius:'25px', color:'#fff',
              fontSize:'14px', fontWeight:'900', padding:'13px 24px',
              cursor:'pointer', boxShadow:'0 4px 20px rgba(255,107,0,0.5)',
              WebkitTapHighlightColor:'transparent', letterSpacing:'0.5px',
              animation:'pulseBtn 2s ease-in-out infinite',
            }}
          >🐟 지금 랭킹 올라보기</button>
        </div>
      );
    }

    // 전체 랭킹이 비어있을 때
    if (rankings.length === 0) {
      return <div style={{ ...RS.empty, flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>아직 기록이 없어요. 첫 번째 주인공이 되세요! 🌟</div>;
    }

    return (
      <div className="ranking-list" style={RS.listWrapper}>
        {rankings.map((r, i) => {
          const isMe = submitted && r.nickname === nickname.trim() && r.score === currentScore;
          return (
            <div key={r.id} style={{
              ...RS.rankRow,
              background: isMe ? 'linear-gradient(135deg,rgba(255,171,0,0.25),rgba(255,107,0,0.15))' : i%2===0 ? 'rgba(255,255,255,0.04)' : 'transparent',
              border: isMe ? '1px solid rgba(255,171,0,0.5)' : '1px solid transparent',
            }}>
              {/* TOP3는 메달 이모지, 4위부터는 숫자 */}
              <span style={RS.rankNum}>{i < 3 ? medals[i] : `${i+1}위`}</span>
              <span style={RS.rankName}>
                {r.nickname}
                {isMe && <span style={{ fontSize:'10px', color:THEME.accentGold, marginLeft:'4px' }}>← 나</span>}
              </span>
              <span style={RS.rankLevel}>Lv.{r.level}</span>
              <span style={RS.rankScore}>{r.score.toLocaleString()}점</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9995, pointerEvents:'auto' }}>
      <div style={{ ...RS.dim, zIndex:9995 }} onClick={onClose} />
      <div style={{ ...RS.modal, zIndex:9996 }} onClick={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
        <button onClick={onClose} style={RS.closeBtn}>✕</button>
        <div style={RS.title}>{isDaily ? '🏆 오늘 랭킹 TOP 10' : '🏆 랭킹 TOP 10'}</div>

        {/* ── 탭 버튼 (일간 / 전체) ── */}
        <div style={RS.tabRow}>
          <button
            onClick={() => setActiveTab('daily')}
            style={{ ...RS.tabBtn, ...(isDaily ? RS.tabBtnActive : {}) }}
          >🌟 일간 랭킹</button>
          <button
            onClick={() => setActiveTab('alltime')}
            style={{ ...RS.tabBtn, ...(!isDaily ? RS.tabBtnActive : {}) }}
          >🏆 전체 랭킹</button>
        </div>



        {/* ── 점수 등록 영역 (게임 오버 후에만 표시) ── */}
        {currentScore > 0 && !submitted && !loading && (
          <>
            {canEnter && (
              <div style={RS.submitBox}>
                <div style={RS.submitScore}>
                  내 점수: <span style={{ color:THEME.accentGold, fontWeight:'900' }}>{currentScore.toLocaleString()}점</span>
                  <span style={{ fontSize:'11px', color:'#4ade80', marginLeft:'8px', fontWeight:'700' }}>🎉 TOP 10 진입!</span>
                </div>
                <div style={RS.inputRow}>
                  <input type="text" placeholder="닉네임 입력 (최대 10자)"
                    value={nickname} onChange={e => { setNickname(e.target.value); setSubmitError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    onClick={e => e.stopPropagation()}
                    maxLength={10} style={{ ...RS.input, touchAction:'manipulation' }}
                    inputMode="text" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                    onTouchEnd={(e) => { e.stopPropagation(); }}
                    disabled={!nickname.trim() || submitting}
                    style={{ ...RS.submitBtn, opacity: !nickname.trim() || submitting ? 0.5 : 1, pointerEvents: !nickname.trim() || submitting ? 'none' : 'auto', touchAction:'manipulation', WebkitTapHighlightColor:'transparent' }}>
                    {submitting ? '⏳' : '등록'}
                  </button>
                </div>
                {/* 등록 실패 에러 메시지 */}
                {submitError && (
                  <div style={{ marginTop:'8px', fontSize:'12px', fontWeight:'700', color:'#ff6b6b', textAlign:'center', lineHeight:'1.5' }}>
                    ⚠️ {submitError}
                  </div>
                )}
              </div>
            )}
            {canEnter === false && (
              <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,171,0,0.2)', borderRadius:'12px', padding:'14px 16px', marginBottom:'14px', textAlign:'center' }}>
                <div style={{ fontSize:'13px', color:'rgba(255,248,240,0.6)', marginBottom:'4px' }}>
                  내 점수: <span style={{ color:THEME.accentGold, fontWeight:'900' }}>{currentScore.toLocaleString()}점</span>
                </div>
                <div style={{ fontSize:'15px', fontWeight:'900', color:'#fff', lineHeight:'1.6' }}>
                  😢 아쉽지만 {isDaily ? '오늘' : '전체'} <span style={{ color:THEME.accentYellow }}>{totalRank}위</span>예요!
                </div>
                <div style={{ fontSize:'12px', color:'rgba(255,248,240,0.5)', marginTop:'4px' }}>다시 한번 도전?! 💪</div>
              </div>
            )}
          </>
        )}

        {/* 등록 성공 메시지 */}
        {submitted && myRank && (
          <div style={RS.myRankBox}>🎉 {isDaily ? '오늘' : '전체'} {myRank <= 10 ? `${myRank}위로 등록됐어요!` : '랭킹에 등록됐어요!'}</div>
        )}

        {/* ── 랭킹 목록 ── */}
        {renderList()}
      </div>
    </div>
  );
};

// ============================================================
// 🎬 타이틀 화면
// ============================================================
const TitleScreen = ({ onStart, onTutorial, onRanking }) => (
  <div style={titleStyles.container}>
    <div style={titleStyles.bg} />
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      {['🐟','🐟','✨','🪙','🔥','⭐','🐟','💰'].map((emoji, i) => (
        <span key={i} style={{
          position:'absolute', fontSize:`${16+(i%3)*8}px`,
          left:`${10+i*11}%`, top:`${5+(i%4)*20}%`, opacity:0.18,
          animation:`floatEmoji ${3+i*0.4}s ease-in-out infinite alternate`,
          animationDelay:`${i*0.3}s`,
        }}>{emoji}</span>
      ))}
    </div>
    <div style={titleStyles.content}>
      <div style={titleStyles.signBoard}>
        <div style={titleStyles.signDecor}>✦ ────── ✦</div>
        <div style={titleStyles.fishRow}>🐟 🐟 🐟</div>
        <div style={titleStyles.mainTitle}>서경이네</div>
        <div style={titleStyles.subTitle}>붕어빵 타이쿤</div>
        <div style={titleStyles.signDecor}>✦ ────── ✦</div>
      </div>
      <div style={titleStyles.catchCopy}>달콤한 붕어빵 가게를 운영해보세요! 🍞</div>
      <div style={titleStyles.buttonArea}>
        <button onClick={onStart} style={titleStyles.startButton}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
          <span style={{ fontSize:'22px' }}>🐟</span><span>게임 시작</span>
        </button>
        <button onClick={onTutorial} style={titleStyles.tutorialButton}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,171,0,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,171,0,0.08)'}>
          <span style={{ fontSize:'18px' }}>📖</span><span>게임 튜토리얼</span>
        </button>
        <button onClick={onRanking} style={titleStyles.rankingButton}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,214,0,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,214,0,0.08)'}>
          <span style={{ fontSize:'18px' }}>🏆</span><span>전체 랭킹</span>
        </button>
      </div>
      <div style={titleStyles.hint}>탭하고, 굽고, 팔아요!</div>
    </div>
  </div>
);

// ============================================================
// 📖 튜토리얼 팝업
// ============================================================
const TutorialModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const total = TUTORIAL_STEPS.length;
  const current = TUTORIAL_STEPS[step];
  const isLast = step === total - 1;
  const TS = tutorialStyles;
  return (
    <>
      <div style={TS.dim} onClick={onClose} />
      <div style={TS.modal}>
        <button onClick={onClose} style={TS.closeBtn}>✕</button>
        <div style={TS.modalTitle}>📖 튜토리얼</div>
        <div style={TS.dots}>
          {TUTORIAL_STEPS.map((_, i) => (
            <div key={i} onClick={() => setStep(i)} style={{
              ...TS.dot,
              background: i===step ? THEME.accentGold : 'rgba(255,171,0,0.25)',
              transform: i===step ? 'scale(1.3)' : 'scale(1)',
            }} />
          ))}
        </div>
        <div style={TS.stepContent}>
          <div style={TS.stepEmoji}>{current.emoji}</div>
          <div style={TS.stepTitle}>{current.title}</div>
          <div style={TS.stepDesc}>
            {current.desc.split('\n').map((line, i) => (
              <span key={i}>{line}{i < current.desc.split('\n').length-1 && <br />}</span>
            ))}
          </div>
          <div style={TS.tipBox}>💡 {current.tip}</div>
        </div>
        <div style={TS.navButtons}>
          <button onClick={() => setStep(s => s-1)} disabled={step===0}
            style={{ ...TS.navBtn, opacity:step===0?0.3:1 }}>← 이전</button>
          {isLast
            ? <button onClick={onClose} style={TS.doneBtn}>시작하기! 🐟</button>
            : <button onClick={() => setStep(s => s+1)} style={TS.navBtn}>다음 →</button>}
        </div>
        <div style={TS.stepCount}>{step+1} / {total}</div>
      </div>
    </>
  );
};

// ============================================================
// 🎮 메인 게임 컴포넌트
// ============================================================
const BungeoppangTycoon = () => {
  const [screen, setScreen]           = useState('title');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showRanking, setShowRanking]   = useState(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const [isPaused, setIsPaused]         = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null); // ✅ 게임 시작 시간 기록용
  // 게임 오버 애니메이션 단계: 'idle' → 'intro'(딤+텍스트 등장) → 'done'(결과박스)
  const [gameoverPhase, setGameoverPhase] = useState('idle');

  const [money, setMoney]         = useState(0);
  const [score, setScore]         = useState(0);
  const [level, setLevel]         = useState(1);
  const [combo, setCombo]         = useState(0);
  const [lives, setLives]         = useState(GAME_CONFIG.maxLives);
  const [inventory, setInventory] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [particles, setParticles] = useState([]);
  const [screenFlash, setScreenFlash] = useState(false);
  const [comboKey, setComboKey]   = useState(0);
  const [comboFading, setComboFading] = useState(false);
  const [pans, setPans] = useState(
    Array(GAME_CONFIG.panCount).fill(null).map((_, i) => ({ id: i, state: 'empty', progress: 0 }))
  );
  const [gameState, setGameState]     = useState('playing');
  const [currentToast, setCurrentToast] = useState(null);
  const [shakeId, setShakeId]         = useState(null);
  const [enteringCustomers, setEnteringCustomers] = useState(new Set());
  const [leavingCustomers, setLeavingCustomers]   = useState(new Set());

  const customerSpawnTimer = useRef(null);
  const toastTimer         = useRef(null);
  const comboTimer         = useRef(null);
  const particleIdRef      = useRef(0);
  const gameoverTimer      = useRef(null); // 게임오버 애니메이션 타이머

  // ============================================================
  // 🤖 봇 감지 시스템
  // 클릭 간격을 기록해서 패턴이 너무 일정하면 봇으로 판단해요
  // ============================================================
  const clickTimestamps    = useRef([]);  // 최근 클릭 시간 기록
  const botWarningCount    = useRef(0);   // 경고 횟수
  const isBotBlocked       = useRef(false); // 봇으로 차단됐는지 여부

  // 봇 여부 판단 함수
  const checkBotPattern = useCallback(() => {
    const times = clickTimestamps.current;
    if (times.length < 10) return false; // 클릭이 10번 미만이면 판단 안 함

    // 최근 10번 클릭의 간격(ms) 계산
    const intervals = [];
    for (let i = 1; i < times.length; i++) {
      intervals.push(times[i] - times[i - 1]);
    }

    // ① 최소 클릭 간격 체크: 80ms 미만이면 사람이 물리적으로 불가능
    const tooFast = intervals.filter(v => v < 80).length;
    const isTooFast = tooFast >= 3; // 10번 중 3번 이상 80ms 미만

    // ② 클릭 간격 분산 체크: 너무 일정하면 봇
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / intervals.length;
    const isTooPerfect = variance < 400 && avg < 500; // 분산이 400 미만이면 비정상적으로 일정함

    // ③ 과다 클릭 체크: 3초 안에 20번 이상
    const now = Date.now();
    const recentClicks = times.filter(t => now - t < 3000).length;
    const isTooMany = recentClicks >= 20;

    // 3가지 중 2가지 이상 해당하면 봇으로 판단
    const suspiciousCount = [isTooFast, isTooPerfect, isTooMany].filter(Boolean).length;
    return suspiciousCount >= 2;
  }, []);

  // 📱 모바일 오디오 잠금 해제
  useEffect(() => {
    const handler = () => unlockAudio();
    document.addEventListener('touchstart', handler, { passive: true });
    document.addEventListener('touchend',   handler, { passive: true });
    document.addEventListener('click',      handler, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('touchend',   handler);
      document.removeEventListener('click',      handler);
    };
  }, []);

  // 🎬 게임 오버 애니메이션 자동 시퀀스
  // gameState가 'gameover'가 되면 → 딤+텍스트 등장(intro) → 2초 후 랭킹 팝업 자동 오픈(done)
  useEffect(() => {
    if (gameState === 'gameover') {
      setGameoverPhase('intro'); // 딤 페이드인 + Game Over 텍스트 등장
      gameoverTimer.current = setTimeout(() => {
        setGameoverPhase('done'); // 2초 후 랭킹 팝업 자동 오픈
        if (!isBotBlocked.current) setShowRanking(true);
      }, 2000);
    } else {
      setGameoverPhase('idle'); // 게임 재시작 시 초기화
      if (gameoverTimer.current) clearTimeout(gameoverTimer.current);
    }
    return () => { if (gameoverTimer.current) clearTimeout(gameoverTimer.current); };
  }, [gameState]);

  // 스크롤/줌 방지
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

  // 이미지 경로 (PUBLIC_URL 포함)
  const IMAGES = Object.fromEntries(
    Object.entries(PAN_IMAGES).map(([k, v]) => [k, process.env.PUBLIC_URL + v])
  );

  // 파티클 생성
  const spawnParticles = useCallback((x, y, count = 6, type = 'money') => {
    const emojiSets = { money:['💰','🪙','✨','💵'], star:['⭐','🌟','✨','💫'], combo:['🔥','⭐','💥','🎉','✨'] };
    const colorSets = { money:['#ffd600','#ff6b00','#ffab00','#fff176'], star:['#ffd600','#fff176','#ffee58','#ffe082'], combo:['#ff1744','#ff6b00','#ffd600','#d500f9','#00e5ff'] };
    const emojis = emojiSets[type] || emojiSets.money;
    const colors = colorSets[type] || colorSets.money;
    const newParticles = Array.from({ length: count }, () => {
      const id = ++particleIdRef.current;
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 100;
      return { id, x:x+(Math.random()-0.5)*40, y:y+(Math.random()-0.5)*20,
        dx:Math.cos(angle)*speed, dy:Math.sin(angle)*speed-60,
        emoji:emojis[Math.floor(Math.random()*emojis.length)],
        color:colors[Math.floor(Math.random()*colors.length)],
        size:`${14+Math.random()*10}px`, duration:700+Math.random()*400 };
    });
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => { setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id))); }, 1200);
  }, []);

  // 토스트 메시지 (화면 중간에 잠깐 뜨는 알림)
  const showToast = useCallback((text, type = 'normal') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setCurrentToast({ id: Date.now(), text, type, fading: false });
    toastTimer.current = setTimeout(() => {
      setCurrentToast(prev => prev ? { ...prev, fading: true } : null);
      setTimeout(() => setCurrentToast(null), 500);
    }, 800);
  }, []);

  // 게임 초기화
  const resetGame = () => {
    setShowRanking(false);   // ✅ 랭킹 팝업 반드시 닫기 (이전 게임 상태 완전 초기화)
    setMoney(0); setScore(0); setLevel(1); setCombo(0);
    setLives(GAME_CONFIG.maxLives); setInventory(0);
    setCustomers([]); setParticles([]);
    setPans(Array(GAME_CONFIG.panCount).fill(null).map((_, i) => ({ id: i, state: 'empty', progress: 0 })));
    setGameState('playing'); setIsPaused(false);
    setGameStartTime(Date.now()); // ✅ 게임 시작 시간 기록
    // 봇 감지 초기화
    clickTimestamps.current = [];
    botWarningCount.current = 0;
    isBotBlocked.current = false;
  };

  const handleStartGame = () => {
    unlockAudio();
    resetGame();
    setScreen('playing');
    showToast('붕어빵 장사 시작! 화이팅! 💪', 'normal');
  };

  // 손님 등장
  useEffect(() => {
    if (screen !== 'playing' || gameState !== 'playing' || isPaused) return;
    const spawnInterval = Math.max(1500, 3500 - level * 250);
    customerSpawnTimer.current = setInterval(() => {
      if (customers.length < GAME_CONFIG.maxCustomers) {
        const isVIP = level >= GAME_CONFIG.vipMinLevel && Math.random() < GAME_CONFIG.vipSpawnChance;
        const type = isVIP ? vipCustomer : customerTypes[Math.floor(Math.random() * customerTypes.length)];
        const orderCount = Math.min(level, 3) + Math.floor(Math.random() * 2) + 1;
        const newId = Date.now();
        if (isVIP) sound('vip');
        setEnteringCustomers(prev => new Set(prev).add(newId));
        setTimeout(() => { setEnteringCustomers(prev => { const s = new Set(prev); s.delete(newId); return s; }); }, 600);
        setCustomers(prev => [...prev, { id: newId, ...type, orderCount, currentPatience: type.patience, waiting: true, satisfied: false, isVIP }]);
      }
    }, spawnInterval);
    return () => clearInterval(customerSpawnTimer.current);
  }, [customers.length, level, gameState, screen, isPaused]);

  // 인내심 감소 + 굽기 진행 타이머
  useEffect(() => {
    if (screen !== 'playing' || gameState !== 'playing' || isPaused) return;
    const patienceSpeed = Math.max(1500, 3000 - level * 150);

    const patienceTimer = setInterval(() => {
      setCustomers(prev => prev.map(c => {
        if (c.satisfied) return c;
        if (c.currentPatience > 0) return { ...c, currentPatience: c.currentPatience - 1 };
        sound('warning');
        setLives(l => {
          const nl = l - 1;
          if (nl <= 0) { sound('gameover'); setGameState('gameover'); setScreen('gameover'); }
          return nl;
        });
        showToast('손님이 화나서 떠났어요! 💔', 'warning');
        setCombo(0);
        return null;
      }).filter(Boolean));
    }, patienceSpeed);

    const cookingTimer = setInterval(() => {
      setPans(prev => prev.map(pan => {
        if (pan.state !== 'empty' && pan.state !== 'burnt') {
          const newProgress = pan.progress + GAME_CONFIG.cookProgressStep;
          if (newProgress >= 100) return { ...pan, state: 'burnt', progress: 100 };
          return { ...pan, progress: newProgress };
        }
        return pan;
      }));
    }, GAME_CONFIG.cookTimerMs);

    return () => { clearInterval(patienceTimer); clearInterval(cookingTimer); };
  }, [screen, gameState, level, showToast, isPaused]);

  // 판 클릭 처리
  const handlePanClick = (panId) => {
    unlockAudio();
    if (screen !== 'playing' || gameState !== 'playing' || isPaused) return;

    // 🤖 봇 감지 체크
    if (isBotBlocked.current) {
      showToast('🤖 비정상적인 플레이가 감지됐어요!', 'warning');
      return;
    }
    // 클릭 시간 기록 (최근 20개만 유지)
    clickTimestamps.current.push(Date.now());
    if (clickTimestamps.current.length > 20) clickTimestamps.current.shift();

    // 봇 패턴 감지
    if (checkBotPattern()) {
      botWarningCount.current += 1;
      if (botWarningCount.current >= 3) {
        // 경고 3회 이상 → 점수 등록 차단 플래그
        isBotBlocked.current = true;
        showToast('🤖 봇 사용이 감지됐어요! 랭킹 등록이 차단됩니다.', 'warning');
        sound('warning');
        return;
      }
      showToast(`🤖 비정상적인 클릭 패턴! 경고 ${botWarningCount.current}/3`, 'warning');
      sound('warning');
      return;
    }

    const MIN = GAME_CONFIG.goodTimingMin;
    setPans(prev => prev.map(pan => {
      if (pan.id !== panId) return pan;
      if (pan.state === 'empty')                   { sound('pan');     return { ...pan, state: 'dough',   progress: 0 }; }
      if (pan.state === 'dough'   && pan.progress >= MIN) { sound('pan'); return { ...pan, state: 'red',     progress: 0 }; }
      if (pan.state === 'red'     && pan.progress >= MIN) { sound('pan'); return { ...pan, state: 'cooking', progress: 0 }; }
      if (pan.state === 'cooking' && pan.progress >= MIN) { sound('pan'); return { ...pan, state: 'ready',   progress: 0 }; }
      if (pan.state === 'ready')  { sound('ready'); setInventory(i => i + 1); return { ...pan, state: 'empty', progress: 0 }; }
      if (pan.state === 'burnt')  {
        sound('warning');
        setLives(l => { const nl = l-1; if (nl<=0){ sound('gameover'); setGameState('gameover'); setScreen('gameover'); } return nl; });
        showToast('붕어빵이 탔어요! 생명 -1 💔', 'warning');
        setCombo(0);
        return { ...pan, state: 'empty', progress: 0 };
      }
      return pan;
    }));
  };

  // 손님 클릭 처리 (판매)
  const handleCustomerClick = (id, event) => {
    unlockAudio();
    if (screen !== 'playing' || gameState !== 'playing' || isPaused) return;
    const customer = customers.find(c => c.id === id);
    if (!customer || customer.satisfied) return;

    if (inventory < customer.orderCount) {
      sound('warning');
      setShakeId(id);
      setTimeout(() => setShakeId(null), 400);
      showToast(`붕어빵이 부족합니다! (필요: ${customer.orderCount}개)`, 'warning');
      return;
    }

    const nc = combo + 1;
    const comboBonus = combo * 100 * customer.orderCount;
    const totalPay = customer.pay * customer.orderCount + comboBonus;
    const rect = event?.currentTarget?.getBoundingClientRect?.();
    const px = rect ? rect.left + rect.width/2 : window.innerWidth/2;
    const py = rect ? rect.top + rect.height/2 : window.innerHeight/2;
    spawnParticles(px, py, customer.isVIP ? 12 : Math.min(4 + customer.orderCount*2, 10), customer.isVIP ? 'star' : 'money');

    if (nc >= 5) {
      sound('combo');
      setScreenFlash(true);
      setTimeout(() => setScreenFlash(false), 500);
      spawnParticles(window.innerWidth/2, window.innerHeight/2, 15, 'combo');
    } else {
      sound('sell');
    }

    if (comboTimer.current) clearTimeout(comboTimer.current);
    setComboFading(false);
    setComboKey(k => k + 1);
    comboTimer.current = setTimeout(() => { setComboFading(true); }, 800);

    setInventory(inv => inv - customer.orderCount);
    setMoney(m => m + totalPay);
    setScore(s => {
      const newScore = s + totalPay;
      if (Math.floor(newScore / GAME_CONFIG.scorePerLevel) > Math.floor(s / GAME_CONFIG.scorePerLevel)) {
        setLevel(l => l + 1);
        sound('levelup');
        showToast(`레벨 ${level + 1}! 🎊`, 'normal');
      }
      return newScore;
    });
    setCombo(nc);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, satisfied: true } : c));
    setLeavingCustomers(prev => new Set(prev).add(id));
    showToast(customer.isVIP
      ? `VIP 판매 성공! ⭐×${customer.orderCount} +${totalPay.toLocaleString()}원`
      : `${customer.orderCount}개 판매! +${totalPay.toLocaleString()}원${comboBonus > 0 ? ` (콤보+${comboBonus.toLocaleString()})` : ''}`, 'normal');
    setTimeout(() => {
      setCustomers(curr => curr.filter(c => c.id !== id));
      setLeavingCustomers(prev => { const s = new Set(prev); s.delete(id); return s; });
    }, 1200);
  };

  const getProgressColor = (p) => p < 60 ? '#3b82f6' : p < 84 ? '#22c55e' : '#ef4444';

  const getCustomerAnimation = (c) => {
    if (c.satisfied || leavingCustomers.has(c.id)) return 'customerLeave 1.2s ease-in forwards';
    if (enteringCustomers.has(c.id)) return 'customerEnter 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards';
    if (shakeId === c.id) return 'shake 0.4s';
    return 'none';
  };

  // ── 타이틀 화면 ──
  if (screen === 'title') {
    return (
      <>
        <TitleScreen onStart={handleStartGame} onTutorial={() => setShowTutorial(true)} onRanking={() => setShowRanking(true)} />
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
        {showRanking  && <RankingScreen onClose={() => setShowRanking(false)} currentScore={0} currentLevel={0} onStartGame={handleStartGame} />}
      </>
    );
  }

  // ── 게임 화면 ──
  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <ParticleEffect particles={particles} />
        <div key={comboKey}><ComboDisplay combo={combo} fading={comboFading} /></div>
        <ScreenFlash flash={screenFlash} />

        {/* 헤더 */}
        <div style={styles.header}>
          <div style={styles.signBoard}>
            <div style={styles.signDecor}>⊱ ─────── ⊰</div>
            <div style={styles.signText}>🐟 서경이네 붕어빵 🐟</div>
            <div style={styles.signDecor}>⊱ ─────── ⊰</div>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.statBox}>🪙 {money.toLocaleString()}원</div>
            <div style={styles.statBox}>⭐ Lv.{level}</div>
            <div style={{ ...styles.statBox,
              background: inventory > 0 ? 'linear-gradient(135deg,#065f46,#047857)' : 'linear-gradient(135deg,#7f1d1d,#991b1b)',
              border: `2px solid ${inventory > 0 ? '#34d399' : '#f87171'}`, color: '#fff',
            }}>🐟 재고: {inventory}개</div>
            <button onClick={() => { sound('pan'); setIsPaused(true); setShowHomeConfirm(true); }}
              style={styles.homeButton} title="타이틀로 돌아가기">🏠</button>
          </div>
          <div style={styles.lifeBox}>
            {Array.from({ length: GAME_CONFIG.maxLives }).map((_, i) => (
              <span key={i} style={{
                opacity: i < lives ? 1 : 0.15,
                filter: i < lives ? 'drop-shadow(0 0 4px #ff4757)' : 'none',
                transition: 'all 0.3s', fontSize: i < lives ? '16px' : '14px',
              }}>❤️</span>
            ))}
          </div>
        </div>

        {/* 손님 + 요리판 */}
        <div style={styles.content}>
          <div style={styles.customerArea}>
            {customers.length === 0 ? (
              <div style={styles.noCustomers}>손님 기다리는 중... 🌬️</div>
            ) : (
              customers.map(c => (
                <div key={c.id} style={{ ...styles.customerWrapper, animation: getCustomerAnimation(c) }}
                  onClick={(e) => handleCustomerClick(c.id, e)}>
                  {c.satisfied
                    ? <div style={styles.satisfiedBubble}>잘먹겠습니다! 😋</div>
                    : <div style={{ ...styles.orderBadge,
                        background: c.isVIP ? 'linear-gradient(135deg,#b45309,#d97706)' : 'linear-gradient(135deg,#dc2626,#ef4444)',
                        boxShadow: c.isVIP ? '0 0 8px rgba(251,191,36,0.8)' : '0 2px 8px rgba(239,68,68,0.5)' }}>×{c.orderCount}</div>
                  }
                  <img src={process.env.PUBLIC_URL + c.img} alt={c.name} style={{ ...styles.customerImage,
                    filter: c.isVIP ? 'drop-shadow(0 0 10px gold) drop-shadow(0 0 20px rgba(255,214,0,0.5))' : 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))' }} />
                  <div style={styles.patienceBar}>
                    <div style={{ ...styles.patienceFill,
                      width: `${(c.currentPatience/c.patience)*100}%`,
                      backgroundColor: c.currentPatience/c.patience>0.5?'#4ade80':c.currentPatience/c.patience>0.25?'#facc15':'#f87171',
                      boxShadow: c.currentPatience/c.patience<=0.25?'0 0 6px #f87171':'none' }} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ paddingLeft:'max(15px,env(safe-area-inset-left))', paddingRight:'max(15px,env(safe-area-inset-right))' }}>
            <div style={styles.cookingBoard}>
              <div style={styles.pansGrid}>
                {pans.map(pan => {
                  const isGoodTiming = pan.state !== 'empty' && pan.state !== 'burnt' && pan.state !== 'ready' && pan.progress >= GAME_CONFIG.goodTimingMin;
                  const isReady = pan.state === 'ready';
                  return (
                    <button key={pan.id} onClick={() => handlePanClick(pan.id)} style={{
                      ...styles.panButton,
                      animation: isReady ? 'readyGlow 0.8s ease-in-out infinite alternate' : isGoodTiming ? 'panShake 0.3s infinite' : 'none',
                      boxShadow: isReady ? '0 0 16px rgba(255,214,0,0.7),inset 0 0 8px rgba(255,214,0,0.2)' : isGoodTiming ? '0 0 6px rgba(140,160,200,0.25)' : '0 2px 8px rgba(0,0,0,0.4)',
                      border: isReady ? '2px solid #fbbf24' : isGoodTiming ? '2px solid rgba(150,170,210,0.45)' : '2px solid transparent',
                    }}>
                      <img src={IMAGES[pan.state]} alt={pan.state} style={{ ...styles.panImage, filter: pan.state==='burnt'?'grayscale(1) brightness(0.4)':'none' }} />
                      {pan.state !== 'empty' && pan.state !== 'burnt' && (
                        <div style={styles.progressContainer}>
                          <div style={styles.progressBarOuter}>
                            <div style={{ ...styles.progressBarInner, width:`${pan.progress}%`, backgroundColor: getProgressColor(pan.progress) }} />
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

        {/* 토스트 알림 */}
        <div style={styles.toastContainer}>
          {currentToast && (
            <div key={currentToast.id} style={{
              ...styles.toast,
              background: currentToast.type==='warning' ? 'linear-gradient(135deg,#dc2626,#ef4444)' : 'linear-gradient(135deg,#1a0f00ee,#4a2c00ee)',
              animation: currentToast.fading ? 'toastFadeOut 0.5s ease forwards' : 'toastPop 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
            }}>{currentToast.text}</div>
          )}
        </div>
      </div>

      {/* ─── 게임 오버 — 단계별 애니메이션 ─── */}
      {screen === 'gameover' && gameoverPhase !== 'idle' && (
        <>
          {/* ① 딤 배경: 서서히 페이드인 */}
          <div style={{
            ...styles.dimBackground, zIndex:5000,
            animation:'dimFadeIn 0.55s ease forwards',
          }} onClick={(e) => e.stopPropagation()} />

          {/* ② intro 단계: "GAME OVER" 텍스트가 아래서 위로 스르륵 등장 (약 1초) */}
          {gameoverPhase === 'intro' && (
            <div style={{
              position:'fixed', top:'42%', left:'50%',
              zIndex:5001, textAlign:'center', pointerEvents:'none',
              animation:'gameoverSlideUp 1.0s cubic-bezier(0.215,0.610,0.355,1.000) forwards',
            }}>
              {/* 큰 GAME OVER 타이틀 */}
              <div style={{
                fontSize:'clamp(32px,9vw,52px)', fontWeight:'900',
                color:'#ff4757', letterSpacing:'3px', lineHeight:1,
                fontFamily:"'Impact','Pretendard',sans-serif",
                textShadow:'0 0 30px rgba(255,71,87,0.8),0 0 60px rgba(255,71,87,0.4)',
                animation:'gameoverTitlePulse 1.2s ease-in-out infinite',
                marginBottom:'14px',
              }}>
                GAME OVER
              </div>
              {/* 이모지 */}
              <div style={{ fontSize:'56px', lineHeight:1, filter:'drop-shadow(0 4px 16px rgba(255,71,87,0.5))' }}>
                😭
              </div>
              {/* 점수 미리보기 */}
              <div style={{
                marginTop:'16px', fontSize:'16px', color:'rgba(255,248,240,0.85)',
                fontWeight:'700', letterSpacing:'0.5px',
              }}>
                최종 점수: <span style={{ color:'#ffd600', fontWeight:'900', fontSize:'20px' }}>
                  {score.toLocaleString()}점
                </span>
              </div>
              <div style={{
                marginTop:'8px', fontSize:'12px', color:'rgba(255,248,240,0.4)',
                fontWeight:'600', animation:'flashFade 1s ease-in-out infinite alternate',
              }}>
                잠시 후 랭킹 화면이 열려요...
              </div>
            </div>
          )}

          {/* ③ done 단계: 랭킹 닫은 후 → 결과 박스 + 버튼들 */}
          {gameoverPhase === 'done' && !showRanking && (
            <div style={{ ...styles.gameoverContainer, zIndex:5001 }}>
              <div style={{ ...styles.gameoverBox, animation:'resultBoxPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards' }}>
                <div style={styles.gameoverTitle}>게임 오버!</div>
                <div style={styles.gameoverEmoji}>😭</div>
                <div style={styles.gameoverStats}>
                  {[
                    { label:'최종 점수', value:`${score.toLocaleString()}점` },
                    { label:'최종 레벨', value:`레벨 ${level}` },
                    { label:'총 수입',   value:`${money.toLocaleString()}원` },
                  ].map(({ label, value }) => (
                    <div key={label} style={styles.gameoverStat}>
                      <span style={styles.gameoverLabel}>{label}</span>
                      <span style={styles.gameoverValue}>{value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  if (isBotBlocked.current) {
                    showToast('🤖 봇 사용이 감지되어 랭킹 등록이 차단됐어요!', 'warning');
                    return;
                  }
                  sound('sell'); setShowRanking(true);
                }} style={styles.rankingButton}>🏆 랭킹 등록하기</button>
                <button onClick={() => { resetGame(); setScreen('playing'); showToast('다시 시작! 화이팅! 💪','normal'); }} style={styles.restartButton}>다시 시작 🔥</button>
                <button onClick={() => { resetGame(); setScreen('title'); }} style={styles.titleButton}>타이틀로 돌아가기</button>
              </div>
            </div>
          )}
        </>
      )}
      {/* 랭킹 팝업 (게임오버 후 자동 오픈) */}
      {/* key={gameStartTime} → 게임 세션마다 컴포넌트를 완전히 새로 만들어 이전 상태가 남지 않게 함 */}
      {screen === 'gameover' && showRanking && (
        <RankingScreen
          key={`ranking-${gameStartTime}`}
          onClose={() => setShowRanking(false)}
          currentScore={score} currentLevel={level}
          currentPlayTime={gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 9999}
          onStartGame={handleStartGame}
        />
      )}

      {/* 🏠 홈으로 가기 확인 팝업 */}
      {showHomeConfirm && (
        <>
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:9500 }} />
          <div style={{
            position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            zIndex:9501, background:'linear-gradient(135deg,#1a0f00,#2d1b00)',
            border:'2px solid rgba(255,171,0,0.5)', borderRadius:'20px',
            padding:'28px 24px 20px', width:'80%', maxWidth:'320px', textAlign:'center',
            boxShadow:'0 20px 60px rgba(0,0,0,0.9)', animation:'modalPop 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
          }}>
            <div style={{ fontSize:'36px', marginBottom:'10px' }}>🏠</div>
            <div style={{ fontSize:'16px', fontWeight:'900', color:'#fff', marginBottom:'6px' }}>홈으로 돌아갈까요?</div>
            <div style={{ fontSize:'12px', color:'rgba(255,248,240,0.55)', marginBottom:'22px', lineHeight:'1.6' }}>
              현재 게임 진행 상황이<br />저장되지 않아요 😢
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => { setShowHomeConfirm(false); setIsPaused(false); }}
                style={{ flex:1, padding:'13px', background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.2)', borderRadius:'20px', color:'#fff', fontSize:'14px', fontWeight:'800', cursor:'pointer', WebkitTapHighlightColor:'transparent' }}>
                🎮 계속하기
              </button>
              <button onClick={() => { setShowHomeConfirm(false); resetGame(); setScreen('title'); }}
                style={{ flex:1, padding:'13px', background:'linear-gradient(135deg,#ff6b00,#ff8c00)', border:'none', borderRadius:'20px', color:'#fff', fontSize:'14px', fontWeight:'900', cursor:'pointer', boxShadow:'0 4px 16px rgba(255,107,0,0.4)', WebkitTapHighlightColor:'transparent' }}>
                🏠 홈가기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================
// 🎨 스타일 정의
// ============================================================
const titleStyles = {
  container:    { width:'100%', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Pretendard','Noto Sans KR',sans-serif", position:'relative', overflow:'hidden' },
  bg:           { position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 30%, #7a3800 0%, #3d1800 40%, #1a0900 100%)`, zIndex:0 },
  content:      { position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'20px', maxWidth:'360px', width:'100%', animation:'titleEnter 0.8s cubic-bezier(0.175,0.885,0.32,1.275) forwards' },
  signBoard:    { background:'linear-gradient(135deg,#fff8e1,#ffe0b2)', border:`3px solid ${THEME.accentGold}`, borderRadius:'16px', padding:'18px 28px', textAlign:'center', boxShadow:`0 0 40px rgba(255,171,0,0.4),0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.8)`, marginBottom:'20px', width:'100%' },
  signDecor:    { fontSize:'10px', color:THEME.accentGold, letterSpacing:'2px', opacity:0.7, lineHeight:'1.4' },
  fishRow:      { fontSize:'28px', letterSpacing:'8px', margin:'6px 0', animation:'fishBounce 1.5s ease-in-out infinite' },
  mainTitle:    { fontSize:'32px', fontWeight:'900', color:THEME.textDark, letterSpacing:'-1px', lineHeight:'1.1', textShadow:'0 1px 0 rgba(255,255,255,0.6)' },
  subTitle:     { fontSize:'18px', fontWeight:'800', color:'#7b3f00', letterSpacing:'2px', marginBottom:'6px' },
  catchCopy:    { color:THEME.accentYellow, fontSize:'13px', fontWeight:'700', marginBottom:'28px', textShadow:'0 0 12px rgba(255,214,0,0.5)', letterSpacing:'0.5px' },
  buttonArea:   { display:'flex', flexDirection:'column', gap:'12px', width:'100%' },
  startButton:  { width:'100%', padding:'16px', background:'linear-gradient(135deg,#ff6b00,#ff8c00)', border:'2px solid rgba(255,255,255,0.3)', borderRadius:'30px', color:'#fff', fontSize:'18px', fontWeight:'900', cursor:'pointer', letterSpacing:'1px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', boxShadow:'0 6px 24px rgba(255,107,0,0.5)', transition:'transform 0.15s', WebkitTapHighlightColor:'transparent', animation:'pulseBtn 2s ease-in-out infinite' },
  tutorialButton:{ width:'100%', padding:'13px', background:'rgba(255,171,0,0.08)', border:`2px solid rgba(255,171,0,0.4)`, borderRadius:'30px', color:THEME.accentGold, fontSize:'15px', fontWeight:'800', cursor:'pointer', letterSpacing:'0.5px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'background 0.2s', WebkitTapHighlightColor:'transparent' },
  rankingButton: { width:'100%', padding:'13px', background:'rgba(255,214,0,0.08)', border:`2px solid rgba(255,214,0,0.4)`, borderRadius:'30px', color:'#ffd600', fontSize:'15px', fontWeight:'800', cursor:'pointer', letterSpacing:'0.5px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'background 0.2s', WebkitTapHighlightColor:'transparent' },
  hint:         { marginTop:'24px', color:'rgba(255,214,0,0.45)', fontSize:'11px', fontWeight:'600', letterSpacing:'1px' },
};

const tutorialStyles = {
  dim:          { position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:8000 },
  modal:        { position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:8001, background:'linear-gradient(135deg,#1a0f00,#2d1b00)', border:`2px solid rgba(255,171,0,0.5)`, borderRadius:'20px', padding:'24px 20px 20px', width:'80%', maxWidth:'340px', boxShadow:'0 20px 60px rgba(0,0,0,0.8),0 0 30px rgba(255,107,0,0.2)', animation:'modalPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)', maxHeight:'85vh', overflowY:'auto' },
  closeBtn:     { position:'absolute', top:'12px', right:'14px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.6)', width:'28px', height:'28px', borderRadius:'50%', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' },
  modalTitle:   { textAlign:'center', fontSize:'15px', fontWeight:'800', color:THEME.accentGold, marginBottom:'14px', letterSpacing:'1px' },
  dots:         { display:'flex', justifyContent:'center', gap:'7px', marginBottom:'18px' },
  dot:          { width:'8px', height:'8px', borderRadius:'50%', cursor:'pointer', transition:'all 0.2s' },
  stepContent:  { textAlign:'center', padding:'4px 0 12px' },
  stepEmoji:    { fontSize:'48px', marginBottom:'10px', animation:'emojiPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' },
  stepTitle:    { fontSize:'18px', fontWeight:'900', color:'#fff', marginBottom:'10px' },
  stepDesc:     { fontSize:'13px', color:'rgba(255,248,240,0.85)', lineHeight:'1.7', marginBottom:'14px' },
  tipBox:       { background:'rgba(255,171,0,0.12)', border:'1px solid rgba(255,171,0,0.3)', borderRadius:'10px', padding:'10px 14px', fontSize:'12px', color:THEME.accentYellow, fontWeight:'700', lineHeight:'1.5' },
  navButtons:   { display:'flex', gap:'10px', marginTop:'16px' },
  navBtn:       { flex:1, padding:'11px', background:'rgba(255,171,0,0.1)', border:'1.5px solid rgba(255,171,0,0.35)', borderRadius:'20px', color:THEME.accentGold, fontSize:'13px', fontWeight:'800', cursor:'pointer', WebkitTapHighlightColor:'transparent' },
  doneBtn:      { flex:1, padding:'11px', background:'linear-gradient(135deg,#ff6b00,#ff8c00)', border:'none', borderRadius:'20px', color:'#fff', fontSize:'14px', fontWeight:'900', cursor:'pointer', boxShadow:'0 4px 16px rgba(255,107,0,0.4)', WebkitTapHighlightColor:'transparent' },
  stepCount:    { textAlign:'center', fontSize:'11px', color:'rgba(255,255,255,0.3)', marginTop:'10px', fontWeight:'600' },
};

const rankingStyles = {
  dim:        { position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:9992 },
  modal:      { position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:9993, background:'linear-gradient(135deg,#1a0f00,#2d1b00)', border:`2px solid rgba(255,214,0,0.5)`, borderRadius:'20px', padding:'24px 20px 20px', width:'80%', maxWidth:'360px', boxShadow:'0 20px 60px rgba(0,0,0,0.9),0 0 40px rgba(255,171,0,0.15)', animation:'modalPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)', height:'80vh', maxHeight:'560px', overflowY:'auto', display:'flex', flexDirection:'column' },
  closeBtn:   { position:'absolute', top:'12px', right:'14px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.6)', width:'28px', height:'28px', borderRadius:'50%', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' },
  // ── 탭 버튼 줄 ──
  tabRow:       { display:'flex', gap:'8px', marginBottom:'14px', background:'rgba(0,0,0,0.3)', borderRadius:'20px', padding:'4px' },
  tabBtn:       { flex:1, padding:'8px 0', borderRadius:'16px', border:'none', background:'transparent', color:'rgba(255,248,240,0.5)', fontSize:'12px', fontWeight:'800', cursor:'pointer', WebkitTapHighlightColor:'transparent', transition:'all 0.2s', letterSpacing:'0.3px' },
  tabBtnActive: { background:'linear-gradient(135deg,#ff6b00,#ff8c00)', color:'#fff', boxShadow:'0 2px 10px rgba(255,107,0,0.4)' },
  title:      { textAlign:'center', fontSize:'17px', fontWeight:'900', color:'#ffd600', marginBottom:'16px', letterSpacing:'1px' },
  submitBox:  { background:'rgba(255,171,0,0.1)', border:'1px solid rgba(255,171,0,0.3)', borderRadius:'12px', padding:'12px', marginBottom:'14px' },
  submitScore:{ fontSize:'12px', color:'rgba(255,248,240,0.7)', marginBottom:'8px', textAlign:'center' },
  inputRow:   { display:'flex', gap:'8px' },
  input:      { flex:1, padding:'9px 12px', borderRadius:'20px', background:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,171,0,0.4)', color:'#fff', fontSize:'13px', fontWeight:'700', outline:'none' },
  submitBtn:  { padding:'9px 16px', borderRadius:'20px', background:'linear-gradient(135deg,#ff6b00,#ff8c00)', border:'none', color:'#fff', fontSize:'13px', fontWeight:'900', cursor:'pointer', whiteSpace:'nowrap' },
  myRankBox:  { background:'linear-gradient(135deg,rgba(255,171,0,0.2),rgba(255,107,0,0.1))', border:'1px solid rgba(255,171,0,0.4)', borderRadius:'10px', padding:'10px', marginBottom:'14px', textAlign:'center', color:'#ffd600', fontSize:'13px', fontWeight:'800' },
  loading:    { textAlign:'center', color:'rgba(255,248,240,0.5)', padding:'30px 0', fontSize:'13px' },
  empty:      { textAlign:'center', color:'rgba(255,248,240,0.5)', padding:'20px 0', fontSize:'12px' },
  listWrapper:{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'4px', scrollbarWidth:'thin', scrollbarColor:'rgba(255,171,0,0.3) transparent', minHeight:0 },
  rankRow:    { display:'flex', alignItems:'center', gap:'8px', padding:'9px 10px', borderRadius:'10px', transition:'background 0.2s', flexShrink:0 },
  rankNum:    { fontSize:'14px', fontWeight:'900', minWidth:'36px', textAlign:'center', color:'#ffd600' },
  rankName:   { flex:1, fontSize:'13px', fontWeight:'700', color:'#fff8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  rankLevel:  { fontSize:'11px', color:'rgba(255,248,240,0.5)', fontWeight:'600', minWidth:'36px', textAlign:'right' },
  rankScore:  { fontSize:'13px', fontWeight:'900', color:THEME.accentGold, minWidth:'80px', textAlign:'right' },
};

const styles = {
  container:       { width:'100%', minHeight:'100vh', fontFamily:"'Pretendard','Noto Sans KR',sans-serif", position:'relative' },
  background:      { background:`linear-gradient(180deg,${THEME.bgDark} 0%,${THEME.bgMid} 40%,${THEME.bgLight} 100%)`, minHeight:'100vh', position:'relative', paddingBottom:'env(safe-area-inset-bottom,20px)' },
  header:          { padding:'12px 20px 16px', paddingTop:'max(12px,env(safe-area-inset-top))', background:`linear-gradient(180deg,${THEME.headerBg} 0%,${THEME.bgDark} 100%)`, textAlign:'center', borderBottom:`2px solid ${THEME.accentOrange}44` },
  signBoard:       { background:`linear-gradient(135deg,#fff8e1,#ffe0b2)`, padding:'10px 16px', borderRadius:'10px', marginBottom:'12px', border:`2px solid ${THEME.accentGold}`, boxShadow:`0 0 20px rgba(255,171,0,0.3),inset 0 1px 0 rgba(255,255,255,0.8)` },
  signDecor:       { fontSize:'9px', color:THEME.accentGold, letterSpacing:'2px', opacity:0.7, lineHeight:'1.2' },
  signText:        { fontSize:'20px', fontWeight:'900', color:THEME.textDark, letterSpacing:'-0.5px', padding:'4px 0', textShadow:`0 1px 0 rgba(255,255,255,0.5)` },
  headerStats:     { display:'flex', justifyContent:'center', gap:'6px', marginBottom:'10px', flexWrap:'wrap', alignItems:'center' },
  statBox:         { background:`linear-gradient(135deg,#78350f,#92400e)`, padding:'5px 10px', borderRadius:'20px', fontWeight:'800', color:'#fde68a', fontSize:'11px', minWidth:'65px', border:'1px solid rgba(251,191,36,0.4)', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' },
  homeButton:      { background:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,255,255,0.2)', borderRadius:'20px', padding:'5px 10px', fontSize:'16px', cursor:'pointer', WebkitTapHighlightColor:'transparent', transition:'background 0.2s', lineHeight:1 },
  lifeBox:         { fontSize:'15px', letterSpacing:'3px' },
  content:         { maxWidth:'480px', margin:'0 auto', paddingTop:'12px', paddingBottom:'12px', overflow:'visible' },
  customerArea:    { display:'flex', gap:'4px', marginBottom:'0', overflowX:'auto', overflowY:'visible', paddingTop:'40px', paddingBottom:'8px', paddingLeft:'max(15px,env(safe-area-inset-left))', paddingRight:'max(15px,env(safe-area-inset-right))', WebkitOverflowScrolling:'touch', alignItems:'flex-start', minHeight:'130px' },
  customerWrapper: { position:'relative', display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer', flexShrink:0, width:'31vw', maxWidth:'110px', height:'115px', justifyContent:'flex-start' },
  orderBadge:      { position:'absolute', top:'-22px', right:'2px', color:'white', fontSize:'11px', fontWeight:'900', padding:'3px 8px', borderRadius:'12px', border:'2px solid rgba(255,255,255,0.6)', zIndex:1000 },
  satisfiedBubble: { position:'absolute', top:'-22px', right:'2px', background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', color:'#065f46', fontSize:'10px', fontWeight:'800', padding:'3px 7px', borderRadius:'10px', border:'2px solid #34d399', zIndex:1000, whiteSpace:'nowrap', boxShadow:'0 2px 8px rgba(52,211,153,0.4)', animation:'bubbleFadeIn 0.4s ease forwards' },
  customerImage:   { width:'80px', height:'80px', objectFit:'contain' },
  patienceBar:     { width:'72px', height:'5px', background:'rgba(0,0,0,0.4)', borderRadius:'3px', marginTop:'6px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)' },
  patienceFill:    { height:'100%', borderRadius:'3px', transition:'width 3.1s linear,background-color 0.5s' },
  noCustomers:     { width:'100%', textAlign:'center', color:THEME.accentGold, fontWeight:'bold', fontSize:'13px', padding:'30px 0', opacity:0.7 },
  cookingBoard:    { background:`linear-gradient(180deg,#1e2433,#252d3d)`, padding:'12px', borderRadius:'14px', border:`2px solid rgba(80,100,150,0.35)`, boxShadow:`0 4px 20px rgba(0,0,0,0.5),inset 0 1px 0 rgba(100,130,200,0.1)` },
  pansGrid:        { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' },
  panButton:       { width:'100%', aspectRatio:'1', position:'relative', borderRadius:'12px', background:`linear-gradient(135deg,#2a3147,#313a52)`, display:'flex', alignItems:'center', justifyContent:'center', padding:0, cursor:'pointer', WebkitTapHighlightColor:'transparent', transition:'box-shadow 0.2s,border-color 0.2s' },
  panImage:        { width:'75%', height:'75%', objectFit:'contain' },
  progressContainer:{ position:'absolute', bottom:'6%', left:'8%', right:'8%' },
  progressBarOuter: { width:'100%', height:'4px', background:'rgba(0,0,0,0.6)', borderRadius:'2px', overflow:'hidden' },
  progressBarInner: { height:'100%', transition:'width 0.1s,background-color 0.3s', borderRadius:'2px' },
  toastContainer:  { position:'fixed', bottom:'50%', left:'env(safe-area-inset-left,20px)', right:'env(safe-area-inset-right,20px)', display:'flex', justifyContent:'center', zIndex:2000, pointerEvents:'none', padding:'0 20px' },
  toast:           { color:'white', padding:'12px 24px', borderRadius:'25px', fontSize:'14px', fontWeight:'800', boxShadow:'0 5px 20px rgba(0,0,0,0.4)', maxWidth:'90%', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.15)' },
  dimBackground:   { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.85)', zIndex:9990, pointerEvents:'auto' },
  gameoverContainer:{ position:'fixed', top:0, left:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Pretendard',sans-serif", padding:'env(safe-area-inset-top,20px) env(safe-area-inset-right,20px) env(safe-area-inset-bottom,20px) env(safe-area-inset-left,20px)', zIndex:9991, pointerEvents:'none' },
  gameoverBox:     { background:'linear-gradient(135deg,#1a0f00,#2d1b00)', border:'2px solid rgba(255,171,0,0.5)', padding:'28px 20px', borderRadius:'20px', width:'80%', maxWidth:'320px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.8),0 0 30px rgba(255,107,0,0.2)', maxHeight:'80vh', overflowY:'auto', pointerEvents:'auto' },
  gameoverTitle:   { fontSize:'22px', fontWeight:'900', color:'#ff4757', marginBottom:'8px', textShadow:'0 0 20px rgba(255,71,87,0.5)' },
  gameoverEmoji:   { fontSize:'48px', marginBottom:'16px' },
  gameoverStats:   { background:'rgba(0,0,0,0.3)', padding:'12px', borderRadius:'12px', marginBottom:'16px', border:'1px solid rgba(255,171,0,0.2)' },
  gameoverStat:    { display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' },
  gameoverLabel:   { fontSize:'12px', color:'#a78bfa', fontWeight:'600' },
  gameoverValue:   { fontSize:'13px', color:'#fde68a', fontWeight:'900' },
  rankingButton:   { background:'linear-gradient(135deg,#b45309,#d97706)', color:'white', border:'none', padding:'12px 24px', borderRadius:'25px', fontSize:'14px', fontWeight:'900', cursor:'pointer', boxShadow:'0 4px 16px rgba(180,83,9,0.5)', width:'100%', WebkitTapHighlightColor:'transparent', letterSpacing:'0.5px', marginBottom:'10px' },
  restartButton:   { background:'linear-gradient(135deg,#ff6b00,#ff8c00)', color:'white', border:'none', padding:'14px 24px', borderRadius:'25px', fontSize:'15px', fontWeight:'900', cursor:'pointer', boxShadow:'0 4px 20px rgba(255,107,0,0.5)', width:'100%', WebkitTapHighlightColor:'transparent', letterSpacing:'0.5px', marginBottom:'10px' },
  titleButton:     { background:'transparent', color:'rgba(255,248,240,0.55)', border:'1.5px solid rgba(255,255,255,0.15)', padding:'11px 24px', borderRadius:'25px', fontSize:'13px', fontWeight:'700', cursor:'pointer', width:'100%', WebkitTapHighlightColor:'transparent' },
};

export default BungeoppangTycoon;