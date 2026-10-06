(function () {
  'use strict';

  const C = window.WEDDING;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nl2br = (s) => esc(s).replace(/\n/g, '<br>');
  const pad = (n) => String(n).padStart(2, '0');

  // ───────── 날짜 계산 (항상 한국 시간 기준) ─────────
  const D = C.date;
  const KST = 9 * 3600 * 1000;
  const DAY = 86400000;
  const weddingTime = Date.UTC(D.year, D.month - 1, D.day, D.hour, D.minute) - KST;
  const weekday = new Date(Date.UTC(D.year, D.month - 1, D.day)).getUTCDay();
  const KO_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const KO_WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const EN_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const EN_MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const EN_MON_SHORT = EN_MONTHS.map((m) => m.slice(0, 3));

  function koTime(h, m) {
    let label, hh;
    if (h < 12) [label, hh] = ['오전', h === 0 ? 12 : h];
    else if (h < 14) [label, hh] = ['낮', h === 12 ? 12 : h - 12];
    else if (h < 18) [label, hh] = ['오후', h - 12];
    else [label, hh] = ['저녁', h - 12];
    return `${label} ${hh}시${m ? ` ${m}분` : ''}`;
  }
  const enTime = (h, m) => `${h % 12 || 12}:${pad(m)}${h < 12 ? 'AM' : 'PM'}`;

  // ───────── 아이콘 ─────────
  const ICON = {
    heart: '<svg viewBox="0 0 15 13" width="15" height="13" fill="currentColor" aria-hidden="true"><path d="M7.11 2.32C8.06.25 10.57-.72 12.58.6c2.01 1.32 2.36 5.05 0 7.54C9.97 10.89 7.16 12.49 7.11 12.52c0 0-2.84-1.6-5.47-4.38C-.72 5.65-.37 1.93 1.64.6 3.66-.72 6.17.25 7.11 2.32Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7.2 3.5c.8 0 1.5.4 2 1.1.9 1.3 2.3 3.3 1.6 4.8-.3.6-1 .9-1.2 1.4-.4 1 .5 2.5 1.9 3.9 1.4 1.4 2.9 2.3 3.9 1.9.5-.2.8-.9 1.4-1.2 1.5-.7 3.5.7 4.8 1.6.7.5 1.1 1.2 1.1 2 0 1.8-2.2 3.6-4 3.8-7.4.7-16.5-8.4-15.8-15.8.2-1.8 2-4 3.8-4Z"/></svg>',
    sms: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/></svg>',
    copy: '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="7.5" width="9.5" height="9.5" rx="2"/><path d="M8 5.5V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-.5"/></svg>',
    chevron: '<svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M1.5 4 6 8.5 10.5 4"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    kakao: '<svg viewBox="0 0 18 18" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M9 1.4C4.5 1.4.8 4.3.8 7.9c0 2.3 1.5 4.3 3.8 5.4l-.8 2.9c-.1.2.2.4.4.3l3.3-2.2c.5.1 1 .1 1.5.1 4.5 0 8.2-2.9 8.2-6.5S13.5 1.4 9 1.4Z"/></svg>',
    music: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
  };

  const sectionTitle = (en, ko) =>
    `<div class="sec-title fade"><p class="sec-en">${esc(en)}</p><h2 class="sec-ko">${esc(ko)}</h2></div>`;

  // ───────── 표지 ─────────
  function renderCover() {
    $('#cover').innerHTML = `
      <img class="cover-bg" src="${esc(C.images.cover)}" alt="" aria-hidden="true">
      <img class="cover-photo" src="${esc(C.images.cover)}" alt="${esc(C.groom.name)}, ${esc(C.bride.name)} 웨딩 사진">
      <div class="cover-frame">
        <div class="cover-bar">
          <span class="cover-label">${esc(C.cover.topLabel)}</span>
          <div class="cover-names">
            <span>${esc(C.groom.name)}</span><span class="cover-heart">${ICON.heart}</span><span>${esc(C.bride.name)}</span>
          </div>
        </div>
        <div class="cover-spacer"></div>
        <div class="cover-bar">
          <span class="cover-date">${D.year} ${EN_MONTHS[D.month - 1]} ${D.day}, ${EN_DAYS[weekday]} ${enTime(D.hour, D.minute)}</span>
          <span class="cover-label">${esc(C.cover.bottomLabel)}</span>
        </div>
      </div>`;
  }

  // ───────── 인사말 + 혼주 ─────────
  function parentName(p) {
    if (!p || !p.name) return '';
    return `${p.deceased ? '<span class="deceased">故</span>' : ''}${esc(p.name)}`;
  }
  function familyRow(person) {
    const parents = [parentName(person.father), parentName(person.mother)].filter(Boolean).join('<span class="dot">·</span>');
    return `
      <div class="family-row">
        <span class="parents">${parents}</span>
        <span class="of">의 ${esc(person.order)}</span>
        <strong class="child">${esc(person.name)}</strong>
      </div>`;
  }
  function renderIntro() {
    $('#intro').innerHTML = `
      ${sectionTitle('INVITATION', C.greeting.title)}
      <p class="greeting fade">${nl2br(C.greeting.text)}</p>
      <div class="divider fade"></div>
      <div class="family fade">${familyRow(C.groom)}${familyRow(C.bride)}</div>
      <button type="button" class="btn-outline fade" data-action="contact">${ICON.phone}<span>연락하기</span></button>`;
  }

  function contactList(person, side) {
    const rows = [
      [side, person.name, person.phone],
      [`${side} 아버지`, person.father?.name, person.father?.phone],
      [`${side} 어머니`, person.mother?.name, person.mother?.phone],
    ].filter(([, name, phone]) => name && phone);
    return rows
      .map(
        ([role, name, phone]) => `
        <li class="contact-item">
          <span class="contact-role">${esc(role)}</span>
          <span class="contact-name">${esc(name)}</span>
          <a class="icon-btn" href="tel:${esc(phone)}" aria-label="${esc(name)}에게 전화">${ICON.phone}</a>
          <a class="icon-btn" href="sms:${esc(phone)}" aria-label="${esc(name)}에게 문자">${ICON.sms}</a>
        </li>`
      )
      .join('');
  }
  function openContact() {
    openModal(`
      <h3 class="modal-title">연락하기</h3>
      <p class="modal-sub">신랑측</p>
      <ul class="contact-list">${contactList(C.groom, '신랑')}</ul>
      <p class="modal-sub">신부측</p>
      <ul class="contact-list">${contactList(C.bride, '신부')}</ul>`);
  }

  // ───────── 중간 사진 배너 ─────────
  function renderBanner(id, src) {
    const el = $(id);
    if (!src) return el.remove();
    el.innerHTML = `
      <div class="banner-inner fade">
        <div class="banner-frame"><img src="${esc(src)}" alt="" loading="lazy"></div>
        <p class="banner-script">${nl2br(C.bannerPhrase)}</p>
      </div>`;
  }

  // ───────── 달력 + D-day ─────────
  function renderCalendar() {
    const firstDay = new Date(Date.UTC(D.year, D.month - 1, 1)).getUTCDay();
    const lastDate = new Date(Date.UTC(D.year, D.month, 0)).getUTCDate();
    const holidays = new Set(C.holidays || []);
    let cells = KO_DAYS.map((d, i) => `<div class="cal-head${i === 0 ? ' sun' : ''}">${d}</div>`).join('');
    for (let i = 0; i < firstDay; i++) cells += '<div></div>';
    for (let d = 1; d <= lastDate; d++) {
      const dow = (firstDay + d - 1) % 7;
      const key = `${D.year}-${pad(D.month)}-${pad(d)}`;
      const cls = [dow === 0 || holidays.has(key) ? 'sun' : '', d === D.day ? 'dday' : ''].filter(Boolean).join(' ');
      cells += `<div class="cal-day ${cls}"><span>${d}</span></div>`;
    }
    $('#calendar').innerHTML = `
      <div class="cal-title fade">
        <p class="cal-date">${D.year}.${pad(D.month)}.${pad(D.day)}</p>
        <p class="cal-time">${KO_WEEKDAYS[weekday]} ${koTime(D.hour, D.minute)}</p>
      </div>
      <div class="cal-grid fade">${cells}</div>
      <div class="countdown fade">
        ${['DAYS', 'HOUR', 'MIN', 'SEC']
          .map((l, i) => `${i ? '<span class="cd-sep">:</span>' : ''}<div class="cd-item"><span class="cd-label">${l}</span><span class="cd-num" data-cd="${i}">00</span></div>`)
          .join('')}
      </div>
      <p class="dday-text fade"></p>`;
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }
  function tickCountdown() {
    const diff = Math.max(0, weddingTime - Date.now());
    const vals = [Math.floor(diff / DAY), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];
    $$('[data-cd]').forEach((el, i) => (el.textContent = pad(vals[i])));

    const todayKst = Math.floor((Date.now() + KST) / DAY);
    const weddingDay = Math.floor(Date.UTC(D.year, D.month - 1, D.day) / DAY);
    const n = weddingDay - todayKst;
    const names = `${esc(C.bride.firstName)}, ${esc(C.groom.firstName)}의 결혼식이`;
    $('.dday-text').innerHTML =
      n > 0 ? `${names} <em>${n}</em>일 남았습니다.` : n === 0 ? `${names} <em>오늘</em>입니다.` : `${names} <em>${-n}</em>일 지났습니다.`;
  }

  // ───────── 오시는 길 ─────────
  function renderLocation() {
    const v = C.venue;
    const q = encodeURIComponent(v.name);
    const lines = (arr) =>
      arr
        .map((l) =>
          !l ? '<p class="gap"></p>' : typeof l === 'string' ? `<p>${esc(l)}</p>` : `<p><span class="line-dot" style="color:${esc(l.dot)}">●</span> ${esc(l.text)}</p>`
        )
        .join('');
    $('#location').innerHTML = `
      ${sectionTitle('LOCATION', '오시는 길')}
      <div class="venue fade">
        <p class="venue-name">${esc(v.name)}${v.hall ? ` ${esc(v.hall)}` : ''}</p>
        <p class="venue-addr">${esc(v.address)}
          <button type="button" class="copy-inline" data-copy="${esc(v.address)}" aria-label="주소 복사">${ICON.copy}</button></p>
        ${v.tel ? `<a class="venue-tel" href="tel:${esc(v.tel)}">Tel. ${esc(v.tel)}</a>` : ''}
      </div>
      <div class="map fade">
        <iframe title="예식장 지도" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=${v.lat},${v.lng}&z=16&hl=ko&output=embed"></iframe>
      </div>
      ${v.mapImage ? `<button type="button" class="btn-outline fade" data-action="mapimage"><span>약도 이미지 보기</span></button>` : ''}
      <div class="navi fade">
        <p class="navi-title">내비게이션</p>
        <p class="navi-desc">원하시는 앱을 선택하시면 길안내가 시작됩니다.</p>
        <div class="navi-btns">
          <a href="https://map.naver.com/p/search/${q}" target="_blank" rel="noopener"><i class="navi-ico naver">N</i>네이버지도</a>
          <a href="tmap://route?goalname=${q}&goalx=${v.lng}&goaly=${v.lat}" data-action="tmap"><i class="navi-ico tmap">T</i>티맵</a>
          <a href="https://map.kakao.com/link/to/${q},${v.lat},${v.lng}" target="_blank" rel="noopener"><i class="navi-ico kakao">K</i>카카오맵</a>
        </div>
      </div>
      <ul class="transport fade">
        ${C.transport.map((t) => `<li><p class="tr-title">${esc(t.title)}</p><div class="tr-body">${lines(t.lines)}</div></li>`).join('')}
      </ul>`;
  }

  // 티맵은 웹 버전이 없어 앱이 설치된 휴대폰에서만 열린다. 앱이 없으면 스토어로 보낸다.
  function openTmap(appUrl) {
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);
    if (!isIOS && !isAndroid) return toast('티맵은 모바일에서만 사용할 수 있어요.');

    const store = isIOS
      ? 'https://apps.apple.com/kr/app/id431589174'
      : 'https://play.google.com/store/apps/details?id=com.skt.tmap.ku';
    const timer = setTimeout(() => {
      if (!document.hidden) location.href = store;
    }, 1500);
    document.addEventListener('visibilitychange', () => document.hidden && clearTimeout(timer), { once: true });
    location.href = appUrl;
  }

  // ───────── 갤러리 ─────────
  function renderGallery() {
    const imgs = C.images.gallery || [];
    if (!imgs.length) return $('#gallery').remove();
    const initial = C.galleryInitialCount || 9;
    $('#gallery').innerHTML = `
      ${sectionTitle('GALLERY', '웨딩 갤러리')}
      <div class="gallery-grid fade${imgs.length > initial ? ' collapsed' : ''}">
        ${imgs
          .map((src, i) => `<button type="button" class="g-item${i >= initial ? ' extra' : ''}" data-index="${i}" aria-label="사진 ${i + 1} 크게 보기"><img src="${esc(src)}" alt="" loading="lazy"></button>`)
          .join('')}
      </div>
      ${imgs.length > initial ? `<button type="button" class="more-btn" data-action="more">더보기 ${ICON.chevron}</button>` : ''}`;
  }

  let lbIndex = 0;
  function openLightbox(i) {
    lbIndex = i;
    const lb = $('#lightbox');
    lb.innerHTML = `
      <button type="button" class="lb-close" data-action="lb-close" aria-label="닫기">${ICON.close}</button>
      <button type="button" class="lb-nav lb-prev" data-action="lb-prev" aria-label="이전 사진">${ICON.left}</button>
      <img class="lb-img" alt="">
      <button type="button" class="lb-nav lb-next" data-action="lb-next" aria-label="다음 사진">${ICON.right}</button>
      <p class="lb-count"></p>`;
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    showLightbox();
  }
  function showLightbox() {
    const imgs = C.images.gallery;
    lbIndex = (lbIndex + imgs.length) % imgs.length;
    $('.lb-img').src = imgs[lbIndex];
    $('.lb-count').textContent = `${lbIndex + 1} / ${imgs.length}`;
  }
  function closeLightbox() {
    $('#lightbox').hidden = true;
    document.body.classList.remove('no-scroll');
  }

  // ───────── 계좌 ─────────
  function renderAccount() {
    const group = (title, list) => `
      <div class="acc-group">
        <button type="button" class="acc-head" data-action="toggle-acc" aria-expanded="false"><span>${esc(title)}</span>${ICON.chevron}</button>
        <ul class="acc-list">
          ${list
            .map(
              (a) => `
            <li class="acc-item">
              <div class="acc-info">
                <button type="button" class="acc-name" data-copy="${esc(`${a.bank} ${a.number}`)}">${ICON.copy}<span class="acc-rel">${esc(a.relation)}</span>${esc(a.name)}</button>
                <button type="button" class="acc-num" data-copy="${esc(`${a.bank} ${a.number}`)}">${esc(a.bank)} ${esc(a.number)}</button>
              </div>
              <div class="acc-btns">
                ${a.kakaopay ? `<a class="kakaopay" href="${esc(a.kakaopay)}" target="_blank" rel="noopener" aria-label="카카오페이로 송금">${ICON.kakao}</a>` : `<button type="button" class="chip" data-copy="${esc(`${a.bank} ${a.number}`)}">복사</button>`}
              </div>
            </li>`
            )
            .join('')}
        </ul>
      </div>`;
    $('#account').innerHTML = `
      ${sectionTitle('ACCOUNT', '마음 전하실 곳')}
      <p class="acc-msg fade">${nl2br(C.accountMessage)}</p>
      <div class="fade">
        ${group('신랑측 계좌번호', C.accounts.groom)}
        ${group('신부측 계좌번호', C.accounts.bride)}
      </div>`;
  }

  // ───────── 엔딩 ─────────
  function renderEnding() {
    $('#stamp').innerHTML = `
      <div class="stamp-badge fade">
        <span class="stamp-top">WEDDING DAY</span>
        <span class="stamp-date">${pad(D.day)}-${EN_MON_SHORT[D.month - 1]}-${D.year}</span>
        <span class="stamp-bottom">${esc(C.groom.firstName)} &amp; ${esc(C.bride.firstName)}</span>
      </div>`;
    $('#ending').innerHTML = `
      <img class="ending-photo" src="${esc(C.images.ending)}" alt="" loading="lazy">
      <div class="ending-card fade">
        <p>${nl2br(C.ending.text)}</p>
        ${C.ending.source ? `<p class="ending-src">${esc(C.ending.source)}</p>` : ''}
      </div>`;
    $('#share').innerHTML = `
      <button type="button" class="share-link" data-action="kakao"><span class="kakao-ico">${ICON.kakao}</span>카카오톡으로 초대장 보내기</button>
      <button type="button" class="share-link" data-action="copy-link">${ICON.copy}링크 복사하기</button>`;
    $('#footer').textContent = `© ${D.year} ${C.groom.firstName} & ${C.bride.firstName}`;
  }

  // ───────── 공유 ─────────
  function initKakao() {
    const key = C.share.kakaoAppKey;
    if (!key) return;
    const s = document.createElement('script');
    s.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
    s.crossOrigin = 'anonymous';
    s.onload = () => window.Kakao && !window.Kakao.isInitialized() && window.Kakao.init(key);
    document.head.appendChild(s);
  }
  function shareKakao() {
    const url = location.href.split('#')[0];
    if (window.Kakao && window.Kakao.isInitialized()) {
      const link = { mobileWebUrl: url, webUrl: url };
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: { title: C.share.title, description: C.share.description, imageUrl: C.share.imageUrl, link },
        buttons: [{ title: '청첩장 보기', link }],
      });
    } else if (navigator.share) {
      navigator.share({ title: C.share.title, text: C.share.description, url }).catch(() => {});
    } else {
      copyText(url, '링크가 복사되었습니다. 카카오톡에 붙여넣어 보내주세요.');
    }
  }

  // ───────── 공통: 복사 / 토스트 / 모달 ─────────
  function copyText(text, msg = '복사되었습니다.') {
    const done = () => toast(msg);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else fallbackCopy(text, done);
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('복사에 실패했습니다.'); }
    ta.remove();
  }
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => (t.hidden = true), 300);
    }, 2000);
  }
  function openModal(html) {
    const m = $('#modal');
    m.innerHTML = `<div class="modal-dim" data-action="modal-close"></div>
      <div class="modal-panel" role="dialog" aria-modal="true">
        <button type="button" class="modal-x" data-action="modal-close" aria-label="닫기">${ICON.close}</button>${html}
      </div>`;
    m.hidden = false;
    document.body.classList.add('no-scroll');
  }
  function closeModal() {
    $('#modal').hidden = true;
    document.body.classList.remove('no-scroll');
  }

  // ───────── 배경음악 ─────────
  function initBgm() {
    if (!C.bgm) return;
    const audio = new Audio(C.bgm);
    audio.loop = true;
    const btn = $('#bgm-btn');
    btn.innerHTML = ICON.music;
    btn.hidden = false;
    btn.addEventListener('click', () => {
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    });
    audio.addEventListener('play', () => btn.classList.add('playing'));
    audio.addEventListener('pause', () => btn.classList.remove('playing'));
  }

  // ───────── 이벤트 ─────────
  document.addEventListener('click', (e) => {
    const copyEl = e.target.closest('[data-copy]');
    if (copyEl) return copyText(copyEl.dataset.copy);
    const gItem = e.target.closest('.g-item');
    if (gItem) return openLightbox(Number(gItem.dataset.index));
    const actEl = e.target.closest('[data-action]');
    if (!actEl) return;
    switch (actEl.dataset.action) {
      case 'contact': return openContact();
      case 'modal-close': return closeModal();
      case 'mapimage': return openModal(`<h3 class="modal-title">약도</h3><img class="map-image" src="${esc(C.venue.mapImage)}" alt="약도">`);
      case 'more':
        $('.gallery-grid').classList.remove('collapsed');
        return actEl.remove();
      case 'lb-close': return closeLightbox();
      case 'lb-prev': lbIndex--; return showLightbox();
      case 'lb-next': lbIndex++; return showLightbox();
      case 'toggle-acc': {
        const open = actEl.parentElement.classList.toggle('open');
        return actEl.setAttribute('aria-expanded', String(open));
      }
      case 'tmap':
        e.preventDefault();
        return openTmap(actEl.getAttribute('href'));
      case 'kakao': return shareKakao();
      case 'copy-link': return copyText(location.href.split('#')[0], '청첩장 링크가 복사되었습니다.');
    }
  });
  $('#lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!$('#lightbox').hidden) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') { lbIndex--; showLightbox(); }
      if (e.key === 'ArrowRight') { lbIndex++; showLightbox(); }
    } else if (!$('#modal').hidden && e.key === 'Escape') closeModal();
  });
  let touchX = null;
  $('#lightbox').addEventListener('touchstart', (e) => (touchX = e.touches[0].clientX), { passive: true });
  $('#lightbox').addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { lbIndex += dx < 0 ? 1 : -1; showLightbox(); }
    touchX = null;
  });

  // ───────── 스크롤 애니메이션 ─────────
  function initFade() {
    const els = $$('.fade');
    if (!('IntersectionObserver' in window)) return els.forEach((el) => el.classList.add('show'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); } }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
  }

  // ───────── 실행 ─────────
  document.title = C.share.title || document.title;
  renderCover();
  renderIntro();
  renderBanner('#banner1', C.images.middle1);
  renderCalendar();
  renderBanner('#banner2', C.images.middle2);
  renderLocation();
  renderGallery();
  renderAccount();
  renderEnding();
  initKakao();
  initBgm();
  initFade();
})();
