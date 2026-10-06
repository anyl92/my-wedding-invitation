# 모바일 청첩장

빌드 과정 없는 정적 사이트(HTML/CSS/JS)입니다. GitHub Pages에 그대로 올리면 됩니다.

## 파일 구조

```
index.html        페이지 뼈대 + 링크 미리보기(og) 설정
js/config.js      ✏️ 청첩장 내용 (이름, 날짜, 인사말, 장소, 계좌 등) — 거의 이 파일만 수정
js/main.js        동작 코드 (수정할 필요 없음)
css/style.css     디자인 (맨 위 :root 의 색상 값으로 테마 변경)
images/           사진
```

## 내용 수정하기

1. `js/config.js`를 열어 따옴표 안의 글자를 바꿉니다.
2. 사진은 `images/` 폴더에 넣고, `config.js`의 `images` 항목에서 파일 이름을 바꿉니다.
   - 예: `cover: 'images/cover.jpg'`
   - 휴대폰 사진은 용량이 크니 긴 변 1600px 이하, 장당 500KB 안팎으로 줄이는 걸 권장합니다.
3. `index.html` 위쪽의 `<title>`, `og:title`, `og:description`도 함께 바꿉니다.
   - 이 값들은 카톡/문자로 링크를 보냈을 때 미리보기에 쓰입니다.

## 내 컴퓨터에서 미리보기

```bash
python3 -m http.server 8000
```
브라우저에서 http://localhost:8000 을 엽니다. 크롬 개발자도구(F12)에서 모바일 화면 모드로 보면 편합니다.

## 배포 (GitHub Pages)

1. 변경 사항을 커밋하고 GitHub에 push 합니다.
2. GitHub 저장소 → **Settings → Pages**로 갑니다.
3. Source를 `Deploy from a branch`로 두고, 배포할 브랜치(예: `main`)와 `/ (root)`를 선택한 뒤 저장합니다.
4. 1~2분 뒤 `https://anyl92.github.io/my-wedding-invitation/` 에서 확인합니다.

## 링크 미리보기 이미지 (카카오톡 썸네일)

- `images/og.jpg`에 대표 사진을 넣습니다. 가로형 1200×630 권장, JPG/PNG만 가능합니다.
- `index.html`의 `og:image` / `og:url` 주소가 실제 배포 주소와 맞는지 확인합니다.
- 카톡은 미리보기를 캐시합니다. 수정 후에도 예전 미리보기가 보이면 [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 캐시를 초기화하세요.

## 카카오톡 공유 버튼 (선택)

키가 없으면 버튼이 휴대폰 기본 공유창을 열거나 링크를 복사합니다. 카톡 전용 카드 형태로 보내려면 다음과 같이 설정합니다.

1. [Kakao Developers](https://developers.kakao.com)에서 애플리케이션을 만듭니다.
2. 앱 설정 → 플랫폼 → Web에 사이트 도메인 `https://anyl92.github.io`를 등록합니다.
3. JavaScript 키를 `config.js`의 `share.kakaoAppKey`에 넣습니다.
4. `share.imageUrl`에는 `https://anyl92.github.io/my-wedding-invitation/images/og.jpg`처럼 전체 주소를 넣습니다.

## 그 외

- **지도:** 별도 키 없이 쓸 수 있는 구글 지도 임베드를 사용합니다. 네이버·카카오 지도 버튼은 각 앱/웹으로 연결됩니다.
- **티맵 버튼:** 티맵 앱이 설치된 휴대폰에서만 동작합니다.
- **고인 표시:** 혼주가 고인이시면 `deceased: true`로 바꾸면 이름 앞에 故가 붙습니다.
- **배경음악:** `music/bgm.mp3`처럼 파일을 넣고 `config.js`의 `bgm`에 경로를 적으면 우측 상단에 음악 버튼이 생깁니다.
