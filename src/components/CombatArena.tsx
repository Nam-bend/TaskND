import React from 'react';
import { useGame } from '../context/GameContext';

export const CombatArena: React.FC = () => {
  const {
    currentStageId,
    stages,
    enemyHp,
    maxEnemyHp,
    attackingHeroIds,
    hitEnemy,
    isBossCounterAttacking,
    settleWeekBattle,
    quests,
    members
  } = useGame();

  const currentStage = stages.find(s => s.id === currentStageId) || stages[0];
  const hpPct = Math.max(0, Math.min(100, Math.round((enemyHp / maxEnemyHp) * 100)));

  const currentWeekQuests = quests.filter(q => q.stageId === currentStageId);
  const doneCount = currentWeekQuests.filter(q => q.status === 'done').length;
  const totalCount = currentWeekQuests.length;

  const isDragon = currentStage?.enemyAvatar === '🐲';
  const isLeafMonster = ['🍃', '🍁', '🍂', '🌱'].includes(currentStage?.enemyAvatar || '');

  const renderHeroSvg = (avatar: string) => {
    switch (avatar) {
      case '🐻':
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <ellipse cx="50" cy="90" rx="30" ry="8" fill="rgba(0,0,0,0.3)" />
            <circle cx="50" cy="55" r="32" fill="#8d5524" />
            <circle cx="50" cy="58" r="22" fill="#c68642" />
            <circle cx="25" cy="30" r="12" fill="#8d5524" />
            <circle cx="25" cy="30" r="6" fill="#e0ac69" />
            <circle cx="75" cy="30" r="12" fill="#8d5524" />
            <circle cx="75" cy="30" r="6" fill="#e0ac69" />
            <circle cx="38" cy="48" r="5" fill="#2b1100" />
            <circle cx="37" cy="46" r="2" fill="#fff" />
            <circle cx="62" cy="48" r="5" fill="#2b1100" />
            <circle cx="61" cy="46" r="2" fill="#fff" />
            <ellipse cx="50" cy="60" rx="10" ry="7" fill="#ffe0bd" />
            <circle cx="50" cy="57" r="4" fill="#2b1100" />
            <ellipse cx="18" cy="60" rx="8" ry="14" fill="#8d5524" transform="rotate(20 18 60)" />
            <ellipse cx="82" cy="60" rx="8" ry="14" fill="#8d5524" transform="rotate(-20 82 60)" />
            <rect x="80" y="25" width="6" height="35" fill="#cfd8dc" rx="2" transform="rotate(15 80 25)" />
            <rect x="73" y="55" width="20" height="5" fill="#ffd54f" rx="2" transform="rotate(15 73 55)" />
          </svg>
        );
      case '🐧':
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <ellipse cx="50" cy="90" rx="25" ry="7" fill="rgba(0,0,0,0.3)" />
            <ellipse cx="50" cy="60" rx="26" ry="28" fill="#1e88e5" />
            <ellipse cx="50" cy="65" rx="18" ry="20" fill="#e3f2fd" />
            <circle cx="40" cy="48" r="6" fill="#fff" />
            <circle cx="42" cy="48" r="3" fill="#000" />
            <circle cx="60" cy="48" r="6" fill="#fff" />
            <circle cx="58" cy="48" r="3" fill="#000" />
            <polygon points="50,58 42,52 58,52" fill="#ffb300" />
            <ellipse cx="20" cy="62" rx="6" ry="16" fill="#1565c0" transform="rotate(25 20 62)" />
            <ellipse cx="80" cy="62" rx="6" ry="16" fill="#1565c0" transform="rotate(-25 80 62)" />
            <rect x="82" y="25" width="4" height="45" fill="#6d4c41" rx="2" />
            <circle cx="84" cy="22" r="8" fill="#00e676" />
          </svg>
        );
      case '🦊':
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <ellipse cx="50" cy="90" rx="25" ry="7" fill="rgba(0,0,0,0.3)" />
            <polygon points="25,25 35,50 15,45" fill="#e65100" />
            <polygon points="75,25 65,50 85,45" fill="#e65100" />
            <polygon points="30,30 35,45 22,40" fill="#ffcc80" />
            <polygon points="70,30 65,45 78,40" fill="#ffcc80" />
            <circle cx="50" cy="55" r="28" fill="#e65100" />
            <path d="M 28 65 Q 50 85 72 65" fill="#ffffff" />
            <polygon points="42,70 50,82 58,70" fill="#e65100" />
            <ellipse cx="50" cy="70" rx="7" ry="5" fill="#ffcc80" />
            <circle cx="50" cy="68" r="3.5" fill="#000" />
            <circle cx="38" cy="53" r="4" fill="#000" />
            <circle cx="62" cy="53" r="4" fill="#000" />
            <circle cx="37" cy="51" r="1.5" fill="#fff" />
            <circle cx="61" cy="51" r="1.5" fill="#fff" />
          </svg>
        );
      case '🦁':
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <ellipse cx="50" cy="90" rx="26" ry="7" fill="rgba(0,0,0,0.3)" />
            <circle cx="50" cy="53" r="33" fill="#e65100" />
            <circle cx="50" cy="55" r="25" fill="#ffd54f" />
            <circle cx="30" cy="35" r="8" fill="#e65100" />
            <circle cx="70" cy="35" r="8" fill="#e65100" />
            <ellipse cx="50" cy="65" rx="8" ry="6" fill="#fff" />
            <polygon points="46,60 54,60 50,66" fill="#000" />
            <circle cx="40" cy="48" r="4.5" fill="#3e2723" />
            <circle cx="60" cy="48" r="4.5" fill="#3e2723" />
            <circle cx="38" cy="46" r="1.5" fill="#fff" />
            <circle cx="58" cy="46" r="1.5" fill="#fff" />
          </svg>
        );
      case '🐯':
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <ellipse cx="50" cy="90" rx="25" ry="7" fill="rgba(0,0,0,0.3)" />
            <circle cx="50" cy="55" r="28" fill="#ff9800" />
            <path d="M 22 55 L 35 55" stroke="#212121" strokeWidth="4" strokeLinecap="round" />
            <path d="M 78 55 L 65 55" stroke="#212121" strokeWidth="4" strokeLinecap="round" />
            <path d="M 50 27 L 50 38" stroke="#212121" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="50" cy="66" rx="9" ry="6" fill="#fff" />
            <polygon points="47,61 53,61 50,67" fill="#212121" />
            <circle cx="38" cy="48" r="4" fill="#212121" />
            <circle cx="62" cy="48" r="4" fill="#212121" />
            <circle cx="37" cy="46" r="1.5" fill="#fff" />
            <circle cx="61" cy="46" r="1.5" fill="#fff" />
          </svg>
        );
      case '🐨':
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <ellipse cx="50" cy="90" rx="25" ry="7" fill="rgba(0,0,0,0.3)" />
            <circle cx="26" cy="38" r="15" fill="#b0bec5" />
            <circle cx="26" cy="38" r="9" fill="#eceff1" />
            <circle cx="74" cy="38" r="15" fill="#b0bec5" />
            <circle cx="74" cy="38" r="9" fill="#eceff1" />
            <circle cx="50" cy="55" r="28" fill="#b0bec5" />
            <circle cx="34" cy="66" r="5" fill="#ff8a80" opacity="0.6" />
            <circle cx="66" cy="66" r="5" fill="#ff8a80" opacity="0.6" />
            <ellipse cx="50" cy="60" rx="7" ry="12" fill="#37474f" />
            <circle cx="38" cy="48" r="4" fill="#212121" />
            <circle cx="62" cy="48" r="4" fill="#212121" />
            <circle cx="37" cy="46" r="1.5" fill="#fff" />
            <circle cx="61" cy="46" r="1.5" fill="#fff" />
          </svg>
        );
      case '🐵':
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <ellipse cx="50" cy="90" rx="25" ry="7" fill="rgba(0,0,0,0.3)" />
            <circle cx="22" cy="50" r="10" fill="#8d6e63" />
            <circle cx="22" cy="50" r="5" fill="#d7ccc8" />
            <circle cx="78" cy="50" r="10" fill="#8d6e63" />
            <circle cx="78" cy="50" r="5" fill="#d7ccc8" />
            <circle cx="50" cy="52" r="27" fill="#8d6e63" />
            <path d="M 32 50 Q 50 35 68 50 Q 72 68 50 74 Q 28 68 32 50 Z" fill="#d7ccc8" />
            <ellipse cx="50" cy="61" rx="6" ry="4" fill="#a1887f" />
            <circle cx="50" cy="59" r="2" fill="#212121" />
            <circle cx="42" cy="48" r="3.5" fill="#212121" />
            <circle cx="58" cy="48" r="3.5" fill="#212121" />
            <circle cx="41" cy="46" r="1.2" fill="#fff" />
            <circle cx="57" cy="46" r="1.2" fill="#fff" />
          </svg>
        );
      case '🐙':
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <ellipse cx="50" cy="90" rx="25" ry="7" fill="rgba(0,0,0,0.3)" />
            <ellipse cx="32" cy="80" rx="6" ry="10" fill="#ec407a" />
            <ellipse cx="44" cy="83" rx="6" ry="10" fill="#ec407a" />
            <ellipse cx="56" cy="83" rx="6" ry="10" fill="#ec407a" />
            <ellipse cx="68" cy="80" rx="6" ry="10" fill="#ec407a" />
            <ellipse cx="50" cy="48" rx="28" ry="30" fill="#ec407a" />
            <ellipse cx="50" cy="54" rx="22" ry="22" fill="#f48fb1" opacity="0.3" />
            <circle cx="40" cy="46" r="4.5" fill="#212121" />
            <circle cx="60" cy="46" r="4.5" fill="#212121" />
            <circle cx="38" cy="44" r="1.5" fill="#fff" />
            <circle cx="58" cy="44" r="1.5" fill="#fff" />
            <circle cx="50" cy="58" r="4" fill="#ad1457" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="30" fill="#cfd8dc" />
            <text x="50" y="55" fontSize="20" textAnchor="middle">{avatar}</text>
          </svg>
        );
    }
  };

  return (
    <section className={`game-arena ${isBossCounterAttacking ? 'shake-danger' : ''}`}>
      <div className="clouds" />
      <div className="forest-backdrop" />

      {/* HERO PARTY */}
      <div className="hero-party" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', maxWidth: '65%' }}>
        {members.map(member => (
          <div key={member.id} className="unit-container">
            <div className="unit-name">{member.avatar} {(member.name || '').split(' ')[0] || ''}</div>
            <div className={`unit-sprite ${attackingHeroIds.includes(member.id) ? 'attacking' : ''}`}>
              {renderHeroSvg(member.avatar)}
            </div>
          </div>
        ))}
      </div>

      {/* CENTER ACTION & RULES BANNER */}
      <div className="arena-center-info">
        <div className="rule-banner">
          💡 Mẹo: Hoàn thành 100% Task để tiêu diệt Quái vật! ({doneCount}/{totalCount} Task Done)
        </div>
        <button
          className="rpg-btn settle"
          onClick={settleWeekBattle}
          title="Kiểm tra tiến độ tuần. Nếu 100% Done sẽ thắng, nếu chưa sẽ bị phản công!"
        >
          ⏳ Quyết Đấu / Tổng Kết Tuần
        </button>
      </div>

      {/* ENEMY / BOSS */}
      <div className="enemy-container">
        {enemyHp <= 0 ? (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '38px', animation: 'pulse-icon 1s infinite' }}>🏆✨</div>
            <div style={{ fontWeight: 900, color: '#ffd54f', textShadow: '1px 1px 2px #000' }}>
              QUÁI ĐÃ BỊ TIÊU DIỆT!
            </div>
          </div>
        ) : (
          <div className={`enemy-sprite ${isDragon ? 'boss' : ''} ${hitEnemy ? 'hit' : ''}`}>
            {isDragon ? (
              /* Dragon Boss SVG */
              <svg viewBox="0 0 130 130" width="100%" height="100%">
                <ellipse cx="65" cy="115" rx="40" ry="10" fill="rgba(0,0,0,0.4)" />
                <path d="M 20 50 Q 5 20 40 35 Z" fill="#6a1b9a" />
                <path d="M 110 50 Q 125 20 90 35 Z" fill="#6a1b9a" />
                <path d="M 35 100 Q 20 70 50 45 Q 65 30 80 45 Q 110 70 95 100 Z" fill="#ab47bc" />
                <circle cx="50" cy="60" r="7" fill="#ffeb3b" />
                <circle cx="50" cy="60" r="3" fill="#d50000" />
                <circle cx="80" cy="60" r="7" fill="#ffeb3b" />
                <circle cx="80" cy="60" r="3" fill="#d50000" />
                <polygon points="50,35 45,15 58,30" fill="#ffd54f" />
                <polygon points="80,35 85,15 72,30" fill="#ffd54f" />
                <polygon points="65,32 65,10 70,30" fill="#ffd54f" />
                <path d="M 45 80 Q 65 95 85 80" stroke="#fff" strokeWidth="4" fill="none" />
                <polygon points="52,82 56,92 60,83" fill="#fff" />
                <polygon points="70,83 74,92 78,82" fill="#fff" />
              </svg>
            ) : isLeafMonster ? (
              /* Leaf Monster SVG with customizable color */
              <svg viewBox="0 0 120 120" width="100%" height="100%">
                <ellipse cx="60" cy="105" rx="35" ry="8" fill="rgba(0,0,0,0.3)" />
                <path d="M 60 15 Q 95 30 90 75 Q 60 100 30 75 Q 25 30 60 15 Z" fill={currentStage?.enemyColor || '#66bb6a'} />
                <path d="M 60 25 Q 60 70 60 90" stroke="rgba(255,255,255,0.4)" strokeWidth="4" fill="none" />
                <circle cx="45" cy="55" r="8" fill="#fff" />
                <circle cx="45" cy="55" r="4" fill="#212121" />
                <circle cx="75" cy="55" r="8" fill="#fff" />
                <circle cx="75" cy="55" r="4" fill="#212121" />
                <path d="M 38 43 Q 45 48 52 45" stroke="#1b5e20" strokeWidth="3" fill="none" />
                <path d="M 68 45 Q 75 48 82 43" stroke="#1b5e20" strokeWidth="3" fill="none" />
                <path d="M 48 72 Q 60 62 72 72" stroke="#212121" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
            ) : (
              /* Dynamic Custom Jelly Monster overlaying selected emoji avatar icon! */
              <svg viewBox="0 0 120 120" width="100%" height="100%">
                <ellipse cx="60" cy="105" rx="35" ry="8" fill="rgba(0,0,0,0.3)" />
                {/* Slime body */}
                <path d="M 60 18 Q 96 30 92 82 Q 60 108 28 82 Q 24 30 60 18 Z" fill={currentStage?.enemyColor || '#90a4ae'} />
                {/* Floating Boss Emoji avatar core */}
                <text x="60" y="76" fontSize="40" textAnchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
                  {currentStage?.enemyAvatar}
                </text>
                {/* Slime animated eyes */}
                <circle cx="45" cy="40" r="5" fill="#fff" />
                <circle cx="45" cy="40" r="2.5" fill="#000" />
                <circle cx="75" cy="40" r="5" fill="#fff" />
                <circle cx="75" cy="40" r="2.5" fill="#000" />
                <path d="M 52 48 Q 60 52 68 48" stroke="#37474f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            )}
          </div>
        )}

        <div className="unit-name" style={{ marginTop: '4px', background: '#311b0b' }}>
          {currentStage?.enemyName || 'Quái Vật'}
        </div>
        <div className="enemy-hp-container">
          <div className="enemy-hp-bar">
            <div className="enemy-hp-fill" style={{ width: `${hpPct}%` }} />
          </div>
          <div className="enemy-hp-text">
            {enemyHp} / {maxEnemyHp} HP
          </div>
        </div>
      </div>
    </section>
  );
};
