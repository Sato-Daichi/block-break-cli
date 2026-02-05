import * as blessed from 'blessed';
import { HighScoreEntry } from '../utils/HighScore';

export class ScoreBoard {
  screen: blessed.Widgets.Screen;
  box: blessed.Widgets.BoxElement;
  onClose: (() => void) | null = null;

  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Block Break CLI - High Scores',
    });

    this.box = blessed.box({
      top: 'center',
      left: 'center',
      width: 50,
      height: 18,
      border: {
        type: 'line',
      },
      style: {
        border: {
          fg: 'yellow',
        },
      },
    });

    this.screen.append(this.box);

    this.screen.key(['escape', 'q', 'enter'], () => {
      if (this.onClose) {
        this.onClose();
      }
    });
  }

  show(scores: HighScoreEntry[], callback: () => void): void {
    this.onClose = callback;

    const title = blessed.text({
      top: 1,
      left: 'center',
      content: '{bold}{yellow-fg}HIGH SCORES{/yellow-fg}{/bold}',
      tags: true,
    });

    const divider = blessed.text({
      top: 3,
      left: 'center',
      content: '─'.repeat(40),
      style: {
        fg: 'gray',
      },
    });

    this.box.append(title);
    this.box.append(divider);

    if (scores.length === 0) {
      const noScores = blessed.text({
        top: 6,
        left: 'center',
        content: 'No high scores yet!',
        style: {
          fg: 'gray',
        },
      });
      this.box.append(noScores);
    } else {
      scores.slice(0, 10).forEach((entry, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '{yellow-fg}🥇{/yellow-fg}' : rank === 2 ? '{gray-fg}🥈{/gray-fg}' : rank === 3 ? '{#cd7f32-fg}🥉{/#cd7f32-fg}' : '  ';
        const date = new Date(entry.date).toLocaleDateString();
        const scoreText = blessed.text({
          top: 4 + index,
          left: 2,
          content: `${medal} ${rank.toString().padStart(2, ' ')}. ${entry.score.toString().padStart(6, ' ')} pts  Level ${entry.level}  (${date})`,
          tags: true,
        });
        this.box.append(scoreText);
      });
    }

    const hint = blessed.text({
      top: 15,
      left: 'center',
      content: '{gray-fg}Press [Enter] or [Q] to return{/gray-fg}',
      tags: true,
    });
    this.box.append(hint);

    this.screen.render();
  }

  destroy(): void {
    this.screen.destroy();
  }
}
