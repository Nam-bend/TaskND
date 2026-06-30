import React, { useState } from 'react';
import type { Quest, QuestStatus } from '../types/game';
import { QuestCard } from './QuestCard';
import { useGame } from '../context/GameContext';

interface KanbanColumnProps {
  status: QuestStatus;
  title: string;
  icon: string;
  quests: Quest[];
  onEditQuest: (quest: Quest) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, title, icon, quests, onEditQuest }) => {
  const { updateQuestStatus } = useGame();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      updateQuestStatus(id, status);
    }
  };

  return (
    <div className="kanban-column">
      <div className="column-header">
        <div className="column-title">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <div className="column-badge">{quests.length}</div>
      </div>

      <div
        className={`column-dropzone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {quests.map(quest => (
          <QuestCard key={quest.id} quest={quest} onEdit={onEditQuest} />
        ))}
      </div>
    </div>
  );
};
