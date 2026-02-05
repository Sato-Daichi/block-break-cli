import Conf from 'conf';

export interface HighScoreEntry {
  score: number;
  level: number;
  date: string;
}

interface StoreSchema {
  highScores: HighScoreEntry[];
}

export class HighScoreManager {
  private store: Conf<StoreSchema>;
  private maxEntries: number = 10;

  constructor() {
    this.store = new Conf<StoreSchema>({
      projectName: 'block-break-cli',
      defaults: {
        highScores: [],
      },
    });
  }

  getScores(): HighScoreEntry[] {
    return this.store.get('highScores') || [];
  }

  addScore(score: number, level: number): boolean {
    const scores = this.getScores();
    const newEntry: HighScoreEntry = {
      score,
      level,
      date: new Date().toISOString(),
    };

    scores.push(newEntry);
    scores.sort((a, b) => b.score - a.score);
    const trimmedScores = scores.slice(0, this.maxEntries);
    this.store.set('highScores', trimmedScores);

    return trimmedScores.some(
      (entry) => entry.score === score && entry.date === newEntry.date
    );
  }

  getHighScore(): number {
    const scores = this.getScores();
    return scores.length > 0 ? scores[0].score : 0;
  }

  isHighScore(score: number): boolean {
    const scores = this.getScores();
    if (scores.length < this.maxEntries) return true;
    return score > scores[scores.length - 1].score;
  }

  clearScores(): void {
    this.store.set('highScores', []);
  }
}
