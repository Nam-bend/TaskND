import React from 'react';
import { useGame } from '../context/GameContext';

export const WeekTabs: React.FC = () => {
  const { stages, currentStageId, setCurrentStageId } = useGame();

  return (
    <div className="week-tabs">
      {stages.map(stage => (
        <div
          key={stage.id}
          className={`wave-tab ${currentStageId === stage.id ? 'active' : ''}`}
          onClick={() => setCurrentStageId(stage.id)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>{stage.name}</span>
            {stage.startDate && stage.endDate && (
              <span style={{ fontSize: '0.75em', opacity: 0.8, marginTop: '2px', fontWeight: 'normal' }}>
                {new Date(stage.startDate).toLocaleDateString('vi-VN')} - {new Date(stage.endDate).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
