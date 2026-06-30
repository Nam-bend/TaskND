import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose }) => {
  const { members, addMember, deleteMember, clearAllMembers } = useGame();
  const [name, setName] = useState('');
  const [role, setRole] = useState('Gameplay Engineer');
  const [avatar, setAvatar] = useState('🦊');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMember({ name, role, avatar });
    setName('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">👥 Tổ Đội Coop Phát Triển</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '14px' }}>Danh sách Anh Hùng:</h4>
            {members.map(m => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'var(--paper-card)',
                  border: '2px solid var(--paper-border)',
                  borderRadius: '10px',
                  marginBottom: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{m.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 800 }}>{m.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.role}</div>
                  </div>
                </div>
                <button
                  className="rpg-btn"
                  style={{ padding: '4px 8px', fontSize: '12px', background: '#ffcdd2', color: '#b71c1c' }}
                  onClick={() => {
                    if (window.confirm(`Bạn có chắc muốn xóa thành viên "${m.name}"?`)) {
                      deleteMember(m.id);
                    }
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAdd} style={{ borderTop: '2px dashed var(--paper-border)', paddingTop: '16px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '14px' }}>Thêm Đồng Đội Mới:</h4>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <select
                className="form-select"
                style={{ width: '80px' }}
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
              >
                <option value="🦊">🦊</option>
                <option value="🦁">🦁</option>
                <option value="🐯">🐯</option>
                <option value="🐨">🐨</option>
                <option value="🐵">🐵</option>
                <option value="🐙">🐙</option>
              </select>
              <input
                type="text"
                className="form-input"
                placeholder="Tên thành viên..."
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Chức danh (VD: Audio Specialist)..."
                value={role}
                onChange={e => setRole(e.target.value)}
              />
              <button type="submit" className="rpg-btn primary">
                + Thêm
              </button>
            </div>
          </form>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          {members.length > 0 ? (
            <button
              className="rpg-btn"
              style={{ background: '#ffcdd2', color: '#b71c1c' }}
              onClick={() => {
                if (window.confirm('⚠️ CẢNH BÁO: Bạn có muốn XÓA SẠCH toàn bộ thành viên tổ đội không? Cấu hình Quest sẽ cần phân công lại!')) {
                  clearAllMembers();
                }
              }}
            >
              🗑️ Giải Tán Tổ Đội
            </button>
          ) : <div />}
          <button className="rpg-btn primary" onClick={onClose}>
            💾 Chốt Danh Tính
          </button>
        </div>
      </div>
    </div>
  );
};
