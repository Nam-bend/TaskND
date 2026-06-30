import React, { useState, useEffect } from 'react';
import type { Quest, QuestRole } from '../../types/game';
import { useGame } from '../../context/GameContext';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingQuest: Quest | null;
}

const QUEST_ICONS = ['💻', '🎨', '🎵', '🐛', '🚀', '🎮', '🌐', '⚔️', '📜', '🔧', '🛡️', '💡'];

export const QuestModal: React.FC<QuestModalProps> = ({ isOpen, onClose, editingQuest }) => {
  const { currentStageId, stages, members, addQuest, updateQuest, deleteQuest } = useGame();

  const [stageId, setStageId] = useState<string>('w1');
  const [role, setRole] = useState<QuestRole>('gameplay');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dmg, setDmg] = useState(25);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [icon, setIcon] = useState<string>('💻');

  useEffect(() => {
    if (editingQuest) {
      setStageId(editingQuest.stageId);
      setRole(editingQuest.role);
      setTitle(editingQuest.title);
      setDesc(editingQuest.desc);
      setDmg(editingQuest.dmg);
      setAssignees(editingQuest.assignees || []);
      setIcon(editingQuest.icon || '💻');
    } else {
      setStageId(currentStageId);
      setRole('gameplay');
      setTitle('');
      setDesc('');
      setDmg(25);
      setAssignees(members[0] ? [members[0].id] : []);
      setIcon('💻');
    }
  }, [editingQuest, currentStageId, members, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stages.length === 0) {
      alert('Vui lòng tạo ít nhất một giai đoạn (sprint/tuần) trong phần "Cấu Hình Giai Đoạn" trước khi thêm Quest!');
      return;
    }
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề nhiệm vụ!');
      return;
    }
    if (members.length === 0) {
      alert('Vui lòng tạo ít nhất một anh hùng trong phần "Tổ Đội Coop" trước khi thêm Quest!');
      return;
    }
    if (assignees.length === 0) {
      alert('Vui lòng phân công cho ít nhất một anh hùng!');
      return;
    }

    if (editingQuest) {
      updateQuest({
        ...editingQuest,
        stageId,
        role,
        title,
        desc,
        dmg: Number(dmg),
        assignees,
        icon
      });
    } else {
      addQuest({
        stageId,
        role,
        title,
        desc,
        dmg: Number(dmg),
        status: 'todo',
        assignees,
        icon
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (editingQuest && window.confirm('Bạn có chắc muốn xóa Quest này không?')) {
      deleteQuest(editingQuest.id);
      onClose();
    }
  };

  const toggleAssignee = (memberId: string) => {
    if (assignees.includes(memberId)) {
      setAssignees(prev => prev.filter(id => id !== memberId));
    } else {
      setAssignees(prev => [...prev, memberId]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{editingQuest ? '✏️ Sửa Lời Nguyền (Quest)' : '📜 Nhận Nhiệm Vụ Mới'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Thuộc Giai Đoạn:</label>
                <select className="form-select" value={stageId} onChange={e => setStageId(e.target.value)}>
                  {stages.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phân Loại Chuyên Môn:</label>
                <select className="form-select" value={role} onChange={e => setRole(e.target.value as QuestRole)}>
                  <option value="gameplay">🎮 Gameplay (Thao tác, Map, UI)</option>
                  <option value="network">🌐 Network / Sync (RPC, Netcode)</option>
                  <option value="both">⚔️ Cả Hai / Fullstack (Tích hợp chung)</option>
                </select>
              </div>
            </div>

            {/* Task Icon Selector */}
            <div className="form-group">
              <label className="form-label">Chọn Icon đại diện Nhiệm vụ:</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {QUEST_ICONS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    style={{
                      fontSize: '20px',
                      padding: '8px',
                      borderRadius: '8px',
                      border: icon === emoji ? '3px solid var(--gold-yellow)' : '2px solid var(--paper-border)',
                      background: icon === emoji ? '#ffe082' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.1s'
                    }}
                    onClick={() => setIcon(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tên Nhiệm Vụ:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nhập tên nhiệm vụ..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô Tả Chi Tiết:</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Nhập chi tiết yêu cầu công việc..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
              <div className="form-group">
                <label className="form-label">Sát Thương (HP Quái):</label>
                <input
                  type="number"
                  className="form-input"
                  min={5}
                  max={500}
                  step={5}
                  value={dmg}
                  onChange={e => setDmg(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Giao Cho Anh Hùng (Chọn nhiều):</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {members.map(m => {
                    const isSelected = assignees.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        className={`role-chip ${isSelected ? 'active' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                        onClick={() => toggleAssignee(m.id)}
                      >
                        <span>{m.avatar}</span>
                        <span>{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {editingQuest && (
              <button
                type="button"
                className="rpg-btn"
                style={{ background: '#ffcdd2', color: '#b71c1c' }}
                onClick={handleDelete}
              >
                🗑️ Xóa Quest
              </button>
            )}
            <button type="button" className="rpg-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="rpg-btn primary">
              💾 Lưu & Trang Bị
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
