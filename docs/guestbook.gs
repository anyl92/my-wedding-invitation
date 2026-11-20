/**
 * 청첩장 방명록 — 구글 시트 + Apps Script
 *
 * 설치 방법 (한 번만)
 *  1. 구글 드라이브에서 새 스프레드시트를 만든다.
 *  2. 메뉴 [확장 프로그램] → [Apps Script] → 기본 코드를 지우고 이 파일 내용을 전부 붙여넣고 저장.
 *  3. 위쪽 함수 목록에서 setup 선택 → [실행] (권한 허용 팝업이 뜨면 허용).
 *  4. [배포] → [새 배포] → 유형: 웹 앱 / 실행 계정: 나 / 액세스 권한: 모든 사용자 → [배포].
 *  5. 나온 웹 앱 URL(https://script.google.com/macros/s/.../exec)을 js/config.js 의 guestbook.url 에 붙여넣는다.
 *  ※ 이 코드를 수정했다면 [배포] → [배포 관리] → 연필 아이콘 → 버전: 새 버전 으로 다시 배포해야 반영됩니다.
 *
 * 엑셀로 받기: 시트에서 [파일] → [다운로드] → Microsoft Excel(.xlsx)
 *
 * 시트 구성 (setup() 실행 시 자동 생성)
 *  - [방명록] 시트: 모든 글이 한 줄씩 쌓입니다. 하객이 삭제해도 행은 지워지지 않고 '삭제됨'에 시간이 찍힙니다.
 *      · '숨김' 체크 → 그 글만 페이지에서 안 보입니다.
 *  - [설정] 시트: B1 '공개' 체크 해제 → 방명록 목록 전체가 비공개가 됩니다 (작성은 계속 가능, 나만 보기).
 */

const SHEET = "방명록";
const SETTINGS = "설정";
const HEAD = ["id", "작성시간", "이름", "메시지", "비밀번호(해시)", "삭제됨", "숨김"];
const COL = { id: 0, time: 1, name: 2, message: 3, pw: 4, deleted: 5, hidden: 6 };
const MAX_NAME = 20;
const MAX_MSG = 500;

// 처음 한 번만 실행: 시트와 머리글, 체크박스를 만든다.
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight("bold");
  sh.setFrozenRows(1);
  sh.hideColumns(COL.pw + 1);

  const st = ss.getSheetByName(SETTINGS) || ss.insertSheet(SETTINGS);
  st.getRange("A1").setValue("공개");
  st.getRange("B1").insertCheckboxes().setValue(true);
  st.getRange("A2").setValue("체크 해제 시 방명록 목록이 페이지에서 숨겨집니다 (작성은 계속 가능).");
}

function doGet(e) {
  return json(list());
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "잘못된 요청입니다." });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (body.action === "write") return json(write(body));
    if (body.action === "delete") return json(remove(body));
    return json({ ok: false, error: "알 수 없는 요청입니다." });
  } finally {
    lock.releaseLock();
  }
}

function list() {
  if (!isPublic()) return { ok: true, private: true, items: [] };
  const items = rows()
    .filter((r) => r[COL.id] && !r[COL.deleted] && r[COL.hidden] !== true)
    .map((r) => ({ id: String(r[COL.id]), time: new Date(r[COL.time]).getTime(), name: String(r[COL.name]), message: String(r[COL.message]) }))
    .reverse(); // 최신 글 먼저
  return { ok: true, private: false, items };
}

function write(b) {
  const name = clean(b.name).slice(0, MAX_NAME);
  const message = clean(b.message).slice(0, MAX_MSG);
  const password = String(b.password || "");
  if (!name || !message || password.length < 4) return { ok: false, error: "이름, 비밀번호(4자 이상), 메시지를 입력해 주세요." };
  const id = Utilities.getUuid().slice(0, 8);
  const sh = sheet();
  sh.appendRow([id, new Date(), safe(name), safe(message), hash(id, password), "", false]);
  sh.getRange(sh.getLastRow(), COL.hidden + 1).insertCheckboxes();
  return { ok: true };
}

// 실제로 지우지 않고 '삭제됨'에 시간만 남긴다.
function remove(b) {
  const sh = sheet();
  const data = rows();
  const i = data.findIndex((r) => String(r[COL.id]) === String(b.id));
  if (i < 0 || data[i][COL.deleted]) return { ok: false, error: "이미 삭제된 글입니다." };
  if (data[i][COL.pw] !== hash(String(b.id), String(b.password || ""))) return { ok: false, error: "비밀번호가 맞지 않습니다." };
  sh.getRange(i + 2, COL.deleted + 1).setValue(new Date());
  return { ok: true };
}

function sheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
}
function rows() {
  const sh = sheet();
  const n = sh.getLastRow() - 1;
  return n > 0 ? sh.getRange(2, 1, n, HEAD.length).getValues() : [];
}
function isPublic() {
  const st = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS);
  return !st || st.getRange("B1").getValue() !== false;
}
function clean(s) {
  return String(s || "").replace(/\r\n?/g, "\n").trim();
}
// 시트에서 수식으로 실행되지 않도록 = + - @ 로 시작하면 앞에 ' 를 붙인다.
function safe(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function hash(id, password) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, id + ":" + password);
  return bytes.map((b) => ((b + 256) % 256).toString(16).padStart(2, "0")).join("");
}
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
