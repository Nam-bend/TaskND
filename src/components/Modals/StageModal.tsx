import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import type { Stage } from '../../types/game';

interface StageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MONSTER_ICONS = ['🍃', '🍁', '🍂', '🐲', '👻', '👾', '🤖', '🦁', '🐙', '👹', '🐛', '🐸'];

export const StageModal: React.FC<StageModalProps> = ({ isOpen, onClose }) => {
  const { stages, addStage, updateStage, deleteStage } = useGame();
  
  const [newStageName, setNewStageName] = useState('');
  const [newEnemyName, setNewEnemyName] = useState('Quái Vật Mới');
  const [newEnemyHp, setNewEnemyHp] = useState(100);
  const [newEnemyColor, setNewEnemyColor] = useState('#66bb6a');
  const [newEnemyAvatar, setNewEnemyAvatar] = useState('🍃');

  if (!isOpen) return null;

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    addStage({
      name: newStageName,
      enemyName: newEnemyName,
      enemyMaxHp: Number(newEnemyHp),
      enemyColor: newEnemyColor,
      enemyAvatar: newEnemyAvatar
    });

    setNewStageName('');
    setNewEnemyName('Quái Vật Mới');
    setNewEnemyHp(100);
    setNewEnemyColor('#66bb6a');
    setNewEnemyAvatar('🍃');
  };

  const handleFieldChange = (id: string, field: keyof Stage, value: any) => {
    const stage = stages.find(s => s.id === id);
    if (!stage) return;
    updateStage({
      ...stage,
      [field]: value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">⚙️ Cấu Hình Giai Đoạn & Chiến Dịch</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* List of existing stages */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#ffb300' }}>Các giai đoạn đang chạy:</h4>
            
            {stages.map((s, index) => (
              <div
                key={s.id}
                style={{
                  padding: '16px',
                  background: 'var(--paper-card)',
                  border: '2px solid var(--paper-border)',
                  borderRadius: '12px',
                  marginBottom: '14px',
                  position: 'relative'
                }}
              >
                {/* Delete Stage Button */}
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#ffcdd2',
                    color: '#b71c1c',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn xóa giai đoạn này? Tất cả các Quest thuộc giai đoạn này cũng sẽ bị xóa.')) {
                      deleteStage(s.id);
                    }
                  }}
                  title="Xóa giai đoạn này và các Quest bên trong"
                >
                  ✕
                </button>

                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  GIAI ĐOẠN #{index + 1}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Tên giai đoạn (Tab):</label>
                    <input
                      type="text"
                      className="form-input"
                      value={s.name}
                      onChange={e => handleFieldChange(s.id, 'name', e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Tên Boss/Quái vật:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={s.enemyName}
                      onChange={e => handleFieldChange(s.id, 'enemyName', e.target.value)}
                    />
                  </div>
                </div>

                {/* Boss Icon Selector for existing stage */}
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Chọn Icon Quái vật:</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {MONSTER_ICONS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        style={{
                          fontSize: '18px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: s.enemyAvatar === emoji ? '2.5px solid var(--gold-yellow)' : '1.5px solid var(--paper-border)',
                          background: s.enemyAvatar === emoji ? '#ffe082' : '#fff',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleFieldChange(s.id, 'enemyAvatar', emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>HP Cực Đại của Boss:</label>
                    <input
                      type="number"
                      className="form-input"
                      min={10}
                      max={1000}
                      value={s.enemyMaxHp}
                      onChange={e => handleFieldChange(s.id, 'enemyMaxHp', Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Màu sắc quái (Jelly Body):</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={s.enemyColor}
                        onChange={e => handleFieldChange(s.id, 'enemyColor', e.target.value)}
                        style={{ border: 'none', background: 'none', width: '32px', height: '32px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{s.enemyColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form to add a new stage */}
          <form onSubmit={handleAddStage} style={{ borderTop: '2px dashed var(--paper-border)', paddingTop: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#66bb6a' }}>➕ Tạo Giai Đoạn Mới:</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Tên giai đoạn mới:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ví dụ: Tuần 5: Đánh Giá & Phát Hành..."
                  value={newStageName}
                  onChange={e => setNewStageName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Tên quái vật gác cửa:</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEnemyName}
                  onChange={e => setNewEnemyName(e.target.value)}
                />
              </div>
            </div>

            {/* Boss Icon Selector for new stage */}
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Chọn Icon Quái vật mới:</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                {MONSTER_ICONS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    style={{
                      fontSize: '18px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: newEnemyAvatar === emoji ? '2.5px solid var(--gold-yellow)' : '1.5px solid var(--paper-border)',
                      background: newEnemyAvatar === emoji ? '#ffe082' : '#fff',
                      cursor: 'pointer'
                    }}
                    onClick={() => setNewEnemyAvatar(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Máu tối đa của Boss:</label>
                <input
                  type="number"
                  className="form-input"
                  min={10}
                  max={1000}
                  value={newEnemyHp}
                  onChange={e => setNewEnemyHp(Number(e.target.value))}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Màu sắc quái vật (Jelly Body):</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={newEnemyColor}
                    onChange={e => setNewEnemyColor(e.target.value)}
                    style={{ border: 'none', background: 'none', width: '32px', height: '32px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{newEnemyColor}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="rpg-btn primary" style={{ width: '100%' }}>
              + Thêm Giai Đoạn Vào Chiến Dịch
            </button>
          </form>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="rpg-btn primary" onClick={onClose}>
            💾 Hoàn Tất Thiết Lập
          </button>
        </div>
      </div>
    </div>
  );
};
