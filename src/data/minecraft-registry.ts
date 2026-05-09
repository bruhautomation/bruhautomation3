// Comprehensive vanilla Minecraft 1.20+ registry — blocks, items, entities.
// Organized into browsable categories with color tokens for visual thumbnails.
// Generated from named generators where the variant set is large and regular
// (16 dye colors, 11 wood types, copper oxidation/wax states) and hand-curated
// where the set is irregular.

export interface RegistryEntry {
  id: string;        // 'minecraft:stone' — always namespaced
  label: string;     // 'Stone' — display
  category: string;  // category id
  color: string;     // CSS hex color for the thumbnail swatch
  tags?: string[];   // extra search keywords
}

export interface RegistryCategory {
  id: string;
  name: string;
  iconPath: string;  // SVG path for the category icon
}

// ───────────────────────────────────────────────────────────────────────────
// Color & wood palettes
// ───────────────────────────────────────────────────────────────────────────

const DYE_COLORS: { id: string; hex: string }[] = [
  { id: 'white', hex: '#f9fffe' },
  { id: 'orange', hex: '#f9801d' },
  { id: 'magenta', hex: '#c74ebd' },
  { id: 'light_blue', hex: '#3ab3da' },
  { id: 'yellow', hex: '#fed83d' },
  { id: 'lime', hex: '#80c71f' },
  { id: 'pink', hex: '#f38baa' },
  { id: 'gray', hex: '#474f52' },
  { id: 'light_gray', hex: '#9d9d97' },
  { id: 'cyan', hex: '#169c9c' },
  { id: 'purple', hex: '#8932b8' },
  { id: 'blue', hex: '#3c44aa' },
  { id: 'brown', hex: '#835432' },
  { id: 'green', hex: '#5e7c16' },
  { id: 'red', hex: '#b02e26' },
  { id: 'black', hex: '#1d1d21' },
];

const OVERWORLD_WOODS: { id: string; plank: string; log: string; leaf: string }[] = [
  { id: 'oak',       plank: '#bb9a6a', log: '#6e552c', leaf: '#48702e' },
  { id: 'spruce',    plank: '#7e5d2d', log: '#3a2916', leaf: '#465e2a' },
  { id: 'birch',     plank: '#dac9a3', log: '#dfdcc8', leaf: '#80a755' },
  { id: 'jungle',    plank: '#9b7250', log: '#534b32', leaf: '#469125' },
  { id: 'acacia',    plank: '#aa5d34', log: '#67645b', leaf: '#5a8a25' },
  { id: 'dark_oak',  plank: '#3f2913', log: '#3a2913', leaf: '#395824' },
  { id: 'mangrove',  plank: '#75351a', log: '#564143', leaf: '#80a445' },
  { id: 'cherry',    plank: '#e3b1a7', log: '#5a3032', leaf: '#f47bcd' },
];

const SPECIAL_WOODS: { id: string; plank: string; log: string }[] = [
  { id: 'bamboo', plank: '#cbb74d', log: '#a3d24a' },
];

const NETHER_WOODS: { id: string; plank: string; stem: string; wart: string }[] = [
  { id: 'crimson', plank: '#681e3c', stem: '#5b2638', wart: '#971a1a' },
  { id: 'warped',  plank: '#2c8e6f', stem: '#562c3e', wart: '#108279' },
];

const COPPER_STATES: { prefix: string; color: string }[] = [
  { prefix: '',          color: '#c87c5c' },
  { prefix: 'exposed_',  color: '#a07f6c' },
  { prefix: 'weathered_',color: '#67a36e' },
  { prefix: 'oxidized_', color: '#5fa18a' },
];

// ───────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────

function tc(s: string): string {
  return s.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}
function entry(id: string, label: string, category: string, color: string, tags?: string[]): RegistryEntry {
  return { id: `minecraft:${id}`, label, category, color, tags };
}

// ───────────────────────────────────────────────────────────────────────────
// BLOCK CATEGORIES
// ───────────────────────────────────────────────────────────────────────────

export const BLOCK_CATEGORIES: RegistryCategory[] = [
  { id: 'all',         name: 'All blocks', iconPath: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z' },
  { id: 'natural',     name: 'Natural',    iconPath: 'M3 21h18M5 21V12l7-5 7 5v9' },
  { id: 'ores',        name: 'Ores & gems',iconPath: 'M12 2l8 5v10l-8 5-8-5V7l8-5z' },
  { id: 'wood',        name: 'Wood',       iconPath: 'M12 2v20M5 4h14M5 8h14M5 12h14M5 16h14M5 20h14' },
  { id: 'plants',      name: 'Plants',     iconPath: 'M12 22V8M12 8c0-3-2-5-4-5M12 8c0-3 2-5 4-5M8 12c-2 0-4 2-4 4M16 12c2 0 4 2 4 4' },
  { id: 'fluid',       name: 'Fluids',     iconPath: 'M12 2c-4 5-7 8-7 12a7 7 0 0 0 14 0c0-4-3-7-7-12z' },
  { id: 'stone',       name: 'Stone & brick', iconPath: 'M3 7h18v10H3V7zm0 5h18M9 7v10M15 7v10' },
  { id: 'colored',     name: 'Wool · concrete · glass', iconPath: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z' },
  { id: 'redstone',    name: 'Redstone',   iconPath: 'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z' },
  { id: 'utility',     name: 'Utility',    iconPath: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
  { id: 'storage',     name: 'Storage',    iconPath: 'M3 7h18v13H3V7zM3 7l9-5 9 5M9 12h6' },
  { id: 'transport',   name: 'Transport',  iconPath: 'M5 17h14M3 13l2-7h14l2 7M7 17v3M17 17v3M7 13h10' },
  { id: 'lighting',    name: 'Lighting',   iconPath: 'M9 21h6M10 17h4M12 2a6 6 0 0 0-3 11l1 3h4l1-3a6 6 0 0 0-3-11z' },
  { id: 'decoration',  name: 'Decoration', iconPath: 'M12 2l4 8 8 1-6 6 2 9-8-5-8 5 2-9-6-6 8-1 4-8z' },
  { id: 'nether',      name: 'Nether',     iconPath: 'M12 2L3 7v10l9 5 9-5V7l-9-5zM12 8l5 3v5l-5 3-5-3v-5l5-3z' },
  { id: 'end',         name: 'The End',    iconPath: 'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zM7 12h10M12 7v10' },
  { id: 'copper',      name: 'Copper',     iconPath: 'M3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9c-3 0-5-1-7-3' },
];

export const ITEM_CATEGORIES: RegistryCategory[] = [
  { id: 'all',          name: 'All items',     iconPath: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z' },
  { id: 'tools',        name: 'Tools',         iconPath: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
  { id: 'weapons',      name: 'Weapons',       iconPath: 'M14 5l5-3-1 6-9 9-3 3-2-2 3-3 9-9z' },
  { id: 'armor',        name: 'Armor',         iconPath: 'M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z' },
  { id: 'food',         name: 'Food',          iconPath: 'M12 2C8 2 5 5 5 9v3a7 7 0 0 0 14 0V9c0-4-3-7-7-7z' },
  { id: 'materials',    name: 'Materials',     iconPath: 'M5 5h14v14H5V5z' },
  { id: 'mob_drops',    name: 'Mob drops',     iconPath: 'M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z' },
  { id: 'transport',    name: 'Transport',     iconPath: 'M5 17h14M3 13l2-7h14l2 7M7 17v3M17 17v3' },
  { id: 'spawn_eggs',   name: 'Spawn eggs',    iconPath: 'M12 2c4 5 6 8 6 12a6 6 0 0 1-12 0c0-4 2-7 6-12z' },
  { id: 'potions',      name: 'Potions',       iconPath: 'M9 2h6M10 2v3M14 2v3M9 5h6l1 4a6 6 0 1 1-8 0l1-4z' },
  { id: 'music',        name: 'Music discs',   iconPath: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
  { id: 'misc',         name: 'Misc',          iconPath: 'M12 2a10 10 0 1 0 0 20M8 14h8M12 10v8' },
];

export const ENTITY_CATEGORIES: RegistryCategory[] = [
  { id: 'all',       name: 'All mobs',  iconPath: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z' },
  { id: 'hostile',   name: 'Hostile',   iconPath: 'M12 2l10 18H2L12 2zm0 6v6m0 4v.01' },
  { id: 'passive',   name: 'Passive',   iconPath: 'M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z' },
  { id: 'aquatic',   name: 'Aquatic',   iconPath: 'M12 2c-4 5-7 8-7 12a7 7 0 0 0 14 0c0-4-3-7-7-12z' },
  { id: 'flying',    name: 'Flying',    iconPath: 'M2 12l4-4 4 2 4-6 4 4 4-2v8H2v-2z' },
  { id: 'boss',      name: 'Bosses',    iconPath: 'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z' },
  { id: 'utility',   name: 'Utility',   iconPath: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
  { id: 'projectile',name: 'Projectiles & misc', iconPath: 'M5 19l14-14M14 5h5v5' },
  { id: 'vehicle',   name: 'Vehicles',  iconPath: 'M5 17h14M3 13l2-7h14l2 7M7 17v3M17 17v3' },
];

// ───────────────────────────────────────────────────────────────────────────
// BLOCKS
// ───────────────────────────────────────────────────────────────────────────

const blocks: RegistryEntry[] = [];

// — Natural —
blocks.push(
  entry('stone', 'Stone', 'natural', '#7e7e7e'),
  entry('cobblestone', 'Cobblestone', 'natural', '#828282'),
  entry('mossy_cobblestone', 'Mossy Cobblestone', 'natural', '#6a8458'),
  entry('granite', 'Granite', 'natural', '#9a6a5a'),
  entry('polished_granite', 'Polished Granite', 'natural', '#a87864'),
  entry('andesite', 'Andesite', 'natural', '#888888'),
  entry('polished_andesite', 'Polished Andesite', 'natural', '#9a9a9a'),
  entry('diorite', 'Diorite', 'natural', '#bcbcbe'),
  entry('polished_diorite', 'Polished Diorite', 'natural', '#cdcdcf'),
  entry('deepslate', 'Deepslate', 'natural', '#4d4d50'),
  entry('cobbled_deepslate', 'Cobbled Deepslate', 'natural', '#535357'),
  entry('polished_deepslate', 'Polished Deepslate', 'natural', '#5a5a5e'),
  entry('tuff', 'Tuff', 'natural', '#6b6862'),
  entry('calcite', 'Calcite', 'natural', '#dcdcd2'),
  entry('dripstone_block', 'Dripstone Block', 'natural', '#8c6d5c'),
  entry('pointed_dripstone', 'Pointed Dripstone', 'natural', '#8c6d5c'),
  entry('dirt', 'Dirt', 'natural', '#866043'),
  entry('coarse_dirt', 'Coarse Dirt', 'natural', '#6e4f33'),
  entry('rooted_dirt', 'Rooted Dirt', 'natural', '#967043'),
  entry('grass_block', 'Grass Block', 'natural', '#5a8a3c'),
  entry('podzol', 'Podzol', 'natural', '#5a3a18'),
  entry('mycelium', 'Mycelium', 'natural', '#6b5b6b'),
  entry('mud', 'Mud', 'natural', '#3d3a3a'),
  entry('packed_mud', 'Packed Mud', 'natural', '#8c6e57'),
  entry('clay', 'Clay', 'natural', '#a4afbc'),
  entry('sand', 'Sand', 'natural', '#dcd29f'),
  entry('red_sand', 'Red Sand', 'natural', '#bc6332'),
  entry('gravel', 'Gravel', 'natural', '#8c8881'),
  entry('snow_block', 'Snow Block', 'natural', '#f5feff'),
  entry('snow', 'Snow Layer', 'natural', '#f5feff'),
  entry('ice', 'Ice', 'natural', '#a3c8f7'),
  entry('packed_ice', 'Packed Ice', 'natural', '#8db8f1'),
  entry('blue_ice', 'Blue Ice', 'natural', '#74a8f3'),
  entry('obsidian', 'Obsidian', 'natural', '#1a1126'),
  entry('crying_obsidian', 'Crying Obsidian', 'natural', '#211141'),
  entry('bedrock', 'Bedrock', 'natural', '#555555'),
  entry('moss_block', 'Moss Block', 'natural', '#576c2c'),
  entry('moss_carpet', 'Moss Carpet', 'natural', '#576c2c'),
  entry('amethyst_block', 'Amethyst Block', 'natural', '#9b6cd0'),
  entry('budding_amethyst', 'Budding Amethyst', 'natural', '#9b6cd0'),
);

// — Ores & metal blocks —
const oreColors: Record<string, string> = {
  coal: '#444444', iron: '#d8af93', copper: '#cb7951', gold: '#fcee4b',
  redstone: '#fc1f00', emerald: '#21cf45', diamond: '#5cdbd5', lapis: '#235ba8',
};
['coal', 'iron', 'copper', 'gold', 'redstone', 'emerald', 'diamond', 'lapis'].forEach((o) => {
  blocks.push(entry(`${o}_ore`, `${tc(o)} Ore`, 'ores', oreColors[o]));
  blocks.push(entry(`deepslate_${o}_ore`, `Deepslate ${tc(o)} Ore`, 'ores', oreColors[o]));
});
blocks.push(
  entry('nether_gold_ore', 'Nether Gold Ore', 'ores', '#a26d2c'),
  entry('nether_quartz_ore', 'Nether Quartz Ore', 'ores', '#e8d3cb'),
  entry('ancient_debris', 'Ancient Debris', 'ores', '#5a312a'),
  entry('coal_block', 'Block of Coal', 'ores', '#0a0a0a'),
  entry('iron_block', 'Block of Iron', 'ores', '#dcdcdc'),
  entry('gold_block', 'Block of Gold', 'ores', '#fcee4b'),
  entry('diamond_block', 'Block of Diamond', 'ores', '#5cdbd5'),
  entry('emerald_block', 'Block of Emerald', 'ores', '#21cf45'),
  entry('redstone_block', 'Block of Redstone', 'ores', '#a01a04'),
  entry('lapis_block', 'Block of Lapis Lazuli', 'ores', '#235ba8'),
  entry('netherite_block', 'Block of Netherite', 'ores', '#443a3c'),
  entry('raw_iron_block', 'Block of Raw Iron', 'ores', '#a06d50'),
  entry('raw_copper_block', 'Block of Raw Copper', 'ores', '#9b664c'),
  entry('raw_gold_block', 'Block of Raw Gold', 'ores', '#db9e36'),
);

// — Wood (overworld) —
for (const w of OVERWORLD_WOODS) {
  blocks.push(
    entry(`${w.id}_log`, `${tc(w.id)} Log`, 'wood', w.log),
    entry(`stripped_${w.id}_log`, `Stripped ${tc(w.id)} Log`, 'wood', w.plank),
    entry(`${w.id}_wood`, `${tc(w.id)} Wood`, 'wood', w.log),
    entry(`stripped_${w.id}_wood`, `Stripped ${tc(w.id)} Wood`, 'wood', w.plank),
    entry(`${w.id}_planks`, `${tc(w.id)} Planks`, 'wood', w.plank),
    entry(`${w.id}_slab`, `${tc(w.id)} Slab`, 'wood', w.plank),
    entry(`${w.id}_stairs`, `${tc(w.id)} Stairs`, 'wood', w.plank),
    entry(`${w.id}_fence`, `${tc(w.id)} Fence`, 'wood', w.plank),
    entry(`${w.id}_fence_gate`, `${tc(w.id)} Fence Gate`, 'wood', w.plank),
    entry(`${w.id}_door`, `${tc(w.id)} Door`, 'wood', w.plank),
    entry(`${w.id}_trapdoor`, `${tc(w.id)} Trapdoor`, 'wood', w.plank),
    entry(`${w.id}_pressure_plate`, `${tc(w.id)} Pressure Plate`, 'wood', w.plank),
    entry(`${w.id}_button`, `${tc(w.id)} Button`, 'wood', w.plank),
    entry(`${w.id}_sign`, `${tc(w.id)} Sign`, 'wood', w.plank),
    entry(`${w.id}_hanging_sign`, `${tc(w.id)} Hanging Sign`, 'wood', w.plank),
    entry(`${w.id}_leaves`, `${tc(w.id)} Leaves`, 'plants', w.leaf),
    entry(`${w.id}_sapling`, `${tc(w.id)} Sapling`, 'plants', w.leaf),
  );
}
// Bamboo (1.20 added bamboo wood)
blocks.push(
  entry('bamboo_block', 'Block of Bamboo', 'wood', '#a3d24a'),
  entry('stripped_bamboo_block', 'Stripped Bamboo Block', 'wood', '#cbb74d'),
  entry('bamboo_planks', 'Bamboo Planks', 'wood', '#cbb74d'),
  entry('bamboo_mosaic', 'Bamboo Mosaic', 'wood', '#cbb74d'),
  entry('bamboo_mosaic_slab', 'Bamboo Mosaic Slab', 'wood', '#cbb74d'),
  entry('bamboo_mosaic_stairs', 'Bamboo Mosaic Stairs', 'wood', '#cbb74d'),
  entry('bamboo_slab', 'Bamboo Slab', 'wood', '#cbb74d'),
  entry('bamboo_stairs', 'Bamboo Stairs', 'wood', '#cbb74d'),
  entry('bamboo_fence', 'Bamboo Fence', 'wood', '#cbb74d'),
  entry('bamboo_fence_gate', 'Bamboo Fence Gate', 'wood', '#cbb74d'),
  entry('bamboo_door', 'Bamboo Door', 'wood', '#cbb74d'),
  entry('bamboo_trapdoor', 'Bamboo Trapdoor', 'wood', '#cbb74d'),
  entry('bamboo_pressure_plate', 'Bamboo Pressure Plate', 'wood', '#cbb74d'),
  entry('bamboo_button', 'Bamboo Button', 'wood', '#cbb74d'),
  entry('bamboo_sign', 'Bamboo Sign', 'wood', '#cbb74d'),
  entry('bamboo_hanging_sign', 'Bamboo Hanging Sign', 'wood', '#cbb74d'),
);

// Nether woods
for (const w of NETHER_WOODS) {
  blocks.push(
    entry(`${w.id}_stem`, `${tc(w.id)} Stem`, 'nether', w.stem),
    entry(`stripped_${w.id}_stem`, `Stripped ${tc(w.id)} Stem`, 'nether', w.plank),
    entry(`${w.id}_hyphae`, `${tc(w.id)} Hyphae`, 'nether', w.stem),
    entry(`stripped_${w.id}_hyphae`, `Stripped ${tc(w.id)} Hyphae`, 'nether', w.plank),
    entry(`${w.id}_planks`, `${tc(w.id)} Planks`, 'nether', w.plank),
    entry(`${w.id}_slab`, `${tc(w.id)} Slab`, 'nether', w.plank),
    entry(`${w.id}_stairs`, `${tc(w.id)} Stairs`, 'nether', w.plank),
    entry(`${w.id}_fence`, `${tc(w.id)} Fence`, 'nether', w.plank),
    entry(`${w.id}_fence_gate`, `${tc(w.id)} Fence Gate`, 'nether', w.plank),
    entry(`${w.id}_door`, `${tc(w.id)} Door`, 'nether', w.plank),
    entry(`${w.id}_trapdoor`, `${tc(w.id)} Trapdoor`, 'nether', w.plank),
    entry(`${w.id}_pressure_plate`, `${tc(w.id)} Pressure Plate`, 'nether', w.plank),
    entry(`${w.id}_button`, `${tc(w.id)} Button`, 'nether', w.plank),
    entry(`${w.id}_sign`, `${tc(w.id)} Sign`, 'nether', w.plank),
    entry(`${w.id}_hanging_sign`, `${tc(w.id)} Hanging Sign`, 'nether', w.plank),
    entry(`${w.id}_fungus`, `${tc(w.id)} Fungus`, 'plants', w.wart),
    entry(`${w.id}_roots`, `${tc(w.id)} Roots`, 'plants', w.wart),
    entry(`${w.id}_nylium`, `${tc(w.id)} Nylium`, 'nether', w.stem),
    entry(`${w.id}_wart_block`, `${tc(w.id)} Wart Block`, 'nether', w.wart),
  );
}
blocks.push(
  entry('nether_wart', 'Nether Wart', 'plants', '#971a1a'),
  entry('shroomlight', 'Shroomlight', 'lighting', '#ff9c30'),
);

// — Plants —
[
  ['dandelion', '#ffec38'],
  ['poppy', '#ed302c'],
  ['blue_orchid', '#2db8f0'],
  ['allium', '#a168c5'],
  ['azure_bluet', '#dcdef0'],
  ['red_tulip', '#bb1a13'],
  ['orange_tulip', '#ee881d'],
  ['white_tulip', '#dcdcdc'],
  ['pink_tulip', '#f1a3c8'],
  ['oxeye_daisy', '#dde3ce'],
  ['cornflower', '#3e64f7'],
  ['lily_of_the_valley', '#dadcdc'],
  ['wither_rose', '#222828'],
  ['torchflower', '#ff8000'],
  ['pitcher_plant', '#9c5dba'],
  ['sunflower', '#fcd905'],
  ['lilac', '#b288c1'],
  ['rose_bush', '#bb1a13'],
  ['peony', '#e1aebd'],
  ['pink_petals', '#f1a3c8'],
  ['azalea', '#7b9930'],
  ['flowering_azalea', '#a76ac1'],
].forEach(([id, c]) => blocks.push(entry(id, tc(id), 'plants', c)));
[
  ['grass', '#7baa55'],
  ['tall_grass', '#7baa55'],
  ['fern', '#7baa55'],
  ['large_fern', '#7baa55'],
  ['dead_bush', '#9e734a'],
  ['lily_pad', '#368925'],
  ['seagrass', '#5dba2c'],
  ['tall_seagrass', '#5dba2c'],
  ['kelp', '#3d6b1f'],
  ['kelp_plant', '#3d6b1f'],
  ['sea_pickle', '#5d6e1f'],
  ['vine', '#5d8b2b'],
  ['cave_vines', '#83793b'],
  ['glow_lichen', '#7eaa97'],
  ['hanging_roots', '#a8806a'],
  ['spore_blossom', '#bb6cb8'],
  ['big_dripleaf', '#5e8a40'],
  ['small_dripleaf', '#5e8a40'],
  ['cactus', '#3d6b1f'],
  ['sugar_cane', '#9bc880'],
  ['bamboo', '#5a7e36'],
  ['twisting_vines', '#118f7c'],
  ['weeping_vines', '#902323'],
  ['brown_mushroom', '#9b7152'],
  ['red_mushroom', '#cf3c3c'],
  ['brown_mushroom_block', '#967055'],
  ['red_mushroom_block', '#cb3128'],
  ['mushroom_stem', '#cdc7b8'],
  ['wheat', '#dcb663'],
  ['carrots', '#e0843a'],
  ['potatoes', '#a87b3a'],
  ['beetroots', '#a52323'],
  ['melon', '#7faa3c'],
  ['pumpkin', '#cc7518'],
  ['carved_pumpkin', '#cc7518'],
  ['jack_o_lantern', '#dba23c'],
  ['hay_block', '#a78832'],
].forEach(([id, c]) => blocks.push(entry(id, tc(id), 'plants', c)));

// — Fluids —
blocks.push(
  entry('water', 'Water', 'fluid', '#3d5fce'),
  entry('lava', 'Lava', 'fluid', '#d96c0a'),
  entry('powder_snow', 'Powder Snow', 'fluid', '#fbfeff'),
  entry('air', 'Air', 'fluid', '#000000', ['empty']),
  entry('cave_air', 'Cave Air', 'fluid', '#000000'),
  entry('void_air', 'Void Air', 'fluid', '#000000'),
);

// — Stone & brick variants —
const stoneVariants: [string, string][] = [
  ['stone_bricks', '#7e7e7e'],
  ['mossy_stone_bricks', '#6e8a5a'],
  ['cracked_stone_bricks', '#7e7e7e'],
  ['chiseled_stone_bricks', '#7e7e7e'],
  ['smooth_stone', '#a8a8a8'],
  ['stone_slab', '#7e7e7e'],
  ['stone_stairs', '#7e7e7e'],
  ['cobblestone_slab', '#828282'],
  ['cobblestone_stairs', '#828282'],
  ['cobblestone_wall', '#828282'],
  ['mossy_cobblestone_slab', '#6a8458'],
  ['mossy_cobblestone_stairs', '#6a8458'],
  ['mossy_cobblestone_wall', '#6a8458'],
  ['granite_slab', '#9a6a5a'],
  ['granite_stairs', '#9a6a5a'],
  ['granite_wall', '#9a6a5a'],
  ['polished_granite_slab', '#a87864'],
  ['polished_granite_stairs', '#a87864'],
  ['andesite_slab', '#888888'],
  ['andesite_stairs', '#888888'],
  ['andesite_wall', '#888888'],
  ['polished_andesite_slab', '#9a9a9a'],
  ['polished_andesite_stairs', '#9a9a9a'],
  ['diorite_slab', '#bcbcbe'],
  ['diorite_stairs', '#bcbcbe'],
  ['diorite_wall', '#bcbcbe'],
  ['polished_diorite_slab', '#cdcdcf'],
  ['polished_diorite_stairs', '#cdcdcf'],
  ['deepslate_slab', '#4d4d50'],
  ['deepslate_stairs', '#4d4d50'],
  ['deepslate_wall', '#4d4d50'],
  ['cobbled_deepslate_slab', '#535357'],
  ['cobbled_deepslate_stairs', '#535357'],
  ['cobbled_deepslate_wall', '#535357'],
  ['polished_deepslate_slab', '#5a5a5e'],
  ['polished_deepslate_stairs', '#5a5a5e'],
  ['polished_deepslate_wall', '#5a5a5e'],
  ['deepslate_bricks', '#535357'],
  ['cracked_deepslate_bricks', '#535357'],
  ['deepslate_brick_slab', '#535357'],
  ['deepslate_brick_stairs', '#535357'],
  ['deepslate_brick_wall', '#535357'],
  ['deepslate_tiles', '#3a3a3e'],
  ['cracked_deepslate_tiles', '#3a3a3e'],
  ['deepslate_tile_slab', '#3a3a3e'],
  ['deepslate_tile_stairs', '#3a3a3e'],
  ['deepslate_tile_wall', '#3a3a3e'],
  ['chiseled_deepslate', '#3a3a3e'],
  ['tuff_slab', '#6b6862'],
  ['tuff_stairs', '#6b6862'],
  ['tuff_wall', '#6b6862'],
  ['polished_tuff', '#6b6862'],
  ['polished_tuff_slab', '#6b6862'],
  ['polished_tuff_stairs', '#6b6862'],
  ['polished_tuff_wall', '#6b6862'],
  ['tuff_bricks', '#6b6862'],
  ['tuff_brick_slab', '#6b6862'],
  ['tuff_brick_stairs', '#6b6862'],
  ['tuff_brick_wall', '#6b6862'],
  ['chiseled_tuff', '#6b6862'],
  ['chiseled_tuff_bricks', '#6b6862'],
  ['bricks', '#9a4032'],
  ['brick_slab', '#9a4032'],
  ['brick_stairs', '#9a4032'],
  ['brick_wall', '#9a4032'],
  ['mud_bricks', '#8c6e57'],
  ['mud_brick_slab', '#8c6e57'],
  ['mud_brick_stairs', '#8c6e57'],
  ['mud_brick_wall', '#8c6e57'],
  ['sandstone', '#dcd29f'],
  ['chiseled_sandstone', '#dcd29f'],
  ['cut_sandstone', '#dcd29f'],
  ['smooth_sandstone', '#e7d99c'],
  ['sandstone_slab', '#dcd29f'],
  ['sandstone_stairs', '#dcd29f'],
  ['sandstone_wall', '#dcd29f'],
  ['red_sandstone', '#bc6332'],
  ['chiseled_red_sandstone', '#bc6332'],
  ['cut_red_sandstone', '#bc6332'],
  ['smooth_red_sandstone', '#c66830'],
  ['red_sandstone_slab', '#bc6332'],
  ['red_sandstone_stairs', '#bc6332'],
  ['red_sandstone_wall', '#bc6332'],
  ['nether_bricks', '#2b1416'],
  ['cracked_nether_bricks', '#2b1416'],
  ['chiseled_nether_bricks', '#2b1416'],
  ['nether_brick_slab', '#2b1416'],
  ['nether_brick_stairs', '#2b1416'],
  ['nether_brick_wall', '#2b1416'],
  ['nether_brick_fence', '#2b1416'],
  ['red_nether_bricks', '#660000'],
  ['red_nether_brick_slab', '#660000'],
  ['red_nether_brick_stairs', '#660000'],
  ['red_nether_brick_wall', '#660000'],
  ['blackstone', '#28252b'],
  ['polished_blackstone', '#3b3741'],
  ['chiseled_polished_blackstone', '#3b3741'],
  ['polished_blackstone_bricks', '#3b3741'],
  ['cracked_polished_blackstone_bricks', '#3b3741'],
  ['gilded_blackstone', '#28252b'],
  ['blackstone_slab', '#28252b'],
  ['blackstone_stairs', '#28252b'],
  ['blackstone_wall', '#28252b'],
  ['polished_blackstone_slab', '#3b3741'],
  ['polished_blackstone_stairs', '#3b3741'],
  ['polished_blackstone_wall', '#3b3741'],
  ['polished_blackstone_brick_slab', '#3b3741'],
  ['polished_blackstone_brick_stairs', '#3b3741'],
  ['polished_blackstone_brick_wall', '#3b3741'],
  ['polished_blackstone_button', '#3b3741'],
  ['polished_blackstone_pressure_plate', '#3b3741'],
  ['quartz_block', '#e8e1d6'],
  ['chiseled_quartz_block', '#e8e1d6'],
  ['quartz_pillar', '#e8e1d6'],
  ['quartz_bricks', '#e8e1d6'],
  ['smooth_quartz', '#e8e1d6'],
  ['quartz_slab', '#e8e1d6'],
  ['quartz_stairs', '#e8e1d6'],
  ['smooth_quartz_slab', '#e8e1d6'],
  ['smooth_quartz_stairs', '#e8e1d6'],
  ['prismarine', '#5e9281'],
  ['prismarine_bricks', '#5e9281'],
  ['dark_prismarine', '#3a584a'],
  ['prismarine_slab', '#5e9281'],
  ['prismarine_stairs', '#5e9281'],
  ['prismarine_wall', '#5e9281'],
  ['prismarine_brick_slab', '#5e9281'],
  ['prismarine_brick_stairs', '#5e9281'],
  ['dark_prismarine_slab', '#3a584a'],
  ['dark_prismarine_stairs', '#3a584a'],
  ['end_stone', '#dadda6'],
  ['end_stone_bricks', '#dadda6'],
  ['end_stone_brick_slab', '#dadda6'],
  ['end_stone_brick_stairs', '#dadda6'],
  ['end_stone_brick_wall', '#dadda6'],
  ['purpur_block', '#a86fa8'],
  ['chiseled_purpur_block', '#a86fa8'],
  ['purpur_pillar', '#a86fa8'],
  ['purpur_slab', '#a86fa8'],
  ['purpur_stairs', '#a86fa8'],
];
stoneVariants.forEach(([id, c]) => blocks.push(entry(id, tc(id), 'stone', c)));

// — Colored variants (16 colors) —
for (const c of DYE_COLORS) {
  blocks.push(
    entry(`${c.id}_wool`, `${tc(c.id)} Wool`, 'colored', c.hex),
    entry(`${c.id}_carpet`, `${tc(c.id)} Carpet`, 'colored', c.hex),
    entry(`${c.id}_concrete`, `${tc(c.id)} Concrete`, 'colored', c.hex),
    entry(`${c.id}_concrete_powder`, `${tc(c.id)} Concrete Powder`, 'colored', c.hex),
    entry(`${c.id}_terracotta`, `${tc(c.id)} Terracotta`, 'colored', c.hex),
    entry(`${c.id}_glazed_terracotta`, `${tc(c.id)} Glazed Terracotta`, 'colored', c.hex),
    entry(`${c.id}_stained_glass`, `${tc(c.id)} Stained Glass`, 'colored', c.hex),
    entry(`${c.id}_stained_glass_pane`, `${tc(c.id)} Stained Glass Pane`, 'colored', c.hex),
    entry(`${c.id}_bed`, `${tc(c.id)} Bed`, 'decoration', c.hex),
    entry(`${c.id}_candle`, `${tc(c.id)} Candle`, 'lighting', c.hex),
    entry(`${c.id}_shulker_box`, `${tc(c.id)} Shulker Box`, 'storage', c.hex),
    entry(`${c.id}_banner`, `${tc(c.id)} Banner`, 'decoration', c.hex),
  );
}
blocks.push(
  entry('terracotta', 'Terracotta', 'colored', '#9b6045'),
  entry('glass', 'Glass', 'colored', '#c8eaff'),
  entry('glass_pane', 'Glass Pane', 'colored', '#c8eaff'),
  entry('tinted_glass', 'Tinted Glass', 'colored', '#2d2536'),
  entry('shulker_box', 'Shulker Box', 'storage', '#a17ea1'),
);

// — Redstone —
[
  ['redstone_wire', '#a01a04'],
  ['redstone_torch', '#a01a04'],
  ['redstone_lamp', '#5b3416'],
  ['lever', '#7e6630'],
  ['stone_button', '#7e7e7e'],
  ['stone_pressure_plate', '#7e7e7e'],
  ['heavy_weighted_pressure_plate', '#dcdcdc'],
  ['light_weighted_pressure_plate', '#fcee4b'],
  ['observer', '#5a5a5a'],
  ['piston', '#7e6630'],
  ['sticky_piston', '#7d8d3e'],
  ['dispenser', '#7e7e7e'],
  ['dropper', '#7e7e7e'],
  ['hopper', '#1a1a1a'],
  ['repeater', '#a08e72'],
  ['comparator', '#9a8866'],
  ['redstone_block', '#a01a04'],
  ['daylight_detector', '#7d6a4a'],
  ['target', '#cd6055'],
  ['tripwire_hook', '#7e7e7e'],
  ['note_block', '#a87864'],
  ['command_block', '#9b7430'],
  ['chain_command_block', '#41734a'],
  ['repeating_command_block', '#7c40a3'],
  ['structure_block', '#705f64'],
  ['jigsaw', '#705f64'],
  ['polished_blackstone_button', '#3b3741'],
  ['light', '#fde4a0'],
  ['barrier', '#cc1f1a'],
  ['structure_void', '#5b1c75'],
].forEach(([id, c]) => blocks.push(entry(id, tc(id), 'redstone', c)));

// — Storage —
blocks.push(
  entry('chest', 'Chest', 'storage', '#a07845'),
  entry('trapped_chest', 'Trapped Chest', 'storage', '#a06e45'),
  entry('ender_chest', 'Ender Chest', 'storage', '#162a36'),
  entry('barrel', 'Barrel', 'storage', '#7e6630'),
  entry('decorated_pot', 'Decorated Pot', 'storage', '#a78366'),
);

// — Utility —
[
  ['crafting_table', '#a87864'],
  ['crafter', '#5e5e6c'],
  ['furnace', '#5d5d5d'],
  ['blast_furnace', '#5d5d5d'],
  ['smoker', '#5d5d5d'],
  ['enchanting_table', '#48272a'],
  ['anvil', '#3d3d3d'],
  ['chipped_anvil', '#3d3d3d'],
  ['damaged_anvil', '#3d3d3d'],
  ['grindstone', '#7d6a4a'],
  ['stonecutter', '#a4a4a4'],
  ['cartography_table', '#9b7858'],
  ['fletching_table', '#dac9a3'],
  ['loom', '#bb9a6a'],
  ['composter', '#82593a'],
  ['lectern', '#bb9a6a'],
  ['smithing_table', '#3d3934'],
  ['brewing_stand', '#7d6a4a'],
  ['cauldron', '#3d3d3d'],
  ['bee_nest', '#c1953e'],
  ['beehive', '#a07952'],
  ['honey_block', '#fdcd45'],
  ['honeycomb_block', '#e89337'],
  ['lodestone', '#bcbab8'],
  ['respawn_anchor', '#3a1c4f'],
  ['conduit', '#0d8c91'],
  ['beacon', '#71fffe'],
  ['bell', '#facf36'],
  ['lightning_rod', '#cb7951'],
].forEach(([id, c]) => blocks.push(entry(id, tc(id), 'utility', c)));

// — Lighting —
[
  ['torch', '#fcee4b'],
  ['soul_torch', '#3d8aa3'],
  ['lantern', '#a06e45'],
  ['soul_lantern', '#458aa3'],
  ['candle', '#dcd29f'],
  ['glowstone', '#fed83d'],
  ['sea_lantern', '#a8d2c0'],
  ['jack_o_lantern', '#dba23c'],
  ['campfire', '#a06e45'],
  ['soul_campfire', '#3d8aa3'],
  ['end_rod', '#dcd29f'],
  ['fire', '#ff8c00'],
  ['soul_fire', '#3d8aa3'],
  ['ochre_froglight', '#f6e2a8'],
  ['verdant_froglight', '#bbedaf'],
  ['pearlescent_froglight', '#f5cfd7'],
].forEach(([id, c]) => blocks.push(entry(id, tc(id), 'lighting', c)));

// — Decoration —
[
  ['painting', '#7e6e3c'],
  ['item_frame', '#bb9a6a'],
  ['glow_item_frame', '#a76ac1'],
  ['flower_pot', '#a04330'],
  ['armor_stand', '#a87864'],
  ['head', '#3d3d3d'],
  ['skeleton_skull', '#bcbab8'],
  ['wither_skeleton_skull', '#3d3d3d'],
  ['zombie_head', '#5a8a3c'],
  ['creeper_head', '#5e8a3c'],
  ['dragon_head', '#1f1c25'],
  ['piglin_head', '#a06e45'],
  ['player_head', '#a87864'],
  ['turtle_egg', '#dcd29f'],
  ['sniffer_egg', '#9c5dba'],
  ['scaffolding', '#cbb74d'],
  ['chain', '#3d3d3d'],
  ['iron_bars', '#dcdcdc'],
  ['cobweb', '#dcdcdc'],
  ['slime_block', '#7c9a3e'],
  ['snow_golem', '#f5feff'],
  ['suspicious_sand', '#dcd29f'],
  ['suspicious_gravel', '#8c8881'],
  ['frogspawn', '#3d6b1f'],
  ['mangrove_roots', '#564143'],
  ['muddy_mangrove_roots', '#3d3a3a'],
  ['dragon_egg', '#1f1c25'],
  ['vault', '#3d3d3d'],
  ['trial_spawner', '#3d3d3d'],
  ['chiseled_bookshelf', '#a87864'],
  ['bookshelf', '#a87864'],
].forEach(([id, c]) => blocks.push(entry(id, tc(id), 'decoration', c)));

// — Transport —
[
  ['rail', '#7e7e7e'],
  ['powered_rail', '#fcd905'],
  ['detector_rail', '#7e7e7e'],
  ['activator_rail', '#a01a04'],
].forEach(([id, c]) => blocks.push(entry(id, tc(id), 'transport', c)));

// — End —
blocks.push(
  entry('end_portal_frame', 'End Portal Frame', 'end', '#5a8a73'),
  entry('end_portal', 'End Portal', 'end', '#0f0824'),
  entry('end_gateway', 'End Gateway', 'end', '#0f0824'),
  entry('end_rod', 'End Rod', 'lighting', '#dcd29f'),
  entry('chorus_plant', 'Chorus Plant', 'end', '#5b386b'),
  entry('chorus_flower', 'Chorus Flower', 'end', '#9070a3'),
);

// — Nether portals & misc —
blocks.push(
  entry('nether_portal', 'Nether Portal', 'nether', '#7c2eb1'),
  entry('netherrack', 'Netherrack', 'nether', '#723e3e'),
  entry('soul_sand', 'Soul Sand', 'nether', '#523c2c'),
  entry('soul_soil', 'Soul Soil', 'nether', '#4d3727'),
  entry('basalt', 'Basalt', 'nether', '#4f4751'),
  entry('polished_basalt', 'Polished Basalt', 'nether', '#5b545d'),
  entry('smooth_basalt', 'Smooth Basalt', 'nether', '#494649'),
  entry('magma_block', 'Magma Block', 'nether', '#962d05'),
  entry('glowstone', 'Glowstone', 'nether', '#fed83d'),
  entry('quartz_block', 'Block of Quartz', 'nether', '#e8e1d6'),
  entry('nether_quartz_ore', 'Nether Quartz Ore', 'nether', '#e8d3cb'),
);

// — Copper variants —
for (const s of COPPER_STATES) {
  ['copper_block', 'cut_copper', 'cut_copper_slab', 'cut_copper_stairs', 'chiseled_copper', 'copper_grate', 'copper_door', 'copper_trapdoor', 'copper_bulb'].forEach((b) => {
    blocks.push(entry(`${s.prefix}${b}`, `${tc(s.prefix + b)}`, 'copper', s.color));
  });
  ['waxed_'].forEach((wax) => {
    ['copper_block', 'cut_copper', 'cut_copper_slab', 'cut_copper_stairs', 'chiseled_copper', 'copper_grate', 'copper_door', 'copper_trapdoor', 'copper_bulb'].forEach((b) => {
      blocks.push(entry(`${wax}${s.prefix}${b}`, `${tc(wax + s.prefix + b)}`, 'copper', s.color));
    });
  });
}
blocks.push(
  entry('lightning_rod', 'Lightning Rod', 'copper', '#cb7951'),
  entry('copper_ore', 'Copper Ore', 'copper', '#cb7951'),
  entry('deepslate_copper_ore', 'Deepslate Copper Ore', 'copper', '#cb7951'),
);

// Deduplicate by id (some entries are intentionally duplicated across categories).
const blockSeen = new Set<string>();
export const BLOCKS: RegistryEntry[] = blocks.filter((b) => {
  const k = b.id + '::' + b.category;
  if (blockSeen.has(k)) return false;
  blockSeen.add(k);
  return true;
});

// ───────────────────────────────────────────────────────────────────────────
// ITEMS
// ───────────────────────────────────────────────────────────────────────────

const items: RegistryEntry[] = [];

// Tools — 6 tiers × 5 tools + shears + flint_and_steel + fishing rod + lead + name tag + brush
const TIERS: { id: string; color: string }[] = [
  { id: 'wooden', color: '#bb9a6a' },
  { id: 'stone', color: '#7e7e7e' },
  { id: 'iron', color: '#dcdcdc' },
  { id: 'golden', color: '#fcee4b' },
  { id: 'diamond', color: '#5cdbd5' },
  { id: 'netherite', color: '#443a3c' },
];
for (const t of TIERS) {
  ['sword', 'pickaxe', 'axe', 'shovel', 'hoe'].forEach((tool) => {
    items.push(entry(`${t.id}_${tool}`, `${tc(t.id)} ${tc(tool)}`, tool === 'sword' ? 'weapons' : 'tools', t.color));
  });
}
items.push(
  entry('shears', 'Shears', 'tools', '#dcdcdc'),
  entry('flint_and_steel', 'Flint & Steel', 'tools', '#dcdcdc'),
  entry('fishing_rod', 'Fishing Rod', 'tools', '#bb9a6a'),
  entry('carrot_on_a_stick', 'Carrot on a Stick', 'tools', '#bb9a6a'),
  entry('warped_fungus_on_a_stick', 'Warped Fungus on a Stick', 'tools', '#2c8e6f'),
  entry('lead', 'Lead', 'tools', '#9b7858'),
  entry('name_tag', 'Name Tag', 'tools', '#dcd29f'),
  entry('brush', 'Brush', 'tools', '#bb9a6a'),
  entry('compass', 'Compass', 'tools', '#dcdcdc'),
  entry('clock', 'Clock', 'tools', '#fcee4b'),
  entry('recovery_compass', 'Recovery Compass', 'tools', '#5b1c75'),
  entry('spyglass', 'Spyglass', 'tools', '#cb7951'),
  entry('bucket', 'Bucket', 'tools', '#dcdcdc'),
  entry('water_bucket', 'Water Bucket', 'tools', '#3d5fce'),
  entry('lava_bucket', 'Lava Bucket', 'tools', '#d96c0a'),
  entry('milk_bucket', 'Milk Bucket', 'tools', '#fbfeff'),
  entry('powder_snow_bucket', 'Powder Snow Bucket', 'tools', '#fbfeff'),
  entry('axolotl_bucket', 'Axolotl Bucket', 'tools', '#f99ad8'),
  entry('cod_bucket', 'Cod Bucket', 'tools', '#bb9a6a'),
  entry('salmon_bucket', 'Salmon Bucket', 'tools', '#bb5d3a'),
  entry('pufferfish_bucket', 'Pufferfish Bucket', 'tools', '#fcd905'),
  entry('tropical_fish_bucket', 'Tropical Fish Bucket', 'tools', '#f99ad8'),
  entry('tadpole_bucket', 'Tadpole Bucket', 'tools', '#3a2916'),
  entry('writable_book', 'Book and Quill', 'tools', '#bb9a6a'),
  entry('written_book', 'Written Book', 'tools', '#a87864'),
  entry('book', 'Book', 'tools', '#bb9a6a'),
  entry('enchanted_book', 'Enchanted Book', 'tools', '#a76ac1'),
  entry('paper', 'Paper', 'tools', '#dcd29f'),
  entry('map', 'Empty Map', 'tools', '#dcd29f'),
  entry('filled_map', 'Filled Map', 'tools', '#dcd29f'),
  entry('saddle', 'Saddle', 'tools', '#7e6630'),
  entry('elytra', 'Elytra', 'armor', '#7c8082'),
  entry('totem_of_undying', 'Totem of Undying', 'tools', '#fcee4b'),
);

// Weapons / projectiles
items.push(
  entry('bow', 'Bow', 'weapons', '#bb9a6a'),
  entry('crossbow', 'Crossbow', 'weapons', '#bb9a6a'),
  entry('arrow', 'Arrow', 'weapons', '#bb9a6a'),
  entry('spectral_arrow', 'Spectral Arrow', 'weapons', '#fcd905'),
  entry('tipped_arrow', 'Tipped Arrow', 'weapons', '#a76ac1'),
  entry('shield', 'Shield', 'weapons', '#7e6630'),
  entry('trident', 'Trident', 'weapons', '#5e9281'),
  entry('mace', 'Mace', 'weapons', '#443a3c'),
  entry('snowball', 'Snowball', 'weapons', '#fbfeff'),
  entry('egg', 'Egg', 'weapons', '#dcd29f'),
  entry('ender_pearl', 'Ender Pearl', 'weapons', '#1f5d54'),
  entry('ender_eye', 'Eye of Ender', 'weapons', '#21cf45'),
  entry('fire_charge', 'Fire Charge', 'weapons', '#a04330'),
  entry('wind_charge', 'Wind Charge', 'weapons', '#dcd29f'),
);

// Armor
const ARMOR_TIERS: { id: string; color: string }[] = [
  { id: 'leather', color: '#7e3d24' },
  { id: 'chainmail', color: '#3d3d3d' },
  { id: 'iron', color: '#dcdcdc' },
  { id: 'golden', color: '#fcee4b' },
  { id: 'diamond', color: '#5cdbd5' },
  { id: 'netherite', color: '#443a3c' },
];
for (const a of ARMOR_TIERS) {
  ['helmet', 'chestplate', 'leggings', 'boots'].forEach((p) => {
    items.push(entry(`${a.id}_${p}`, `${tc(a.id)} ${tc(p)}`, 'armor', a.color));
  });
}
items.push(
  entry('turtle_helmet', 'Turtle Shell', 'armor', '#5e8a3c'),
  entry('leather_horse_armor', 'Leather Horse Armor', 'armor', '#7e3d24'),
  entry('iron_horse_armor', 'Iron Horse Armor', 'armor', '#dcdcdc'),
  entry('golden_horse_armor', 'Gold Horse Armor', 'armor', '#fcee4b'),
  entry('diamond_horse_armor', 'Diamond Horse Armor', 'armor', '#5cdbd5'),
  entry('wolf_armor', 'Wolf Armor', 'armor', '#443a3c'),
);

// Food
[
  ['apple', '#cd2926'],
  ['golden_apple', '#fcee4b'],
  ['enchanted_golden_apple', '#fcee4b'],
  ['carrot', '#e0843a'],
  ['golden_carrot', '#fcee4b'],
  ['potato', '#a87b3a'],
  ['baked_potato', '#a87b3a'],
  ['poisonous_potato', '#7e8a3c'],
  ['beetroot', '#a52323'],
  ['beetroot_soup', '#a52323'],
  ['mushroom_stew', '#a87864'],
  ['suspicious_stew', '#a76ac1'],
  ['rabbit_stew', '#a87864'],
  ['bread', '#cdb45e'],
  ['cake', '#dcd29f'],
  ['cookie', '#9b7050'],
  ['pumpkin_pie', '#a04330'],
  ['melon_slice', '#cd2926'],
  ['glistering_melon_slice', '#fcee4b'],
  ['sweet_berries', '#9c1418'],
  ['glow_berries', '#e89337'],
  ['chorus_fruit', '#9070a3'],
  ['popped_chorus_fruit', '#a86fa8'],
  ['raw_beef', '#cd2926'],
  ['cooked_beef', '#7e3d24'],
  ['raw_porkchop', '#f1a3c8'],
  ['cooked_porkchop', '#7e3d24'],
  ['raw_chicken', '#f1d3a8'],
  ['cooked_chicken', '#cdb45e'],
  ['raw_mutton', '#cd2926'],
  ['cooked_mutton', '#7e3d24'],
  ['raw_rabbit', '#cd2926'],
  ['cooked_rabbit', '#7e3d24'],
  ['raw_cod', '#bb9a6a'],
  ['cooked_cod', '#a87864'],
  ['raw_salmon', '#bb5d3a'],
  ['cooked_salmon', '#7e3d24'],
  ['tropical_fish', '#f99ad8'],
  ['pufferfish', '#fcd905'],
  ['rotten_flesh', '#7e3d24'],
  ['spider_eye', '#7e1c1c'],
  ['fermented_spider_eye', '#7e1c1c'],
  ['honey_bottle', '#fdcd45'],
  ['milk_bucket', 'milk_bucket', ],
  ['dried_kelp', '#3d6b1f'],
  ['kelp', '#3d6b1f'],
  ['nautilus_shell', '#dcd29f'],
].forEach(([id, c]) => {
  if (typeof c === 'string') items.push(entry(id, tc(id), 'food', c));
});

// Materials
[
  ['stick', '#bb9a6a'],
  ['coal', '#0a0a0a'],
  ['charcoal', '#3d2d1d'],
  ['iron_ingot', '#dcdcdc'],
  ['gold_ingot', '#fcee4b'],
  ['copper_ingot', '#cb7951'],
  ['netherite_ingot', '#443a3c'],
  ['netherite_scrap', '#5a312a'],
  ['raw_iron', '#a06d50'],
  ['raw_copper', '#9b664c'],
  ['raw_gold', '#db9e36'],
  ['iron_nugget', '#dcdcdc'],
  ['gold_nugget', '#fcee4b'],
  ['diamond', '#5cdbd5'],
  ['emerald', '#21cf45'],
  ['lapis_lazuli', '#235ba8'],
  ['quartz', '#e8e1d6'],
  ['amethyst_shard', '#9b6cd0'],
  ['echo_shard', '#1f5d54'],
  ['flint', '#3d3d3d'],
  ['leather', '#7e3d24'],
  ['rabbit_hide', '#a87864'],
  ['feather', '#dcd29f'],
  ['bone', '#dcd29f'],
  ['bone_meal', '#dcd29f'],
  ['gunpowder', '#3d3d3d'],
  ['blaze_powder', '#fcd905'],
  ['blaze_rod', '#fcd905'],
  ['ghast_tear', '#dcd29f'],
  ['glowstone_dust', '#fed83d'],
  ['redstone', '#a01a04'],
  ['glow_ink_sac', '#a76ac1'],
  ['ink_sac', '#1d1d21'],
  ['slime_ball', '#7c9a3e'],
  ['magma_cream', '#962d05'],
  ['phantom_membrane', '#a76ac1'],
  ['rabbit_foot', '#a87864'],
  ['shulker_shell', '#a17ea1'],
  ['nether_star', '#dcd29f'],
  ['heart_of_the_sea', '#5e9281'],
  ['nautilus_shell', '#dcd29f'],
  ['turtle_scute', '#5e8a3c'],
  ['armadillo_scute', '#9b7858'],
  ['honeycomb', '#e89337'],
  ['snowball', '#fbfeff'],
  ['clay_ball', '#a4afbc'],
  ['scute', '#5e8a3c'],
  ['armor_trim_template', '#dcd29f'],
  ['netherite_upgrade_smithing_template', '#443a3c'],
  ['breeze_rod', '#dcd29f'],
  ['heavy_core', '#3d3d3d'],
  ['ominous_trial_key', '#3d3d3d'],
  ['trial_key', '#dcd29f'],
  ['firework_rocket', '#dcd29f'],
  ['firework_star', '#fcd905'],
  ['string', '#dcd29f'],
  ['wheat', '#dcb663'],
  ['wheat_seeds', '#7baa55'],
  ['pumpkin_seeds', '#dcd29f'],
  ['melon_seeds', '#dcd29f'],
  ['beetroot_seeds', '#dcd29f'],
  ['torchflower_seeds', '#dcd29f'],
  ['pitcher_pod', '#9c5dba'],
  ['sugar', '#dcdcdc'],
  ['nether_wart', '#971a1a'],
  ['blaze_powder', '#fcd905'],
  ['glistering_melon_slice', '#fcee4b'],
  ['dragon_breath', '#1f5d54'],
  ['experience_bottle', '#21cf45'],
  ['popped_chorus_fruit', '#a86fa8'],
].forEach(([id, c]) => items.push(entry(id, tc(id), 'materials', c)));

// Mob drops
[
  ['rotten_flesh', '#7e3d24'],
  ['bone', '#dcd29f'],
  ['arrow', '#bb9a6a'],
  ['gunpowder', '#3d3d3d'],
  ['string', '#dcd29f'],
  ['spider_eye', '#7e1c1c'],
  ['ender_pearl', '#1f5d54'],
  ['blaze_rod', '#fcd905'],
  ['ghast_tear', '#dcd29f'],
  ['magma_cream', '#962d05'],
  ['nether_star', '#dcd29f'],
  ['shulker_shell', '#a17ea1'],
  ['phantom_membrane', '#a76ac1'],
  ['leather', '#7e3d24'],
  ['feather', '#dcd29f'],
  ['rabbit_hide', '#a87864'],
  ['rabbit_foot', '#a87864'],
  ['scute', '#5e8a3c'],
  ['heart_of_the_sea', '#5e9281'],
].forEach(([id, c]) => items.push(entry(id, tc(id), 'mob_drops', c)));

// Music discs
['13', 'cat', 'blocks', 'chirp', 'far', 'mall', 'mellohi', 'stal', 'strad', 'ward', '11', 'wait', 'pigstep', 'otherside', 'relic', 'creator', 'creator_music_box', '5', 'precipice'].forEach((d) => {
  items.push(entry(`music_disc_${d}`, `Music Disc — ${d}`, 'music', '#1d1d21'));
});

// Spawn eggs (for /give use)
const SPAWN_EGG_COLORS: Record<string, string> = {
  zombie: '#5a8a3c', skeleton: '#bcbab8', creeper: '#5e8a3c', spider: '#41311c',
  enderman: '#1d1d21', witch: '#3d3d3d', ghast: '#dcd29f', blaze: '#fcd905',
  wither_skeleton: '#3d3d3d', cow: '#7e3d24', pig: '#f1a3c8', sheep: '#dcd29f',
  chicken: '#dcd29f', horse: '#a87864', wolf: '#dcdcdc', cat: '#dcdcdc',
  axolotl: '#f99ad8', villager: '#a87864', allay: '#3ab3da', fox: '#e89337',
  panda: '#dcdcdc', bee: '#fcd905', frog: '#7baa55', turtle: '#5e8a3c',
  parrot: '#fcd905', dolphin: '#3ab3da', squid: '#235ba8', strider: '#a04330',
  hoglin: '#cd2926', piglin: '#f1a3c8', warden: '#1f5d54', goat: '#dcd29f',
  camel: '#dcd29f', sniffer: '#9c5dba', breeze: '#3ab3da', armadillo: '#9b7858',
  pillager: '#3d3d3d', vindicator: '#3d3d3d', evoker: '#dcdcdc', vex: '#a76ac1',
  ravager: '#7e3d24', drowned: '#3d8aa3', husk: '#dcd29f', stray: '#bcbab8',
  phantom: '#a76ac1', shulker: '#a17ea1', endermite: '#1d1d21', silverfish: '#7e7e7e',
  slime: '#5e8a3c', magma_cube: '#962d05', zombified_piglin: '#f1a3c8',
  zombie_villager: '#5a8a3c', wandering_trader: '#3ab3da', salmon: '#bb5d3a',
  cod: '#bb9a6a', pufferfish: '#fcd905', tropical_fish: '#f99ad8', glow_squid: '#3ab3da',
  guardian: '#5e9281', elder_guardian: '#5e9281', polar_bear: '#dcdcdc',
  rabbit: '#a87864', mooshroom: '#cd2926', llama: '#dcd29f', donkey: '#a87864',
  mule: '#a87864', skeleton_horse: '#bcbab8', zombie_horse: '#5a8a3c',
  trader_llama: '#dcd29f', tadpole: '#3a2916', iron_golem: '#dcdcdc',
  snow_golem: '#fbfeff', ocelot: '#fcd905', illusioner: '#3ab3da',
  bogged: '#5e7c16', creaking: '#3d3d3d',
};
Object.entries(SPAWN_EGG_COLORS).forEach(([m, c]) => {
  items.push(entry(`${m}_spawn_egg`, `${tc(m)} Spawn Egg`, 'spawn_eggs', c));
});

// Potions (simple — use NBT for specific effects)
items.push(
  entry('potion', 'Potion', 'potions', '#a76ac1'),
  entry('splash_potion', 'Splash Potion', 'potions', '#a76ac1'),
  entry('lingering_potion', 'Lingering Potion', 'potions', '#a76ac1'),
  entry('glass_bottle', 'Glass Bottle', 'potions', '#c8eaff'),
  entry('experience_bottle', 'Bottle o\' Enchanting', 'potions', '#21cf45'),
  entry('honey_bottle', 'Honey Bottle', 'potions', '#fdcd45'),
  entry('dragon_breath', 'Dragon\'s Breath', 'potions', '#1f5d54'),
);

// Transport
items.push(
  entry('minecart', 'Minecart', 'transport', '#7e7e7e'),
  entry('chest_minecart', 'Minecart with Chest', 'transport', '#a07845'),
  entry('hopper_minecart', 'Minecart with Hopper', 'transport', '#1a1a1a'),
  entry('tnt_minecart', 'Minecart with TNT', 'transport', '#cd2926'),
  entry('furnace_minecart', 'Minecart with Furnace', 'transport', '#5d5d5d'),
  entry('command_block_minecart', 'Minecart with Command Block', 'transport', '#9b7430'),
);
for (const w of OVERWORLD_WOODS) {
  items.push(
    entry(`${w.id}_boat`, `${tc(w.id)} Boat`, 'transport', w.plank),
    entry(`${w.id}_chest_boat`, `${tc(w.id)} Boat with Chest`, 'transport', w.plank),
  );
}
items.push(
  entry('bamboo_raft', 'Bamboo Raft', 'transport', '#cbb74d'),
  entry('bamboo_chest_raft', 'Bamboo Raft with Chest', 'transport', '#cbb74d'),
);

// Dyes
DYE_COLORS.forEach((c) => items.push(entry(`${c.id}_dye`, `${tc(c.id)} Dye`, 'materials', c.hex)));

// Misc
items.push(
  entry('tnt', 'TNT', 'misc', '#cd2926'),
  entry('end_crystal', 'End Crystal', 'misc', '#a76ac1'),
  entry('bundle', 'Bundle', 'misc', '#bb9a6a'),
  entry('disc_fragment_5', 'Disc Fragment', 'misc', '#1d1d21'),
  entry('saddle', 'Saddle', 'misc', '#7e6630'),
);

// Add all blocks as items as well — every block is also obtainable via /give.
// We do this last and dedupe by id so item-only entries take priority.
const itemSeen = new Set<string>(items.map((i) => i.id));
for (const b of blocks) {
  if (!itemSeen.has(b.id)) {
    itemSeen.add(b.id);
    // Map block category to nearest item category
    items.push({ ...b, category: 'misc' });
  }
}

export const ITEMS: RegistryEntry[] = items;

// ───────────────────────────────────────────────────────────────────────────
// ENTITIES
// ───────────────────────────────────────────────────────────────────────────

const entities: RegistryEntry[] = [];

const addEnt = (id: string, label: string, cat: string, color: string) =>
  entities.push(entry(id, label, cat, color));

// Hostile mobs
[
  ['zombie', '#5a8a3c'],
  ['zombie_villager', '#5a8a3c'],
  ['husk', '#dcd29f'],
  ['drowned', '#3d8aa3'],
  ['skeleton', '#bcbab8'],
  ['stray', '#dcd29f'],
  ['bogged', '#5e7c16'],
  ['wither_skeleton', '#3d3d3d'],
  ['creeper', '#5e8a3c'],
  ['spider', '#41311c'],
  ['cave_spider', '#1d6b6b'],
  ['enderman', '#1d1d21'],
  ['endermite', '#1d1d21'],
  ['silverfish', '#7e7e7e'],
  ['slime', '#5e8a3c'],
  ['magma_cube', '#962d05'],
  ['witch', '#3d3d3d'],
  ['blaze', '#fcd905'],
  ['ghast', '#dcd29f'],
  ['phantom', '#a76ac1'],
  ['shulker', '#a17ea1'],
  ['guardian', '#5e9281'],
  ['elder_guardian', '#5e9281'],
  ['piglin', '#f1a3c8'],
  ['piglin_brute', '#f1a3c8'],
  ['hoglin', '#cd2926'],
  ['zoglin', '#cd2926'],
  ['zombified_piglin', '#f1a3c8'],
  ['vex', '#a76ac1'],
  ['vindicator', '#3d3d3d'],
  ['pillager', '#3d3d3d'],
  ['evoker', '#dcdcdc'],
  ['ravager', '#7e3d24'],
  ['illusioner', '#3ab3da'],
  ['warden', '#1f5d54'],
  ['breeze', '#3ab3da'],
  ['creaking', '#3d3d3d'],
].forEach(([id, c]) => addEnt(id, tc(id), 'hostile', c));

// Bosses
[
  ['wither', '#3d3d3d'],
  ['ender_dragon', '#1f1c25'],
  ['warden', '#1f5d54'],
  ['elder_guardian', '#5e9281'],
].forEach(([id, c]) => addEnt(id, tc(id), 'boss', c));

// Passive
[
  ['cow', '#7e3d24'],
  ['mooshroom', '#cd2926'],
  ['pig', '#f1a3c8'],
  ['sheep', '#dcd29f'],
  ['chicken', '#dcd29f'],
  ['horse', '#a87864'],
  ['donkey', '#a87864'],
  ['mule', '#a87864'],
  ['llama', '#dcd29f'],
  ['trader_llama', '#dcd29f'],
  ['skeleton_horse', '#bcbab8'],
  ['zombie_horse', '#5a8a3c'],
  ['villager', '#a87864'],
  ['wandering_trader', '#3ab3da'],
  ['rabbit', '#a87864'],
  ['fox', '#e89337'],
  ['wolf', '#dcdcdc'],
  ['cat', '#dcdcdc'],
  ['ocelot', '#fcd905'],
  ['parrot', '#fcd905'],
  ['panda', '#dcdcdc'],
  ['polar_bear', '#dcdcdc'],
  ['axolotl', '#f99ad8'],
  ['allay', '#3ab3da'],
  ['frog', '#7baa55'],
  ['tadpole', '#3a2916'],
  ['sniffer', '#9c5dba'],
  ['camel', '#dcd29f'],
  ['armadillo', '#9b7858'],
  ['goat', '#dcd29f'],
  ['bee', '#fcd905'],
  ['turtle', '#5e8a3c'],
  ['strider', '#a04330'],
].forEach(([id, c]) => addEnt(id, tc(id), 'passive', c));

// Aquatic
[
  ['cod', '#bb9a6a'],
  ['salmon', '#bb5d3a'],
  ['pufferfish', '#fcd905'],
  ['tropical_fish', '#f99ad8'],
  ['squid', '#235ba8'],
  ['glow_squid', '#3ab3da'],
  ['dolphin', '#3ab3da'],
  ['guardian', '#5e9281'],
  ['turtle', '#5e8a3c'],
].forEach(([id, c]) => addEnt(id, tc(id), 'aquatic', c));

// Flying
[
  ['ghast', '#dcd29f'],
  ['phantom', '#a76ac1'],
  ['vex', '#a76ac1'],
  ['allay', '#3ab3da'],
  ['ender_dragon', '#1f1c25'],
  ['parrot', '#fcd905'],
  ['bat', '#3d3d3d'],
  ['bee', '#fcd905'],
  ['blaze', '#fcd905'],
  ['breeze', '#3ab3da'],
].forEach(([id, c]) => addEnt(id, tc(id), 'flying', c));

// Utility
[
  ['iron_golem', '#dcdcdc'],
  ['snow_golem', '#fbfeff'],
  ['armor_stand', '#a87864'],
].forEach(([id, c]) => addEnt(id, tc(id), 'utility', c));

// Projectiles & misc
[
  ['arrow', '#bb9a6a'],
  ['spectral_arrow', '#fcd905'],
  ['snowball', '#fbfeff'],
  ['ender_pearl', '#1f5d54'],
  ['eye_of_ender', '#21cf45'],
  ['fireball', '#a04330'],
  ['small_fireball', '#a04330'],
  ['dragon_fireball', '#a76ac1'],
  ['wither_skull', '#3d3d3d'],
  ['llama_spit', '#dcd29f'],
  ['shulker_bullet', '#a17ea1'],
  ['breeze_wind_charge', '#3ab3da'],
  ['wind_charge', '#dcd29f'],
  ['fishing_bobber', '#dcd29f'],
  ['experience_orb', '#21cf45'],
  ['experience_bottle', '#21cf45'],
  ['firework_rocket', '#dcd29f'],
  ['lightning_bolt', '#fcd905'],
  ['tnt', '#cd2926'],
  ['falling_block', '#7e7e7e'],
  ['item', '#dcd29f'],
  ['item_frame', '#bb9a6a'],
  ['glow_item_frame', '#a76ac1'],
  ['leash_knot', '#a87864'],
  ['painting', '#7e6e3c'],
  ['area_effect_cloud', '#a76ac1'],
  ['marker', '#1d1d21'],
  ['interaction', '#1d1d21'],
  ['display', '#3d3d3d'],
  ['text_display', '#3d3d3d'],
  ['item_display', '#3d3d3d'],
  ['block_display', '#3d3d3d'],
  ['evoker_fangs', '#dcdcdc'],
  ['ominous_item_spawner', '#3d3d3d'],
].forEach(([id, c]) => addEnt(id, tc(id), 'projectile', c));

// Vehicles
[
  ['minecart', '#7e7e7e'],
  ['chest_minecart', '#a07845'],
  ['hopper_minecart', '#1a1a1a'],
  ['furnace_minecart', '#5d5d5d'],
  ['tnt_minecart', '#cd2926'],
  ['command_block_minecart', '#9b7430'],
  ['boat', '#bb9a6a'],
  ['chest_boat', '#bb9a6a'],
].forEach(([id, c]) => addEnt(id, tc(id), 'vehicle', c));

// Dedupe entities (some appear in multiple categories)
const entSeen = new Set<string>();
export const ENTITIES: RegistryEntry[] = entities.filter((e) => {
  const k = e.id + '::' + e.category;
  if (entSeen.has(k)) return false;
  entSeen.add(k);
  return true;
});

// ───────────────────────────────────────────────────────────────────────────
// EFFECTS & ENCHANTMENTS — typed entries with color tokens
// ───────────────────────────────────────────────────────────────────────────

const EFFECT_COLORS: Record<string, string> = {
  speed: '#7cafc6', slowness: '#5a6c81', haste: '#d9c043', mining_fatigue: '#4a4217',
  strength: '#932423', instant_health: '#f82423', instant_damage: '#430a09',
  jump_boost: '#22ff4c', nausea: '#551d4a', regeneration: '#cd5cab', resistance: '#99453a',
  fire_resistance: '#e49a3a', water_breathing: '#2e5299', invisibility: '#7f8392',
  blindness: '#1f1f23', night_vision: '#1f1fa1', hunger: '#587653', weakness: '#484d48',
  poison: '#4e9331', wither: '#352a27', health_boost: '#f87d23', absorption: '#2552a5',
  saturation: '#f82423', glowing: '#94a061', levitation: '#ceffff', luck: '#339900',
  unluck: '#c0a44d', slow_falling: '#cefffa', conduit_power: '#1c4a47',
  dolphins_grace: '#88a3be', bad_omen: '#0b6138', hero_of_the_village: '#44ff44',
  darkness: '#292721',
};
export const EFFECTS: RegistryEntry[] = Object.entries(EFFECT_COLORS).map(([id, c]) =>
  entry(id, tc(id), 'all', c)
);

const ENCHANT_COLORS: Record<string, string> = {
  protection: '#7cafc6', fire_protection: '#e49a3a', feather_falling: '#cefffa',
  blast_protection: '#a04330', projectile_protection: '#dcd29f', respiration: '#3ab3da',
  aqua_affinity: '#2e5299', thorns: '#576c2c', depth_strider: '#3d5fce',
  frost_walker: '#a3c8f7', binding_curse: '#7e1c1c', sharpness: '#dcd29f',
  smite: '#dcdcdc', bane_of_arthropods: '#5e7c16', knockback: '#9b7050',
  fire_aspect: '#e49a3a', looting: '#fcee4b', sweeping_edge: '#dcdcdc',
  efficiency: '#fcd905', silk_touch: '#fbfeff', unbreaking: '#7e7e7e',
  fortune: '#fcee4b', power: '#a01a04', punch: '#9b7050', flame: '#e49a3a',
  infinity: '#fcd905', luck_of_the_sea: '#3ab3da', lure: '#3ab3da',
  loyalty: '#5e9281', impaling: '#5e9281', riptide: '#3d5fce', channeling: '#fcd905',
  multishot: '#a04330', quick_charge: '#fcd905', piercing: '#dcdcdc', mending: '#21cf45',
  vanishing_curse: '#7e1c1c', soul_speed: '#523c2c', swift_sneak: '#352a27',
  density: '#3d3d3d', breach: '#dcdcdc', wind_burst: '#dcd29f',
};
export const ENCHANTS: RegistryEntry[] = Object.entries(ENCHANT_COLORS).map(([id, c]) =>
  entry(id, tc(id), 'all', c)
);

// ───────────────────────────────────────────────────────────────────────────
// Minecraft chat colors (for tellraw / title rich text builder)
// ───────────────────────────────────────────────────────────────────────────

export const CHAT_COLORS: { id: string; label: string; hex: string }[] = [
  { id: 'black', label: 'Black', hex: '#000000' },
  { id: 'dark_blue', label: 'Dark Blue', hex: '#0000aa' },
  { id: 'dark_green', label: 'Dark Green', hex: '#00aa00' },
  { id: 'dark_aqua', label: 'Dark Aqua', hex: '#00aaaa' },
  { id: 'dark_red', label: 'Dark Red', hex: '#aa0000' },
  { id: 'dark_purple', label: 'Dark Purple', hex: '#aa00aa' },
  { id: 'gold', label: 'Gold', hex: '#ffaa00' },
  { id: 'gray', label: 'Gray', hex: '#aaaaaa' },
  { id: 'dark_gray', label: 'Dark Gray', hex: '#555555' },
  { id: 'blue', label: 'Blue', hex: '#5555ff' },
  { id: 'green', label: 'Green', hex: '#55ff55' },
  { id: 'aqua', label: 'Aqua', hex: '#55ffff' },
  { id: 'red', label: 'Red', hex: '#ff5555' },
  { id: 'light_purple', label: 'Light Purple', hex: '#ff55ff' },
  { id: 'yellow', label: 'Yellow', hex: '#ffff55' },
  { id: 'white', label: 'White', hex: '#ffffff' },
];
