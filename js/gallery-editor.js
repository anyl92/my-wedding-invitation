/*
 * 갤러리 썸네일 편집기 — 로컬(localhost)에서만 main.js 가 불러온다. 배포 사이트에는 나타나지 않는다.
 *  1. 왼쪽 위 [썸네일 편집] 버튼 → 갤러리 사진을 누르면 선택됨
 *  2. 미리보기를 끌거나 슬라이더로 위치·확대 조정 (갤러리에 바로 반영)
 *  3. [코드 복사] → js/config.js 의 gallery: [ ... ] 부분을 통째로 덮어쓰기
 * 붙여넣기 전 작업은 브라우저에 임시 저장되어 새로고침해도 남아 있다.
 */
(function () {
  "use strict";

  const C = window.WEDDING;
  const { gSrc, thumbStyle } = window.WEDDING_GALLERY;
  const DRAFT = "gallery-editor-draft";
  const STATE = "gallery-editor-state";
  const $ = (sel, root = document) => root.querySelector(sel);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const store = {
    get(s, k) {
      try {
        return JSON.parse(s.getItem(k));
      } catch (e) {
        return null;
      }
    },
    set(s, k, v) {
      try {
        v == null ? s.removeItem(k) : s.setItem(k, JSON.stringify(v));
      } catch (e) {}
    },
  };

  // ───────── 데이터: 편집용 {src, x, y, zoom} ↔ config 항목 ─────────
  function toItem(g) {
    const [x, y] = (typeof g === "string" ? "" : g.pos || "").split(" ").map(parseFloat);
    return { src: gSrc(g), x: isNaN(x) ? 50 : x, y: isNaN(y) ? 50 : y, zoom: (typeof g !== "string" && g.zoom) || 1 };
  }
  function toEntry(it) {
    if (it.x === 50 && it.y === 50 && it.zoom === 1) return it.src;
    const e = { src: it.src, pos: `${it.x}% ${it.y}%` };
    if (it.zoom !== 1) e.zoom = it.zoom;
    return e;
  }
  const entryCode = (e) =>
    typeof e === "string" ? JSON.stringify(e) : `{ src: ${JSON.stringify(e.src)}, pos: ${JSON.stringify(e.pos)}${e.zoom ? `, zoom: ${e.zoom}` : ""} }`;

  const original = C.images.gallery.map(toItem);
  let items = original.map((it) => ({ ...it }));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // 아직 config.js 에 붙여넣지 않은 작업이 있으면 이어서 보여준다
  const draft = store.get(localStorage, DRAFT);
  if (draft) {
    const bySrc = new Map(draft.map((d) => [d.src, d]));
    const merged = items.map((it) => bySrc.get(it.src) || it);
    if (same(merged, original)) store.set(localStorage, DRAFT, null);
    else items = merged;
  }

  let on = false;
  let sel = -1;

  // ───────── 화면 ─────────
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
      .ge-toggle { position: fixed; top: 12px; left: 12px; z-index: 200; padding: 8px 14px; border-radius: 999px; background: #1a1a1a; color: #fff; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,.2); }
      .ge-toggle.on { background: #f79e9e; color: #1a1a1a; }
      .ge-panel { position: fixed; left: 50%; bottom: 12px; z-index: 200; width: min(400px, calc(100% - 24px)); transform: translateX(-50%);
        padding: 14px 16px; border-radius: 14px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.25); font-size: 13px; line-height: 1.4; -webkit-text-stroke: 0; }
      .ge-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-weight: 700; }
      .ge-body { display: flex; gap: 14px; align-items: center; }
      .ge-preview { flex-shrink: 0; width: 120px; height: 120px; overflow: hidden; border-radius: 6px; background: #eee; cursor: grab; touch-action: none; }
      .ge-preview:active { cursor: grabbing; }
      .ge-preview img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
      .ge-sliders { flex: 1; display: flex; flex-direction: column; gap: 6px; }
      .ge-sliders label { display: grid; grid-template-columns: 2.6em 1fr 3.2em; align-items: center; gap: 6px; }
      .ge-sliders input { width: 100%; }
      .ge-sliders output { text-align: right; color: #666; font-variant-numeric: tabular-nums; }
      .ge-btns { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
      .ge-btns button { padding: 6px 10px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; font-size: 12px; }
      .ge-btns .ge-copy { margin-left: auto; border-color: #1a1a1a; background: #1a1a1a; color: #fff; }
      .ge-note { margin-top: 8px; color: #999; font-size: 11px; }
      .ge-dirty { color: #d9534f; }
      .ge-empty { padding: 16px 0; color: #999; text-align: center; }
      .g-item.ge-sel { outline: 3px solid #f79e9e; outline-offset: 2px; }
      body.ge-on .gallery-grid.collapsed .extra { display: block; }
      body.ge-on #gallery .more-btn { display: none; }
      body.ge-on { padding-bottom: 280px; } /* 패널에 가려진 사진도 스크롤해서 볼 수 있게 */
    </style>`,
  );

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "ge-toggle";
  toggle.textContent = "썸네일 편집";
  document.body.appendChild(toggle);

  const panel = document.createElement("div");
  panel.className = "ge-panel";
  panel.hidden = true;
  document.body.appendChild(panel);

  function renderPanel() {
    const head = `<div class="ge-head"><span>썸네일 편집${sel >= 0 ? ` · ${sel + 1}번 사진` : ""}</span>
      <span class="ge-dirty">config.js 에 아직 반영 안 됨</span></div>`;
    const btns = `<div class="ge-btns">
        ${sel >= 0 ? '<button type="button" data-ge="prev">◀ 이전</button><button type="button" data-ge="next">다음 ▶</button><button type="button" data-ge="reset">이 사진 초기화</button>' : ""}
        <button type="button" class="ge-discard" data-ge="discard">변경 모두 버리기</button>
        <button type="button" class="ge-copy" data-ge="copy">코드 복사</button>
      </div>
      <p class="ge-note">복사한 코드로 js/config.js 의 <b>gallery: [ ... ],</b> 부분을 통째로 바꾸세요.</p>`;
    if (sel < 0) {
      panel.innerHTML = `${head}<p class="ge-empty">갤러리에서 사진을 눌러 선택하세요.</p>${btns}`;
      return markDirty();
    }
    const it = items[sel];
    const slider = (key, label, min, max, step, unit) =>
      `<label>${label}<input type="range" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${it[key]}"><output>${it[key]}${unit}</output></label>`;
    panel.innerHTML = `${head}
      <div class="ge-body">
        <div class="ge-preview"><img src="${it.src}" alt=""></div>
        <div class="ge-sliders">
          ${slider("x", "좌우", 0, 100, 1, "%")}
          ${slider("y", "상하", 0, 100, 1, "%")}
          ${slider("zoom", "확대", 1, 3, 0.05, "x")}
        </div>
      </div>${btns}`;
    paintPreview();
    markDirty();
  }
  function markDirty() {
    const dirty = !same(items, original);
    panel.querySelectorAll(".ge-dirty, .ge-discard").forEach((el) => (el.hidden = !dirty));
  }

  function paintPreview() {
    const img = $(".ge-preview img", panel);
    if (img) img.style.cssText = thumbStyle(toEntry(items[sel])) || "";
    panel.querySelectorAll("input[data-key]").forEach((inp) => {
      inp.value = items[sel][inp.dataset.key];
      inp.nextElementSibling.textContent = items[sel][inp.dataset.key] + (inp.dataset.key === "zoom" ? "x" : "%");
    });
  }

  // 갤러리 썸네일과 라이트박스(C.images.gallery)에 반영
  function apply(i) {
    const entry = toEntry(items[i]);
    C.images.gallery[i] = entry;
    const img = $(`.g-item[data-index="${i}"] img`);
    if (img) img.style.cssText = thumbStyle(entry);
  }
  function update(i, patch) {
    Object.assign(items[i], patch);
    apply(i);
    store.set(localStorage, DRAFT, same(items, original) ? null : items);
    paintPreview();
    markDirty();
  }

  function select(i) {
    $(".g-item.ge-sel")?.classList.remove("ge-sel");
    sel = i < 0 ? -1 : (i + items.length) % items.length;
    if (sel >= 0) $(`.g-item[data-index="${sel}"]`)?.classList.add("ge-sel");
    saveState();
    renderPanel();
  }

  function setOn(v) {
    on = v;
    toggle.classList.toggle("on", on);
    toggle.textContent = on ? "편집 끄기" : "썸네일 편집";
    document.body.classList.toggle("ge-on", on);
    panel.hidden = !on;
    if (!on) $(".g-item.ge-sel")?.classList.remove("ge-sel");
    else select(sel);
    saveState();
  }
  const saveState = () => store.set(sessionStorage, STATE, { on, sel });

  async function copyCode() {
    const code = `    gallery: [\n${items.map((it) => `      ${entryCode(toEntry(it))},`).join("\n")}\n    ],`;
    try {
      await navigator.clipboard.writeText(code);
      flash("복사됨! config.js 에 붙여넣으세요");
    } catch (e) {
      window.prompt("복사가 막혀 있어요. 아래 내용을 직접 복사하세요.", code);
    }
  }
  function flash(msg) {
    const b = $(".ge-copy", panel);
    if (!b) return;
    b.textContent = msg;
    setTimeout(() => b.isConnected && (b.textContent = "코드 복사"), 1800);
  }

  // ───────── 이벤트 ─────────
  toggle.addEventListener("click", () => setOn(!on));

  // 편집 중에는 사진을 눌러도 크게 보기 대신 선택만 한다 (main.js 보다 먼저 가로챔)
  document.addEventListener(
    "click",
    (e) => {
      if (!on) return;
      const g = e.target.closest(".g-item");
      if (!g) return;
      e.stopPropagation();
      e.preventDefault();
      select(Number(g.dataset.index));
    },
    true,
  );

  panel.addEventListener("input", (e) => {
    const key = e.target.dataset.key;
    if (key) update(sel, { [key]: parseFloat(e.target.value) });
  });

  panel.addEventListener("click", (e) => {
    const act = e.target.closest("[data-ge]")?.dataset.ge;
    if (act === "prev") select(sel - 1);
    if (act === "next") select(sel + 1);
    if (act === "reset") update(sel, { x: 50, y: 50, zoom: 1 });
    if (act === "copy") copyCode();
    if (act === "discard" && confirm("config.js 에 반영하지 않은 변경을 모두 버릴까요?")) {
      items = original.map((it) => ({ ...it }));
      items.forEach((_, i) => apply(i));
      store.set(localStorage, DRAFT, null);
      renderPanel();
    }
  });

  // 미리보기를 끌어서 위치 조정: 끄는 방향으로 사진이 따라 움직인다
  let drag = null;
  panel.addEventListener("pointerdown", (e) => {
    const pv = e.target.closest(".ge-preview");
    if (!pv || sel < 0) return;
    pv.setPointerCapture(e.pointerId);
    drag = { px: e.clientX, py: e.clientY, x: items[sel].x, y: items[sel].y, w: pv.clientWidth };
  });
  panel.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const k = 100 / drag.w / items[sel].zoom;
    update(sel, {
      x: Math.round(clamp(drag.x - (e.clientX - drag.px) * k, 0, 100)),
      y: Math.round(clamp(drag.y - (e.clientY - drag.py) * k, 0, 100)),
    });
  });
  ["pointerup", "pointercancel"].forEach((t) => panel.addEventListener(t, () => (drag = null)));

  // ───────── 시작 ─────────
  items.forEach((_, i) => apply(i));
  const st = store.get(sessionStorage, STATE);
  if (st) {
    sel = st.sel ?? -1;
    setOn(!!st.on);
  }
})();
