import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import type { Quest } from '../types/game';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  onEditQuest: (quest: Quest) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEditQuest }) => {
  const { quests, members, currentStageId, clearAllQuests } = useGame();
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter quests for current week and criteria
  const filteredQuests = quests.filter(q => {
    if (q.stageId !== currentStageId) return false;
    if (roleFilter !== 'all' && q.role !== roleFilter) return false;
    if (assigneeFilter !== 'all' && !q.assignees?.includes(assigneeFilter)) return false;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchDesc = q.desc.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const todoQuests = filteredQuests.filter(q => q.status === 'todo');
  const doingQuests = filteredQuests.filter(q => q.status === 'doing');
  const doneQuests = filteredQuests.filter(q => q.status === 'done');

  return (
    <div>
      {/* FILTER & SEARCH BAR */}
      <div className="controls-bar">
        <div className="filter-group">
          <span className="filter-label">🎭 Vai trò:</span>
          <button
            className={`role-chip ${roleFilter === 'all' ? 'active' : ''}`}
            onClick={() => setRoleFilter('all')}
          >
            Tất Cả
          </button>
          <button
            className={`role-chip ${roleFilter === 'gameplay' ? 'active' : ''}`}
            onClick={() => setRoleFilter('gameplay')}
          >
            🎮 Gameplay
          </button>
          <button
            className={`role-chip ${roleFilter === 'network' ? 'active' : ''}`}
            onClick={() => setRoleFilter('network')}
          >
            🌐 Network
          </button>
          <button
            className={`role-chip ${roleFilter === 'both' ? 'active' : ''}`}
            onClick={() => setRoleFilter('both')}
          >
            ⚔️ Cả Hai
          </button>
        </div>

        <div className="filter-group">
          <span className="filter-label">👥 Người làm:</span>
          <button
            className={`role-chip ${assigneeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setAssigneeFilter('all')}
          >
            Tất Cả
          </button>
          {members.map(m => (
            <button
              key={m.id}
              className={`role-chip ${assigneeFilter === m.id ? 'active' : ''}`}
              onClick={() => setAssigneeFilter(m.id)}
            >
              {m.avatar} {m.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm kiếm task..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {quests.length > 0 && (
            <button
              type="button"
              className="rpg-btn"
              style={{
                background: '#ffcdd2',
                color: '#b71c1c',
                padding: '8px 12px',
                fontSize: '12px',
                borderColor: '#ef9a9a'
              }}
              onClick={() => {
                if (window.confirm('⚠️ CẢNH BÁO: Bạn có chắc muốn XÓA SẠCH toàn bộ task không? Hành động này không thể phục hồi!')) {
                  clearAllQuests();
                }
              }}
            >
              🗑️ Xóa Sạch Task
            </button>
          )}
        </div>
      </div>

      {/* 3 COLUMNS */}
      <div className="kanban-board">
        <KanbanColumn
          status="todo"
          title="CHỜ ĐÁNH (TODO)"
          icon="📜"
          quests={todoQuests}
          onEditQuest={onEditQuest}
        />
        <KanbanColumn
          status="doing"
          title="ĐANG THI TRIỂN (DOING)"
          icon="⚔️"
          quests={doingQuests}
          onEditQuest={onEditQuest}
        />
        <KanbanColumn
          status="done"
          title="ĐÃ CHÉM XONG (DONE)"
          icon="🏆"
          quests={doneQuests}
          onEditQuest={onEditQuest}
        />
      </div>
    </div>
  );
};
