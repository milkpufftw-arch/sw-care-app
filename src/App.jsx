import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, Battery, Shield, CloudRain, Sun, Zap, Coffee, Wind, Anchor, 
  Sparkles, X, RefreshCw, BookOpen, User, History, Search, 
  LogOut, Smile, Frown, Meh, AlertCircle, Feather, Mountain, 
  Trees, Cloud, PenTool, LayoutDashboard, Plus, Trash2, Copy, Check
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// --- Firebase SDK 引入 ---
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, collection, addDoc, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, onAuthStateChanged 
} from 'firebase/auth';

// ==========================================
// 🔑 您的 Firebase 設定
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAmwYU6D3MR0LK4BR8otdMZZssj_AgvXJM",
  authDomain: "social-worker-care.firebaseapp.com",
  projectId: "social-worker-care",
  storageBucket: "social-worker-care.firebasestorage.app",
  messagingSenderId: "426152157988",
  appId: "1:426152157988:web:e4daceae1b985bf4bec9b1",
  measurementId: "G-WM02V9WGVR"
};

// --- 初始化 Firebase ---
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  // 忽略重複初始化錯誤
}
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// 🔥 底圖連結 (已更新)
// ==========================================
const BACKGROUND_IMAGES = {
  forest: "https://i.postimg.cc/k4RkfT7Z/Gemini-Generated-Image-700amr700amr700a.png", 
  watercolor: "https://i.postimg.cc/GpgCMBGr/IMG_7966.jpg",
  zen: "https://i.postimg.cc/m2PTKy8D/IMG_7964.jpg"
};

// --- 資料庫與設定 ---

const THEMES = {
  forest: {
    id: 'forest',
    name: '森林浴',
    desc: '深綠苔蘚與大地，強調穩定。',
    icon: <Trees className="w-5 h-5" />,
    cardImage: BACKGROUND_IMAGES.forest,
    styles: {
      appBg: "bg-[#F3F5F2]", 
      textMain: "text-[#2F3E35]",
      textSub: "text-[#7A8C81]",
      accent: "text-[#C48058]",
      btnPrimary: "bg-[#4A6756] hover:bg-[#385042] text-white rounded-[24px] shadow-lg transition-transform hover:-translate-y-1",
      btnSecondary: "bg-white border border-[#DCE4DC] text-[#4A6756] rounded-[24px] hover:bg-[#E6EBE6]",
      cardBackOverlay: "bg-[#2F3E35]/20 mix-blend-multiply",
      cardBackBorder: "border-[6px] border-white",
      stackColor: "bg-[#5F7D6B]", 
      cardFront: "bg-[#FDFAF6] border-4 border-[#E0E8E0]",
      input: "bg-white border-none rounded-2xl focus:ring-2 focus:ring-[#4A6756] p-4 shadow-sm placeholder-[#7A8C81]/60",
      font: "font-['Zen_Maru_Gothic',_sans-serif]",
      moodBtn: "bg-white/80 border-transparent hover:border-[#4A6756]/30 rounded-2xl shadow-sm",
      chartColor: "#4A6756",
      textColorOnCard: "text-[#2F3E35]",
      actionBox: "bg-[#4A6756]/5"
    }
  },
  watercolor: {
    id: 'watercolor',
    name: '晨曦水彩',
    desc: '夢幻漸層與流動，強調溫柔。',
    icon: <Cloud className="w-5 h-5" />,
    cardImage: BACKGROUND_IMAGES.watercolor,
    styles: {
      appBg: "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50",
      textMain: "text-slate-700",
      textSub: "text-slate-500",
      accent: "text-indigo-500",
      btnPrimary: "bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105",
      btnSecondary: "bg-white/40 backdrop-blur-md border border-white/60 text-indigo-600 rounded-full hover:bg-white/60",
      cardBackOverlay: "bg-white/10",
      cardBackBorder: "border border-white/40",
      stackColor: "bg-indigo-300",
      cardFront: "bg-white border border-indigo-100 shadow-lg",
      input: "bg-white/50 border border-indigo-100 rounded-full focus:ring-2 focus:ring-indigo-300 p-4 placeholder-indigo-300",
      font: "font-['Zen_Maru_Gothic',_sans-serif]",
      moodBtn: "bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white/50 rounded-xl",
      chartColor: "#818cf8",
      textColorOnCard: "text-slate-700",
      actionBox: "bg-indigo-50"
    }
  },
  zen: {
    id: 'zen',
    name: '日系極簡',
    desc: '米白紙張與留白，強調純粹。',
    icon: <BookOpen className="w-5 h-5" />,
    cardImage: BACKGROUND_IMAGES.zen,
    styles: {
      appBg: "bg-[#F5F5F0]",
      textMain: "text-[#292524]",
      textSub: "text-[#78716c]",
      accent: "text-[#ea580c]",
      btnPrimary: "bg-[#292524] hover:bg-[#000000] text-[#F5F5F0] rounded-sm shadow-sm hover:shadow-md tracking-widest uppercase",
      btnSecondary: "bg-transparent border border-[#78716c] text-[#57534e] rounded-sm hover:bg-[#E7E5E4]",
      cardBackOverlay: "bg-[#44403c]/10",
      cardBackBorder: "border-4 border-[#F5F5F0]",
      stackColor: "bg-[#57534e]",
      cardFront: "bg-[#FAFAF9] border border-[#E7E5E4]",
      input: "bg-transparent border-b border-[#78716c] rounded-none focus:border-[#292524] p-4 px-0 placeholder-[#78716c]/50",
      font: "font-['Zen_Maru_Gothic',_sans-serif]",
      moodBtn: "bg-white border border-[#E7E5E4] hover:border-[#78716c] rounded-sm shadow-sm",
      chartColor: "#44403c",
      textColorOnCard: "text-[#292524]",
      actionBox: "bg-[#E7E5E4]/30"
    }
  }
};

const MOODS = [
  { label: "平靜安穩", score: 85, icon: <Feather className="w-5 h-5" /> },
  { label: "充滿能量", score: 90, icon: <Sun className="w-5 h-5" /> },
  { label: "感恩滿足", score: 95, icon: <Heart className="w-5 h-5" /> },
  { label: "清醒專注", score: 80, icon: <Mountain className="w-5 h-5" /> },
  { label: "平淡如水", score: 60, icon: <Meh className="w-5 h-5" /> },
  { label: "有些思緒", score: 55, icon: <Wind className="w-5 h-5" /> },
  { label: "忙碌緊湊", score: 45, icon: <Zap className="w-5 h-5" /> },
  { label: "焦慮緊繃", score: 30, icon: <AlertCircle className="w-5 h-5" /> },
  { label: "疲憊耗竭", score: 20, icon: <Battery className="w-5 h-5" /> },
  { label: "受傷低落", score: 25, icon: <CloudRain className="w-5 h-5" /> },
];

const CARD_DATABASE = [
  { category: "身體覺察", title: "雙腳著地", message: "當思緒飄到遠方時，身體是你唯一的錨。", action: "用力踩踏地板三下，感受腳底與地面的接觸面。" },
  { category: "身體覺察", title: "5-4-3-2-1", message: "用感官找回對當下的控制權。", action: "找出：5樣看到的、4樣摸到的、3樣聽到的、2樣聞到的、1樣嚐到的。" },
  { category: "身體覺察", title: "蝴蝶擁抱", message: "透過雙側刺激，整合混亂的情緒。", action: "雙手交叉抱胸，左右交替輕拍肩膀一分鐘。" },
  { category: "身體覺察", title: "呼吸箱", message: "30秒內讓神經系統降溫。", action: "吸氣4秒，憋氣4秒，吐氣4秒，停頓4秒。" },
  { category: "身體覺察", title: "冷水效應", message: "啟動潛水反射，迅速降低心跳。", action: "去洗手間用冷水潑臉，或沖手腕30秒。" },
  { category: "身體覺察", title: "搖晃練習", message: "像動物一樣甩掉壓力。", action: "站起來，輕輕抖動手腳，想像把身上的水珠甩乾。" },
  { category: "身體覺察", title: "視覺定位", message: "當內在混亂時，外在的結構能帶來安全感。", action: "環顧四周，找出房間裡所有「綠色」的物品。" },
  { category: "身體覺察", title: "推牆運動", message: "釋放體內因壓力而積累的能量。", action: "雙手抵住牆壁，用盡全力推牆10秒，感受肌肉緊繃後放鬆。" },
  { category: "身體覺察", title: "掃描緊繃", message: "我們常不自覺地聳肩或咬牙。", action: "從頭到腳掃描，刻意把肩膀垂下來，鬆開下顎。" },
  { category: "身體覺察", title: "感受支撐", message: "你不需要隨時都撐住自己。", action: "將背完全靠在椅背上，把重量交給椅子。" },
  { category: "情緒調節", title: "情緒命名", message: "說得出來，就能被馴服。", action: "用三個精準形容詞描述現在感受，不只是「不好」。" },
  { category: "情緒調節", title: "允許流淚", message: "眼淚是生理排毒。", action: "找個安全地方，給自己5分鐘盡情流淚。" },
  { category: "情緒調節", title: "情緒衝浪", message: "情緒像海浪，會升起也會落下。", action: "閉眼想像情緒是浪頭，看著它升起、破碎、退去。" },
  { category: "情緒調節", title: "寫下來", message: "大腦的短期記憶有限，寫下來能清出運算空間。", action: "拿廢紙寫下煩心事，然後揉成一團丟掉。" },
  { category: "情緒調節", title: "音樂切換", message: "聽覺直接連結邊緣系統。", action: "播放一首能讓你感到「平靜」或「被理解」的歌。" },
  { category: "情緒調節", title: "暫時封存", message: "現在處理太重了，先打包。", action: "想像把困擾鎖進保險箱，告訴自己「晚點再處理」。" },
  { category: "情緒調節", title: "雨刷練習", message: "當負面念頭遮蔽視線。", action: "想像眼前有雨刷，左右擺動刷掉泥濘。" },
  { category: "情緒調節", title: "嘆氣的藝術", message: "嘆氣是釋放的信號。", action: "深吸一口氣，然後發出聲音長長地嘆出來：「唉——」。" },
  { category: "情緒調節", title: "與情緒對話", message: "創造心理距離。", action: "問心中的焦慮：「親愛的焦慮，你想保護我什麼？」" },
  { category: "情緒調節", title: "觸摸安撫", message: "皮膚的飢渴需要被滿足。", action: "用右手掌心溫柔地摩擦左手手臂，像安撫一個孩子。" },
  { category: "心理界線", title: "光之防護", message: "同理心不是讓對方踩進你的草皮。", action: "想像金光包圍你，負能量會被彈開。" },
  { category: "心理界線", title: "下班儀式", message: "大腦需要切換訊號。", action: "離開時做個「拍灰塵」動作，把工作留門後。" },
  { category: "心理界線", title: "拒絕練習", message: "設限是對自己的慈悲。", action: "練習說：「我現在無法接下，因為我要確保現有個案品質。」" },
  { category: "心理界線", title: "數位排毒", message: "不間斷的訊息讓人維持警戒。", action: "將手機翻面蓋上，或設定15分鐘勿擾模式。" },
  { category: "心理界線", title: "責任歸位", message: "你是協助者，不是拯救者。", action: "默念：「我把個案的命運交還給他自己。」" },
  { category: "心理界線", title: "物理隔離", message: "空間的轉換能帶動心境。", action: "感到窒息時，到走廊或樓梯間待2分鐘。" },
  { category: "心理界線", title: "我是有限的", message: "承認限制不是無能，是專業。", action: "告訴自己：「我只是一個人，今天已經盡力了。」" },
  { category: "心理界線", title: "不急著回應", message: "急迫感通常是焦慮的投射。", action: "試著說：「我收到了，確認行程後回覆你。」" },
  { category: "心理界線", title: "能量盤點", message: "能量帳戶不能只出不進。", action: "如果能量低於3分，拒絕下一個非緊急請求。" },
  { category: "心理界線", title: "脫下戰袍", message: "社工只是外衣。", action: "換衣服時想像真的脫下「社工皮」，變回人類。" },
  { category: "自我慈悲", title: "像對朋友", message: "別對自己說對朋友說不出口的話。", action: "如果好友遭遇你的處境，你會對他說什麼？對自己說。" },
  { category: "自我慈悲", title: "擁抱無力", message: "系統性無力不是你的錯。", action: "手撫胸口：「這真的很難，但我有一顆柔軟的心。」" },
  { category: "自我慈悲", title: "足夠好了", message: "完美主義通往耗竭。", action: "咒語：「Done is better than perfect。」" },
  { category: "自我慈悲", title: "喝水儀式", message: "脫水會增加壓力荷爾蒙。", action: "去倒一杯溫水，慢慢喝下，感受水流過喉嚨。" },
  { category: "自我慈悲", title: "三件好事", message: "訓練大腦看見安全。", action: "回想今天三件小好事（如：好喝的咖啡）。" },
  { category: "自我慈悲", title: "微休息", message: "休息是生存必需。", action: "給自己無所事事的5分鐘，什麼都不要做。" },
  { category: "自我慈悲", title: "感官享受", message: "用愉悅的感官體驗對抗苦澀。", action: "今晚專注感受熱水澡，或穿最舒服的睡衣。" },
  { category: "自我慈悲", title: "接納陰影", message: "負面想法不代表你是壞社工。", action: "告訴自己：「我感到厭煩是正常的，這是我的人性。」" },
  { category: "自我慈悲", title: "給自己的信", message: "未來的你會感謝現在撐住的你。", action: "在備忘錄寫一句鼓勵的話給明天的自己。" },
  { category: "自我慈悲", title: "暫停批判", message: "自我批判會啟動防禦系統。", action: "把「我應該更好」改成「我正在學習如何處理」。" },
  { category: "內在力量", title: "見證者", message: "見證本身就有療癒力。", action: "肯定自己：「因為我在這裡，他沒有獨自面對黑暗。」" },
  { category: "內在力量", title: "尋找韌性", message: "在創傷中也藏著生存智慧。", action: "找出個案的一個強項，並讚嘆生命的韌性。" },
  { category: "內在力量", title: "控制可控", message: "焦慮來自想控制不可控。", action: "畫一個圓，圓內寫你能控制的，專注在圓內。" },
  { category: "內在力量", title: "意義感", message: "知道為何而活，就能忍受任何生活。", action: "回想初衷：當初是什麼讓你決定踏入社工這一行？" },
  { category: "內在力量", title: "轉念練習", message: "詮釋賦予意義。", action: "把「困難」改成「挑戰成長的機會」。" },
  { category: "內在力量", title: "連結資源", message: "別忘了連結資源給自己。", action: "這週約一位能讓你大笑的朋友吃飯。" },
  { category: "內在力量", title: "自然療癒", message: "大自然恢復注意力。", action: "看窗外的樹或天空，尋找綠色與藍色的部分。" },
  { category: "內在力量", title: "創造力", message: "創造力能解凍創傷。", action: "隨手塗鴉或哼歌，做點無生產力但好玩的事。" },
  { category: "內在力量", title: "小勝利", message: "大腦需要多巴胺。", action: "完成一件超小的事（如整理桌面），給自己一個讚。" },
  { category: "內在力量", title: "希望的種子", message: "功不唐捐。", action: "相信你的努力可能多年後才開花，但那沒關係。" },
  { category: "特別提醒", title: "專業求助", message: "醫者也需要醫治。", action: "如果長期耗竭，請考慮預約諮商或督導。" },
  { category: "特別提醒", title: "就是現在", message: "最好的時間點就是現在。", action: "放下手機，閉眼深呼吸一次。" }
];

export default function App() {
  // App State
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [tempNickname, setTempNickname] = useState('');
  const [currentThemeId, setCurrentThemeId] = useState('forest');
  const [screen, setScreen] = useState('login'); 
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Supervisor State
  const [supervisorTeam, setSupervisorTeam] = useState([]);
  const [supervisorTarget, setSupervisorTarget] = useState('');
  const [targetLogs, setTargetLogs] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');

  // 安全獲取 Theme
  const theme = THEMES[currentThemeId] || THEMES['forest'];
  const styles = theme.styles;

  // --- Optimization: Image Preloading ---
  useEffect(() => {
    Object.values(BACKGROUND_IMAGES).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // --- Initialization ---
  useEffect(() => {
    if (!auth) {
      setInitError(true);
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth error", err);
        setInitError(true);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      
      const storedNick = localStorage.getItem('sw_app_nickname');
      const storedTheme = localStorage.getItem('sw_app_theme');
      const storedTeam = localStorage.getItem('sw_supervisor_team');
      
      if (storedTheme && THEMES[storedTheme]) {
        setCurrentThemeId(storedTheme);
      }
      
      if (storedNick) {
        setNickname(storedNick);
        setScreen('welcome');
      }
      
      if (storedTeam) {
        try {
          setSupervisorTeam(JSON.parse(storedTeam));
        } catch(e) {
          setSupervisorTeam([]);
        }
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Logic Functions ---
  const addTeamMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const updatedTeam = [...supervisorTeam, newMemberName.trim()];
    setSupervisorTeam(updatedTeam);
    localStorage.setItem('sw_supervisor_team', JSON.stringify(updatedTeam));
    setNewMemberName('');
  };

  const removeTeamMember = (name) => {
    const updatedTeam = supervisorTeam.filter(m => m !== name);
    setSupervisorTeam(updatedTeam);
    localStorage.setItem('sw_supervisor_team', JSON.stringify(updatedTeam));
    if (supervisorTarget === name) {
      setSupervisorTarget('');
      setTargetLogs([]);
    }
  };

  const selectMember = (name) => {
    setSupervisorTarget(name);
  };

  useEffect(() => {
    if (!user || !supervisorTarget || !db) return;
    
    // 使用 'mood_logs' 路徑
    const q = collection(db, 'mood_logs');
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : new Date()
      }));
      
      const userLogs = allData
        .filter(log => log.nickname === supervisorTarget)
        .sort((a, b) => b.timestamp - a.timestamp);
        
      setTargetLogs(userLogs);
    });
    
    return () => unsubscribe();
  }, [user, supervisorTarget]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!tempNickname.trim()) return;
    setNickname(tempNickname.trim());
    localStorage.setItem('sw_app_nickname', tempNickname.trim());
    setScreen('welcome');
  };

  const handleLogout = () => {
    setNickname('');
    setTempNickname('');
