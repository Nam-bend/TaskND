import type { Quest, TeamMember, Stage } from '../types/game';

export const DEFAULT_STAGES: Stage[] = [
  { id: 'w1', name: 'Tuần 1: Cài Đặt & Core', enemyName: '🍃 Lá Xanh "Cài Đặt & Core"', enemyMaxHp: 100, enemyColor: '#66bb6a', enemyAvatar: '🍃' },
  { id: 'w2', name: 'Tuần 2: Netcode & Shoot', enemyName: '🍁 Lá Đỏ "Netcode & Shoot"', enemyMaxHp: 120, enemyColor: '#ef5350', enemyAvatar: '🍁' },
  { id: 'w3', name: 'Tuần 3: Lobby & AI Combat', enemyName: '🍂 Lá Vàng "Lobby & AI Combat"', enemyMaxHp: 150, enemyColor: '#ffa726', enemyAvatar: '🍂' },
  { id: 'w4', name: 'Tuần 4: Coop Boss Fight', enemyName: '🐲 Boss Đại Long "Coop Desync"', enemyMaxHp: 200, enemyColor: '#ab47bc', enemyAvatar: '🐲' }
];

export const DEFAULT_MEMBERS: TeamMember[] = [
  { id: 'p1', name: 'Trưởng Nhóm / Coder 1', role: 'Gameplay Engineer', avatar: '🐻' },
  { id: 'p2', name: 'Đồng Đội / Coder 2', role: 'Network / Sync Engineer', avatar: '🐧' }
];

export const DEFAULT_QUESTS: Quest[] = [
  // Tuần 1
  { id: 'q1', stageId: 'w1', role: 'gameplay', title: 'Khởi tạo Project Unity & Thiết lập Map cơ bản', desc: 'Sắp xếp tilemap rừng núi, tạo camera orthographic theo dõi nhân vật.', dmg: 25, status: 'done', assignees: ['p1'], icon: '🗺️' },
  { id: 'q2', stageId: 'w1', role: 'network', title: 'Cài đặt Netcode for GameObjects & Relay', desc: 'Tích hợp gói Unity Transport, cấu hình Lobby cơ bản.', dmg: 25, status: 'done', assignees: ['p2'], icon: '🌐' },
  { id: 'q3', stageId: 'w1', role: 'gameplay', title: 'Script Di chuyển Nhân vật (WASD)', desc: 'CharacterController mượt mà, đồng bộ vị trí qua NetworkTransform.', dmg: 25, status: 'doing', assignees: ['p1'], icon: '🏃' },
  { id: 'q4', stageId: 'w1', role: 'both', title: 'Tạo Hero Prefabs (Gấu & Chim)', desc: 'Gắn Animator, thiết lập state Idle/Run/Attack.', dmg: 25, status: 'todo', assignees: ['p1', 'p2'], icon: '🐻' },

  // Tuần 2
  { id: 'q5', stageId: 'w2', role: 'network', title: 'Cơ chế bắn đạn Client-Side Prediction', desc: 'Spawn đạn lập tức trên Client, xác thực va chạm trên Host.', dmg: 40, status: 'todo', assignees: ['p2'], icon: '🏹' },
  { id: 'q6', stageId: 'w2', role: 'gameplay', title: 'Hệ thống máu (HP) & thanh máu trên đầu Hero', desc: 'UI canvas world-space cập nhật máu theo thời gian thực.', dmg: 40, status: 'todo', assignees: ['p1'], icon: '❤️' },
  { id: 'q7', stageId: 'w2', role: 'network', title: 'RPC Damage & Đồng bộ trạng thái Hit/Death', desc: 'Gọi ServerRpc trừ máu và ClientRpc hiển thị animation trúng đòn.', dmg: 40, status: 'todo', assignees: ['p2'], icon: '💥' },

  // Tuần 3
  { id: 'q8', stageId: 'w3', role: 'gameplay', title: 'AI Enemy đuổi theo người chơi', desc: 'NavMesh hoặc logic tìm mục tiêu gần nhất, có thanh HP cơ bản.', dmg: 50, status: 'todo', assignees: ['p1'], icon: '🤖' },
  { id: 'q9', stageId: 'w3', role: 'both', title: 'Đồng bộ sát thương & Quái chết qua mạng', desc: 'Chỉ Host tính toán sát thương trừ máu quái, broadcast cho clients.', dmg: 50, status: 'todo', assignees: ['p1', 'p2'], icon: '⚔️' },
  { id: 'q10', stageId: 'w3', role: 'network', title: 'Tối ưu hóa băng thông & Interpolation', desc: 'Giảm tick rate gửi gói tin từ 60Hz xuống 20Hz nhưng vẫn mượt.', dmg: 50, status: 'todo', assignees: ['p2'], icon: '🔌' },

  // Tuần 4
  { id: 'q11', stageId: 'w4', role: 'both', title: 'Trận Boss Battle Coop 2 Người Chơi', desc: 'Ghép toàn bộ luồng: di chuyển + bắn + quái boss tung chiêu + revive.', dmg: 100, status: 'todo', assignees: ['p1', 'p2'], icon: '🐉' },
  { id: 'q12', stageId: 'w4', role: 'both', title: 'Kiểm thử mạng trễ (Clumsy / Network Emulation)', desc: 'Giả lập lag 150ms và packet loss 5% để fix lỗi desync nghiêm trọng.', dmg: 100, status: 'todo', assignees: ['p2'], icon: '⚠️' }
];
