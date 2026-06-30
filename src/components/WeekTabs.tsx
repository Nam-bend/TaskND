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
          {stage.name}
        </div>
      ))}
    </div>
  );
};
