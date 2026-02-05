import * as blessed from 'blessed';

export type MenuOption = 'start' | 'highscore' | 'quit';

export class Menu {
  screen: blessed.Widgets.Screen;
  box: blessed.Widgets.BoxElement;
  list: blessed.Widgets.ListElement;
  onSelect: ((option: MenuOption) => void) | null = null;

  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Block Break CLI - Menu',
    });

    this.box = blessed.box({
      top: 'center',
      left: 'center',
      width: 40,
      height: 15,
      border: {
        type: 'line',
      },
      style: {
        border: {
          fg: 'cyan',
        },
      },
    });

    const title = blessed.text({
      top: 1,
      left: 'center',
      content: '{bold}{cyan-fg}BLOCK BREAK CLI{/cyan-fg}{/bold}',
      tags: true,
    });

    const subtitle = blessed.text({
      top: 3,
      left: 'center',
      content: '{yellow-fg}Terminal Breakout Game{/yellow-fg}',
      tags: true,
    });

    this.list = blessed.list({
      top: 6,
      left: 'center',
      width: 20,
      height: 5,
      items: ['  Start Game  ', '  High Scores  ', '  Quit  '],
      keys: true,
      vi: true,
      mouse: true,
      style: {
        selected: {
          bg: 'cyan',
          fg: 'black',
          bold: true,
        },
        item: {
          fg: 'white',
        },
      },
    });

    this.box.append(title);
    this.box.append(subtitle);
    this.box.append(this.list);
    this.screen.append(this.box);

    this.list.on('select', (_item, index) => {
      const options: MenuOption[] = ['start', 'highscore', 'quit'];
      if (this.onSelect) {
        this.onSelect(options[index]);
      }
    });

    this.screen.key(['q', 'C-c'], () => {
      if (this.onSelect) {
        this.onSelect('quit');
      }
    });

    this.list.focus();
  }

  show(callback: (option: MenuOption) => void): void {
    this.onSelect = callback;
    this.screen.render();
  }

  destroy(): void {
    this.screen.destroy();
  }
}
