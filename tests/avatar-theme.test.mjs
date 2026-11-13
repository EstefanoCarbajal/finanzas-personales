import test from 'node:test';
import assert from 'node:assert/strict';
import { avatars } from '../src/lib/avatars.mjs';
import { avatarTheme, themeVariables } from '../src/lib/avatar-themes.mjs';

const luminance = hex => {
  const rgb = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);

test('every avatar palette has readable text, controls and light-on-dark labels', () => {
  for (const avatar of avatars) {
    const theme = avatarTheme(avatar.id);
    for (const [foreground, background] of [['ink','surface'],['muted','surface'],['deep','accent'],['ondark','deep'],['strong','soft']]) {
      assert.ok(contrast(theme[foreground], theme[background]) >= 4.5, `${avatar.id}: ${foreground}/${background}`);
    }
    assert.equal(themeVariables(avatar.id)['--theme-accent'], theme.accent);
  }
  assert.equal(avatarTheme('unknown'), avatarTheme('koala'));
  assert.equal(avatarTheme('__proto__'), avatarTheme('koala'));
});
