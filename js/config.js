/*
 * ✏️ 청첩장 내용은 이 파일만 수정하면 됩니다.
 *  - 글자는 따옴표('...' 또는 `...`) 안의 내용만 바꾸세요.
 *  - 여러 줄 문장은 백틱(`...`) 안에서 그냥 줄바꿈하면 그대로 표시됩니다.
 *  - 비워두고 싶은 값은 '' (빈 따옴표)로 두면 해당 항목이 숨겨집니다.
 */
window.WEDDING = {
  // ───────── 신랑 · 신부 ─────────
  groom: {
    name: "이강빈",
    firstName: "강빈",
    phone: "010-2048-6285",
    order: "아들", // 장남, 차남, 아들 등
    father: { name: "이명고", phone: "010-4550-6277", deceased: false }, // 고인이면 deceased: true
    mother: { name: "김은화", phone: "010-8227-6277", deceased: false },
  },
  bride: {
    name: "안유림",
    firstName: "유림",
    phone: "010-4343-7509",
    order: "딸", // 장녀, 차녀, 딸 등
    father: { name: "안상수", phone: "010-5310-1915", deceased: false },
    mother: { name: "신선옥", phone: "010-7411-0881", deceased: false },
  },

  // ───────── 예식 일시 (한국 시간 기준, 24시간제) ─────────
  date: { year: 2027, month: 2, day: 20, hour: 12, minute: 20 },
  // 달력에 빨간색으로 표시할 공휴일
  holidays: ["2027-02-07", "2027-02-08", "2027-02-09", "2027-03-01"],

  // ───────── 표지 ─────────
  cover: {
    topLabel: "Wedding Invitation from.",
    bottomLabel: "JOIN US AS WE BECOME ONE",
  },

  // ───────── 인사말 ─────────
  greeting: {
    title: "“서로 사랑하되, 사랑을 구속하지는 마십시오.” — 칼릴 지브란, 『예언자』",
    text: `우리는 참 많이 다릅니다.
서로를 바꾸려 하기보다
서로의 다름을 조금씩 알아가며
결국, 평생을 함께해 보기로 했습니다.

저희의 새로운 출발을 함께해 주시고
마음껏 축하해 주세요.
잘 살아보겠습니다!`,
  },

  // 사진 사이에 들어가는 손글씨 문구
  bannerPhrase: "Love story is beautiful,\nbut ours is my favorite",

  // ───────── 사진 (images 폴더에 넣고 파일 이름만 바꾸세요) ─────────
  images: {
    cover: "images/cover.jpg",
    middle1: "images/middle1.jpg",
    middle2: "images/middle2.jpg",
    ending: "images/ending.jpg",
    gallery: [
      { src: "images/gallery01.jpg", pos: "50% 65%" },
      { src: "images/gallery02.jpg", pos: "47% 84%", zoom: 1.1 },
      { src: "images/gallery03.jpg", pos: "59% 50%" },
      { src: "images/gallery04.jpg", pos: "50% 62%", zoom: 1.1 },
      "images/gallery05.jpg",
      "images/gallery06.jpg",
      { src: "images/gallery07.jpg", pos: "3% 80%", zoom: 1.25 },
      { src: "images/gallery08.jpg", pos: "54% 65%", zoom: 1.45 },
      { src: "images/gallery09.jpg", pos: "50% 58%" },
      { src: "images/gallery10.jpg", pos: "50% 63%" },
      "images/gallery11.jpg",
      { src: "images/gallery12.jpg", pos: "67% 63%", zoom: 1.2 },
      { src: "images/gallery13.jpg", pos: "60% 46%", zoom: 1.1 },
      "images/gallery14.jpg",
      { src: "images/gallery15.jpg", pos: "48% 80%", zoom: 1.3 },
      { src: "images/gallery16.jpg", pos: "58% 79%", zoom: 1.3 },
      { src: "images/gallery17.jpg", pos: "100% 59%", zoom: 1.25 },
      { src: "images/gallery18.jpg", pos: "50% 45%" },
      { src: "images/gallery19.jpg", pos: "59% 78%", zoom: 1.15 },
      { src: "images/gallery20.jpg", pos: "50% 100%" },
      { src: "images/gallery21.jpg", pos: "95% 81%", zoom: 1.1 },
      { src: "images/gallery22.jpg", pos: "50% 73%", zoom: 1.65 },
      "images/gallery23.jpg",
      "images/gallery24.jpg",
      { src: "images/gallery25.jpg", pos: "58% 64%", zoom: 1.25 },
      { src: "images/gallery26.jpg", pos: "50% 73%" },
      { src: "images/gallery27.jpg", pos: "50% 71%", zoom: 1.15 },
      { src: "images/gallery28.jpg", pos: "0% 57%", zoom: 1.05 },
      "images/gallery29.jpg",
      "images/gallery30.jpg",
    ],
  },
  galleryInitialCount: 99, // '더보기' 누르기 전에 보이는 사진 수 (사진 수보다 크면 처음부터 다 펼쳐짐, 접으려면 12 등으로)

  // ───────── 오시는 길 ─────────
  venue: {
    name: "더리버사이드호텔",
    hall: "노벨라홀, 지하 1층(LL층)",
    address: "서울 서초구 강남대로107길 6",
    // tel: "02-6710-1100",
    // 좌표: 네이버/카카오 지도에서 장소 검색 → 공유 링크나 '좌표 복사'로 확인
    lat: 37.5185714,
    lng: 127.0180161,
    mapImage: "", // 약도 이미지가 있으면 'images/map.png' 처럼 입력
  },
  transport: [
    {
      title: "지하철",
      lines: [
        { dot: "#EF7C00", text: "3호선 신사역 5번 출구" },
        { dot: "#D40036", text: "신분당선 신사역 5번 출구" },
        "",
        "· 도보 240M 직진 후 좌측 건물",
      ],
    },
    {
      title: "주차",
      lines: [
        // { dot: "#0d347f", text: "간선버스 : 301, 342, 472" },
        // { dot: "#3b9f37", text: "지선버스 : 3011, 4312" },
        // "",
        "발렛이 필수이며, 진입 및 출차가 다소 혼잡합니다.",
        "발렛 비용은 저희가 부담하나, 시간이 지연될 수 있기에",
        "지하철 등 대중교통 이용을 적극 권장해 드립니다 🩷",
      ],
    },
  ],

  // ───────── 마음 전하실 곳 ─────────
  accountMessage: `참석이 어려우신 분들을 위해
계좌번호를 기재하였습니다.
너그러운 마음으로 양해 부탁드립니다.`,
  accounts: {
    groom: [
      { relation: "신랑", name: "이강빈", bank: "국민은행", number: "244002-04-233624", kakaopay: "" },
      { relation: "아버지", name: "이명고", bank: "국민은행", number: "041210-66-2275", kakaopay: "" },
      { relation: "어머니", name: "김은화", bank: "국민은행", number: "041210-66-4812", kakaopay: "" },
    ],
    bride: [
      { relation: "신부", name: "안유림", bank: "국민은행", number: "002802-04-146540", kakaopay: "" },
      { relation: "아버지", name: "안상수", bank: "하나은행", number: "139-910350-53107", kakaopay: "" },
      { relation: "어머니", name: "신선옥", bank: "IM뱅크", number: "02307-512439-001", kakaopay: "" },
    ],
  },

  // ───────── 방명록 ─────────
  guestbook: {
    // 구글 Apps Script 웹 앱 주소 (설정 방법: docs/guestbook.gs 맨 위) — 비워두면 방명록이 숨겨집니다
    url: "",
    initialCount: 5, // '더보기' 누르기 전에 보이는 글 수
  },

  // ───────── 마지막 문구 ─────────
  ending: {
    text: `기쁜 날에는 함께 웃고,
힘든 날에는 더 꼭 안아주며,
언제나 서로의 편이 되어
함께 걸어가겠습니다. `,
  },

  // ───────── 배경음악 (선택) ─────────
  bgm: "", // 예: 'music/bgm.mp3' — 비워두면 음악 버튼이 숨겨집니다

  // ───────── 공유 ─────────
  share: {
    // 카카오톡 공유 버튼을 쓰려면 Kakao Developers의 JavaScript 키를 넣으세요 (README 참고)
    kakaoAppKey: "",
    title: "이강빈 ♥ 안유림 결혼합니다",
    description: "2027년 2월 20일 토요일 낮 12시 20분\n더리버사이드호텔 노벨라홀",
    imageUrl: "https://anyl92.github.io/my-wedding-invitation/images/og.jpg", // 배포 후 대표 사진의 전체 주소 (https://...)
  },
};
