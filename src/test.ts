import { assert, assertEquals } from 'https://deno.land/std@0.66.0/testing/asserts.ts';
import colors from './index.ts';

Deno.test('should wrap a string with ansi codes:', () => {
  assertEquals(colors.bgBlack('string'), '\u001b[40mstring\u001b[49m');
  assertEquals(colors.bgBlue('string'), '\u001b[44mstring\u001b[49m');
  assertEquals(colors.bgCyan('string'), '\u001b[46mstring\u001b[49m');
  assertEquals(colors.bgGreen('string'), '\u001b[42mstring\u001b[49m');
  assertEquals(colors.bgMagenta('string'), '\u001b[45mstring\u001b[49m');
  assertEquals(colors.bgRed('string'), '\u001b[41mstring\u001b[49m');
  assertEquals(colors.bgWhite('string'), '\u001b[47mstring\u001b[49m');
  assertEquals(colors.bgYellow('string'), '\u001b[43mstring\u001b[49m');
  assertEquals(colors.black('string'), '\u001b[30mstring\u001b[39m');
  assertEquals(colors.blue('string'), '\u001b[34mstring\u001b[39m');
  assertEquals(colors.bold('string'), '\u001b[1mstring\u001b[22m');
  assertEquals(colors.cyan('string'), '\u001b[36mstring\u001b[39m');
  assertEquals(colors.dim('string'), '\u001b[2mstring\u001b[22m');
  assertEquals(colors.gray('string'), '\u001b[90mstring\u001b[39m');
  assertEquals(colors.green('string'), '\u001b[32mstring\u001b[39m');
  assertEquals(colors.hidden('string'), '\u001b[8mstring\u001b[28m');
  assertEquals(colors.inverse('string'), '\u001b[7mstring\u001b[27m');
  assertEquals(colors.italic('string'), '\u001b[3mstring\u001b[23m');
  assertEquals(colors.magenta('string'), '\u001b[35mstring\u001b[39m');
  assertEquals(colors.red('string'), '\u001b[31mstring\u001b[39m');
  assertEquals(colors.reset('string'), '\u001b[0mstring\u001b[0m');
  assertEquals(colors.strikethrough('string'), '\u001b[9mstring\u001b[29m');
  assertEquals(colors.underline('string'), '\u001b[4mstring\u001b[24m');
  assertEquals(colors.white('string'), '\u001b[37mstring\u001b[39m');
  assertEquals(colors.yellow('string'), '\u001b[33mstring\u001b[39m');
});

Deno.test('should wrap a string with bold ansi codes:', () => {
  assertEquals(colors.black.bold('string'), '\u001b[30m\u001b[1mstring\u001b[22m\u001b[39m');
  assertEquals(colors.blue.bold('string'), '\u001b[34m\u001b[1mstring\u001b[22m\u001b[39m');
  assertEquals(colors.cyan.bold('string'), '\u001b[36m\u001b[1mstring\u001b[22m\u001b[39m');
  assertEquals(colors.dim.bold('string'), '\u001b[2m\u001b[1mstring\u001b[22m\u001b[2m\u001b[22m');
  assertEquals(colors.gray.bold('string'), '\u001b[90m\u001b[1mstring\u001b[22m\u001b[39m');
  assertEquals(colors.green.bold('string'), '\u001b[32m\u001b[1mstring\u001b[22m\u001b[39m');
  assertEquals(colors.magenta.bold('string'), '\u001b[35m\u001b[1mstring\u001b[22m\u001b[39m');
  assertEquals(colors.red.bold('string'), '\u001b[31m\u001b[1mstring\u001b[22m\u001b[39m');
  assertEquals(colors.white.bold('string'), '\u001b[37m\u001b[1mstring\u001b[22m\u001b[39m');
  assertEquals(colors.yellow.bold('string'), '\u001b[33m\u001b[1mstring\u001b[22m\u001b[39m');

  assertEquals(colors.bold.black('string'), '\u001b[1m\u001b[30mstring\u001b[39m\u001b[22m');
  assertEquals(colors.bold.blue('string'), '\u001b[1m\u001b[34mstring\u001b[39m\u001b[22m');
  assertEquals(colors.bold.cyan('string'), '\u001b[1m\u001b[36mstring\u001b[39m\u001b[22m');
  assertEquals(colors.bold.dim('string'), '\u001b[1m\u001b[2mstring\u001b[22m\u001b[1m\u001b[22m');
  assertEquals(colors.bold.gray('string'), '\u001b[1m\u001b[90mstring\u001b[39m\u001b[22m');
  assertEquals(colors.bold.green('string'), '\u001b[1m\u001b[32mstring\u001b[39m\u001b[22m');
  assertEquals(colors.bold.magenta('string'), '\u001b[1m\u001b[35mstring\u001b[39m\u001b[22m');
  assertEquals(colors.bold.red('string'), '\u001b[1m\u001b[31mstring\u001b[39m\u001b[22m');
  assertEquals(colors.bold.white('string'), '\u001b[1m\u001b[37mstring\u001b[39m\u001b[22m');
  assertEquals(colors.bold.yellow('string'), '\u001b[1m\u001b[33mstring\u001b[39m\u001b[22m');
});

Deno.test('chaining | should create a color stack for chained colors', () => {
  let dim = colors.dim;

  assertEquals(dim.stack, ['dim']);
  assertEquals(dim.gray.stack, ['dim', 'gray']);
  assertEquals(dim.gray.underline.stack, ['dim', 'gray', 'underline']);
});

Deno.test('chaining | should correctly reset the color stack on bound colors', () => {
  let dim = colors.dim;
  let foo = dim('FOO');
  let codes = dim.gray.underline('FOO');

  assertEquals(dim('FOO'), foo);
  assertEquals(dim.gray.underline('FOO'), codes);
  assertEquals(dim('FOO'), foo);
  assertEquals(dim.gray.underline('FOO'), codes);
  assertEquals(dim('FOO'), foo);
});

Deno.test('chaining | should correctly reset the color stack on chained _bound_ colors', () => {
  let dimRed = colors.dim.red;
  let dim = colors.dim;
  let underline = dimRed.underline;
  let foo = dim('FOO');
  let codes = dimRed.underline('FOO');

  assertEquals(dim('FOO'), foo);
  assertEquals(dimRed.underline('FOO'), codes);
  assertEquals(dim('FOO'), foo);
  assertEquals(dimRed.underline('FOO'), codes);
  assertEquals(dim('FOO'), foo);
  assertEquals(underline('foo'), colors.dim.red.underline('foo'));

  let redBold = colors.red.bold;
  let blueBold = colors.red.blue.bold('Blue Bold');

  assertEquals(
    blueBold,
    '\u001b[31m\u001b[34m\u001b[1mBlue Bold\u001b[22m\u001b[39m\u001b[31m\u001b[39m'
  );
  assertEquals(redBold('Red Bold'), '\u001b[31m\u001b[1mRed Bold\u001b[22m\u001b[39m');
  assertEquals(colors.red.bold('Red Bold'), '\u001b[31m\u001b[1mRed Bold\u001b[22m\u001b[39m');
});

Deno.test('nesting | should correctly wrap the colors on nested colors', () => {
  assertEquals(
    colors.red(`R${colors.green(`G${colors.blue('B')}G`)}R`),
    '\u001b[31mR\u001b[32mG\u001b[34mB\u001b[39m\u001b[31m\u001b[32mG\u001b[39m\u001b[31mR\u001b[39m'
  );
});

Deno.test('newlines | should correctly wrap colors around newlines', () => {
  assertEquals(
    colors.bgRed('foo\nbar') + 'baz qux',
    '\u001b[41mfoo\u001b[49m\n\u001b[41mbar\u001b[49mbaz qux'
  );
});

Deno.test('enabled | should disable ansi styling when colors.enabled is false', () => {
  colors.enabled = false;
  assertEquals(colors.red('foo bar'), 'foo bar');
  assertEquals(colors.blue('foo bar'), 'foo bar');
  assertEquals(colors.bold('foo bar'), 'foo bar');
  colors.enabled = true;
});

// // describe("FORCE_COLOR", () => {
// //   beforeEach(() => {
// //     delete process.env.FORCE_COLOR;
// //     decache("./");
// //   });

// //   Deno.test("should be enabled if FORCE_COLOR is not set", () => {
// //     const colors = require("./");
// //     assertEquals(colors.enabled, true);
// //   });

// //   Deno.test("should be enabled if FORCE_COLOR is set to 1", () => {
// //     process.env.FORCE_COLOR = "1";
// //     const colors = require("./");
// //     assertEquals(colors.enabled, true);
// //   });

// //   Deno.test("should be disabled if FORCE_COLOR is set to 0", () => {
// //     process.env.FORCE_COLOR = "0";
// //     const colors = require("./");
// //     assertEquals(colors.enabled, false);
// //   });
// // });

Deno.test('visible | should mute output when colors.visible is false', () => {
  colors.visible = false;

  assertEquals(colors.red('foo bar'), '');
  assertEquals(colors.blue('foo bar'), '');
  assertEquals(colors.bold('foo bar'), '');

  colors.visible = true;
});

Deno.test('unstyle | should strip ANSI codes', () => {
  assertEquals(colors.unstyle(colors.blue.bold('foo bar baz')), 'foo bar baz');
  assertEquals(colors.stripColor(colors.blue.bold('foo bar baz')), 'foo bar baz');
});

Deno.test('hasColor | should return true if a string has ansi styling', () => {
  assert(colors.hasColor(colors.blue.bold('foo bar baz')));
  assert(colors.hasAnsi(colors.blue.bold('foo bar baz')));
});

Deno.test('hasColor | should return false if a string does not have ansi styling', () => {
  assert(!colors.hasColor('foo bar baz'));
  assert(!colors.hasAnsi('foo bar baz'));
});

Deno.test('hasColor | should return true when used multiple times', () => {
  assert(colors.hasColor(colors.blue.bold('foo bar baz')));
  assert(colors.hasColor(colors.blue.bold('foo bar baz')));
  assert(colors.hasColor(colors.blue.bold('foo bar baz')));
  assert(colors.hasColor(colors.blue.bold('foo bar baz')));
  assert(colors.hasColor(colors.blue.bold('foo bar baz')));
});
