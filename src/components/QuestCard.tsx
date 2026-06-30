import React, { useState } from 'react';
import type { Quest } from '../types/game';
import { useGame } from '../context/GameContext';

interface QuestCardProps {
  quest: Quest;
  onEdit: (quest: Quest) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onEdit }) => {
  const { members, updateQuestStatus } = useGame();
  const [isDragging, setIsDragging] = useState(false);

  // Find all assigned team members
  const assignedMembers = members.filter(m => quest.assignees?.includes(m.id));

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', quest.id);
    // Delay setting isDragging state to allow browser to capture clear drag ghost image
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const roleText = 
    quest.role === 'gameplay' ? '🎮 Gameplay' :
    quest.role === 'network' ? '🌐 Network' : '⚔️ Cả hai';

  return (
    <div
      className={`quest-card ${quest.status === 'done' ? 'is-done' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onEdit(quest)}
    >
      <div className="card-top-tags">
        <span className={`role-badge ${quest.role}`}>{roleText}</span>
        <span className="dmg-badge">⚔️ {quest.dmg} DMG</span>
      </div>

      <div className="card-title" style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>{quest.icon || '📜'}</span>
        <span>{quest.title}</span>
      </div>
      <div className="card-desc">{quest.desc}</div>

      <div className="card-footer">
        {/* Render multiple assignees with names */}
        <div className="assignees-container">
          {assignedMembers.length > 0 ? (
            <div className="assignee-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}>
              {assignedMembers.slice(0, 2).map((m, idx) => (
                <React.Fragment key={m.id}>
                  {idx > 0 && <span style={{ color: 'var(--text-muted)' }}>, </span>}
                  <span className="assignee-avatar">{m.avatar}</span>
                  <span className="assignee-name" style={{ fontWeight: 700 }}>{(m.name || '').split(' ')[0] || ''}</span>
                </React.Fragment>
              ))}
              {assignedMembers.length > 2 && <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>, ...</span>}
            </div>
          ) : (
            <div className="assignee-badge" style={{ padding: '4px 8px' }}>
              <span className="assignee-avatar">👤</span>
              <span style={{ fontSize: '11px', marginLeft: '4px', fontWeight: 700 }}>Chưa giao</span>
            </div>
          )}
        </div>

        {quest.status !== 'done' ? (
          <button
            className="btn-card-action"
            onClick={(e) => {
              e.stopPropagation();
              updateQuestStatus(quest.id, 'done');
            }}
          >
            ✅ Xong!
          </button>
        ) : (
          <span style={{ color: '#2e7d32', fontWeight: 800, fontSize: '12px' }}>✨ Đã Xong</span>
        )}
      </div>
    </div>
  );
};
