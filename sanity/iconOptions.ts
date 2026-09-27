/** Icon choices shown in CMS dropdowns. Keep in sync with ICONS in components/icons.tsx. */
export const ICON_OPTIONS = [
  'trophy', 'medal', 'ribbon', 'users', 'user', 'graduation', 'megaphone', 'wrench', 'cpu', 'rocket', 'handshake', 'book',
  'target', 'layers', 'shield', 'feather', 'compass', 'bulb', 'flag', 'star', 'clipboard', 'chat', 'envelope', 'globe',
  'calendar', 'building', 'code', 'gear', 'bolt', 'heart', 'spark', 'mail', 'pin', 'doc',
].map((v) => ({ title: v.charAt(0).toUpperCase() + v.slice(1), value: v }))

export const iconField = (name = 'icon', title = 'Icon') => ({
  name,
  title,
  type: 'string',
  options: { list: ICON_OPTIONS },
  description: 'Small icon shown next to this item.',
})
