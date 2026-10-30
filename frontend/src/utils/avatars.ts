export interface CuteAvatar {
  id: string;
  name: string;
  characterType: string;
  url: string;
}

export const CUTE_AVATARS: CuteAvatar[] = [
  {
    id: 'astro-bot',
    name: 'Sparky',
    characterType: 'Cyber Robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky&backgroundColor=b6e3f4,c0aede,d1d4f9'
  },
  {
    id: 'luna-fox',
    name: 'Luna',
    characterType: 'Adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna&backgroundColor=ffd5dc,ffdfbf,ffd5dc'
  },
  {
    id: 'milo-bot',
    name: 'Milo',
    characterType: 'Friendly Droid',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Milo&backgroundColor=c0aede,d1d4f9'
  },
  {
    id: 'felix-pup',
    name: 'Felix',
    characterType: 'Scholar Boy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4,d1d4f9'
  },
  {
    id: 'aria-star',
    name: 'Aria',
    characterType: 'Anime Scholar',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Aria&backgroundColor=ffdfbf,ffd5dc'
  },
  {
    id: 'chloe-owl',
    name: 'Chloe',
    characterType: 'Bio Student',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Chloe&backgroundColor=b6e3f4,c0aede'
  },
  {
    id: 'buster-bear',
    name: 'Buster',
    characterType: 'Tech Wizard',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Buster&backgroundColor=d1d4f9,c0aede'
  },
  {
    id: 'daisy-bunny',
    name: 'Daisy',
    characterType: 'Cheery Cadet',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Daisy&backgroundColor=ffd5dc,ffdfbf'
  },
  {
    id: 'oliver-droid',
    name: 'Gizmo',
    characterType: 'Smart Droid',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gizmo&backgroundColor=ffd5dc,d1d4f9'
  },
  {
    id: 'leo-lion',
    name: 'Leo',
    characterType: 'Maker Pilot',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=ffdfbf,b6e3f4'
  },
  {
    id: 'maya-dream',
    name: 'Maya',
    characterType: 'Design Prodigy',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Maya&backgroundColor=c0aede,ffd5dc'
  },
  {
    id: 'pixel-buddy',
    name: 'Pixel',
    characterType: 'Gamer Bot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pixel&backgroundColor=b6e3f4,ffd5dc'
  }
];

export const getDefaultAvatar = (name?: string): string => {
  if (!name) return CUTE_AVATARS[0].url;
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(hash) % CUTE_AVATARS.length;
  return CUTE_AVATARS[index].url;
};
