// ============================================================
// 📁 gameData.js — 게임의 모든 "데이터"를 모아놓은 파일
// 디자이너/기획자가 수정할 값들은 거의 다 여기 있어요!
// ============================================================

// ============================================================
// 🎨 색상 테마
// 여기 색상 코드만 바꾸면 게임 전체 색상이 한 번에 바뀌어요!
// ============================================================
export const THEME = {
  bgDark:      '#2d1b00',
  bgMid:       '#4a2c00',
  bgLight:     '#6b3d00',
  headerBg:    '#1a0f00',
  boardColor:  '#3d1f00',
  signBg:      '#fff3e0',
  accentOrange:'#ff6b00',
  accentYellow:'#ffd600',
  accentGold:  '#ffab00',
  text:        '#fff8f0',
  textDark:    '#3d1f00',
};

// ============================================================
// 🍞 붕어빵 이미지 경로
// ============================================================
export const PAN_IMAGES = {
  empty:   '/images/empty.png',
  dough:   '/images/dough.png',
  red:     '/images/cooking1.png',
  cooking: '/images/cooking2.png',
  ready:   '/images/ready.png',
  burnt:   '/images/burnt.png',
};

// ============================================================
// 👥 손님 종류
// 새 손님 추가: 아래 배열에 항목을 복사해서 추가하세요!
// patience : 기다리는 시간 (클수록 오래 기다림)
// pay      : 붕어빵 1개당 금액
// ============================================================
export const customerTypes = [
  { name: '학생',   patience: 20, pay: 1000, img: '/images/student.png' },
  { name: '직장인', patience: 15, pay: 1500, img: '/images/worker.png'  },
  { name: '할머니', patience: 25, pay: 800,  img: '/images/grandma.png' },
  { name: '아이',   patience: 12, pay: 2000, img: '/images/child.png'   },
  // { name: '외국인', patience: 18, pay: 2500, img: '/images/foreigner.png' },
];

// ============================================================
// ⭐ VIP 손님
// ============================================================
export const vipCustomer = {
  name: 'VIP', patience: 8, pay: 5000, img: '/images/vip.png',
};

// ============================================================
// 🎮 게임 밸런스 설정
// ============================================================
export const GAME_CONFIG = {
  maxLives:        5,
  maxCustomers:    5,
  panCount:        6,
  vipMinLevel:     5,
  vipSpawnChance:  0.1,
  scorePerLevel:   10000,
  cookProgressStep: 2,
  cookTimerMs:     100,
  goodTimingMin:   60,
};

// ============================================================
// 📖 튜토리얼 내용
// ============================================================
export const TUTORIAL_STEPS = [
  {
    emoji: '🐟', title: '붕어빵 굽기',
    desc: '화면 아래쪽 판을 탭하면 붕어빵을 구울 수 있어요.\n반죽 → 빨간색 → 노릇노릇 → 완성! 단계를 거쳐요.',
    tip: '진행 바가 초록색일 때 탭하면 딱 좋아요!',
  },
  {
    emoji: '⚡', title: '타이밍이 중요해요',
    desc: '진행 바가 빨간색이 되기 전에 다음 단계로 넘겨야 해요.\n너무 늦으면 붕어빵이 타버려요! 🔥',
    tip: '타면 생명이 1개 줄어요. 총 5개의 생명이 있어요.',
  },
  {
    emoji: '👥', title: '손님에게 팔기',
    desc: '완성된 붕어빵을 재고에 모아두고,\n위쪽 손님을 탭하면 판매할 수 있어요!',
    tip: '손님 머리 위 숫자가 필요한 개수예요. 재고가 충분한지 확인하세요.',
  },
  {
    emoji: '⏰', title: '손님 인내심',
    desc: '손님마다 기다리는 시간이 달라요.\n인내심 바가 다 줄기 전에 팔아야 해요!',
    tip: '손님이 화나서 떠나면 생명이 줄어요 💔',
  },
  {
    emoji: '🔥', title: '콤보 보너스',
    desc: '연속으로 판매하면 콤보가 쌓여요!\n콤보가 높을수록 더 많은 보너스 수익이 생겨요.',
    tip: '5콤보 이상이면 화면이 번쩍여요! 🎆',
  },
  {
    emoji: '⭐', title: 'VIP 손님',
    desc: '레벨 5 이상이 되면 VIP 손님이 등장해요.\n인내심은 짧지만 수익이 훨씬 커요!',
    tip: '금색으로 빛나는 손님이 VIP예요 ✨',
  },
];
