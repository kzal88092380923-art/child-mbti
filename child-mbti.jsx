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

// ===================== 부모 인증 퀴즈 50개 =====================

const QUIZ_POOL = [
  // 2002 월드컵
  { q: "2002 한일 월드컵 대한민국 감독은?", hint: "💡 네덜란드 출신 외국인 감독, ○딩크", a: "히딩크" },
  { q: "2002 월드컵 스페인전 승부차기 마지막 키커는?", hint: "💡 수비수 출신, 나중에 국가대표 감독 역임", a: "홍명보" },
  { q: "2002 월드컵 포르투갈전 결승골 주인공은?", hint: "💡 이후 맨체스터 유나이티드 입단, 이름 3글자", a: "박지성" },
  { q: "2002 월드컵 준결승 상대 국가는?", hint: "💡 유럽 강호, 게르만 민족의 나라", a: "독일" },
  { q: "2002 월드컵 이탈리아전 16강 골든골 주인공은?", hint: "💡 이름 3글자, 안○○", a: "안정환" },
  // 스포츠
  { q: "한국 최초 미국 메이저리그 야구 선수는?", hint: "💡 LA 다저스 입단, 이름 3글자", a: "박찬호" },
  { q: "1992 바르셀로나 올림픽 마라톤 금메달리스트는?", hint: "💡 이름 3글자, 황○○", a: "황영조" },
  { q: "1988 서울 올림픽 마스코트 이름은?", hint: "💡 호랑이, 3글자, 호○○", a: "호돌이" },
  { q: "한국 최초 LPGA 메이저 대회 우승 선수는?", hint: "💡 이름 3글자, 박○○", a: "박세리" },
  { q: "1988 서울 올림픽 주제가 '손에 손잡고'를 부른 그룹은?", hint: "💡 영어 이름, 나라 이름 포함", a: "코리아나" },
  { q: "2002 솔트레이크 동계올림픽 쇼트트랙 금메달 박탈 논란의 한국 선수는?", hint: "💡 이름 3글자, 김○○", a: "김동성" },
  // IT/기술
  { q: "싸이월드에서 사용하던 사이버 화폐 이름은?", hint: "💡 나무 열매, 2글자", a: "도토리" },
  { q: "마이크로소프트가 운영한 인터넷 메신저 이름은?", hint: "💡 영문 대문자 3글자", a: "MSN" },
  { q: "SK 포털 네이트에서 운영한 메신저 이름은?", hint: "💡 네이트 다음에 2글자, 뒤는 '온'", a: "네이트온" },
  { q: "1990년대 PC통신, 한국통신이 운영한 서비스는?", hint: "💡 5글자, 하이○○○", a: "하이텔" },
  { q: "하이텔·나우누리와 함께 3대 PC통신이었던 서비스는?", hint: "💡 4글자, 천○○안", a: "천리안" },
  { q: "넥슨의 대표 RPG, 버섯과 슬라임이 등장하는 게임은?", hint: "💡 이름에 나무 이름 포함", a: "메이플스토리" },
  { q: "스타크래프트에서 테란의 기본 전투 보병 유닛은?", hint: "💡 영어로 해병대라는 뜻", a: "마린" },
  { q: "스타크래프트에서 저그의 기본 전투 유닛은?", hint: "💡 작고 빠름, 2마리씩 생산", a: "저글링" },
  { q: "2000년대 초 인기 메신저, 노란 캐릭터가 특징인 서비스는?", hint: "💡 같은 단어가 두 번 반복", a: "버디버디" },
  { q: "2004년 넥슨이 서비스를 시작한 카트 레이싱 게임은?", hint: "💡 카트+라이더", a: "카트라이더" },
  { q: "2000년대 초 전국민 포털 '한메일'을 서비스한 곳은?", hint: "💡 지금의 카카오와 합병, 영문 4글자", a: "다음" },
  // 아이돌/가요
  { q: "SM 1세대 남자 아이돌, '캔디'·'전사의 후예'로 유명한 그룹은?", hint: "💡 멤버 5명, 알파벳 이름에 점 포함", a: "H.O.T" },
  { q: "H.O.T의 라이벌, DSP 소속 6인조 남자 아이돌은?", hint: "💡 이름에 숫자 '6'이라는 뜻 포함", a: "젝스키스" },
  { q: "이효리가 소속된 1990년대 여자 아이돌 그룹은?", hint: "💡 이름 2글자, 꽃 이름", a: "핑클" },
  { q: "핑클의 라이벌이었던 SM 소속 3인조 여자 그룹은?", hint: "💡 세 멤버 이름 첫 글자로 그룹명 구성", a: "S.E.S" },
  { q: "1992년 '난 알아요'로 데뷔한 전설적인 3인조 그룹은?", hint: "💡 리더 이름이 그룹명에 포함", a: "서태지와 아이들" },
  { q: "god의 전체 멤버 수는?", hint: "💡 영어로 신이라는 뜻의 그룹", a: "5" },
  { q: "신화(SHINHWA)가 데뷔한 연도는?", hint: "💡 1990년대 후반, 199○년", a: "1998" },
  { q: "1999년 가면을 쓰고 '와'로 강렬한 무대를 선보인 여가수는?", hint: "💡 이름 3글자, 이○○", a: "이정현" },
  // 드라마/영화
  { q: "2003년 방영 MBC 사극, 이영애 주연, 주인공 이름이 제목인 드라마는?", hint: "💡 조선 최초 여성 어의 이야기", a: "대장금" },
  { q: "1999년 개봉 한국 첩보 영화, 한석규·김윤진 주연은?", hint: "💡 민물고기 이름, 3글자", a: "쉬리" },
  { q: "2002년 KBS2 드라마, 배용준·최지우 주연의 멜로물은?", hint: "💡 계절 이름 + 소나타", a: "겨울연가" },
  { q: "2004년 개봉, 한국전쟁 형제 이야기 강제규 감독 영화는?", hint: "💡 제목에 우리나라 국기 이름 포함", a: "태극기 휘날리며" },
  { q: "1997년 방영 MBC 드라마, 안재욱·차인표 주연은?", hint: "💡 '별은 내 ○○에'", a: "별은 내 가슴에" },
  { q: "2000년 방영 KBS2 드라마, 원빈·송혜교·송승헌 주연은?", hint: "💡 계절 이름 + 동화", a: "가을동화" },
  // 음식/생활
  { q: "1974년 출시된 농심의 새우 맛 스낵은?", hint: "💡 3글자, 새우○○", a: "새우깡" },
  { q: "농심의 국물 없는 짜장 라면 이름은?", hint: "💡 4글자, ○○게티", a: "짜파게티" },
  { q: "빙그레에서 출시한 바나나 맛 막대 아이스크림은?", hint: "💡 3글자, 메○○", a: "메로나" },
  { q: "빙그레 바나나맛 우유의 특이한 용기 모양은?", hint: "💡 전통 항아리 모양, 2글자", a: "단지" },
  { q: "1990년대 문방구에서 팔던 쫄깃한 불량식품은?", hint: "💡 3글자, 쫀○○", a: "쫀드기" },
  { q: "에버랜드의 이전 이름은?", hint: "💡 자○○○랜드, 5글자", a: "자연농원" },
  { q: "롯데월드가 개장한 연도는?", hint: "💡 1980년대 후반, 198○년", a: "1989" },
  // 사회/역사
  { q: "1997년 외환위기 구제금융을 받은 국제기관 약자는?", hint: "💡 영문 3글자", a: "IMF" },
  { q: "외환위기 극복을 위해 전국민이 참여한 캠페인은?", hint: "💡 귀금속 ○ 모으기 운동", a: "금모으기" },
  { q: "2000년 6월 역사적인 남북정상회담 당시 대통령은?", hint: "💡 노벨 평화상 수상, 이름 3글자", a: "김대중" },
  { q: "2002년 대선에서 당선된 16대 대통령은?", hint: "💡 이름 3글자, 노○○", a: "노무현" },
  { q: "한국 최초 우주인 이름은?", hint: "💡 이름 3글자, 이○○", a: "이소연" },
  // 장난감/게임
  { q: "1990년대 초등학생들이 열광한 카드 수집 게임은?", hint: "💡 일본 원작, 몬스터를 잡는 게임, 포○○", a: "포켓몬" },
  { q: "1990년대 유행한 일본산 전자 애완동물 장난감은?", hint: "💡 달걀 모양, 일본어로 알+시계", a: "다마고치" },
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
  ENFJ: "나는 친구들을 잘 이끄는 멋진 사자예요!\n친구들이 힘들 때 먼저 다가가고,\n모두가 행복할 때 나도 가장 행복해요. 💛",
  ENFP: "나는 아이디어가 넘치는 앵무새예요!\n새로운 것을 좋아하고,\n친구들을 웃게 만드는 걸 잘해요. 🌈",
  ENTJ: "나는 당당한 독수리예요!\n어떤 일이든 자신 있게 나서고,\n계획을 세워 끝까지 이루어내요. 🦅",
  ENTP: "나는 호기심 많은 여우예요!\n독창적인 아이디어로\n모두를 깜짝 놀라게 해요. 🦊",
  ESFJ: "나는 친구를 잘 챙기는 강아지예요!\n모두가 행복한지 늘 살피고,\n친절하게 도와줘요. 🐶",
  ESFP: "나는 신나는 돌고래예요!\n어디서든 즐거운 분위기를 만들고,\n함께하는 걸 정말 좋아해요. 🐬",
  ESTJ: "나는 꼼꼼한 비버예요!\n규칙을 잘 지키고,\n맡은 일은 끝까지 해내요. 🦫",
  ESTP: "나는 빠른 치타예요!\n무슨 일이든 겁 없이 도전하고,\n행동이 누구보다 빨라요. 🐆",
  INFJ: "나는 지혜로운 부엉이예요!\n조용히 관찰하다가\n꼭 필요한 말을 해줘요. 🦉",
  INFP: "나는 감성적인 고양이예요!\n상상력이 풍부하고\n마음이 따뜻해요. 🐱",
  INTJ: "나는 독립적인 문어예요!\n혼자서도 척척 잘하고\n생각이 아주 깊어요. 🐙",
  INTP: "나는 생각 많은 너구리예요!\n궁금한 게 많고,\n논리적으로 생각하는 걸 좋아해요. 🦝",
  ISFJ: "나는 따뜻한 토끼예요!\n조용하지만 든든하게\n친구들을 지켜줘요. 🐰",
  ISFP: "나는 평화로운 판다예요!\n예쁜 것을 좋아하고\n모두와 사이좋게 지내요. 🐼",
  ISTJ: "나는 믿음직한 거북이예요!\n한번 정한 건 꼭 지키고\n성실하게 노력해요. 🐢",
  ISTP: "나는 조용한 고슴도치예요!\n말은 적지만 문제가 생기면\n누구보다 빨리 해결해요. 🦔",
};

const PARENT_DATA = {
  ENFJ: {
    discipline: "직접적인 명령보다 이유를 설명해 주세요. '왜 그렇게 해야 하는지'를 알면 스스로 고쳐나갑니다. 공개적인 지적은 상처가 크므로 1:1로 조용히 이야기하는 게 효과적입니다.",
    praise: "'네가 친구들을 잘 도와줬어'처럼 사회적 기여를 인정해 주세요. 리더십을 발휘할 때 구체적으로 칭찬하면 더 큰 동기부여가 됩니다.",
    learning: "협력 학습이 효과적입니다. 그룹 활동이나 친구와 함께 공부하는 걸 좋아합니다. '이걸 배우면 다른 사람을 도울 수 있어'처럼 목적을 연결하면 집중력이 올라갑니다.",
    relationship: "친구 관계를 매우 중요시합니다. 친구의 갈등에 깊이 관여하다 상처받을 수 있으니, '나도 내 마음을 돌봐야 해'라는 것을 꾸준히 가르쳐 주세요.",
  },
  ENFP: {
    discipline: "규칙의 이유를 창의적으로 설명해 주세요. 단순 반복 훈육은 반발을 부릅니다. 관심을 끌기 위한 행동에는 긍정적인 표현 채널을 만들어 주세요.",
    praise: "'그 아이디어 어떻게 생각한 거야?' 처럼 창의성을 인정해 주세요. 열정을 발휘할 때 크게 반응해 주면 큰 힘이 됩니다.",
    learning: "흥미 기반 학습이 필수입니다. 지루한 반복 학습은 효과가 적습니다. 다양한 방식의 경험을 통해 배울 수 있도록 풍부한 자극을 제공하세요.",
    relationship: "많은 친구들과 넓게 사귀는 경향이 있습니다. 깊은 관계보다 넓은 관계를 선호하지만, 쉽게 상처받기도 하므로 감정을 표현하는 법을 가르쳐 주세요.",
  },
  ENTJ: {
    discipline: "논리적으로 이유를 설명하면 빠르게 수용합니다. 감정적인 훈육보다 결과와 원칙을 명확히 제시하세요. 자율성을 존중해 주면 더 잘 따릅니다.",
    praise: "'네가 스스로 해냈네'처럼 성취와 자립심을 인정해 주세요. 능력을 인정받을 때 가장 동기부여가 됩니다.",
    learning: "목표 지향적 학습에 강합니다. '이걸 배우면 뭘 할 수 있어'처럼 목적을 명확히 해주세요. 경쟁적인 환경에서 두각을 나타냅니다.",
    relationship: "리더 역할을 자처하지만, 강압적으로 보일 수 있습니다. 타인의 감정을 배려하는 법을 꾸준히 가르쳐 주세요.",
  },
  ENTP: {
    discipline: "규칙에 도전하는 경향이 있습니다. 훈육 시 토론을 허용하되 최종 결론은 부모가 내려주세요. 창의적인 반항은 적절한 활동 채널로 이끌어 주세요.",
    praise: "'그런 생각은 어떻게 한 거야?'처럼 독창성에 반응해 주세요. 지적 능력을 인정받을 때 크게 동기부여됩니다.",
    learning: "토론과 질문을 통한 학습을 좋아합니다. 정답보다 과정을 즐기는 아이이므로 탐구적 환경을 만들어 주세요.",
    relationship: "논쟁을 즐기는 경향이 있어 친구들과 갈등이 생길 수 있습니다. '이기는 것'보다 '관계'가 중요함을 가르쳐 주세요.",
  },
  ESFJ: {
    discipline: "관계 중심으로 접근하세요. '네가 그러면 친구가 어떤 기분일까?'처럼 타인의 감정과 연결하면 효과적입니다.",
    praise: "'덕분에 모두가 즐거웠어'처럼 관계적 기여를 인정해 주세요. 인정과 감사 표현이 가장 큰 힘이 됩니다.",
    learning: "안정적인 환경에서 학습 효율이 높습니다. 선생님·친구와의 관계가 좋을수록 학업 의지도 함께 높아집니다.",
    relationship: "인기 있는 편이지만 거절을 어려워합니다. '싫다고 말해도 괜찮아'를 꾸준히 가르쳐 주세요.",
  },
  ESFP: {
    discipline: "즉각적이고 따뜻하게 접근하세요. 긴 설교보다 짧고 명확한 피드백이 효과적입니다. 재미있는 경험과 연결해 규칙을 가르쳐 주세요.",
    praise: "'와, 정말 신나 보였어!'처럼 에너지와 표현력을 칭찬해 주세요. 즉각적인 칭찬이 가장 효과적입니다.",
    learning: "체험 학습과 실습이 효과적입니다. 앉아서 이론을 공부하는 건 힘들어하므로 다양한 활동형 학습을 시도해 보세요.",
    relationship: "폭넓은 관계를 유지하며 사교적입니다. 깊은 갈등을 회피하는 경향이 있으니 감정을 솔직하게 표현하는 법을 가르쳐 주세요.",
  },
  ESTJ: {
    discipline: "규칙과 원칙을 명확히 제시하세요. 일관성이 매우 중요합니다. 예외를 허용하면 혼란을 느낍니다.",
    praise: "'계획대로 잘 해냈네'처럼 성실함과 책임감을 인정해 주세요. 노력과 결과가 인정받을 때 더 열심히 합니다.",
    learning: "체계적이고 구조화된 학습 환경에서 강합니다. 명확한 목표와 단계별 계획을 함께 세워주세요.",
    relationship: "규칙을 지키지 않는 친구들과 갈등이 생길 수 있습니다. 유연성을 기르고 다름을 인정하는 법을 가르쳐 주세요.",
  },
  ESTP: {
    discipline: "즉각적이고 직접적으로 접근하세요. 긴 설명보다 행동의 즉각적인 결과를 보여주는 게 효과적입니다. 에너지를 긍정적으로 발산할 수 있는 활동을 제공하세요.",
    praise: "'빠르게 문제를 해결했네!'처럼 행동력과 순발력을 칭찬해 주세요.",
    learning: "움직이면서 배우는 걸 좋아합니다. 현장학습·실습·스포츠 활동 등과 연결된 학습이 효과적입니다.",
    relationship: "인싸형이지만 충동적인 행동으로 갈등이 생길 수 있습니다. 행동 전에 잠깐 생각하는 습관을 길러주세요.",
  },
  INFJ: {
    discipline: "혼자 생각할 시간을 주세요. 즉각적인 반응보다 '나중에 이야기하자'가 효과적일 때가 많습니다. 감정을 억누르지 않도록 안전한 표현 공간을 만들어 주세요.",
    praise: "'그 생각 정말 깊다'처럼 통찰력과 직관을 인정해 주세요. 진심 어린 칭찬에 크게 감동받습니다.",
    learning: "조용한 환경에서 깊이 집중합니다. 관심 있는 분야에 몰입하는 경향이 강하므로 흥미를 파악해 연결해 주세요.",
    relationship: "소수의 깊은 관계를 선호합니다. 혼자 있는 시간이 필요하므로 억지로 사교 활동을 강요하지 마세요.",
  },
  INFP: {
    discipline: "감정을 존중하며 접근하세요. 비판적인 말은 상처가 오래 남습니다. 행동이 잘못되었어도 존재 자체는 소중함을 꼭 전달해 주세요.",
    praise: "'너만의 특별한 방식이야'처럼 개성과 창의성을 인정해 주세요. 진정성 있는 칭찬이 형식적 칭찬보다 훨씬 효과적입니다.",
    learning: "의미 있는 것에 깊이 집중합니다. 흥미 없는 과목은 동기부여가 어려우므로 '왜 중요한지'를 이야기로 연결해 주세요.",
    relationship: "깊은 우정을 원하지만 거절당하는 것을 두려워합니다. 자기 표현을 격려하고, 상처받았을 때 충분히 이야기 들어주세요.",
  },
  INTJ: {
    discipline: "논리적 이유 제시가 가장 효과적입니다. 단순한 '안 된다'는 반발을 부릅니다. 자율성을 최대한 존중하되, 명확한 경계선을 함께 제시하세요.",
    praise: "'그 방법 정말 효율적이네'처럼 전략적 사고를 인정해 주세요. 지적 능력 인정이 가장 큰 동기부여입니다.",
    learning: "독립적으로 깊이 파고드는 학습을 선호합니다. 자기 주도 학습 환경을 만들어 주되, 완벽주의로 지치지 않도록 살펴주세요.",
    relationship: "소수 정예 관계를 선호합니다. 친구가 적어 보여도 깊은 관계를 맺고 있으므로 무리하게 사교를 강요하지 마세요.",
  },
  INTP: {
    discipline: "논리적으로 설명하면 잘 수용합니다. 권위에 의한 훈육은 효과가 없습니다. '왜?'라는 질문에 성실히 답해주세요.",
    praise: "'그 분석 정말 날카롭네'처럼 논리적 사고와 지적 호기심을 인정해 주세요.",
    learning: "지적 호기심이 강하므로 탐구적 환경이 중요합니다. 한 주제에 깊이 파고들 수 있도록 지원해 주세요.",
    relationship: "사회적 관계보다 지적 자극을 더 중요시합니다. 친구 수가 적어도 괜찮으며, 소통 방식이 다를 뿐입니다.",
  },
  ISFJ: {
    discipline: "관계 중심으로 부드럽게 접근하세요. 크게 야단치면 크게 위축됩니다. 변화가 필요할 때는 충분한 예고와 설명이 필요합니다.",
    praise: "'정말 믿음직하다'처럼 신뢰성과 성실함을 인정해 주세요. 조용히 한 노력들을 눈여겨보고 인정해 주세요.",
    learning: "안정적인 루틴 속에서 학습 효율이 높습니다. 갑작스러운 변화보다 예측 가능한 학습 계획이 도움됩니다.",
    relationship: "조용하지만 든든한 친구입니다. 자기 감정을 잘 표현 못할 수 있으니 정기적으로 감정을 묻고 들어주세요.",
  },
  ISFP: {
    discipline: "자유로운 분위기에서 훈육하세요. 강압적인 통제는 반발을 불러옵니다. 창의적인 표현 공간을 충분히 허용해 주세요.",
    praise: "'네 감각이 정말 특별해'처럼 미적 감각과 개성을 인정해 주세요. 조용한 칭찬이지만 오래 기억합니다.",
    learning: "예술·음악·체육 등 감각적 활동과 연결된 학습이 효과적입니다. 자유로운 창작 활동을 많이 허용해 주세요.",
    relationship: "깊고 진심어린 관계를 원합니다. 갈등을 회피하는 경향이 있으니 감정 표현과 갈등 해결 방법을 가르쳐 주세요.",
  },
  ISTJ: {
    discipline: "일관된 규칙과 결과를 제시하세요. 예외 없는 일관성이 가장 중요합니다. 실수를 했을 때 책임지는 방법을 차분히 알려주세요.",
    praise: "'역시 믿을 수 있어'처럼 책임감과 성실성을 인정해 주세요. 묵묵히 해낸 것들을 구체적으로 칭찬해 주세요.",
    learning: "체계적이고 순차적인 학습에 강합니다. 한 번 배운 것은 오래 기억합니다. 꾸준한 복습 루틴이 효과적입니다.",
    relationship: "깊은 신뢰 관계를 중요시합니다. 새로운 환경 적응에 시간이 걸리므로 적응 기간을 충분히 주세요.",
  },
  ISTP: {
    discipline: "자율성을 최대한 존중하세요. 간섭이 심하면 더 닫힙니다. 문제가 생겼을 때 해결책을 함께 찾는 방식으로 접근하세요.",
    praise: "'혼자서 척척 해결했네'처럼 독립적인 문제해결 능력을 인정해 주세요.",
    learning: "직접 해보면서 배우는 것을 선호합니다. 이론보다 실습·만들기·분해하기 등 활동적인 학습이 효과적입니다.",
    relationship: "말이 적고 독립적이지만, 필요한 순간에 든든하게 나타납니다. 억지로 대화를 이끌기보다 함께 활동하며 가까워지세요.",
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

const usedIdxRef = { current: new Set() };
function getRandomQuiz() {
  if (usedIdxRef.current.size >= QUIZ_POOL.length) usedIdxRef.current.clear();
  let idx;
  do { idx = Math.floor(Math.random() * QUIZ_POOL.length); } while (usedIdxRef.current.has(idx));
  usedIdxRef.current.add(idx);
  return QUIZ_POOL[idx];
}

// ===================== 컴포넌트 =====================

export default function ChildMBTI() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Jua&family=Nanum+Gothic:wght@400;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; }
      body { margin: 0; background: linear-gradient(135deg, #FFF5EC 0%, #FFF0F8 50%, #F0EFFF 100%); min-height: 100vh; }
      input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 52px; background: transparent; cursor: pointer; }
      input[type=range]::-webkit-slider-runnable-track { height: 8px; border-radius: 4px; background: #E8E8E8; }
      input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #4F46E5); border: 3px solid white; box-shadow: 0 4px 12px rgba(124,58,237,0.4); margin-top: -18px; }
      input[type=range]::-moz-range-track { height: 8px; border-radius: 4px; background: #E8E8E8; }
      input[type=range]::-moz-range-thumb { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #4F46E5); border: 3px solid white; cursor: pointer; }
      @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes slideUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
      .pop { animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
      .slide-up { animation: slideUp 0.3s ease both; }
      .emoji-bounce { animation: bounce 2s ease-in-out infinite; }
      .shake { animation: shake 0.3s ease; }
    `;
    document.head.appendChild(style);
  }, []);

  const [screen, setScreen] = useState("welcome");
  const [ageInput, setAgeInput] = useState("");
  const [ageGroup, setAgeGroup] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  const [answerHistory, setAnswerHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [qVisible, setQVisible] = useState(true);

  // 부모 인증
  const [parentStep, setParentStep] = useState("locked");
  const [sliderVal, setSliderVal] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [quizInput, setQuizInput] = useState("");
  const [quizErr, setQuizErr] = useState(false);
  const [timer, setTimer] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);

  const timerRef = useRef(null);

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

  const questions = ageGroup ? QUESTIONS[ageGroup] : [];
  const totalQ = questions.length;
  const progress = totalQ > 0 ? (currentQ / totalQ) * 100 : 0;
  const validAge = getAgeGroup(parseInt(ageInput));

  const ageLabels = {
    "5-7": { label: "5~7살", emoji: "🐣", color: "#FF6B9D" },
    "8-10": { label: "8~10살", emoji: "🌱", color: "#FF8C42" },
    "11-13": { label: "11~13살", emoji: "🌟", color: "#4361EE" },
  };
  const groupColors = {
    "5-7": { p: "#FF6B9D", bg: "#FFF0F6" },
    "8-10": { p: "#FF8C42", bg: "#FFF3E8" },
    "11-13": { p: "#4361EE", bg: "#EEF1FF" },
  };

  function startQuiz() {
    const g = getAgeGroup(parseInt(ageInput));
    if (!g) return;
    setAgeGroup(g);
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setAnswerHistory([]);
    setCurrentQ(0);
    setScreen("quiz");
  }

  function handleAnswer(choice) {
    const q = questions[currentQ];
    // "C" = 잘 모르겠어요 → 중립 처리 (점수 미반영)
    let ns = scores;
    let scoredKey = null;
    if (choice !== "C") {
      scoredKey = choice === "A" ? q.sa : q.sb;
      ns = { ...scores, [scoredKey]: scores[scoredKey] + 1 };
      setScores(ns);
    }
    setAnswerHistory([...answerHistory, { choice, key: scoredKey }]);
    if (currentQ + 1 >= totalQ) {
      setResult(calcMBTI(ns));
      setParentStep("locked");
      setSliderVal(0);
      setQuiz(null);
      setQuizInput("");
      setTimer(null);
      setScreen("result");
    } else {
      setQVisible(false);
      setTimeout(() => { setCurrentQ(currentQ + 1); setQVisible(true); }, 250);
    }
  }

  function handleBack() {
    if (currentQ === 0 || answerHistory.length === 0) return;
    const last = answerHistory[answerHistory.length - 1];
    if (last.key) {
      setScores({ ...scores, [last.key]: scores[last.key] - 1 });
    }
    setAnswerHistory(answerHistory.slice(0, -1));
    setQVisible(false);
    setTimeout(() => { setCurrentQ(currentQ - 1); setQVisible(true); }, 250);
  }

  function handleSlider(e) {
    const v = parseInt(e.target.value);
    setSliderVal(v);
    if (v >= 95) {
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
    const normalize = s => s.trim().toLowerCase().replace(/\s/g, "").replace(/\./g, "");
    const userAns = normalize(quizInput);
    const correctAns = normalize(quiz.a);
    if (userAns === correctAns) {
      clearTimeout(timerRef.current);
      setParentStep("open");
      setTimer(null);
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
    setCurrentQ(0); setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setAnswerHistory([]);
    setResult(null); setParentStep("locked"); setSliderVal(0);
    setQuiz(null); setQuizInput(""); setQuizErr(false); setTimer(null);
  }

  const char = result ? CHARS[result] : null;
  const pdata = result ? PARENT_DATA[result] : null;

  const wrap = {
    fontFamily: '"Jua", "Nanum Gothic", sans-serif',
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", padding: "20px",
  };
  const card = {
    background: "white", borderRadius: "32px", padding: "36px 32px",
    maxWidth: "480px", width: "100%",
    boxShadow: "0 24px 64px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.04)",
  };

  // ── 시작 화면 ──
  if (screen === "welcome") return (
    <div style={wrap}>
      <div style={card} className="pop">
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "72px", marginBottom: "12px" }} className="emoji-bounce">🌟</div>
          <h1 style={{ fontSize: "30px", color: "#333", margin: "0 0 8px", letterSpacing: "-0.5px" }}>어린이 MBTI</h1>
          <p style={{ color: "#AAA", fontSize: "15px", margin: 0 }}>나는 어떤 동물 친구일까요?</p>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <p style={{ textAlign: "center", color: "#666", fontSize: "16px", marginBottom: "12px" }}>몇 살이에요? 🎂</p>
          <input
            type="number" min="5" max="13" value={ageInput}
            onChange={e => setAgeInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && validAge && startQuiz()}
            placeholder="나이 입력 (5~13세)"
            style={{
              width: "100%", padding: "16px", borderRadius: "16px",
              border: `2.5px solid ${validAge ? groupColors[validAge].p : "#E8E8E8"}`,
              fontSize: "20px", textAlign: "center", outline: "none",
              fontFamily: "inherit", color: "#333", transition: "border-color 0.2s",
            }}
          />
          {ageInput && !validAge && (
            <p style={{ color: "#FF6B6B", fontSize: "13px", textAlign: "center", marginTop: "8px" }}>5살 ~ 13살만 이용할 수 있어요 🙏</p>
          )}
          {validAge && (
            <p style={{ color: groupColors[validAge].p, fontSize: "13px", textAlign: "center", marginTop: "8px", fontWeight: "700" }}>
              {ageLabels[validAge].emoji} {ageLabels[validAge].label} 문항으로 시작해요!
            </p>
          )}
        </div>
        <button
          onClick={startQuiz} disabled={!validAge}
          style={{
            width: "100%", padding: "18px", borderRadius: "20px", border: "none",
            background: validAge
              ? `linear-gradient(135deg, ${groupColors[validAge].p}, ${validAge === "5-7" ? "#FF8C42" : validAge === "8-10" ? "#FF6B9D" : "#7C3AED"})`
              : "#E0E0E0",
            color: "white", fontSize: "20px", cursor: validAge ? "pointer" : "not-allowed",
            fontFamily: "inherit", boxShadow: validAge ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
            transition: "transform 0.1s",
          }}
          onMouseEnter={e => validAge && (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >시작하기 🚀</button>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
          {Object.entries(ageLabels).map(([g, v]) => (
            <div key={g} style={{ textAlign: "center", fontSize: "13px", color: "#BBB" }}>
              <div>{v.emoji}</div><div>{v.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── 퀴즈 화면 ──
  if (screen === "quiz") {
    const q = questions[currentQ];
    const c = groupColors[ageGroup];
    const bigFont = ageGroup === "5-7";
    return (
      <div style={wrap}>
        <div style={card}>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "14px", color: "#CCC", fontFamily: '"Nanum Gothic", sans-serif' }}>{currentQ + 1} / {totalQ}</span>
              <span style={{ fontSize: "13px", color: c.p, fontWeight: "700", fontFamily: '"Nanum Gothic", sans-serif' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: "10px", background: "#F0F0F0", borderRadius: "5px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: `linear-gradient(90deg, ${c.p}, ${ageGroup === "5-7" ? "#FF8C42" : ageGroup === "8-10" ? "#FF6B9D" : "#7C3AED"})`,
                borderRadius: "5px", transition: "width 0.4s ease",
              }} />
            </div>
          </div>
          <div className={qVisible ? "slide-up" : ""} style={{
            textAlign: "center", padding: "28px 20px", background: c.bg, borderRadius: "20px", marginBottom: "20px",
            opacity: qVisible ? 1 : 0, transition: "opacity 0.2s",
          }}>
            <p style={{ fontSize: bigFont ? "21px" : "18px", color: "#333", margin: 0, lineHeight: 1.7, fontWeight: "700" }}>{q.text}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: q.a, ch: "A" },
              { label: q.b, ch: "B" },
              { label: "잘 모르겠어요 🤔", ch: "C" },
            ].map(({ label, ch }) => (
              <button key={ch} onClick={() => handleAnswer(ch)} style={{
                padding: "18px 20px",
                borderRadius: "18px",
                border: `2px solid ${c.p}25`,
                background: "white",
                fontSize: bigFont ? "17px" : "15px",
                color: "#444",
                cursor: "pointer", textAlign: "left",
                fontFamily: "inherit", lineHeight: 1.6,
                transition: "all 0.15s ease",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = c.bg; e.currentTarget.style.borderColor = c.p; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${c.p}25`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = `${c.p}25`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none";
                }}
              >{label}</button>
            ))}
          </div>
          {currentQ > 0 && (
            <div style={{ textAlign: "center", marginTop: "18px" }}>
              <button onClick={handleBack} style={{
                padding: "8px 16px", borderRadius: "12px", border: "none",
                background: "transparent", color: "#999",
                fontSize: bigFont ? "14px" : "13px",
                cursor: "pointer", fontFamily: "inherit",
                transition: "color 0.15s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "#555"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#999"; }}
              >← 이전 문항으로 돌아가기</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 결과 화면 ──
  if (screen === "result" && char && pdata) return (
    <div style={{ ...wrap, alignItems: "flex-start", paddingTop: "32px", paddingBottom: "40px" }}>
      <div style={{ ...card, maxWidth: "500px" }} className="pop">

        {/* 아이 결과 */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "120px", height: "120px", borderRadius: "50%", background: char.bg,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "68px",
            margin: "0 auto 16px", boxShadow: `0 12px 32px ${char.color}30`,
          }} className="emoji-bounce">{char.emoji}</div>
          <span style={{
            display: "inline-block", padding: "5px 14px", borderRadius: "20px",
            background: char.bg, color: char.color, fontSize: "14px", fontWeight: "800",
            marginBottom: "10px", letterSpacing: "2px",
          }}>{result}</span>
          <h2 style={{ fontSize: "30px", color: char.color, margin: "0 0 4px" }}>{char.name}형</h2>
          <p style={{ color: "#AAA", fontSize: "15px", margin: "0 0 20px" }}>{char.tag}</p>
          <div style={{ background: char.bg, borderRadius: "20px", padding: "20px 24px", fontSize: "16px", color: "#555", lineHeight: 1.9, whiteSpace: "pre-line" }}>
            {CHILD_DESC[result]}
          </div>
        </div>

        <div style={{ borderTop: "2px dashed #F0F0F0", margin: "20px 0" }} />

        {/* 잠금 */}
        {parentStep === "locked" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔒</div>
            <h3 style={{ fontSize: "18px", color: "#444", margin: "0 0 6px" }}>부모님 전용 가이드</h3>
            <p style={{ color: "#BBB", fontSize: "13px", margin: "0 0 20px", lineHeight: 1.6 }}>우리 아이 훈육법 · 칭찬법<br />학습 스타일 · 친구 관계</p>
            <button onClick={() => setParentStep("slider")} style={{
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
          <div className="slide-up">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>👨‍👩‍👧</div>
              <h3 style={{ fontSize: "20px", color: "#333", margin: "0 0 4px" }}>부모님을 위한 양육 가이드</h3>
              <p style={{ color: "#AAA", fontSize: "13px", margin: 0 }}>{char.name}형 ({result}) 아이와 더 잘 소통하는 법</p>
            </div>
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
                <p style={{ margin: 0, fontSize: "14px", color: "#555", lineHeight: 1.8, fontFamily: '"Nanum Gothic", sans-serif' }}>
                  {pdata[item.key]}
                </p>
              </div>
            ))}
          </div>
        )}

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

  return null;
}
