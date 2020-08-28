// const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);

/* eslint-disable no-control-regex */
// this is a modified version of https://github.com/chalk/ansi-regex (MIT License)
const ANSI_REGEX = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g;

let colors = {
  ansiRegex: ANSI_REGEX,
  enabled: true,
  visible: true,
  styles: {},
  keys: {},
  style(input, stack) {
    if (input === '' || input == null) return '';
    if (this.enabled === false) return input;
    if (this.visible === false) return '';

    let str = '' + input;
    let nl = str.includes('\n');
    let n = stack.length;

    if (n > 0 && stack.includes('unstyle')) {
      stack = [...new Set(['unstyle', ...stack])].reverse();
    }

    while (n-- > 0) str = wrap(this.styles[stack[n]], str, nl);

    return str;
  },
  define(name: string, codes: Array<number>, type: string) {
    this.styles[name] = ansi({ name, codes });

    let keys = this.keys[type] || (this.keys[type] = []);
    let colors = this;

    keys.push(name);

    Reflect.defineProperty(colors, name, {
      configurable: true,
      enumerable: true,
      set(value) {
        colors.alias(name, value);
      },
      get() {
        let color = (input) => this.style(input, color.stack);

        Reflect.setPrototypeOf(color, colors);

        color.stack = this.stack ? this.stack.concat(name) : [name];

        return color;
      },
    });
  },
  hasColor(str: string) {
    this.ansiRegex.lastIndex = 0;

    return typeof str === 'string' && str !== '' && this.ansiRegex.test(str);
  },
  hasAnsi(str: string) {
    return this.hasColor(str);
  },
  hasColor(str: string) {
    this.ansiRegex.lastIndex = 0;

    return typeof str === 'string' && str !== '' && this.ansiRegex.test(str);
  },
  hasAnsi(str: string) {
    return this.hasColor(str);
  },
  alias(name, color: any) {
    // this could be a redundant function
    // NOTE: color is string or function
    let fn = typeof color === 'string' ? this[color] : color;

    if (typeof fn !== 'function') {
      throw new TypeError(
        'Expected alias to be the name of an existing color (string) or a function'
      );
    }

    if (!fn.stack) {
      Reflect.defineProperty(fn, 'name', { value: name });

      this.styles[name] = fn;

      fn.stack = [name];
    }

    Reflect.defineProperty(this, name, {
      configurable: true,
      enumerable: true,
      set(value) {
        this.alias(name, value);
      },
      get() {
        let color = (input) => style(input, color.stack);
        Reflect.setPrototypeOf(color, this);

        color.stack = this.stack ? this.stack.concat(fn.stack) : fn.stack;

        return color;
      },
    });
  },
  theme(custom: object) {
    if (!isObject(custom)) throw new TypeError('Expected theme to be an object');

    for (let name of Object.keys(custom)) {
      colors.alias(name, custom[name]);
    }

    return colors;
  },
  unstyle(str: string) {
    if (typeof str === 'string' && str !== '') {
      this.ansiRegex.lastIndex = 0;

      return str.replace(this.ansiRegex, '');
    }

    return '';
  },
  stripColor(str: string) {
    return this.unstyle(str);
  },
  noop(str: string): string {
    return str;
  },
  none(str: string): string {
    return this.noop(str);
  },
  clear(str: string): string {
    return this.noop(str);
  },
  //   colors.symbols = require('./symbols');
};

colors.define('reset', [0, 0], 'modifier');
colors.define('bold', [1, 22], 'modifier');
colors.define('dim', [2, 22], 'modifier');
colors.define('italic', [3, 23], 'modifier');
colors.define('underline', [4, 24], 'modifier');
colors.define('inverse', [7, 27], 'modifier');
colors.define('hidden', [8, 28], 'modifier');
colors.define('strikethrough', [9, 29], 'modifier');

colors.define('black', [30, 39], 'color');
colors.define('red', [31, 39], 'color');
colors.define('green', [32, 39], 'color');
colors.define('yellow', [33, 39], 'color');
colors.define('blue', [34, 39], 'color');
colors.define('magenta', [35, 39], 'color');
colors.define('cyan', [36, 39], 'color');
colors.define('white', [37, 39], 'color');
colors.define('gray', [90, 39], 'color');
colors.define('grey', [90, 39], 'color');

colors.define('bgBlack', [40, 49], 'bg');
colors.define('bgRed', [41, 49], 'bg');
colors.define('bgGreen', [42, 49], 'bg');
colors.define('bgYellow', [43, 49], 'bg');
colors.define('bgBlue', [44, 49], 'bg');
colors.define('bgMagenta', [45, 49], 'bg');
colors.define('bgCyan', [46, 49], 'bg');
colors.define('bgWhite', [47, 49], 'bg');

colors.define('blackBright', [90, 39], 'bright');
colors.define('redBright', [91, 39], 'bright');
colors.define('greenBright', [92, 39], 'bright');
colors.define('yellowBright', [93, 39], 'bright');
colors.define('blueBright', [94, 39], 'bright');
colors.define('magentaBright', [95, 39], 'bright');
colors.define('cyanBright', [96, 39], 'bright');
colors.define('whiteBright', [97, 39], 'bright');

colors.define('bgBlackBright', [100, 49], 'bgBright');
colors.define('bgRedBright', [101, 49], 'bgBright');
colors.define('bgGreenBright', [102, 49], 'bgBright');
colors.define('bgYellowBright', [103, 49], 'bgBright');
colors.define('bgBlueBright', [104, 49], 'bgBright');
colors.define('bgMagentaBright', [105, 49], 'bgBright');
colors.define('bgCyanBright', [106, 49], 'bgBright');
colors.define('bgWhiteBright', [107, 49], 'bgBright');

export default colors;

function ansi(style: object): object {
  let open = (style.open = `\u001b[${style.codes[0]}m`);
  let close = (style.close = `\u001b[${style.codes[1]}m`);
  let regex = (style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, 'g'));

  style.wrap = (input, newline) => {
    if (input.includes(close)) {
      input = input.replace(regex, close + open);
    }

    let output = open + input + close;
    // see https://github.com/chalk/chalk/pull/92, thanks to the
    // chalk contributors for this fix. However, we've confirmed that
    // this issue is also present in Windows terminals
    return newline ? output.replace(/\r*\n/g, `${close}$&${open}`) : output;
  };

  return style;
}

function wrap(style, input, newline) {
  return typeof style === 'function' ? colors.style(input) : style.wrap(input, newline);
}
