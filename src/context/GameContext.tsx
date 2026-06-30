import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import confetti from 'canvas-confetti';
import type { Quest, QuestStatus, TeamMember, Stage } from '../types/game';
import { DEFAULT_MEMBERS, DEFAULT_QUESTS, DEFAULT_STAGES } from '../data/defaultData';
import { supabase } from '../supabaseClient';

interface GameContextType {
  quests: Quest[];
  members: TeamMember[];
  stages: Stage[];
  currentStageId: string;
  setCurrentStageId: (id: string) => void;
  partyLevel: number;
  partyExp: number;
  enemyHp: number;
  maxEnemyHp: number;
  attackingHeroIds: string[];
  hitEnemy: boolean;
  isBossCounterAttacking: boolean;
  battleMessage: { text: string; type: 'victory' | 'defeat' | 'info' } | null;
  setBattleMessage: (msg: { text: string; type: 'victory' | 'defeat' | 'info' } | null) => void;
  addQuest: (quest: Omit<Quest, 'id'>) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (id: string) => void;
  updateQuestStatus: (id: string, status: QuestStatus) => void;
  addMember: (member: Omit<TeamMember, 'id'>) => void;
  updateMember: (member: TeamMember) => void;
  deleteMember: (id: string) => void;
  settleWeekBattle: () => void;
  dbStatus: 'connected' | 'offline';
  addStage: (stage: Omit<Stage, 'id'>) => void;
  updateStage: (stage: Stage) => void;
  deleteStage: (id: string) => void;
  clearAllQuests: () => void;
  clearAllMembers: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'coop_quest_rpg_state_v4';

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quests, setQuests] = useState<Quest[]>(DEFAULT_QUESTS);
  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS);
  const [stages, setStages] = useState<Stage[]>(DEFAULT_STAGES);
  const [currentStageId, setCurrentStageId] = useState<string>('w1');

  const [partyLevel, setPartyLevel] = useState<number>(1);
  const [partyExp, setPartyExp] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline'>('offline');

  // Sync state from Supabase on component mount
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const { data, error } = await supabase
          .from('coop_quest_state')
          .select('*')
          .eq('id', 'default')
          .single();

        if (error || !data) {
          throw new Error(error?.message || 'Không tìm thấy dữ liệu.');
        }

        if (Array.isArray(data.quests)) setQuests(data.quests);
        
        // Handle members payload (which might contain stages list nested inside)
        if (data.members) {
          if (Array.isArray(data.members)) {
            setMembers(data.members);
            setStages(DEFAULT_STAGES);
            setCurrentStageId('w1');
          } else {
            if (Array.isArray(data.members.list)) setMembers(data.members.list);
            if (Array.isArray(data.members.stages)) setStages(data.members.stages);
            if (typeof data.members.currentStageId === 'string') {
              setCurrentStageId(data.members.currentStageId);
            }
          }
        }

        if (typeof data.party_level === 'number') setPartyLevel(data.party_level);
        if (typeof data.party_exp === 'number') setPartyExp(data.party_exp);
        setDbStatus('connected');
        console.log('✅ Dữ liệu được đồng bộ thành công từ Supabase!');
      } catch (sbError) {
        setDbStatus('offline');
        console.warn('⚠️ Lỗi Supabase (đang chạy Offline):', sbError);

        // Fallback to localStorage if offline
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed.quests)) setQuests(parsed.quests);
            if (Array.isArray(parsed.members)) setMembers(parsed.members);
            if (Array.isArray(parsed.stages)) setStages(parsed.stages);
            if (parsed.currentStageId) setCurrentStageId(parsed.currentStageId);
            if (typeof parsed.partyLevel === 'number') setPartyLevel(parsed.partyLevel);
            if (typeof parsed.partyExp === 'number') setPartyExp(parsed.partyExp);
            console.log('📦 Đã khôi phục dữ liệu từ bộ nhớ LocalStorage!');
          } catch (e) {
            console.error('Không thể phục hồi cache LocalStorage:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialState();
  }, []);

  // Global click event listener for play click sound on all button clicks
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('.rpg-btn') ||
        target.closest('.wave-tab') ||
        target.closest('.role-chip') ||
        target.closest('.modal-close') ||
        target.closest('.btn-card-action') ||
        target.closest('button') ||
        target.tagName === 'BUTTON'
      ) {
        playSound('click');
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const [attackingHeroIds, setAttackingHeroIds] = useState<string[]>([]);
  const [hitEnemy, setHitEnemy] = useState<boolean>(false);
  const [isBossCounterAttacking, setIsBossCounterAttacking] = useState<boolean>(false);
  const [battleMessage, setBattleMessage] = useState<{ text: string; type: 'victory' | 'defeat' | 'info' } | null>(null);

  // Calculate Boss HP based on uncompleted tasks in current stage
  const currentStage = stages.find(s => s.id === currentStageId) || stages[0] || DEFAULT_STAGES[0];
  const currentWeekQuests = quests.filter(q => q.stageId === currentStageId);
  const uncompletedQuests = currentWeekQuests.filter(q => q.status !== 'done');
  
  const totalRemainingDmg = uncompletedQuests.reduce((sum, q) => sum + q.dmg, 0);
  const maxEnemyHp = currentStage?.enemyMaxHp || 100;
  const enemyHp = Math.min(maxEnemyHp, totalRemainingDmg);

  // Save state whenever data changes (skip during initial loading phase)
  useEffect(() => {
    if (loading) return;

    // Cache in local storage first
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      quests,
      members,
      stages,
      currentStageId,
      partyLevel,
      partyExp
    }));

    // Pack members, stages, and currentStageId into one JSONB field to avoid DB schema migrations
    const membersPayload = {
      list: members,
      stages: stages,
      currentStageId: currentStageId
    };

    // Sync to Supabase Cloud exclusively
    const syncToSupabase = async () => {
      try {
        const { error } = await supabase
          .from('coop_quest_state')
          .upsert({
            id: 'default',
            quests,
            members: membersPayload,
            party_level: partyLevel,
            party_exp: partyExp,
            updated_at: new Date().toISOString()
          });
        if (error) {
          console.warn('Lưu vào Supabase thất bại:', error.message);
        }
      } catch (err) {
        console.error('Không thể đồng bộ dữ liệu đám mây Supabase:', err);
      }
    };
    syncToSupabase();
  }, [quests, members, stages, currentStageId, partyLevel, partyExp, loading]);

  // Sound play helper
  const playSound = (type: 'attack' | 'hit' | 'victory' | 'defeat' | 'click') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'attack') {
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else if (type === 'victory') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } else if (type === 'defeat') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } else if (type === 'click') {
        // Soft bubble pop / mechanical wood tap sound (satisfying & gentle)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.03);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
      }
    } catch (e) {}
  };

  // Quest status update with delayed attack synchronization
  const updateQuestStatus = (id: string, status: QuestStatus) => {
    const target = quests.find(q => q.id === id);
    if (!target) return;

    if (status === 'done' && target.status !== 'done') {
      // 1. Trigger hero lunge animation & sound first
      playSound('attack');
      setAttackingHeroIds(target.assignees || []);

      // 2. Delay actual state update until hero strikes the enemy (400ms)
      setTimeout(() => {
        setAttackingHeroIds([]);
        setHitEnemy(true);
        playSound('hit');

        // Update Quest state to done
        setQuests(prev => prev.map(q => q.id === id ? { ...q, status: 'done' } : q));

        // Increment Party EXP & handle multiple Level Ups
        setPartyExp(prevExp => {
          let tempExp = prevExp + target.dmg;
          let currentLvl = partyLevel;
          while (tempExp >= currentLvl * 100) {
            tempExp -= currentLvl * 100;
            currentLvl += 1;
          }
          if (currentLvl !== partyLevel) {
            setPartyLevel(currentLvl);
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }
          return tempExp;
        });

        // 3. Clear hit splash effect after 500ms
        setTimeout(() => setHitEnemy(false), 500);
      }, 400);
    } else {
      // Immediate update for todo/doing status transitions
      setQuests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    }
  };

  // Quest management
  const addQuest = (newQ: Omit<Quest, 'id'>) => {
    const id = 'q_' + Date.now();
    setQuests(prev => [...prev, { ...newQ, id }]);
  };

  const updateQuest = (updatedQ: Quest) => {
    setQuests(prev => prev.map(q => q.id === updatedQ.id ? updatedQ : q));
  };

  const deleteQuest = (id: string) => {
    setQuests(prev => prev.filter(q => q.id !== id));
  };

  // Team member management
  const addMember = (newM: Omit<TeamMember, 'id'>) => {
    const id = 'p_' + Date.now();
    setMembers(prev => [...prev, { ...newM, id }]);
  };

  const updateMember = (updatedM: TeamMember) => {
    setMembers(prev => prev.map(m => m.id === updatedM.id ? updatedM : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    // Clean up deleted member ID from all quest assignees arrays safely
    setQuests(prevQuests =>
      prevQuests.map(q => ({
        ...q,
        assignees: (q.assignees || []).filter(memberId => memberId !== id)
      }))
    );
  };

  // Stage/week management
  const addStage = (newS: Omit<Stage, 'id'>) => {
    const id = 's_' + Date.now();
    setStages(prev => [...prev, { ...newS, id }]);
  };

  const updateStage = (updatedS: Stage) => {
    setStages(prev => prev.map(s => s.id === updatedS.id ? updatedS : s));
  };

  const deleteStage = (id: string) => {
    // Delete all quests in the deleted stage
    setQuests(prev => prev.filter(q => q.stageId !== id));
    setStages(prev => {
      const nextStages = prev.filter(s => s.id !== id);
      // Switch active stage if we deleted the current one
      if (currentStageId === id) {
        setCurrentStageId(nextStages[0]?.id || '');
      }
      return nextStages;
    });
  };

  // Bulk actions
  const clearAllQuests = () => {
    setQuests([]);
  };

  const clearAllMembers = () => {
    setMembers([]);
  };

  // Quyết Đấu / Settle Stage Battle
  const settleWeekBattle = () => {
    if (enemyHp <= 0 || uncompletedQuests.length === 0) {
      playSound('victory');
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      
      // Exp rewards
      setPartyExp(prev => {
        const next = prev + 50;
        if (next >= partyLevel * 100) {
          setPartyLevel(l => l + 1);
          return next - partyLevel * 100;
        }
        return next;
      });

      setBattleMessage({
        text: `🎉 CHIẾN THẮNG! Giai đoạn "${currentStage?.name}" đã hoàn thành xuất sắc! Quái vật "${currentStage?.enemyName}" bị tiêu diệt! Nhận 50 EXP tổ đội.`,
        type: 'victory'
      });
    } else {
      playSound('defeat');
      setIsBossCounterAttacking(true);
      setTimeout(() => setIsBossCounterAttacking(false), 800);
      setBattleMessage({
        text: `💀 THẤT BẠI! Quái vật ${currentStage?.enemyName} phản công dữ dội! Vẫn còn ${uncompletedQuests.length} nhiệm vụ chưa hoàn thiện trong tuần. Hoàn tất toàn bộ task để chiến thắng!`,
        type: 'defeat'
      });
    }
  };

  return (
    <GameContext.Provider
      value={{
        quests,
        members,
        stages,
        currentStageId,
        setCurrentStageId,
        partyLevel,
        partyExp,
        enemyHp,
        maxEnemyHp,
        attackingHeroIds,
        hitEnemy,
        isBossCounterAttacking,
        battleMessage,
        setBattleMessage,
        addQuest,
        updateQuest,
        deleteQuest,
        updateQuestStatus,
        addMember,
        updateMember,
        deleteMember,
        settleWeekBattle,
        dbStatus,
        addStage,
        updateStage,
        deleteStage,
        clearAllQuests,
        clearAllMembers
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
