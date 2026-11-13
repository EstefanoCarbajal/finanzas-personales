// Semantic colors (income, expense, error) stay independent of these decorative palettes.
const themes = {
  koala: { name: 'Verde lima', deep: '#143e34', glow: '#32644b', accent: '#dcf899', shade: '#a6c472', surface: '#f5f8ef', soft: '#edf3e4', ink: '#23483c', muted: '#62745c', line: '#dce5d3', ondark: '#d5e6cc', strong: '#466a35' },
  fox: { name: 'Durazno', deep: '#633b2b', glow: '#9c6140', accent: '#f6d9b6', shade: '#d3a875', surface: '#fcf7f1', soft: '#f8ecdf', ink: '#583b2f', muted: '#806454', line: '#ebdac9', ondark: '#f4e2d0', strong: '#88532f' },
  cat: { name: 'Lavanda', deep: '#3e345e', glow: '#70618f', accent: '#dedcf4', shade: '#b5acd3', surface: '#f7f5fc', soft: '#eee9f7', ink: '#423750', muted: '#756685', line: '#e1d8ed', ondark: '#e4ddf3', strong: '#6b538f' },
  panda: { name: 'Menta', deep: '#214b49', glow: '#427b72', accent: '#cce7dc', shade: '#98c6b6', surface: '#f2f8f6', soft: '#e5f2ed', ink: '#2d514a', muted: '#5a776e', line: '#cee3da', ondark: '#daeee7', strong: '#357361' },
  rabbit: { name: 'Rosa suave', deep: '#603c4e', glow: '#946179', accent: '#f3d9de', shade: '#cda2b3', surface: '#fcf5f7', soft: '#f7e8ee', ink: '#563b49', muted: '#816474', line: '#ecd6e0', ondark: '#f3e0e8', strong: '#8a526b' },
  bear: { name: 'Arena', deep: '#51432f', glow: '#84704d', accent: '#eadfc2', shade: '#c1b084', surface: '#faf7f0', soft: '#f1ebdd', ink: '#4f4535', muted: '#776c56', line: '#e3dac6', ondark: '#eee5d0', strong: '#78613a' },
};

export const avatarTheme = id => Object.hasOwn(themes, id) ? themes[id] : themes.koala;
export const themeVariables = id => Object.fromEntries(Object.entries(avatarTheme(id)).filter(([key]) => key !== 'name').map(([key, value]) => [`--theme-${key}`, value]));
