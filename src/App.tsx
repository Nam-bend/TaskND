import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { CombatArena } from './components/CombatArena';
import { WeekTabs } from './components/WeekTabs';
import { KanbanBoard } from './components/KanbanBoard';
import { QuestModal } from './components/Modals/QuestModal';
import { TeamModal } from './components/Modals/TeamModal';
import { StageModal } from './components/Modals/StageModal';
import type { Quest } from './types/game';

const GameContent: React.FC = () => {
  const { battleMessage, setBattleMessage } = useGame();
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  const handleOpenNewQuest = () => {
    setEditingQuest(null);
    setIsQuestModalOpen(true);
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
    setIsQuestModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
        onOpenQuestModal={handleOpenNewQuest}
        onOpenStageModal={() => setIsStageModalOpen(true)}
      />

      <CombatArena />

      <main className="main-content">
        <WeekTabs />
        <KanbanBoard onEditQuest={handleEditQuest} />
      </main>

      {/* MODALS */}
      <QuestModal
        isOpen={isQuestModalOpen}
        onClose={() => setIsQuestModalOpen(false)}
        editingQuest={editingQuest}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />

      <StageModal
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
      />

      {/* BATTLE RESULT NOTIFICATION DIALOG */}
      {battleMessage && (
        <div className="modal-overlay" onClick={() => setBattleMessage(null)}>
          <div
            className="modal-box"
            style={{
              maxWidth: '450px',
              textAlign: 'center',
              borderColor: battleMessage.type === 'victory' ? '#ffd54f' : '#ef5350'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="modal-header"
              style={{
                background: battleMessage.type === 'victory' ? '#438a53' : '#b71c1c',
                justifyContent: 'center'
              }}
            >
              <h3 className="modal-title">
                {battleMessage.type === 'victory' ? '🎉 CHIẾN THẮNG TUẦN!' :
                 battleMessage.type === 'defeat' ? '⚠️ THẤT BẠI QUYẾT ĐẤU!' : '💡 THÔNG BÁO'}
              </h3>
            </div>
            <div className="modal-body" style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.5 }}>
              {battleMessage.text}
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="rpg-btn primary" onClick={() => setBattleMessage(null)}>
                Đã Hiểu / Tiếp Tục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
