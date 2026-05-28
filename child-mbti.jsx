import { useState, useEffect, useRef } from "react";


// ===================== MBTI 문항 =====================

const QUESTIONS = {
  // 5~7세 · 유치원/집 실제 상황 · 각 축 2문항씩
  "5-7": [
    { id: 1, dim: "EI", text: "유치원에서 친구들이 같이 놀자고 부르면? 🎈", a: "👫 신나서 같이 달려가요", b: "🧸 하던 거 계속하고 싶어요", sa: "E", sb: "I" },
    { id: 2, dim: "EI", text: "집에 손님이 와서 인사할 때? 👋", a: "🙋 큰 소리로 \"안녕하세요\" 해요", b: "🌸 엄마 뒤에 살짝 숨어요", sa: "E", sb: "I" },
    { id: 3, dim: "SN", text: "엄마가 책을 골라준다면 어떤 게 좋아요? 📚", a: "🦁 진짜 동물이 나오는 책", b: "🐉 마법사랑 용이 나오는 책", sa: "S", sb: "N" },
    { id: 4, dim: "SN", text: "도화지에 그림을 그릴 때? 🎨", a: "🍎 본 것을 똑같이 그려요", b: "🌈 마음속 이야기를 그려요", sa: "S", sb: "N" },
    { id: 5, dim: "TF", text: "친구가 넘어져서 울고 있어요. 😢", a: "🤔 \"어디 다쳤어?\" 먼저 물어봐요", b: "🤗 옆에서 꼭 안아줘요", sa: "T", sb: "F" },
    { id: 6, dim: "TF", text: "동생이 내 장난감을 가져갔어요. 🧸", a: "⚖️ \"내 거야\"라고 분명히 말해요", b: "💕 같이 가지고 놀자고 해요", sa: "T", sb: "F" },
    { id: 7, dim: "JP", text: "자기 전에 어떻게 해요? 🌙", a: "🛏️ 양치 → 옷 갈아입기 순서대로 해요", b: "🎲 그때그때 하고 싶은 것부터 해요", sa: "J", sb: "P" },
    { id: 8, dim: "JP", text: "유치원 가방은 언제 챙겨요? 🎒", a: "🌙 잠자기 전에 미리 챙겨놔요", b: "🌅 아침에 후다닥 챙겨요", sa: "J", sb: "P" },
  ],
  // 8~10세 · 학교/친구 사이 실제 상황 · 각 축 3문항씩
  "8-10": [
    { id: 1, dim: "EI", text: "쉬는 시간 종이 치면? 🔔", a: "🤸 친구들과 운동장으로 우르르 나가요", b: "📖 자리에서 책 읽거나 그림 그려요", sa: "E", sb: "I" },
    { id: 2, dim: "EI", text: "선생님이 \"발표할 사람?\" 하면? 🙋", a: "✋ 손 번쩍 들고 자원해요", b: "🌷 알아도 조용히 있는 편이에요", sa: "E", sb: "I" },
    { id: 3, dim: "EI", text: "모둠 활동을 시작할 때? 👥", a: "💬 의견을 먼저 꺼내요", b: "👂 친구들 의견 듣고 정리해요", sa: "E", sb: "I" },
    { id: 4, dim: "SN", text: "새로운 단원을 배울 때? 📘", a: "📖 처음부터 차근차근 따라가요", b: "🚀 전체 그림부터 보면 더 재밌어요", sa: "S", sb: "N" },
    { id: 5, dim: "SN", text: "글짓기 시간에? ✍️", a: "🏠 진짜 있었던 일을 자세히 써요", b: "💭 상상한 이야기를 만들어 써요", sa: "S", sb: "N" },
    { id: 6, dim: "SN", text: "만들기 시간에? 🎨", a: "📐 선생님 설명대로 정확히 만들어요", b: "🌟 내 아이디어로 다르게 바꿔봐요", sa: "S", sb: "N" },
    { id: 7, dim: "TF", text: "친구가 시험 점수 때문에 속상해해요. 😔", a: "💡 \"다음엔 이렇게 해보자\" 방법을 알려줘요", b: "🫂 \"많이 속상했겠다\" 먼저 위로해요", sa: "T", sb: "F" },
    { id: 8, dim: "TF", text: "짝꿍과 의견이 다를 때? 🤝", a: "🧠 누구 말이 더 맞는지 같이 따져봐요", b: "💕 서로 기분 안 상하게 양보해요", sa: "T", sb: "F" },
    { id: 9, dim: "TF", text: "어떤 칭찬이 더 기뻐요? 🌟", a: "🏆 \"이 부분이 잘됐어\" 구체적인 칭찬", b: "🌸 \"고생했어\" 따뜻한 한마디", sa: "T", sb: "F" },
    { id: 10, dim: "JP", text: "숙제는 보통 언제 해요? 📝", a: "📅 학교 끝나고 바로 해요", b: "⏰ 자기 전에 몰아서 해요", sa: "J", sb: "P" },
    { id: 11, dim: "JP", text: "학교 갈 준비는? 🎒", a: "🌙 전날 밤에 다 챙겨놔요", b: "🌅 아침에 챙겨도 괜찮아요", sa: "J", sb: "P" },
    { id: 12, dim: "JP", text: "주말 보내는 방식은? 🌈", a: "📋 미리 뭘 할지 정해두는 게 좋아요", b: "🎈 그때 기분에 맞춰서 정해요", sa: "J", sb: "P" },
  ],
  // 11~13세 · 좀 더 복잡한 사회적 상황 · 각 축 5문항씩
  "11-13": [
    { id: 1, dim: "EI", text: "새 학기, 처음 보는 친구들과 한 반이 됐어요. 🌸", a: "✨ 새 친구 사귈 생각에 설레요", b: "😶 친한 친구가 있을지 걱정이 먼저 들어요", sa: "E", sb: "I" },
    { id: 2, dim: "EI", text: "수업 발표 차례가 다가올 때? 🎤", a: "🎯 어떻게 말할지 신나게 준비해요", b: "🌷 차례가 빨리 지나가길 바라요", sa: "E", sb: "I" },
    { id: 3, dim: "EI", text: "친구들 단톡방에서 나는? 📱", a: "💬 자주 말하고 반응도 활발해요", b: "👀 주로 읽고 가끔만 답해요", sa: "E", sb: "I" },
    { id: 4, dim: "EI", text: "친구들과 하루 종일 놀고 집에 왔어요. 🏠", a: "😄 더 놀고 싶고 아쉬워요", b: "🌙 혼자 쉬는 시간이 필요해요", sa: "E", sb: "I" },
    { id: 5, dim: "EI", text: "새 동아리 첫 모임 날? 🌱", a: "🙌 먼저 다가가서 말 걸어요", b: "🌿 분위기 살피며 자연스럽게 어울려요", sa: "E", sb: "I" },
    { id: 6, dim: "SN", text: "수업 중 어떤 활동이 더 흥미로워요? 🔬", a: "🧪 직접 해보는 실험·실습", b: "💡 아이디어를 나누는 토론·발표", sa: "S", sb: "N" },
    { id: 7, dim: "SN", text: "도서관에서 책을 고를 때? 📚", a: "📖 실화·위인전·과학책", b: "🦄 판타지·SF·상상력 책", sa: "S", sb: "N" },
    { id: 8, dim: "SN", text: "새 보드게임을 처음 할 때? 🎲", a: "🎮 일단 해보면서 익혀요", b: "📋 규칙·전략을 먼저 파악해요", sa: "S", sb: "N" },
    { id: 9, dim: "SN", text: "수행평가 주제를 직접 정한다면? ✏️", a: "✅ 익숙하고 자료 많은 안전한 주제", b: "🌟 새롭고 독특한 주제", sa: "S", sb: "N" },
    { id: 10, dim: "SN", text: "선생님 설명 중 머리에 더 남는 건? 🧠", a: "📝 구체적인 예시·사례", b: "🎯 전체적인 흐름·의미", sa: "S", sb: "N" },
    { id: 11, dim: "TF", text: "친구가 부모님과 다툰 일을 털어놓을 때? 💬", a: "💭 어떻게 풀면 좋을지 같이 방법을 찾아요", b: "🫂 \"많이 속상했겠다\" 마음을 먼저 알아줘요", sa: "T", sb: "F" },
    { id: 12, dim: "TF", text: "단톡방에서 친구들 의견이 갈렸어요. 💭", a: "📊 어느 쪽 말이 더 맞는지 정리해요", b: "😊 다들 기분 상하지 않게 분위기를 살펴요", sa: "T", sb: "F" },
    { id: 13, dim: "TF", text: "친구가 내 의견을 물을 때? 🤝", a: "🎯 솔직하게 내 생각을 말해요", b: "🌸 친구 마음 다치지 않게 조심히 말해요", sa: "T", sb: "F" },
    { id: 14, dim: "TF", text: "다른 친구가 칭찬받는 걸 봤어요. 🌟", a: "📐 어떤 점이 칭찬받았는지 분석해요", b: "💕 친구가 기뻐 보여서 같이 기분 좋아요", sa: "T", sb: "F" },
    { id: 15, dim: "TF", text: "모둠 과제에서 한 친구가 자기 몫을 잘 안 해요. 👥", a: "⚖️ 역할을 분명히 다시 정해요", b: "🤗 그냥 내가 좀 더 해요", sa: "T", sb: "F" },
    { id: 16, dim: "JP", text: "시험 공부는 어떻게 시작해요? 📚", a: "📅 전체 일정을 미리 짜두고 따라가요", b: "🎢 그날 컨디션·기분 보고 정해요", sa: "J", sb: "P" },
    { id: 17, dim: "JP", text: "친구와 약속을 잡을 때? 📱", a: "🗓️ 시간·장소를 미리 정해야 편해요", b: "💫 \"이따 보자\" 정도면 충분해요", sa: "J", sb: "P" },
    { id: 18, dim: "JP", text: "책상 위 상태가 어때야 편해요? 📖", a: "🧹 깔끔하게 정리된 상태", b: "🎪 자유롭게 늘어놓은 상태", sa: "J", sb: "P" },
    { id: 19, dim: "JP", text: "갑자기 계획이 바뀌면? 🎲", a: "🧭 잠시 정리할 시간이 필요해요", b: "😎 오히려 새로워서 좋아요", sa: "J", sb: "P" },
    { id: 20, dim: "JP", text: "방학이 시작되면? 🌴", a: "📋 첫날부터 계획표를 만들어요", b: "🌊 며칠 푹 쉬다가 천천히 정해요", sa: "J", sb: "P" },
  ],
};

// ===================== 부모 인증 퀴즈 =====================

const QUIZ_POOL = [
  // 2002 월드컵
  { q: "2002 한일 월드컵 대한민국 감독은?", hint: "💡 네덜란드 출신 외국인 감독, ○딩크", a: "히딩크" },
  { q: "2002 월드컵 스페인전 승부차기 마지막 키커는?", hint: "💡 수비수 출신, 나중에 국가대표 감독 역임", a: "홍명보" },
  { q: "2002 월드컵 포르투갈전 결승골 주인공은?", hint: "💡 이후 맨체스터 유나이티드 입단", a: "박지성" },
  { q: "2002 월드컵 준결승 상대 국가는?", hint: "💡 유럽 강호, 게르만 민족의 나라", a: "독일" },
  { q: "2002 월드컵 이탈리아전 16강 골든골 주인공은?", hint: "💡 안○○", a: "안정환" },
  // 스포츠
  { q: "한국 최초 미국 메이저리그 야구 선수는?", hint: "💡 LA 다저스 입단", a: "박찬호" },
  { q: "1992 바르셀로나 올림픽 마라톤 금메달리스트는?", hint: "💡 황○○", a: "황영조" },
  { q: "1988 서울 올림픽 마스코트 이름은?", hint: "💡 호랑이, 호○○", a: "호돌이" },
  { q: "한국 최초 LPGA 메이저 대회 우승 선수는?", hint: "💡 박○○", a: "박세리" },
  { q: "1988 서울 올림픽 주제가 '손에 손잡고'를 부른 그룹은?", hint: "💡 영어 이름, 나라 이름 포함", a: "코리아나" },
  { q: "2002 솔트레이크 동계올림픽 쇼트트랙 금메달 박탈 논란의 한국 선수는?", hint: "💡 김○○", a: "김동성" },
  // IT/기술
  { q: "싸이월드에서 사용하던 사이버 화폐 이름은?", hint: "💡 나무 열매", a: "도토리" },
  { q: "마이크로소프트가 운영한 인터넷 메신저 이름은?", hint: "💡 영문 대문자", a: "MSN" },
  { q: "하이텔·나우누리와 함께 3대 PC통신이었던 서비스는?", hint: "💡 천○○안", a: "천리안" },
  { q: "넥슨의 대표 RPG, 버섯과 슬라임이 등장하는 게임은?", hint: "💡 이름에 나무 이름 포함", a: "메이플스토리" },
  { q: "스타크래프트에서 테란의 기본 전투 보병 유닛은?", hint: "💡 영어로 해병대라는 뜻", a: "마린" },
  { q: "스타크래프트에서 저그의 기본 전투 유닛은?", hint: "💡 작고 빠름, 2마리씩 생산", a: "저글링" },
  // 아이돌/가요
  { q: "H.O.T의 라이벌, DSP 소속 6인조 남자 아이돌은?", hint: "💡 이름에 숫자 '6'이라는 뜻 포함", a: "젝스키스" },
  { q: "이효리가 소속된 1990년대 여자 아이돌 그룹은?", hint: "💡 꽃 이름", a: "핑클" },
  { q: "1992년 '난 알아요'로 데뷔한 전설적인 3인조 그룹은?", hint: "💡 리더 이름이 그룹명에 포함", a: "서태지와 아이들" },
  { q: "god의 전체 멤버 수는?", hint: "💡 영어로 신이라는 뜻의 그룹", a: "5" },
  { q: "1999년 가면을 쓰고 '와'로 강렬한 무대를 선보인 여가수는?", hint: "💡 이○○", a: "이정현" },
  // 드라마/영화
  { q: "2003년 방영 MBC 사극, 이영애 주연, 주인공 이름이 제목인 드라마는?", hint: "💡 조선 최초 여성 어의 이야기", a: "대장금" },
  { q: "1999년 개봉 한국 첩보 영화, 한석규·김윤진 주연은?", hint: "💡 민물고기 이름", a: "쉬리" },
  { q: "2002년 KBS2 드라마, 배용준·최지우 주연의 멜로물은?", hint: "💡 계절 이름 + 소나타", a: "겨울연가" },
  { q: "2004년 개봉, 한국전쟁 형제 이야기 강제규 감독 영화는?", hint: "💡 제목에 우리나라 국기 이름 포함", a: "태극기 휘날리며" },
  { q: "1997년 방영 MBC 드라마, 안재욱·차인표 주연은?", hint: "💡 '별은 내 ○○에'", a: "별은 내 가슴에" },
  { q: "2000년 방영 KBS2 드라마, 원빈·송혜교·송승헌 주연은?", hint: "💡 계절 이름 + 동화", a: "가을동화" },
  // 음식/생활
  { q: "1974년 출시된 농심의 새우 맛 스낵은?", hint: "💡 새우○○", a: "새우깡" },
  { q: "농심의 국물 없는 짜장 라면 이름은?", hint: "💡 ○○게티", a: "짜파게티" },
  { q: "1990년대 문방구에서 팔던 쫄깃한 불량식품은?", hint: "💡 쫀○○", a: "쫀드기" },
  { q: "에버랜드의 이전 이름은?", hint: "💡 자○○○랜드", a: "자연농원" },
  // 사회/역사
  { q: "2000년 6월 역사적인 남북정상회담 당시 대통령은?", hint: "💡 노벨 평화상 수상", a: "김대중" },
  { q: "2002년 대선에서 당선된 16대 대통령은?", hint: "💡 노○○", a: "노무현" },
];

// ===================== 캐릭터 & 결과 데이터 =====================

const CHARS = {
  ENFJ: { emoji: "🦁", name: "사자", tag: "친구들의 리더", color: "#FF8C42", bg: "#FFF3E8" },
  ENFP: { emoji: "🦜", name: "앵무새", tag: "에너지 넘치는 수다쟁이", color: "#FF6B9D", bg: "#FFF0F6" },
  ENTJ: { emoji: "🦅", name: "독수리", tag: "당당한 대장", color: "#4361EE", bg: "#EEF1FF" },
  ENTP: { emoji: "🦊", name: "여우", tag: "엉뚱한 발명가", color: "#F72585", bg: "#FEE8F4" },
  ESFJ: { emoji: "🐶", name: "강아지", tag: "모두를 챙기는 친구", color: "#E9A800", bg: "#FFFBE8" },
  ESFP: { emoji: "🐬", name: "돌고래", tag: "신나는 파티메이커", color: "#0EA5C9", bg: "#E8F9FF" },
  ESTJ: { emoji: "🦫", name: "비버", tag: "꼼꼼한 반장", color: "#7B2D8B", bg: "#F3E8F8" },
  ESTP: { emoji: "🐆", name: "치타", tag: "겁없는 모험가", color: "#E63946", bg: "#FEE8E8" },
  INFJ: { emoji: "🦉", name: "부엉이", tag: "조용한 관찰자", color: "#457B9D", bg: "#EBF1F5" },
  INFP: { emoji: "🐱", name: "고양이", tag: "감성적인 몽상가", color: "#B5838D", bg: "#F8EDEF" },
  INTJ: { emoji: "🐙", name: "문어", tag: "혼자서도 잘해요", color: "#3A0CA3", bg: "#ECEAFF" },
  INTP: { emoji: "🦝", name: "너구리", tag: "생각이 너무 많아", color: "#2A9D8F", bg: "#E8F5F5" },
  ISFJ: { emoji: "🐰", name: "토끼", tag: "따뜻한 수호자", color: "#4D8B31", bg: "#F0F8E8" },
  ISFP: { emoji: "🐼", name: "판다", tag: "평화로운 예술가", color: "#43AA8B", bg: "#E8F7F3" },
  ISTJ: { emoji: "🐢", name: "거북이", tag: "믿음직한 계획왕", color: "#277DA1", bg: "#E8F4F8" },
  ISTP: { emoji: "🦔", name: "고슴도치", tag: "조용한 해결사", color: "#6D6875", bg: "#F0EEF2" },
};

const CHILD_DESC = {
  ENFJ: "친구가 울고 있으면 제일 먼저 달려가는 타입.\n반에서 다툼이 나면 \"야, 그러지 마\" 하고 슥 끼어드는 그 사람이 바로 나.\n모두가 같이 웃을 때 마음이 제일 신나는 사자. 🦁\n\n쉬는 시간엔 늘 친구들 무리 한가운데.\n역할극·발표·단체 활동, 다 좋아.\n근데 친구 한 명만 빠져도 마음이 짠해지는 편.",
  ENFP: "머릿속에 아이디어가 100개씩 떠다니는 사람.\n\"엄마 있잖아, 그게 뭐냐면…\"으로 시작하는 이야기를 매일 세 편씩 풀어내는 수다쟁이.\n새로운 거? 일단 무조건 좋아하는 앵무새. 🦜\n\n친구 수가 한 손으론 모자라.\n새 친구한테 먼저 다가가 \"같이 놀자\" 하는 그 사람.\n어제 한 놀이 또 하자고? 음… 새로운 거 하자!",
  ENTJ: "\"내가 할게!\" 손이 제일 빠른 사람.\n조별 과제에서 자연스럽게 진두지휘 모드 ON.\n한번 정한 목표는 끝까지 밀어붙이는 뚝심의 독수리. 🦅\n\n보드게임에서 룰 설명하는 사람 = 나.\n친구가 \"넌 어떻게 그렇게 잘해?\" 하면 속으로 \"그치?\" 하면서 살짝 뿌듯.\n혼자보다 팀, 그 안에서 앞장서는 게 진짜 재밌어.",
  ENTP: "\"이거 이렇게 하면 더 재밌지 않아?\" 늘 새로운 방법을 찾는 사람.\n평범한 규칙엔 일단 한 번 의문부터 던지고 보는 호기심왕.\n머릿속이 항상 시끌벅적한 여우. 🦊\n\n친구랑 노는 중에 \"이렇게 바꿔보자\" 한 번씩 던지는 사람.\n수수께끼·말장난·상상 놀이, 셋 다 잘함.\n선생님이 \"답은 하나야\" 하면 속으로 \"진짜?\" 하고 갸웃.",
  ESFJ: "친구가 우유 흘리면 휴지부터 챙겨다 주는 사람.\n오늘 누가 빠졌는지 제일 먼저 알아채는 눈썰미.\n다 같이 웃는 분위기일 때 마음이 가장 편한 강아지. 🐶\n\n친구 생일, 누가 안 챙겨도 내가 챙기는 그런 사람.\n같이 그림 그리고 편지 주고받는 시간이 제일 행복.\n친구 둘이 싸우면 내 일처럼 마음이 콕 찔리는 편.",
  ESFP: "어디든 분위기 띄우는 사람.\n노래·춤·웃긴 이야기 — 셋 다 가능.\n가만히 앉아있는 시간이 인생에서 제일 힘든 돌고래. 🐬\n\n친구 한 명만 있어도 그 자리는 무조건 즐거워.\n노래방·놀이공원·생일 파티, 다 내 무대.\n조용히 책 읽는 시간? 음… 5분이 한계.",
  ESTJ: "학교 가방을 매일 같은 자리에 두는 사람.\n약속한 시간은 칼같이, 정한 규칙은 끝까지.\n누가 새치기라도 하면 정의의 사도 모드가 발동하는 비버. 🦫\n\n\"이거 이렇게 하는 거야\" 친구한테 알려주는 게 자연스러운 사람.\n순서대로 진행하는 보드게임·미션 게임 진짜 좋아.\n약속 시간 늦는 친구 봤을 때? 표정에 다 드러나는 편.",
  ESTP: "\"한번 해볼래!\"가 입버릇인 사람.\n새 놀이기구·새 게임·새 도전 다 환영.\n생각보다 몸이 먼저 움직이는 진짜 치타. 🐆\n\n쉬는 시간 종 치자마자 운동장으로 직진.\n자전거·인라인·술래잡기, 다 환영.\n수업 시간엔… 다리 흔드는 거 멈출 수가 없어.",
  INFJ: "말은 적지만 머릿속은 분주한 사람.\n\"걔, 사실 속상해 보였어\" 같은 한마디를 슬쩍 꺼내는 관찰자.\n자기만의 시간이 꼭 필요한 부엉이. 🦉\n\n진짜 친한 친구는 한두 명이면 충분.\n그 친구랑은 진지한 이야기도 가볍게 나눠.\n시끌벅적한 자리보단 조용한 구석 자리가 마음에 들어.",
  INFP: "머릿속에 자기만의 이야기 세계가 한 채 있는 사람.\n좋아하는 책 한 권 붙들면 한참 못 나옴.\n작은 말 한마디에도 마음이 출렁이는 고양이. 🐱\n\n내 마음 알아주는 친구 한 명만 있어도 진짜 충분.\n그림 그리고 일기 쓰고 상상하는 시간, 그게 내 충전 시간.\n누가 크게 화내면 그날 하루는 마음이 좀 묵직해.",
  INTJ: "계획표 짜는 걸 의외로 좋아하는 사람.\n\"왜 이렇게 해야 돼?\"에 납득이 안 되면 절대 안 움직이는 사람.\n혼자 있는 시간이 충전 타임인 문어. 🐙\n\n친구 수 적어도 괜찮아, 한두 명이면 충분.\n퍼즐·과학·뭔가 설계하는 활동, 다 좋아.\n친구가 갑자기 계획 바꾸자고 하면? 솔직히 좀 당황.",
  INTP: "\"근데 왜 그렇게 되는데?\"가 입에 붙은 사람.\n호기심 가는 주제 하나 잡으면 책 다섯 권쯤 거뜬.\n단, 양말 짝 맞추는 건 매번 잊어버리는 너구리. 🦝\n\n\"왜 그래?\" 같이 궁금해해 주는 친구가 진짜 친구.\n레고·과학 실험·신기한 책, 시간 가는 줄 모름.\n가볍게 떠드는 것보단 깊은 얘기 한 번이 더 좋아.",
  ISFJ: "친구가 안 챙긴 우산을 대신 챙겨주는 사람.\n말은 많이 안 하지만 옆에 있으면 든든한 그런 친구.\n변화보다 익숙한 자리가 편한 토끼. 🐰\n\n오래 친한 친구 한 명, 그게 내 베프.\n인형 놀이·동생 챙기기·같이 빵 굽기, 마음이 편한 활동들.\n시끌시끌한 단체 모임은 끝나면 좀 지쳐.",
  ISFP: "색깔·음악·분위기에 예민한 사람.\n좋아하는 것엔 푹 빠지지만 누가 강요하는 순간 흥미 뚝.\n다툼은 일단 피하고 보는 평화주의자 판다. 🐼\n\n마음 잘 맞는 친구 한 명이면 충분히 행복.\n색칠하기·음악 듣기·강아지 쓰다듬기, 작지만 행복한 순간들.\n누가 큰 소리로 \"이거 해\" 하면 마음이 슥 닫혀.",
  ISTJ: "한 번 한다고 한 건 끝까지 하는 사람.\n약속 시간 5분 전 도착이 기본.\n새 환경엔 천천히 적응하지만 한 번 자리잡으면 누구보다 든든한 거북이. 🐢\n\n한 번 친해진 친구는 진짜 오래 가.\n체스·레고·순서 정해진 게임, 차근차근 하는 게 재밌어.\n새 친구는… 시간이 좀 필요해. 천천히 알아가는 게 편하거든.",
  ISTP: "말은 적지만 손은 빠른 사람.\n고장 난 거 있으면 일단 뜯어보고 보는 타입.\n감정 이야기는 어색해도 진짜 위기 순간엔 제일 먼저 움직이는 고슴도치. 🦔\n\n수다스러운 친구보단 같이 뭔가 만드는 친구가 편해.\n레고·로봇·만들기 키트, 내 시간이 가장 빨리 가는 활동들.\n\"오늘 기분 어때?\" 같은 질문은 좀 답하기 어려운 편.",
};

const PARENT_DATA = {
  ENFJ: {
    psychology: "외향형(E)으로 사람과의 교류에서 에너지를 얻고, 감정형(F)이라 타인의 정서를 본능적으로 읽어냅니다. 판단형(J)이 더해져 \"이 친구가 어떻게 더 행복해질까\"까지 미리 그려두는 경향이 있어요.",
    discipline: "\"왜 안 되는지\" 이유 한 줄이면 의외로 금방 수긍합니다. 단, 친구들 앞에서 혼내면 며칠을 끙끙 앓아요. 잘못 짚는 건 둘만 있을 때 조용히, 인정은 사람들 앞에서 크게 — 이 공식만 기억하셔도 됩니다.",
    praise: "\"친구 챙겨준 거 봤어, 멋지더라\" — 본인이 한 일을 어른이 알아챘다는 사실 자체가 가장 큰 보상입니다. \"착하다\" 같은 두루뭉술한 칭찬보다 본 그대로의 장면을 짚어주세요.",
    learning: "혼자 책상에 앉히면 금세 시들시들. \"이거 배워서 친구한테 알려줄 수 있겠다\" 한마디면 눈빛이 달라집니다. 같이 공부할 친구가 있거나 발표 활동이 있을 때 가장 빛납니다.",
    relationship: "친구 일에 본인 일처럼 슬퍼하다 본인이 먼저 지칩니다. \"너부터 챙겨도 돼\"를 자주 말해주세요. 모두를 만족시키려다 정작 자기가 뭘 좋아하는지 잊는 일이 흔합니다.",
  },
  ENFP: {
    psychology: "외향형(E)+직관형(N)이라 새로운 자극·아이디어에서 에너지를 충전합니다. 인식형(P)이 더해져 한 가지에 오래 매여 있는 걸 답답해해요. 흥미가 옮겨가는 걸 산만함으로만 해석하지 말아 주세요.",
    discipline: "\"안 돼\" 한마디로 끝내면 10분짜리 협상이 따라옵니다(왜 안 되는지, 어떤 조건이면 되는지…). 같은 잔소리 반복은 효과가 가장 빨리 떨어지는 타입이라, 매번 말투를 살짝 바꿔주시는 게 의외로 잘 먹힙니다.",
    praise: "\"그 생각 어떻게 났어?\" 하고 되묻는 게 칭찬보다 효과 큽니다. 본인 아이디어가 진지하게 들렸다는 사실 자체가 큰 보상이에요.",
    learning: "진도표대로 차근차근? 거의 안 됩니다. 흥미가 붙으면 밤새서라도 파지만, 시들면 책상 정리부터 다시 시작해요. 영상·만들기·토론을 섞어주는 쪽이 효율이 훨씬 좋습니다.",
    relationship: "친구가 많아 보여도 의외로 잘 상처받습니다. 본인은 가볍게 던진 말에 친구가 서운해하면 며칠을 끙끙대요. 감정을 말로 정리하는 연습을 같이 해주세요.",
  },
  ENTJ: {
    psychology: "외향형(E)으로 외부 활동에서 에너지를 얻고, 사고형(T)이라 감정보다 결과·합리성에 무게를 둡니다. 판단형(J) 특성상 자율성을 침범당했다고 느끼면 가장 크게 저항해요.",
    discipline: "감정적으로 윽박지르면 속으로 점수 깎습니다(진짜로요). 이유와 원칙을 차분히 말해주면 의외로 빨리 수긍해요. \"엄마가 시켜서\"보다 \"이게 합리적이라서\" 쪽이 통합니다.",
    praise: "\"혼자 끝까지 해냈네\"가 가장 짜릿한 칭찬입니다. 결과뿐 아니라 책임지고 끌어간 과정을 짚어주면 다음번엔 더 큰 도전을 해요.",
    learning: "목표가 뚜렷할수록 강해집니다. \"이거 다 풀면 게임 30분\" 같은 단순 보상보다 \"이걸 알면 뭘 할 수 있어\"가 훨씬 잘 먹혀요. 경쟁 요소가 있으면 눈빛부터 달라집니다.",
    relationship: "리더 노릇을 하다가 친구들에게 \"너 말투가 너무 명령조야\" 소리를 들으면 본인은 진심으로 의아해합니다. 의도가 좋아도 말투는 다듬어야 한다는 걸 알려주세요.",
  },
  ENTP: {
    psychology: "직관형(N)+인식형(P)이라 \"왜?\"와 \"만약에?\"가 사고의 출발점입니다. 권위 자체로는 잘 움직이지 않고, 논리적 설득이 통하는 이유가 여기에 있어요.",
    discipline: "\"왜?\"가 진짜 많습니다. 무시하면 더 끈질겨져요. 토론은 환영하시되 \"엄마 결정은 이거야\"로 마침표는 분명히. 다만 결정 자체가 비논리적이면 더 도전합니다(…).",
    praise: "\"어떻게 그런 생각을 했어?\" 한 줄로 충분합니다. 새로움을 알아봐 주는 어른이 옆에 있다는 것 자체가 보상이에요.",
    learning: "정답 외우기엔 약하고, 원리 파헤치기엔 강합니다. \"왜 이렇게 되는데?\"를 같이 따라가 주면 한 주제로 한참을 파요. 토론·논쟁 형식이 잘 맞습니다.",
    relationship: "친구들과 말장난·토론을 즐기다가 가끔 진지한 친구의 마음을 다치게 합니다. \"이기는 것보다 친구가 중요\"라는 걸 한 번씩 짚어주세요.",
  },
  ESFJ: {
    psychology: "외향형(E)+감정형(F)이라 사람들과의 정서적 교류에서 안정감을 느낍니다. 판단형(J) 특성상 \"내가 챙겨야 할 사람\"의 리스트가 머릿속에 늘 있어, 거절을 어려워하는 것도 같은 맥락이에요.",
    discipline: "\"그렇게 하면 친구가 어떻게 느낄까?\" 한마디면 표정이 바뀝니다. 감정에 매우 민감하므로 큰 소리는 효과보다 상처가 큽니다. 사람 마음 얘기로 풀어주세요.",
    praise: "\"네 덕에 분위기가 좋았어\"처럼 본인의 챙김이 결과로 이어졌다는 걸 짚어주세요. 인정·감사의 표현이 이 아이에겐 가장 좋은 연료입니다.",
    learning: "선생님이 좋으면 그 과목 성적이 같이 올라가는 타입(진심입니다). 관계가 안정될 때 학습도 안정됩니다. 같이 공부할 친구가 있으면 더 좋아해요.",
    relationship: "거절을 정말 어려워합니다. \"싫다고 말해도 친구가 떠나지 않아\"를 꾸준히 알려주세요. 부탁을 다 들어주다 본인이 먼저 지칩니다.",
  },
  ESFP: {
    psychology: "감각형(S)+인식형(P)이라 \"지금 여기\"의 즐거움에 가장 잘 반응합니다. 추상적인 미래 보상보다 즉각적이고 구체적인 경험이 동기가 되는 이유예요.",
    discipline: "긴 설교는 5분쯤부터 표정이 멍해집니다. 짧고 명확하게, 가능하면 그 자리에서 즉시. 차로 30분 가는 동안 잔소리하는 건 효과 거의 0이에요.",
    praise: "즉각적인 리액션이 핵심입니다. \"와, 진짜 재밌었어!\" 표정 크게 해주세요. 한참 지난 칭찬보다 그 자리에서의 한마디가 훨씬 큽니다.",
    learning: "앉아서 보는 공부는 30분이 한계. 만들기·체험·역할극으로 풀어주면 같은 내용도 쏙쏙 들어갑니다. 몸을 쓰는 학습이 가장 효율 좋아요.",
    relationship: "사람 많은 곳에선 신나지만, 친구와 진지한 갈등이 생기면 일단 피하려 합니다. \"불편해도 짚고 가는 게 낫다\"는 걸 같이 연습해 주세요.",
  },
  ESTJ: {
    psychology: "감각형(S)+사고형(T)+판단형(J), 세 축이 모두 \"질서·체계·결과\"를 향합니다. 일관성이 흔들리면 가장 크게 흔들리는 이유가 여기에 있어요.",
    discipline: "일관성이 생명입니다. 어제는 되고 오늘은 안 되는 일이 가장 큰 혼란이에요. \"이번만 봐줄게\"가 쌓이면 부모 말의 무게가 빠르게 가벼워지니, 한 번 정한 룰은 끝까지 지켜주세요.",
    praise: "\"계획한 대로 끝까지 했네\" 같은 노력·책임감 인정이 가장 좋습니다. 결과 자체보다 본인이 들인 시간과 절차를 봐주세요.",
    learning: "시간표대로, 단계별로. 체계가 잡히면 혼자서도 잘 굴러갑니다. 단, 갑작스럽게 계획을 흔들면 능률이 뚝 떨어지니 변경은 미리 알려주세요.",
    relationship: "규칙을 안 지키는 친구를 보면 답답해합니다. \"사람마다 방식이 달라\"라는 걸 부드럽게 알려주세요. 안 그러면 친구한테 잔소리쟁이가 됩니다.",
  },
  ESTP: {
    psychology: "감각형(S)+인식형(P)이라 즉각적인 실제 경험을 통해 학습합니다. 추상적 이론보다 \"직접 해보고 결과 보기\"가 두뇌가 가장 잘 작동하는 방식이에요.",
    discipline: "길게 설명하면 절반은 흘려듣습니다. 행동의 결과를 바로 경험하게 하는 게 가장 효과적이에요. \"이렇게 하면 다음번에 못 해\" 한 줄로 충분합니다.",
    praise: "\"순발력 진짜 좋다\"처럼 행동력·반응 속도를 짚어주세요. 두루뭉술한 \"잘했어\"보다 구체적인 한 장면을 골라 말하는 게 잘 박힙니다.",
    learning: "앉아서 외우기는 약점, 직접 해보기는 강점. 스포츠·실험·현장학습이 잘 맞습니다. 게임 요소(타이머·미션)를 넣으면 의외로 집중해요.",
    relationship: "친구들 사이에선 인기 만점이지만 즉흥적인 한마디로 사고가 종종 터집니다. 행동 전에 3초 멈춤 — 이 한 습관만 들여도 절반은 해결됩니다.",
  },
  INFJ: {
    psychology: "내향형(I)이라 외부 자극을 처리하는 데 에너지가 많이 들고, 직관형(N)+감정형(F)이라 표면 너머의 정서를 읽어냅니다. 혼자 있는 시간이 무기력이 아닌 회복 시간이라는 점, 꼭 기억해 주세요.",
    discipline: "그 자리에서 따져 묻기보다 \"이따 이야기하자\"가 훨씬 잘 통합니다. 혼자 정리할 시간이 필요한 아이예요. 감정을 누르는 경향이 있으니, 안전한 표현 공간은 늘 열어두세요.",
    praise: "\"네가 본 게 정확하더라\" — 깊이를 인정받는 순간 진짜로 감동합니다. 가벼운 빈말은 오히려 거리감을 만들어요.",
    learning: "조용한 공간에서 깊이 파고드는 타입. 관심 있는 주제는 누가 시키지 않아도 끝까지 갑니다. 흥미 분야를 찾아주는 게 부모의 핵심 역할이에요.",
    relationship: "친구 수보다 한 명의 깊이를 중요시합니다. \"친구 좀 더 많이 사귀어 봐\"라는 말은 부담이에요. 혼자 있는 시간을 외로움이 아닌 충전으로 봐주세요.",
  },
  INFP: {
    psychology: "감정형(F)으로 \"옳고 그름\"보다 \"진정성·가치\"를 우선합니다. 비판을 인격 공격으로 해석하기 쉬우니, \"행동과 너 자신은 다르다\"는 구분이 핵심이에요.",
    discipline: "강한 어조의 한마디가 며칠 갑니다. \"행동은 잘못됐어도 너는 소중해\" — 이 구분을 분명히 해주세요. 비교(\"누구는 잘하는데\")는 가장 큰 상처를 남깁니다.",
    praise: "형식적인 \"잘했어\"보다 \"네가 그렇게 한 이유가 멋졌어\"가 훨씬 깊게 닿습니다. 진심인지 아닌지 본능적으로 알아채요.",
    learning: "의미가 있어야 움직이는 아이입니다. \"왜 배워야 하는데?\"에 솔직히 답해주세요. 이야기·소설·예술과 연결하면 흥미가 살아납니다.",
    relationship: "깊은 친구를 원하지만, 거절당할까 봐 먼저 못 다가갑니다. 마음 다친 날엔 해결책보다 그냥 들어주는 게 정답이에요.",
  },
  INTJ: {
    psychology: "내향형(I)으로 내부 성찰에서 에너지를 얻고, 직관형(N)+사고형(T)이라 \"패턴\"과 \"논리\"로 세상을 해석합니다. 권위에 의한 지시보다 합리적 근거가 가장 잘 통하는 이유예요.",
    discipline: "\"안 돼\" 한 줄로는 거의 안 통합니다. 이유를 논리적으로 제시하면 의외로 깔끔하게 수용해요. 자율성을 침범당했다고 느끼면 가장 크게 반발합니다.",
    praise: "\"그 방법 효율적이네\" 같은 전략을 알아봐 주는 말이 가장 큽니다. \"착하다\"보다 \"똑똑하다\"가 통하는 흔치 않은 타입이에요.",
    learning: "자기 주도가 강점. 학원 뺑뺑이보다 본인이 짠 계획대로 갈 때 폭발적입니다. 단, 완벽주의로 본인을 몰아붙이니 \"이 정도면 충분\"도 가르쳐 주세요.",
    relationship: "친구가 적어 보여도 본인은 만족하고 있을 가능성이 큽니다. \"친구 좀 더 사귀어라\" 잔소리가 가장 효과 없는 타입이에요. 양보다 질로 보고 있다는 걸 기억해 주세요.",
  },
  INTP: {
    psychology: "사고형(T)+인식형(P)이라 \"답\"보다 \"과정\"을 즐깁니다. 결론을 빨리 내려주는 어른보다 같이 고민해 주는 어른을 신뢰하는 경향이 있어요.",
    discipline: "권위로 누르려 하면 속으로 \"근거 부족\" 도장 찍힙니다. 논리만 맞으면 의외로 순순합니다. \"왜?\"에 성실히 답해주는 어른을 가장 신뢰해요.",
    praise: "\"분석이 날카롭다\"처럼 사고력 자체를 짚어주세요. 결과보다 그 과정을 알아봐 주는 게 더 큰 동기입니다.",
    learning: "한 주제에 빠지면 학교 진도와 상관없이 혼자 멀리 갑니다. 흥미를 막지 말고 같이 가주세요. 단, 흥미 없는 과목은 동기부여가 진짜 어렵습니다.",
    relationship: "친구 수가 적다고 외로운 게 아닙니다. 편한 친구 한두 명이면 충분해요. 사교성 부족이 아니라 우선순위가 다를 뿐입니다.",
  },
  ISFJ: {
    psychology: "내향형(I)+감각형(S)이라 안정된 환경과 익숙한 루틴에서 에너지를 보존합니다. 갑작스러운 변화가 큰 스트레스가 되는 이유가 여기에 있어요.",
    discipline: "크게 야단치면 위축이 큽니다. 부드럽게, 충분히 설명하는 방식이 가장 잘 맞아요. 변화가 필요할 땐 며칠 전부터 미리 알려주세요. 갑작스러운 변경은 큰 스트레스입니다.",
    praise: "조용히 한 일들을 알아봐 주는 게 핵심이에요. \"그거 네가 챙긴 거지? 봤어\" 한마디면 충분합니다. 거창한 칭찬보다 본 그대로의 한 줄.",
    learning: "익숙한 루틴에서 효율이 최고. 갑자기 학원·시간표 바꾸지 마세요. 천천히 가지만 한 번 익힌 건 오래 갑니다.",
    relationship: "자기 감정을 잘 표현하지 않습니다. 안 힘들어 보여도 안 힘든 건 아니에요. 정기적으로 \"요즘 어때?\" 한 번씩 물어봐 주세요.",
  },
  ISFP: {
    psychology: "감각형(S)+감정형(F)이라 \"지금 이 순간의 느낌\"에 매우 민감합니다. 강압적 통제는 이 민감한 센서를 닫아버리는 가장 빠른 방법이에요.",
    discipline: "강압적인 통제는 가장 안 맞습니다. \"이건 네가 정해\" 식의 여지를 주면 의외로 책임감 있게 따라옵니다. 가둬두면 표정부터 사라져요.",
    praise: "\"네 감각 진짜 특별해\" — 미적 감각·취향을 알아봐 주는 게 핵심입니다. 칭찬을 잘 표현은 안 해도 속으로 오래 간직해요.",
    learning: "예술·음악·체육 등 감각형 활동과 연결하면 같은 내용도 깊이 들어갑니다. 자유롭게 표현할 수 있는 공간이 꼭 필요해요.",
    relationship: "갈등 상황에선 일단 입을 닫습니다. 속으로 쌓아두다 폭발하는 일도 있어요. 작은 갈등도 그때그때 말로 풀게 도와주세요.",
  },
  ISTJ: {
    psychology: "감각형(S)+판단형(J)이라 예측 가능한 구조와 일관성에서 안정감을 얻습니다. \"이번만\" 같은 예외가 누적되면 신뢰의 기반이 흔들리는 이유예요.",
    discipline: "규칙은 일관되게, 예외는 최소한으로. \"이번만\"이 쌓이면 신뢰가 빠르게 흔들립니다. 실수했을 때 책임지는 방법을 차분히 짚어주세요.",
    praise: "묵묵히 한 일을 알아봐 주세요. \"역시 너한테 맡기길 잘했어\" 한 줄이면 다음 일도 책임지고 합니다. 거창한 표현보다 신뢰가 담긴 한마디가 좋아요.",
    learning: "순서대로, 차근차근. 한 번 익히면 오래갑니다. 복습 루틴이 잘 맞고, 새로운 방식은 천천히 도입해 주세요.",
    relationship: "새 친구 사귀는 데 시간이 오래 걸립니다. 적응 기간을 조급하게 다그치지 마세요. 한 번 친해진 친구와는 정말 오래갑니다.",
  },
  ISTP: {
    psychology: "내향형(I)+사고형(T)이라 감정 언어보다 \"문제-해결\" 언어가 더 자연스럽습니다. 마음을 모르는 게 아니라 표현 방식이 다른 것이에요.",
    discipline: "잔소리가 길어지면 마음의 문이 닫힙니다. 짧고 명확하게, 그리고 본인이 직접 해결책을 찾도록 여지를 주세요. \"어떻게 할 거야?\" 한마디가 효과 큽니다.",
    praise: "\"혼자 해결했네, 어떻게 한 거야?\"처럼 호기심으로 물어봐 주세요. 본인의 방법을 인정받는 게 가장 큰 칭찬이에요.",
    learning: "책상보다 작업대가 잘 맞습니다. 만들기·분해하기·실험 등 손으로 직접 하는 학습이 효율 최고예요. 이론만 가르치면 금세 흥미를 잃어요.",
    relationship: "평소엔 조용해도 진짜 친구의 위기엔 누구보다 먼저 움직입니다. 말로 표현하지 않을 뿐, 마음은 깊어요. 강제로 대화를 끌어내려 하지 말고 함께 활동하며 가까워지세요.",
  },
};

// ===================== 유틸 =====================

function getAgeGroup(age) {
  if (age >= 5 && age <= 7) return "5-7";
  if (age >= 8 && age <= 10) return "8-10";
  if (age >= 11 && age <= 13) return "11-13";
  return null;
}

function calcMBTI(s) {
  return (s.E >= s.I ? "E" : "I") + (s.S >= s.N ? "S" : "N") + (s.T >= s.F ? "T" : "F") + (s.J >= s.P ? "J" : "P");
}

// 이미지 저장 헬퍼
const KO_FONT = '"Apple SD Gothic Neo", "Jua", "Nanum Gothic", system-ui, sans-serif';
const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
function drawRoundRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function wrapKoText(ctx, text, maxWidth) {
  const out = [];
  for (const block of text.split("\n")) {
    let line = "";
    for (const ch of block) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
  }
  return out;
}
function downloadCanvas(canvas, filename) {
  if (typeof canvas.toBlob !== "function") {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }
  canvas.toBlob(blob => {
    if (!blob) { alert("이미지 생성에 실패했어요."); return; }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

const usedIdxRef = { current: new Set() };
function getRandomQuiz() {
  if (usedIdxRef.current.size >= QUIZ_POOL.length) usedIdxRef.current.clear();
  let idx;
  do { idx = Math.floor(Math.random() * QUIZ_POOL.length); } while (usedIdxRef.current.has(idx));
  usedIdxRef.current.add(idx);
  return QUIZ_POOL[idx];
}

const SHARE_BASE_URL = "https://child-mbti-preview-jh.netlify.app";
const KAKAO_APP_KEY = "fef83dd39740084a58f68fbdf626d2e0";
const STORAGE_KEY = "child-mbti-state-v2";
const EMPTY_SCORES = Object.freeze({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });

function createEmptyScores() {
  return { ...EMPTY_SCORES };
}

function splitParagraphs(text) {
  return String(text || "").split("\n\n").map(block => block.trim()).filter(Boolean);
}

function trackEvent(name, params = {}) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch {}
}

// ===================== 컴포넌트 =====================

export default function ChildMBTI() {
  const THEMES = {
    "5-7": {
      primary: "#FF4D6D", secondary: "#FFB627",
      bg: "#FFE9F0", softBg: "#FFF5F8",
      bodyBg: "linear-gradient(135deg, #FFE5EC 0%, #FFEDD5 50%, #FFE0EC 100%)",
      btnGrad: "linear-gradient(135deg, #FF4D6D 0%, #FFB627 100%)",
      progressIcon: "♥", progressEmpty: "♡",
      qFontSize: "22px", choiceFontSize: "17px",
      label: "5~7살", emoji: "🐣",
    },
    "8-10": {
      primary: "#FF6B6B", secondary: "#FFA94D",
      bg: "#FFEDE3", softBg: "#FFF5EE",
      bodyBg: "linear-gradient(135deg, #FFF0E5 0%, #E5F9F2 50%, #FFEDE3 100%)",
      btnGrad: "linear-gradient(135deg, #FF6B6B 0%, #FFA94D 100%)",
      progressIcon: "★", progressEmpty: "☆",
      qFontSize: "20px", choiceFontSize: "16px",
      label: "8~10살", emoji: "🌱",
    },
    "11-13": {
      primary: "#5B5FFF", secondary: "#7C3AED",
      bg: "#EEF0FF", softBg: "#F7F8FF",
      bodyBg: "linear-gradient(135deg, #E9ECFF 0%, #F0E5FF 50%, #E2E7FF 100%)",
      btnGrad: "linear-gradient(135deg, #5B5FFF 0%, #7C3AED 100%)",
      progressIcon: "●", progressEmpty: "○",
      qFontSize: "19px", choiceFontSize: "15px",
      label: "11~13살", emoji: "🌟",
    },
  };
  const DEFAULT_BG = "linear-gradient(135deg, #FFF5EC 0%, #FFF0F8 50%, #F0EFFF 100%)";

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Jua&family=Nanum+Gothic:wght@400;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
      }
      html {
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
        word-break: keep-all;
        overflow-wrap: break-word;
      }
      body {
        margin: 0;
        background: linear-gradient(135deg, #FFF5EC 0%, #FFF0F8 50%, #F0EFFF 100%);
        min-height: 100vh;
        min-height: 100dvh;
        padding-top: constant(safe-area-inset-top);
        padding-top: env(safe-area-inset-top);
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        padding-left: constant(safe-area-inset-left);
        padding-left: env(safe-area-inset-left);
        padding-right: constant(safe-area-inset-right);
        padding-right: env(safe-area-inset-right);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        overscroll-behavior-y: none;
        word-break: keep-all;
      }
      #root { min-height: 100vh; min-height: 100dvh; }
      button {
        -webkit-appearance: none;
        appearance: none;
        touch-action: manipulation;
        -webkit-user-select: none;
        user-select: none;
        min-height: 44px;
      }
      input, textarea {
        -webkit-appearance: none;
        appearance: none;
        font-family: inherit;
      }
      /* 데스크탑 큰 화면에서 카드 여유 */
      @media (min-width: 768px) {
        body { font-size: 17px; }
      }
      @media (min-width: 1024px) {
        body { font-size: 18px; }
      }
      input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 52px; background: transparent; cursor: pointer; }
      input[type=range]::-webkit-slider-runnable-track { height: 8px; border-radius: 4px; background: #E8E8E8; }
      input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #4F46E5); border: 3px solid white; box-shadow: 0 4px 12px rgba(124,58,237,0.4); margin-top: -18px; }
      input[type=range]::-moz-range-track { height: 8px; border-radius: 4px; background: #E8E8E8; }
      input[type=range]::-moz-range-thumb { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #4F46E5); border: 3px solid white; cursor: pointer; }
      @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes popBig { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes slideUp { 0% { transform: translate3d(0, 20px, 0); opacity: 0; } 100% { transform: translate3d(0, 0, 0); opacity: 1; } }
      @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes bounceBig { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
      @keyframes shake { 0%,100% { transform: translate3d(0, 0, 0); } 25% { transform: translate3d(-6px, 0, 0); } 75% { transform: translate3d(6px, 0, 0); } }
      @keyframes slideInRight { 0% { transform: translate3d(40px, 0, 0); opacity: 0; } 100% { transform: translate3d(0, 0, 0); opacity: 1; } }
      @keyframes slideInLeft { 0% { transform: translate3d(-40px, 0, 0); opacity: 0; } 100% { transform: translate3d(0, 0, 0); opacity: 1; } }
      @keyframes tapPop { 0% { transform: scale(1); } 35% { transform: scale(1.07); } 100% { transform: scale(1); } }
      @keyframes ringPulse { 0% { box-shadow: 0 0 0 0 currentColor; opacity: 0.5; } 100% { box-shadow: 0 0 0 24px transparent; opacity: 0; } }
      @keyframes fillIn { 0% { transform: scale(0); } 70% { transform: scale(1.3); } 100% { transform: scale(1); } }
      .pop { animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
      .pop-big { animation: popBig 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
      .slide-up { animation: slideUp 0.3s ease both; }
      .slide-next { animation: slideInRight 0.4s cubic-bezier(0.4,0,0.2,1) both; }
      .slide-prev { animation: slideInLeft 0.4s cubic-bezier(0.4,0,0.2,1) both; }
      .gpu-layer {
        will-change: transform, opacity;
        transform: translate3d(0, 0, 0);
        -webkit-transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        perspective: 1000px;
        -webkit-perspective: 1000px;
      }
      .slide-shell {
        touch-action: pan-y;
        contain: layout paint;
      }
      .emoji-bounce { animation: bounce 2s ease-in-out infinite; }
      .emoji-bounce-big { animation: bounceBig 2.4s ease-in-out infinite; }
      .shake { animation: shake 0.3s ease; }
      .tap-pop { animation: tapPop 0.25s cubic-bezier(0.34,1.56,0.64,1); }
      .fill-in { animation: fillIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
      button:active { transform: scale(0.97); }
    `;
    document.head.appendChild(style);

    try {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY);
      }
    } catch (err) {
      console.warn("Kakao init failed:", err);
    }

    const shareUrl = SHARE_BASE_URL + "/?go=1";
    const ogImageUrl = SHARE_BASE_URL + "/og-image.png";
    const setMeta = (prop, content) => {
      let m = document.querySelector(`meta[property="${prop}"]`);
      if (!m) { m = document.createElement("meta"); m.setAttribute("property", prop); document.head.appendChild(m); }
      m.setAttribute("content", content);
    };
    const setNameMeta = (name, content) => {
      let m = document.querySelector(`meta[name="${name}"]`);
      if (!m) { m = document.createElement("meta"); m.setAttribute("name", name); document.head.appendChild(m); }
      m.setAttribute("content", content);
    };
    setMeta("og:url", shareUrl);
    setMeta("og:image", ogImageUrl);
    setNameMeta("twitter:image", ogImageUrl);

    return () => {
      link.remove();
      style.remove();
    };
  }, []);

  function getShareUrl() {
    return SHARE_BASE_URL + "/?go=1";
  }
  function getOgImageUrl(type) {
    if (type && CHARS[type]) return SHARE_BASE_URL + "/og/" + type + ".png";
    return SHARE_BASE_URL + "/og-image.png";
  }
  async function fallbackShare({ title, description, type }) {
    const shareUrl = getShareUrl();
    const text = `${title}\n${description}\n${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        return true;
      }
    } catch {}

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        alert("공유 문구와 링크를 복사했어요.");
        return true;
      }
    } catch {}

    window.prompt("아래 링크를 복사해 공유해 주세요.", `${shareUrl}\n${getOgImageUrl(type)}`);
    return false;
  }

  // ── 카카오 공유 ──
  async function kakaoShare({ title, description, buttonTitle, type }) {
    const u = getShareUrl();
    const img = getOgImageUrl(type);

    try {
      if (!window.Kakao?.isInitialized?.()) {
        await fallbackShare({ title, description, type });
        return;
      }

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title,
          description,
          imageUrl: img,
          link: { mobileWebUrl: u, webUrl: u },
        },
        buttons: [
          { title: buttonTitle, link: { mobileWebUrl: u, webUrl: u } },
        ],
      });
      trackEvent("share_kakao", { result_type: type || "test" });
    } catch (err) {
      console.warn("Kakao share failed:", err);
      await fallbackShare({ title, description, type });
    }
  }
  function kakaoShareTest() {
    kakaoShare({
      title: "🌟 어린이 MBTI · 우리 아이는 어떤 동물?",
      description: "우리 아이 MBTI 해봐!\n5~13세 아이의 성격을 16가지 동물 캐릭터로 알려줘요 🐣",
      buttonTitle: "테스트 하러 가기",
    });
  }
  function kakaoShareChild() {
    if (!char) return;
    const oneLine = (CHILD_DESC[result] || "").split("\n").slice(0, 2).join(" ");
    kakaoShare({
      title: `${char.emoji} 우리 아이는 ${char.name}형 (${result})!`,
      description: `${oneLine}\n\n너희 아이도 어떤 동물인지 해보자!`,
      buttonTitle: "나도 해보기",
      type: result,
    });
  }
  function kakaoShareFull() {
    if (!char || !pdata) return;
    const oneLine = (CHILD_DESC[result] || "").split("\n").slice(0, 2).join(" ");
    kakaoShare({
      title: `${char.emoji} 우리 아이는 ${char.name}형 (${result})!`,
      description: `${oneLine}\n\n부모 가이드까지 다 봤어요 👨‍👩‍👧 너희 아이도 해봐!`,
      buttonTitle: "나도 해보기",
      type: result,
    });
  }

  // ── 이미지 저장 ──
  async function saveChildImage() {
    if (!char) return;
    if (document.fonts?.ready) { try { await document.fonts.ready; } catch {} }
    const canvas = document.createElement("canvas");
    canvas.width = 1080; canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    const t = theme || THEMES["8-10"];

    // 배경 그라데이션
    const bg = ctx.createLinearGradient(0, 0, 0, 1080);
    bg.addColorStop(0, t.softBg);
    bg.addColorStop(1, char.bg);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1080);

    // 헤더
    ctx.font = `700 36px ${KO_FONT}`;
    ctx.fillStyle = "#888888cc";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("어린이 MBTI", 540, 70);

    // 캐릭터 원
    ctx.beginPath();
    ctx.arc(540, 380, 210, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // 이모지
    ctx.font = `230px ${EMOJI_FONT}`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    ctx.fillText(char.emoji, 540, 385);

    // MBTI 배지
    ctx.font = `800 38px ${KO_FONT}`;
    const codeW = ctx.measureText(result).width + 70;
    const codeH = 62;
    drawRoundRect(ctx, 540 - codeW/2, 640, codeW, codeH, 31);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.fillStyle = char.color;
    ctx.textBaseline = "middle";
    ctx.fillText(result, 540, 640 + codeH/2);

    // 동물 이름
    ctx.font = `800 96px ${KO_FONT}`;
    ctx.fillStyle = char.color;
    ctx.textBaseline = "top";
    ctx.fillText(`${char.name}형`, 540, 740);

    // 태그
    ctx.font = `600 38px ${KO_FONT}`;
    ctx.fillStyle = "#666";
    ctx.fillText(char.tag, 540, 855);

    // 한줄 설명 (첫 문단)
    const desc = (CHILD_DESC[result] || "").split("\n\n")[0];
    ctx.font = `600 30px ${KO_FONT}`;
    ctx.fillStyle = "#444";
    let dy = 935;
    for (const line of desc.split("\n")) {
      ctx.fillText(line, 540, dy);
      dy += 46;
    }

    // 푸터
    ctx.font = `400 22px ${KO_FONT}`;
    ctx.fillStyle = "#999";
    ctx.fillText(window.location.host, 540, 1035);

    downloadCanvas(canvas, `어린이MBTI_${result}_${char.name}형.png`);
  }

  async function saveFullImage() {
    if (!char || !pdata) return;
    if (document.fonts?.ready) { try { await document.fonts.ready; } catch {} }
    const canvas = document.createElement("canvas");
    canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    const t = theme || THEMES["8-10"];

    // 배경
    const bg = ctx.createLinearGradient(0, 0, 0, 1920);
    bg.addColorStop(0, t.softBg);
    bg.addColorStop(0.35, char.bg);
    bg.addColorStop(1, "#ffffff");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    // 헤더
    ctx.font = `700 32px ${KO_FONT}`;
    ctx.fillStyle = "#888888cc";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("어린이 MBTI · 부모 가이드", 540, 70);

    // 캐릭터 원 (작게)
    ctx.beginPath();
    ctx.arc(540, 280, 140, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // 이모지
    ctx.font = `160px ${EMOJI_FONT}`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    ctx.fillText(char.emoji, 540, 285);

    // MBTI 배지
    ctx.font = `800 30px ${KO_FONT}`;
    const codeW = ctx.measureText(result).width + 56;
    drawRoundRect(ctx, 540 - codeW/2, 445, codeW, 52, 26);
    ctx.fillStyle = "#ffffff"; ctx.fill();
    ctx.fillStyle = char.color;
    ctx.textBaseline = "middle";
    ctx.fillText(result, 540, 471);

    // 동물 이름
    ctx.font = `800 72px ${KO_FONT}`;
    ctx.fillStyle = char.color;
    ctx.textBaseline = "top";
    ctx.fillText(`${char.name}형`, 540, 520);

    // 태그
    ctx.font = `600 30px ${KO_FONT}`;
    ctx.fillStyle = "#666";
    ctx.fillText(char.tag, 540, 615);

    // 부모 가이드 섹션 타이틀
    ctx.font = `800 38px ${KO_FONT}`;
    ctx.fillStyle = "#333";
    ctx.fillText("부모님을 위한 가이드", 540, 700);

    // 5개 섹션
    const sections = [
      { icon: "🧠", title: "심리적 특성", text: pdata.psychology, color: "#5B5FFF", bg: "#EEF0FF" },
      { icon: "🎯", title: "훈육법",     text: pdata.discipline,  color: "#FF6B6B", bg: "#FFF0F0" },
      { icon: "⭐", title: "칭찬법",     text: pdata.praise,      color: "#FF8C42", bg: "#FFF5EC" },
      { icon: "📚", title: "학습 스타일", text: pdata.learning,    color: "#4361EE", bg: "#EEF1FF" },
      { icon: "👫", title: "친구 관계",   text: pdata.relationship,color: "#4D8B31", bg: "#F0F8E8" },
    ];

    const secX = 60, secW = 960, secH = 218, secGap = 10;
    let secY = 780;
    for (const sec of sections) {
      // 배경
      drawRoundRect(ctx, secX, secY, secW, secH, 24);
      ctx.fillStyle = sec.bg; ctx.fill();
      // 좌측 강조 바
      ctx.fillStyle = sec.color;
      ctx.fillRect(secX, secY, 7, secH);
      // 아이콘
      ctx.font = `38px ${EMOJI_FONT}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#000";
      ctx.fillText(sec.icon, secX + 32, secY + 26);
      // 제목
      ctx.font = `800 32px ${KO_FONT}`;
      ctx.fillStyle = sec.color;
      ctx.fillText(sec.title, secX + 90, secY + 30);
      // 본문 (3줄까지)
      ctx.font = `400 24px ${KO_FONT}`;
      ctx.fillStyle = "#444";
      const lines = wrapKoText(ctx, sec.text || "", secW - 70).slice(0, 4);
      let ty = secY + 92;
      for (const line of lines) {
        ctx.fillText(line, secX + 32, ty);
        ty += 36;
      }
      secY += secH + secGap;
    }

    // 푸터
    ctx.font = `400 22px ${KO_FONT}`;
    ctx.fillStyle = "#999";
    ctx.textAlign = "center";
    ctx.fillText(window.location.host, 540, 1880);

    downloadCanvas(canvas, `어린이MBTI_${result}_${char.name}형_부모가이드.png`);
  }

  const [screen, setScreen] = useState("welcome");
  const [ageInput, setAgeInput] = useState("");
  const [ageGroup, setAgeGroup] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState(createEmptyScores);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [slideDir, setSlideDir] = useState("next");
  const [tappedCh, setTappedCh] = useState(null);
  const [resultStep, setResultStep] = useState("reveal");

  // 부모 인증
  const [parentStep, setParentStep] = useState("locked");
  const [sliderVal, setSliderVal] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [quizInput, setQuizInput] = useState("");
  const [quizErr, setQuizErr] = useState(false);
  const [timer, setTimer] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);

  const timerRef = useRef(null);
  const restoreRef = useRef(false);
  const swipeStartRef = useRef(null);

  // 타이머 로직
  useEffect(() => {
    if (parentStep !== "quiz" || timer === null) return;
    if (timer === 0) {
      // 시간 초과 → 새 문제
      setQuizInput("");
      setQuizErr(false);
      const next = getRandomQuiz();
      setQuiz(next);
      setTimer(10);
      return;
    }
    timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timer, parentStep]);

  // parentStep이 open으로 바뀌면 타이머 정리
  useEffect(() => {
    if (parentStep !== "quiz") clearTimeout(timerRef.current);
  }, [parentStep]);

  // 나이대별 배경 동기화
  useEffect(() => {
    document.body.style.background = ageGroup && THEMES[ageGroup] ? THEMES[ageGroup].bodyBg : DEFAULT_BG;
    document.body.style.transition = "background 0.6s ease";
  }, [ageGroup]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        restoreRef.current = true;
        return;
      }

      const saved = JSON.parse(raw);
      const savedAgeGroup = saved?.ageGroup && QUESTIONS[saved.ageGroup] ? saved.ageGroup : null;
      const savedQuestions = savedAgeGroup ? QUESTIONS[savedAgeGroup] : [];
      const savedCurrentQ = Number.isInteger(saved?.currentQ) ? Math.min(Math.max(saved.currentQ, 0), Math.max(savedQuestions.length - 1, 0)) : 0;
      const savedResult = saved?.result && CHARS[saved.result] ? saved.result : null;
      const savedScreen = savedResult ? saved?.screen || "result" : (savedAgeGroup ? saved?.screen || "quiz" : "welcome");
      const savedParentStep = savedResult && ["locked", "slider", "quiz", "open"].includes(saved?.parentStep) ? saved.parentStep : "locked";

      setScreen(savedScreen);
      setAgeInput(saved?.ageInput || "");
      setAgeGroup(savedAgeGroup);
      setCurrentQ(savedCurrentQ);
      setScores({ ...createEmptyScores(), ...(saved?.scores || {}) });
      setAnswerHistory(Array.isArray(saved?.answerHistory) ? saved.answerHistory : []);
      setResult(savedResult);
      setSlideDir(saved?.slideDir === "prev" ? "prev" : "next");
      setTappedCh(null);
      setResultStep(saved?.resultStep === "details" ? "details" : "reveal");
      setParentStep(savedParentStep);
      setSliderVal(typeof saved?.sliderVal === "number" ? saved.sliderVal : 0);
      setQuiz(savedParentStep === "quiz" && saved?.quiz?.q ? saved.quiz : null);
      setQuizInput(savedParentStep === "quiz" ? saved?.quizInput || "" : "");
      setQuizErr(false);
      setTimer(savedParentStep === "quiz" ? 10 : null);
    } catch (err) {
      console.warn("State restore failed:", err);
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      restoreRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!restoreRef.current) return;

    const nextState = {
      screen,
      ageInput,
      ageGroup,
      currentQ,
      scores,
      answerHistory,
      result,
      slideDir,
      resultStep,
      parentStep,
      sliderVal,
      quiz,
      quizInput,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (err) {
      console.warn("State persist failed:", err);
    }
  }, [screen, ageInput, ageGroup, currentQ, scores, answerHistory, result, slideDir, resultStep, parentStep, sliderVal, quiz, quizInput]);

  const questions = ageGroup ? QUESTIONS[ageGroup] : [];
  const totalQ = questions.length;
  const progress = totalQ > 0 ? (currentQ / totalQ) * 100 : 0;

  const theme = ageGroup ? THEMES[ageGroup] : null;

  function handleQuestionPointerStart(e) {
    if (e.pointerType === "mouse") return;
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
  }

  function handleQuestionPointerEnd(e) {
    if (!swipeStartRef.current) return;
    const deltaX = e.clientX - swipeStartRef.current.x;
    const deltaY = e.clientY - swipeStartRef.current.y;
    swipeStartRef.current = null;
    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    if (deltaX > 0) handleBack();
  }

  function startQuiz(forced) {
    const g = forced || getAgeGroup(parseInt(ageInput));
    if (!g) return;
    setAgeGroup(g);
    setScores(createEmptyScores());
    setAnswerHistory([]);
    setCurrentQ(0);
    setSlideDir("next");
    setResult(null);
    setResultStep("reveal");
    setParentStep("locked");
    setSliderVal(0);
    setQuiz(null);
    setQuizInput("");
    setQuizErr(false);
    setTimer(null);
    setScreen("quiz");
    trackEvent("select_age_group", { age_group: g });
  }

  function handleAnswer(choice) {
    if (tappedCh || !questions[currentQ]) return;
    setTappedCh(choice);
    const q = questions[currentQ];
    let ns = scores;
    let scoredKey = null;
    if (choice !== "C") {
      scoredKey = choice === "A" ? q.sa : q.sb;
      ns = { ...scores, [scoredKey]: scores[scoredKey] + 1 };
    }
    setTimeout(() => {
      if (scoredKey) setScores(ns);
      setAnswerHistory([...answerHistory, { choice, key: scoredKey }]);
      setTappedCh(null);
      if (currentQ + 1 >= totalQ) {
        const nextResult = calcMBTI(ns);
        setResult(nextResult);
        setResultStep("reveal");
        setParentStep("locked");
        setSliderVal(0);
        setQuiz(null);
        setQuizInput("");
        setTimer(null);
        setScreen("result");
        trackEvent("quiz_completed", { result_type: nextResult, age_group: ageGroup, question_count: totalQ });
      } else {
        setSlideDir("next");
        setCurrentQ(currentQ + 1);
      }
    }, 260);
  }

  function handleBack() {
    if (currentQ === 0 || answerHistory.length === 0 || tappedCh) return;
    const last = answerHistory[answerHistory.length - 1];
    if (last.key) {
      setScores({ ...scores, [last.key]: scores[last.key] - 1 });
    }
    setAnswerHistory(answerHistory.slice(0, -1));
    setSlideDir("prev");
    setCurrentQ(currentQ - 1);
  }

  function handleSlider(e) {
    const v = parseInt(e.target.value);
    setSliderVal(v);
    if (parentStep === "slider" && v >= 95) {
      setTimeout(() => {
        const q = getRandomQuiz();
        setQuiz(q);
        setQuizInput("");
        setQuizErr(false);
        setTimer(10);
        setParentStep("quiz");
        setSliderVal(0);
      }, 400);
    }
  }

  function checkQuiz() {
    if (!quiz) return;
    const normalize = s => s.trim().toLowerCase().replace(/\s/g, "").replace(/\./g, "");
    const userAns = normalize(quizInput);
    const correctAns = normalize(quiz.a);
    if (userAns === correctAns) {
      clearTimeout(timerRef.current);
      setParentStep("open");
      setTimer(null);
      trackEvent("parent_unlock_success", { result_type: result || "unknown" });
    } else {
      setQuizErr(true);
      setShakeKey(k => k + 1);
      setQuizInput("");
      clearTimeout(timerRef.current);
      setTimeout(() => {
        setQuizErr(false);
        const next = getRandomQuiz();
        setQuiz(next);
        setTimer(10);
      }, 1200);
    }
  }

  function restart() {
    clearTimeout(timerRef.current);
    setScreen("welcome"); setAgeInput(""); setAgeGroup(null);
    setCurrentQ(0); setScores(createEmptyScores());
    setAnswerHistory([]); setSlideDir("next"); setTappedCh(null); setResultStep("reveal");
    setResult(null); setParentStep("locked"); setSliderVal(0);
    setQuiz(null); setQuizInput(""); setQuizErr(false); setTimer(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const char = result ? CHARS[result] : null;
  const pdata = result ? PARENT_DATA[result] : null;

  function renderParagraphText(text, extraStyle = {}) {
    return splitParagraphs(text).map((paragraph, idx) => (
      <p key={idx} style={{ margin: idx === 0 ? 0 : "14px 0 0", ...extraStyle }}>
        {paragraph}
      </p>
    ));
  }

  function renderTestShareButton(compact = false) {
    return (
      <button onClick={kakaoShareTest} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        padding: compact ? "12px 16px" : "14px 18px", borderRadius: "14px", border: "none",
        background: "#FEE500", color: "#000000d9",
        fontSize: compact ? "14px" : "15px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
        boxShadow: "0 4px 12px rgba(254,229,0,0.35)",
      }}>
        <span style={{ fontSize: compact ? "17px" : "18px" }}>💬</span> 테스트 공유하기
      </button>
    );
  }

  const wrap = {
    fontFamily: '"Jua", "Nanum Gothic", sans-serif',
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", padding: "20px",
    wordBreak: "keep-all",
  };
  const card = {
    background: "white", borderRadius: "32px", padding: "36px 32px",
    maxWidth: "480px", width: "100%",
    boxShadow: "0 24px 64px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.04)",
  };

  // ── 시작 화면 ──
  if (screen === "welcome") return (
    <div style={wrap}>
      <div style={{ ...card, padding: "40px 24px 32px" }} className="pop">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "84px", marginBottom: "10px" }} className="emoji-bounce-big">🌟</div>
          <h1 style={{ fontSize: "32px", color: "#333", margin: "0 0 6px", letterSpacing: "-0.5px" }}>어린이 MBTI</h1>
          <p style={{ color: "#AAA", fontSize: "15px", margin: 0 }}>나는 어떤 동물 친구일까?</p>
        </div>
        <p style={{ textAlign: "center", color: "#666", fontSize: "16px", marginBottom: "16px", fontWeight: 700 }}>몇 살이에요? 🎂</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {Object.entries(THEMES).map(([g, t]) => (
            <button
              key={g}
              onClick={() => startQuiz(g)}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "18px 22px", borderRadius: "22px", border: "none",
                background: t.btnGrad, color: "white",
                fontFamily: "inherit", fontSize: "19px", fontWeight: 700,
                cursor: "pointer", textAlign: "left",
                boxShadow: `0 10px 26px ${t.primary}40`,
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <span style={{ fontSize: "38px", lineHeight: 1 }}>{t.emoji}</span>
              <div style={{ flex: 1 }}>{t.label}</div>
              <span style={{ fontSize: "22px" }}>→</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: "18px" }}>
          {renderTestShareButton()}
        </div>
      </div>
    </div>
  );

  // ── 퀴즈 화면 ──
  if (screen === "quiz") {
    const q = questions[currentQ];
    const t = theme;
    const iconSize = totalQ <= 8 ? 22 : totalQ <= 12 ? 18 : 13;
    const iconGap = totalQ <= 8 ? 6 : totalQ <= 12 ? 4 : 3;
    return (
      <div style={wrap}>
        <div style={card}>
          {/* 진행 인디케이터 — 별/하트/도트 */}
          <div style={{ marginBottom: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", color: "#BBB", fontFamily: '"Nanum Gothic", sans-serif' }}>{currentQ + 1} / {totalQ}</span>
              <span style={{ fontSize: "13px", color: t.primary, fontWeight: 800, fontFamily: '"Nanum Gothic", sans-serif' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `${iconGap}px`, padding: "4px 0" }}>
              {Array.from({ length: totalQ }).map((_, i) => {
                const done = i < currentQ;
                const current = i === currentQ;
                return (
                  <span key={i} style={{
                    fontSize: `${iconSize}px`,
                    color: done ? t.primary : current ? t.secondary : "#E5E5E5",
                    transform: current ? "scale(1.25)" : "scale(1)",
                    transition: "all 0.3s ease",
                    lineHeight: 1,
                    display: "inline-block",
                  }}>{done || current ? t.progressIcon : t.progressEmpty}</span>
                );
              })}
            </div>
          </div>

          {/* 질문 카드 — 슬라이드 애니메이션 */}
          <div
            key={currentQ}
            className={`slide-shell gpu-layer ${slideDir === "prev" ? "slide-prev" : "slide-next"}`}
            onPointerDown={handleQuestionPointerStart}
            onPointerUp={handleQuestionPointerEnd}
            onPointerCancel={() => { swipeStartRef.current = null; }}
          >
            <div style={{
              textAlign: "center", padding: "32px 22px",
              background: `linear-gradient(135deg, ${t.bg} 0%, ${t.softBg} 100%)`,
              borderRadius: "24px", marginBottom: "22px",
              border: `1.5px solid ${t.primary}15`,
            }}>
              <p style={{ fontSize: t.qFontSize, color: "#2D2D2D", margin: 0, lineHeight: 1.6, fontWeight: 800, wordBreak: "keep-all" }}>{q.text}</p>
            </div>

            {/* 선택지 — 한 화면 하나에 집중 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: q.a, ch: "A" },
                { label: q.b, ch: "B" },
                { label: "잘 모르겠어요 🤔", ch: "C" },
              ].map(({ label, ch }) => {
                const isTapped = tappedCh === ch;
                return (
                  <button key={ch} onClick={() => handleAnswer(ch)}
                    className={isTapped ? "tap-pop" : ""}
                    style={{
                      padding: "18px 20px",
                      borderRadius: "18px",
                      border: `2px solid ${isTapped ? t.primary : t.primary + "25"}`,
                      background: isTapped ? t.bg : "white",
                      fontSize: t.choiceFontSize,
                      color: isTapped ? t.primary : "#3A3A3A",
                      fontWeight: isTapped ? 800 : 600,
                      cursor: "pointer", textAlign: "left",
                      fontFamily: "inherit", lineHeight: 1.55,
                      wordBreak: "keep-all",
                      transition: "all 0.15s ease",
                      boxShadow: isTapped ? `0 10px 28px ${t.primary}40` : "none",
                    }}
                    onMouseEnter={e => {
                      if (isTapped) return;
                      e.currentTarget.style.background = t.bg;
                      e.currentTarget.style.borderColor = t.primary;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 6px 20px ${t.primary}25`;
                    }}
                    onMouseLeave={e => {
                      if (isTapped) return;
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.borderColor = `${t.primary}25`;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >{label}</button>
                );
              })}
            </div>
          </div>

          {/* 이전 문항 */}
          {currentQ > 0 && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button onClick={handleBack} style={{
                padding: "8px 18px", borderRadius: "14px", border: "none",
                background: "transparent", color: "#999",
                fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
                transition: "color 0.15s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = t.primary; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#999"; }}
              >← 이전 문항으로 돌아가기</button>
            </div>
          )}

          {/* 질문 페이지 하단 — 테스트 공유 */}
          <div style={{ marginTop: "18px" }}>
            {renderTestShareButton(true)}
          </div>
        </div>
      </div>
    );
  }

  // ── 결과 화면 ──
  if (screen === "result" && char && pdata) {
    const t = theme || THEMES["8-10"];

    // 1단계: 큰 동물 리빌 (한 화면에 하나만 집중)
    if (resultStep === "reveal") return (
      <div style={wrap}>
        <div style={{ ...card, padding: "48px 28px", textAlign: "center" }} className="pop-big">
          <div style={{ fontSize: "13px", color: "#BBB", marginBottom: "10px", fontFamily: '"Nanum Gothic", sans-serif', letterSpacing: "1px" }}>나는…</div>
          <div style={{
            width: "200px", height: "200px", borderRadius: "50%",
            background: `linear-gradient(135deg, ${char.bg} 0%, ${t.softBg} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "120px", margin: "0 auto 24px",
            boxShadow: `0 20px 48px ${char.color}35, inset 0 0 0 6px white`,
          }} className="emoji-bounce-big">{char.emoji}</div>
          <span style={{
            display: "inline-block", padding: "6px 18px", borderRadius: "24px",
            background: char.bg, color: char.color, fontSize: "15px", fontWeight: 800,
            marginBottom: "14px", letterSpacing: "3px",
          }}>{result}</span>
          <h2 style={{ fontSize: "36px", color: char.color, margin: "0 0 6px", letterSpacing: "-0.5px" }}>{char.name}형</h2>
          <p style={{ color: "#888", fontSize: "16px", margin: "0 0 36px", fontWeight: 600 }}>{char.tag}</p>
          <button onClick={() => setResultStep("details")}
            style={{
              padding: "18px 36px", borderRadius: "20px", border: "none",
              background: t.btnGrad, color: "white",
              fontSize: "18px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              boxShadow: `0 10px 28px ${t.primary}50`,
              transition: "transform 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >나에 대해 더 알아보기 →</button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginTop: "16px" }}>
            <button onClick={kakaoShareChild} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px 22px", borderRadius: "14px", border: "none",
              background: "#FEE500", color: "#000000d9",
              fontSize: "14px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(254,229,0,0.35)",
            }}>
              <span style={{ fontSize: "17px" }}>💬</span> 결과 카톡으로 공유하기
            </button>
            <button onClick={saveChildImage} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px 22px", borderRadius: "14px",
              border: `2px solid ${char.color}30`,
              background: "white", color: char.color,
              fontSize: "14px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
            }}>
              <span style={{ fontSize: "16px" }}>📥</span> 이미지로 저장 (1080×1080)
            </button>
            <div style={{ width: "100%", maxWidth: "320px" }}>
              {renderTestShareButton(true)}
            </div>
          </div>
        </div>
      </div>
    );

    // 2단계: 상세 + 부모 가이드
    return (
    <div style={{ ...wrap, alignItems: "flex-start", paddingTop: "32px", paddingBottom: "40px" }}>
      <div style={{ ...card, maxWidth: "500px" }} className="pop">

        <div style={{ marginBottom: "12px" }}>
          <button onClick={() => setResultStep("reveal")} style={{
            padding: "6px 12px", borderRadius: "10px", border: "none",
            background: "transparent", color: "#AAA",
            fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = char.color; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#AAA"; }}
          >← 결과로</button>
        </div>

        {/* 아이 결과 — 컴팩트 헤더 */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "100px", height: "100px", borderRadius: "50%", background: char.bg,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "60px",
            margin: "0 auto 14px", boxShadow: `0 12px 32px ${char.color}30`,
          }} className="emoji-bounce">{char.emoji}</div>
          <span style={{
            display: "inline-block", padding: "5px 14px", borderRadius: "20px",
            background: char.bg, color: char.color, fontSize: "14px", fontWeight: 800,
            marginBottom: "8px", letterSpacing: "2px",
          }}>{result}</span>
          <h2 style={{ fontSize: "26px", color: char.color, margin: "0 0 4px" }}>{char.name}형</h2>
          <p style={{ color: "#AAA", fontSize: "14px", margin: "0 0 18px" }}>{char.tag}</p>
          <div style={{
            background: `linear-gradient(135deg, ${char.bg} 0%, ${t.softBg} 100%)`,
            borderRadius: "20px", padding: "22px 24px",
            fontSize: "16px", color: "#444", lineHeight: 2,
            textAlign: "left",
            fontWeight: 600,
            wordBreak: "keep-all",
          }}>
            {renderParagraphText(CHILD_DESC[result], { lineHeight: 1.95 })}
          </div>
        </div>

        <div style={{ borderTop: "2px dashed #F0F0F0", margin: "20px 0" }} />

        {/* 잠금 */}
        {parentStep === "locked" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔒</div>
            <h3 style={{ fontSize: "18px", color: "#444", margin: "0 0 6px" }}>부모님 전용 가이드</h3>
            <p style={{ color: "#BBB", fontSize: "13px", margin: "0 0 20px", lineHeight: 1.6 }}>우리 아이 훈육법 · 칭찬법<br />학습 스타일 · 친구 관계</p>
            <button onClick={() => { setParentStep("slider"); trackEvent("parent_unlock_start", { result_type: result || "unknown" }); }} style={{
              padding: "14px 32px", borderRadius: "16px", border: "none",
              background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
              color: "white", fontSize: "16px", cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 6px 20px rgba(124,58,237,0.3)",
            }}>부모님 결과 확인하기 👨‍👩‍👧</button>
          </div>
        )}

        {/* 슬라이더 */}
        {parentStep === "slider" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>👆</div>
            <p style={{ color: "#666", fontSize: "15px", margin: "0 0 20px" }}>부모님이 직접 슬라이더를 끝까지 밀어주세요</p>
            <div style={{ position: "relative", padding: "8px 0" }}>
              <div style={{
                position: "relative", height: "52px",
                background: `linear-gradient(90deg, #EDE9FE ${sliderVal}%, #F0F0F0 ${sliderVal}%)`,
                borderRadius: "26px",
              }}>
                <input type="range" min="0" max="100" value={sliderVal} onChange={handleSlider}
                  style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer", zIndex: 2 }} />
                <div style={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  fontSize: "13px", color: sliderVal > 40 ? "#7C3AED" : "#CCC",
                  fontWeight: "700", pointerEvents: "none", userSelect: "none",
                }}>
                  {sliderVal < 95 ? (sliderVal < 10 ? "← 밀어주세요" : sliderVal < 50 ? "계속 →" : "거의 다 됐어요! →") : "✓"}
                </div>
                <div style={{
                  position: "absolute", top: "50%", left: `calc(${sliderVal}% - 22px)`, transform: "translateY(-50%)",
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                  boxShadow: "0 4px 12px rgba(124,58,237,0.4)", border: "3px solid white",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
                  pointerEvents: "none", transition: sliderVal === 0 ? "none" : "left 0.05s",
                }}>→</div>
              </div>
            </div>
          </div>
        )}

        {/* 퀴즈 + 타이머 */}
        {parentStep === "quiz" && quiz && (
          <div style={{ textAlign: "center" }}>
            {/* 타이머 원형 */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: timer <= 2 ? "#FF4444" : timer <= 4 ? "#FF8C42" : "#7C3AED",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "28px", fontWeight: "800",
                boxShadow: `0 4px 16px ${timer <= 2 ? "#FF444440" : timer <= 4 ? "#FF8C4240" : "#7C3AED40"}`,
                transition: "background 0.3s",
                fontFamily: '"Nanum Gothic", sans-serif',
              }}>{timer}</div>
            </div>
            <p style={{ color: "#AAA", fontSize: "12px", margin: "0 0 16px" }}>시간 초과 시 새 문제로 바뀌어요</p>

            {/* 문제 */}
            <div key={quiz.q} style={{
              background: "#F8F6FF", borderRadius: "16px", padding: "18px",
              marginBottom: "12px", animation: "slideUp 0.3s ease",
            }}>
              <p style={{ margin: "0 0 10px", fontSize: "17px", color: "#333", fontWeight: "700", lineHeight: 1.6 }}>{quiz.q}</p>
              <div style={{
                background: "#EDE9FE", borderRadius: "10px", padding: "10px 14px",
                fontSize: "14px", color: "#7C3AED", lineHeight: 1.5,
                fontFamily: '"Nanum Gothic", sans-serif',
              }}>{quiz.hint}</div>
            </div>

            {quizErr && (
              <p style={{ color: "#FF6B6B", fontSize: "14px", margin: "0 0 8px" }}>
                틀렸어요! 새 문제로 바꿀게요 😅
              </p>
            )}

            <div key={shakeKey} className={quizErr ? "shake" : ""} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text" value={quizInput}
                onChange={e => setQuizInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && quizInput && checkQuiz()}
                placeholder="정답 입력"
                style={{
                  flex: 1, padding: "14px", borderRadius: "14px",
                  border: `2px solid ${quizErr ? "#FF6B6B" : "#E0E0E0"}`,
                  fontSize: "18px", textAlign: "center", fontFamily: "inherit",
                  outline: "none", transition: "border-color 0.2s",
                }}
              />
              <button onClick={checkQuiz} disabled={!quizInput} style={{
                padding: "14px 24px", borderRadius: "14px", border: "none",
                background: quizInput ? "linear-gradient(135deg, #7C3AED, #4F46E5)" : "#DDD",
                color: "white", fontSize: "16px", cursor: quizInput ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}>확인</button>
            </div>
          </div>
        )}

        {/* 부모 결과 공개 */}
        {parentStep === "open" && (
          <div className="slide-up gpu-layer">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>👨‍👩‍👧</div>
              <h3 style={{ fontSize: "20px", color: "#333", margin: "0 0 4px" }}>부모님을 위한 양육 가이드</h3>
              <p style={{ color: "#AAA", fontSize: "13px", margin: 0 }}>{char.name}형 ({result}) 아이와 더 잘 소통하는 법</p>
            </div>

            {pdata.psychology && (
              <div style={{
                padding: "18px 20px", borderRadius: "16px",
                background: "linear-gradient(135deg, #EEF0FF 0%, #F4EAFF 100%)",
                marginBottom: "14px", borderLeft: "4px solid #5B5FFF",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "20px" }}>🧠</span>
                  <h4 style={{ margin: 0, fontSize: "15px", color: "#5B5FFF", fontWeight: 800, letterSpacing: "-0.3px" }}>이 유형의 심리적 특성</h4>
                </div>
                <p style={{ margin: 0, fontSize: "14px", color: "#444", lineHeight: 1.85, fontFamily: '"Nanum Gothic", sans-serif', wordBreak: "keep-all" }}>
                  {pdata.psychology}
                </p>
              </div>
            )}

            {[
              { icon: "🎯", title: "훈육법", key: "discipline", color: "#FF6B6B", bg: "#FFF0F0" },
              { icon: "⭐", title: "칭찬법", key: "praise", color: "#FF8C42", bg: "#FFF5EC" },
              { icon: "📚", title: "학습 스타일", key: "learning", color: "#4361EE", bg: "#EEF1FF" },
              { icon: "👫", title: "친구 관계", key: "relationship", color: "#4D8B31", bg: "#F0F8E8" },
            ].map(item => (
              <div key={item.key} style={{
                padding: "18px", borderRadius: "16px", background: item.bg,
                marginBottom: "10px", borderLeft: `4px solid ${item.color}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "20px" }}>{item.icon}</span>
                  <h4 style={{ margin: 0, fontSize: "16px", color: item.color, fontWeight: "800" }}>{item.title}</h4>
                </div>
                <p style={{ margin: 0, fontSize: "14px", color: "#555", lineHeight: 1.8, fontFamily: '"Nanum Gothic", sans-serif', wordBreak: "keep-all" }}>
                  {pdata[item.key]}
                </p>
              </div>
            ))}
            <button onClick={kakaoShareFull} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              marginTop: "8px",
              padding: "14px 18px", borderRadius: "14px", border: "none",
              background: "#FEE500", color: "#000000d9",
              fontSize: "15px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(254,229,0,0.35)",
            }}>
              <span style={{ fontSize: "18px" }}>💬</span> 아이 + 부모 결과 공유하기
            </button>
            <button onClick={saveFullImage} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              marginTop: "10px",
              padding: "14px 18px", borderRadius: "14px",
              border: "2px solid #5B5FFF30",
              background: "white", color: "#5B5FFF",
              fontSize: "15px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
            }}>
              <span style={{ fontSize: "18px" }}>📥</span> 부모 가이드 이미지로 저장 (1080×1920)
            </button>
          </div>
        )}

        <div style={{ marginTop: "12px" }}>
          {renderTestShareButton(true)}
        </div>

        <button onClick={restart} style={{
          width: "100%", padding: "14px", borderRadius: "16px", border: "2px solid #F0F0F0",
          background: "white", fontSize: "15px", color: "#AAA", cursor: "pointer",
          fontFamily: "inherit", marginTop: "24px", transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#CCC"; e.currentTarget.style.color = "#666"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#F0F0F0"; e.currentTarget.style.color = "#AAA"; }}
        >처음으로 돌아가기 🔄</button>
      </div>
    </div>
    );
  }

  return null;
}
