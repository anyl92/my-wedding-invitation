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
    title: "소중한 분들을 초대합니다",
    text: `따스한 봄날,
사랑하는 사람을 만나
사랑하기 좋은 푸른달 아래
저희 두 사람 결혼합니다.

꽃보다 아름답게
햇살보다 따뜻하게 살 수 있도록
앞날을 축복해 주시면 감사하겠습니다.`,
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
      "images/gallery01.jpg",
      "images/gallery07.jpg",
      "images/gallery08.jpg",
      "images/gallery12.jpg",
      "images/gallery11.jpg",
      "images/gallery10.jpg",
      "images/gallery03.jpg",
      "images/gallery04.jpg",
      "images/gallery09.jpg",
      "images/gallery06.jpg",
      "images/gallery05.jpg",
      "images/gallery02.jpg",
    ],
  },
  galleryInitialCount: 9, // '더보기' 누르기 전에 보이는 사진 수

  // ───────── 오시는 길 ─────────
  venue: {
    name: "더리버사이드호텔",
    hall: "노벨라홀, 지하 1층(LL층)",
    address: "서울 서초구 강남대로107길 6",
    tel: "02-6710-1100",
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
        "지하철이나 버스 등 대중교통 이용을 적극 권장해 드립니다 🩷",
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

  // ───────── 마지막 문구 ─────────
  ending: {
    text: `장담하건대, 세상이 다 겨울이어도
우리 사랑은 늘 봄처럼 따뜻하고
간혹, 여름처럼 뜨거울 겁니다.`,
    source: "이수동, 사랑가",
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
