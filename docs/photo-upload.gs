/**
 * 청첩장 사진·동영상 받기 — 구글 드라이브 + Apps Script (방명록과 별개)
 *
 * 설치 방법 (한 번만)
 *  1. 구글 드라이브에 받을 폴더를 만들고, 폴더 주소 맨 끝 부분
 *     (https://drive.google.com/drive/folders/여기부분 — ? 뒤는 빼고)을 아래 FOLDER_ID 에 넣는다.
 *  2. https://script.google.com → [새 프로젝트] → 기본 코드를 지우고 이 파일 내용을 전부 붙여넣고 저장.
 *  3. 위쪽 함수 선택 칸에서 setup → [실행] → 권한 허용
 *     ('Google에서 확인하지 않은 앱' 이 뜨면 [고급] → [(프로젝트 이름)(으)로 이동] → [허용]).
 *  4. 오른쪽 위 [배포] → [새 배포] → 톱니바퀴에서 [웹 앱] → 실행 계정: 나 / 액세스 권한: 모든 사용자 → [배포].
 *  5. 나온 웹 앱 URL(https://script.google.com/macros/s/.../exec)을 js/config.js 의 photoEvent.url 에 넣는다.
 *  ※ 이 코드를 수정했다면 [배포] → [배포 관리] → 연필 아이콘 → 버전: 새 버전 → [배포] (주소는 그대로 유지)
 *
 * 동작: 페이지가 파일을 8MB 조각으로 나눠 보내면, 이 스크립트가 드라이브에 이어 붙여 저장한다 (큰 동영상도 가능).
 * 저장 이름: 20270220_143012_홍길동_IMG_1234.MOV
 */

const FOLDER_ID = "1KoNUyAvFuCQ9essSjm08SCu9WKkjfHzX"; // 사진·동영상을 받을 구글 드라이브 폴더 ID
const MAX_MB = 1024; // 한 파일 최대 크기
const UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files";

// 처음 한 번 실행: 폴더 확인 + 드라이브 권한 요청
// Apps Script 는 코드에 나온 기능을 보고 권한을 정한다. 읽기만 있으면 '읽기 전용' 권한만 받아서 업로드가 403 으로 막히므로,
// 아래 줄로 '파일 만들기(쓰기)' 권한까지 받게 한다. (실행되지는 않음)
// DriveApp.createFile()
function setup() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  UrlFetchApp.fetch("https://www.googleapis.com/drive/v3/about?fields=user", { headers: auth() });
  Logger.log("준비 완료 — 저장 폴더: " + folder.getName());
}

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.action === "start") return json(start(b));
    if (b.action === "chunk") return json(chunk(b));
    if (b.action === "status") return json(status(b));
    return json({ ok: false, error: "알 수 없는 요청입니다." });
  } catch (err) {
    return json({ ok: false, error: String((err && err.message) || err) });
  }
}

// 업로드 시작: 드라이브에 이어올리기 세션을 만들고 주소를 돌려준다
function start(b) {
  const name = clean(b.name).slice(0, 20);
  const mime = String(b.mimeType || "");
  const size = Number(b.size);
  if (!name) return { ok: false, error: "이름을 입력해 주세요." };
  if (!/^(image|video)\//.test(mime)) return { ok: false, error: "사진이나 동영상만 올릴 수 있어요." };
  if (!(size > 0) || size > MAX_MB * 1024 * 1024) return { ok: false, error: MAX_MB + "MB 이하만 올릴 수 있어요." };

  const original = String(b.filename || "file").replace(/[\\/:*?"<>|]/g, "_").slice(-80);
  const stamp = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyyMMdd_HHmmss");
  const res = UrlFetchApp.fetch(UPLOAD_URL + "?uploadType=resumable&supportsAllDrives=true", {
    method: "post",
    contentType: "application/json; charset=UTF-8",
    headers: Object.assign(auth(), { "X-Upload-Content-Type": mime, "X-Upload-Content-Length": String(size) }),
    payload: JSON.stringify({ name: stamp + "_" + name + "_" + original, parents: [FOLDER_ID] }),
    muteHttpExceptions: true,
  });
  const h = res.getHeaders();
  const session = h.Location || h.location;
  if (res.getResponseCode() !== 200 || !session) return { ok: false, error: "업로드를 시작하지 못했어요. " + googleError(res) };
  return { ok: true, session: session };
}

// 조각 하나를 이어 붙인다. 다 받으면 done, 아니면 다음에 보낼 위치(next)를 알려준다
function chunk(b) {
  if (!validSession(b.session)) return { ok: false, error: "잘못된 요청입니다." };
  const bytes = Utilities.base64Decode(b.data);
  const begin = Number(b.start);
  const total = Number(b.total);
  const res = UrlFetchApp.fetch(b.session, {
    method: "put",
    contentType: "application/octet-stream",
    payload: bytes,
    headers: { "Content-Range": "bytes " + begin + "-" + (begin + bytes.length - 1) + "/" + total },
    muteHttpExceptions: true,
  });
  return progress(res);
}

// 중간에 끊겼을 때 드라이브가 어디까지 받았는지 확인한다
function status(b) {
  if (!validSession(b.session)) return { ok: false, error: "잘못된 요청입니다." };
  const res = UrlFetchApp.fetch(b.session, {
    method: "put",
    payload: "",
    headers: { "Content-Range": "bytes */" + Number(b.total) },
    muteHttpExceptions: true,
  });
  return progress(res);
}

function progress(res) {
  const code = res.getResponseCode();
  if (code === 200 || code === 201) return { ok: true, done: true };
  if (code !== 308) return { ok: false, error: "업로드 실패. " + googleError(res) };
  const h = res.getHeaders();
  const range = String(h.Range || h.range || ""); // 예: bytes=0-8388607
  const m = range.match(/-(\d+)$/);
  return { ok: true, done: false, next: m ? Number(m[1]) + 1 : 0 };
}

// 드라이브가 돌려준 에러를 짧게 (원인 파악용)
function googleError(res) {
  let msg = res.getContentText();
  try {
    msg = JSON.parse(msg).error.message;
  } catch (e) {}
  return "(" + res.getResponseCode() + ") " + String(msg).slice(0, 300);
}

// 드라이브 업로드 주소만 허용 (다른 주소로 요청을 보내는 데 악용되지 않게)
function validSession(url) {
  return typeof url === "string" && url.indexOf(UPLOAD_URL + "?") === 0 && /[?&]upload_id=/.test(url);
}
function auth() {
  return { Authorization: "Bearer " + ScriptApp.getOAuthToken() };
}
function clean(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
