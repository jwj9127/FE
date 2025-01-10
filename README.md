## 가이드라인 ( 정말 중요합니다!! )

#### 목표

- 코드의 재사용성
- 코드의 가독성 , 유지보수성

#### 생각해야 할 부분

1. TS를 사용할 때 어떻게 Type을 묶을 것인지

2. 어떻게 렌더링할 지 고민하고 프로젝트를 구상해야합니다.
   <br/> - ( 페이지엔 어떤 렌더링 방식을 쓰고 컴포넌트엔 어떤 렌더링 방식을 쓸 지 )

3. style-component와 scss을 함께 사용할 것입니다. 어떻게 해야 더 목표에 가까워질 지 많이 생각해보셔야 해요

4. redux를 사용하여 중앙에서 데이터를 관리합니다. 물론 props가 좋은 경우도 존재합니다! 고민해보세요

5. git 컨벤션을 사용해주세요

6. 커밋은 터미널에서 하지않고 폴더를 클릭하여 git bash로 이용해주세요

7. Gitmoji CLI를 이용하기 때문에 커밋 명령어는 `gitmoji -c` 입니다. (줄바꿈은 `Shift + Enter`)

8. 각자의 레포로 포크해간 후 머지할 땐 PR을 통해 하겠습니다.

## Git Convention

### 포맷

```
type: subject

body
```

#### type

- 하나의 커밋에 여러 타입이 존재하는 경우 상위 우선순위의 타입을 사용한다.
- fix: 버스 픽스
- feat: 새로운 기능 추가
- refactor: 리팩토링 (버그픽스나 기능추가없는 코드변화)
- docs: 문서만 변경
- style: 코드의 의미가 변경 안 되는 경우 (띄어쓰기, 포맷팅, 줄바꿈 등)
- test: 테스트코드 추가/수정
- chore: 빌드 테스트 업데이트, 패키지 매니저를 설정하는 경우 (프로덕션 코드 변경 X)

#### subject

- 제목은 50글자를 넘지 않도록 한다.
- 개조식 구문 사용
  - 중요하고 핵심적인 요소만 간추려서 (항목별로 나열하듯이) 표현
- 마지막에 특수문자를 넣지 않는다. (마침표, 느낌표, 물음표 등)

#### body (optional)

- 각 라인별로 balled list로 표시한다.
  - 예시) - AA
- 가능하면 한줄당 72자를 넘지 않도록 한다.
- 본문의 양에 구애받지 않고 최대한 상세히 작성
- “어떻게” 보다는 “무엇을" “왜” 변경했는지 설명한다.

## Gitmoji Convention

아이콘 코드 설명
🎨 :art: 코드의 구조/형태 개선
⚡️ :zap: 성능 개선
🔥 :fire: 코드/파일 삭제
🐛 :bug: 버그 수정
🚑 :ambulance: 긴급 수정
✨ :sparkles: 새 기능
📝 :memo: 문서 추가/수정
💄 :lipstick: UI/스타일 파일 추가/수정
🎉 :tada: 프로젝트 시작
✅ :white_check_mark: 테스트 추가/수정
🔒 :lock: 보안 이슈 수정
🔖 :bookmark: 릴리즈/버전 태그
💚 :green_heart: CI 빌드 수정
📌 :pushpin: 특정 버전 의존성 고정
👷 :construction_worker: CI 빌드 시스템 추가/수정
📈 :chart_with_upwards_trend: 분석, 추적 코드 추가/수정
♻️ :recycle: 코드 리팩토링
➕ :heavy_plus_sign: 의존성 추가
➖ :heavy_minus_sign: 의존성 제거
🔧 :wrench: 구성 파일 추가/수정
🔨 :hammer: 개발 스크립트 추가/수정
🌐 :globe_with_meridians: 국제화/현지화
💩 :poop: 똥싼 코드
⏪ :rewind: 변경 내용 되돌리기
🔀 :twisted_rightwards_arrows: 브랜치 합병
📦 :package: 컴파일된 파일 추가/수정
👽 :alien: 외부 API 변화로 인한 수정
🚚 :truck: 리소스 이동, 이름 변경
📄 :page_facing_up: 라이센스 추가/수정
💡 :bulb: 주석 추가/수정
🍻 :beers: 술 취해서 쓴 코드
🗃 :card_file_box: 데이터베이스 관련 수정
🔊 :loud_sound: 로그 추가/수정
🙈 :see_no_evil: .gitignore 추가/수정
