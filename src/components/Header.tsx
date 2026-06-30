import React from 'react';
import { useGame } from '../context/GameContext';

interface HeaderProps {
  onOpenTeamModal: () => void;
  onOpenQuestModal: () => void;
  onOpenStageModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTeamModal,
  onOpenQuestModal,
  onOpenStageModal
}) => {
  const { partyLevel, partyExp, dbStatus } = useGame();
  const expPercentage = Math.min(100, Math.round((partyExp / (partyLevel * 100)) * 100));

  return (
    <header className="game-header">
      <div className="game-brand">
        <div className="game-logo-icon">⚔️</div>
        <div className="game-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ margin: 0 }}>Coop Quest RPG</h1>
            <span
              className={`db-badge ${dbStatus}`}
              style={{
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '20px',
                background: dbStatus === 'connected' ? '#e8f5e9' : '#ffe0b2',
                color: dbStatus === 'connected' ? '#2e7d32' : '#e65100',
                border: dbStatus === 'connected' ? '1.5px solid #2e7d32' : '1.5px solid #e65100',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textTransform: 'uppercase'
              }}
              title={dbStatus === 'connected' ? 'Đã kết nối dữ liệu Supabase Cloud' : 'Chưa thể kết nối tới Supabase, đang chạy chế độ tạm thời'}
            >
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: dbStatus === 'connected' ? '#2e7d32' : '#e65100',
                display: 'inline-block'
              }} />
              {dbStatus === 'connected' ? 'Supabase' : 'Offline'}
            </span>
          </div>
          <div className="subtitle">Hệ Thống Quản Lý Triển Khai Dự Án Game Hóa</div>
        </div>
      </div>

      <div className="party-progress">
        <div className="level-badge">CẤP ĐỘ {partyLevel}</div>
        <div className="exp-container">
          <div className="exp-label">
            <span>KINH NGHIỆM TỔ ĐỘI</span>
            <span>{partyExp} / {partyLevel * 100} EXP</span>
          </div>
          <div className="exp-bar-bg">
            <div className="exp-bar-fill" style={{ width: `${expPercentage}%` }} />
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button className="rpg-btn" style={{ background: '#cfd8dc', color: '#263238' }} onClick={onOpenStageModal}>
          ⚙️ Cấu Hình Giai Đoạn
        </button>
        <button className="rpg-btn gold" onClick={onOpenTeamModal}>
          👥 Tổ Đội Coop
        </button>
        <button className="rpg-btn primary" onClick={onOpenQuestModal}>
          + Nhận Quest Mới
        </button>
      </div>
    </header>
  );
};
