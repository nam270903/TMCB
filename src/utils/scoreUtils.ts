// src/utils/scoreUtils.ts
export interface PathData {
  id: string;
  fill: string;
}

export interface ScoreResult {
  percentage: number;
  score: number;
  message: string;
}

/** 🎨 Chấm điểm dựa trên số path tô đúng */
export const calculateScoreByPaths = (
  userPaths: PathData[],
  samplePaths: PathData[]
): ScoreResult => {
  if (!userPaths.length || !samplePaths.length) {
    return { percentage: 0, score: 0, message: 'Chưa có dữ liệu để chấm điểm.' };
  }

  let correct = 0;
  let total = samplePaths.length;

  userPaths.forEach((p) => {
    const sample = samplePaths.find((s) => s.id === p.id);
    if (sample && normalizeColor(p.fill) === normalizeColor(sample.fill)) {
      correct++;
    }
  });

  const percentage = (correct / total) * 100;
  const result = getScoreFromPercentage(percentage);

  return { percentage, ...result };
};

/** 🧮 Quy đổi phần trăm đúng thành điểm và câu nhận xét */
const getScoreFromPercentage = (percentage: number) => {
  const table = [
    { min: 0, max: 1, score: 0, message: 'Ôi! Hình có vẻ chưa đúng chút nào rồi. Thử lại xem nào! 💪🎨' },
    { min: 1, max: 20, score: 1, message: 'Mới bắt đầu mà! Đã tô thử rồi đấy, cùng tô lại để đẹp hơn nha! 😊' },
    { min: 20, max: 30, score: 2, message: 'Tốt lắm! Đã đúng một vài chỗ rồi. Cẩn thận hơn chút nữa nhé! ✨' },
    { min: 30, max: 40, score: 3, message: 'Đang tiến bộ rồi đó! Tô thêm vài vùng đúng nữa là đẹp lắm luôn! 💡' },
    { min: 40, max: 50, score: 4, message: 'Gần được nửa bức tranh rồi, rất tốt! Có thể làm tốt hơn nữa đó! 💪🌈' },
    { min: 50, max: 60, score: 5, message: 'Một nửa bức tranh đã đúng! Sắp hoàn hảo rồi, cố lên nhé! 🎉' },
    { min: 60, max: 70, score: 6, message: 'Giỏi quá! Chỉ còn vài vùng cần chỉnh thôi. Cố gắng chút nữa nào! 💫' },
    { min: 70, max: 80, score: 7, message: 'Tuyệt vời! Bức tranh đã gần hoàn chỉnh rồi! 🌟' },
    { min: 80, max: 90, score: 8, message: 'Rất đẹp! Muốn thử làm hoàn hảo luôn không nào? 😍' },
    { min: 90, max: 95, score: 9, message: 'Tuyệt tác gần hoàn thành! Chỉ thiếu một chút xíu nữa thôi! 👑' },
    { min: 95, max: 100, score: 10, message: 'Hoàn hảo! Nghệ sĩ tô màu siêu đỉnh! 10/10 điểm luôn! 🎖🎉' },
  ];

  return table.find((s) => percentage >= s.min && percentage < s.max) || table[table.length - 1];
};

/** 🔹 Chuẩn hóa màu (bỏ khoảng trắng, lowercase) */
const normalizeColor = (color: string) => color.replace(/\s/g, '').toLowerCase();
