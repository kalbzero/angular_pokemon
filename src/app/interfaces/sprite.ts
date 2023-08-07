interface Front {
    front_default: string,
    front_shiny: string,
}

interface Front_Female {
    front_default: string,
    front_female: string | null,
}

interface Back_Front {
    back_default: string,
    back_gray: string,
    front_default: string,
    front_gray: string,
}

interface Back_Front_Shiny {
    back_default: string,
    back_shiny: string,
    front_default: string,
    front_shiny: string,
}

interface Back_Front_Shiny_Female {
    back_default: string,
    back_female: string | null,
    back_shiny: string,
    back_shiny_female: string | null,
    front_default: string,
    front_female: string | null,
    front_shiny: string,
    front_shiny_female: string | null,
}

interface Back_Front_Animated {
    animated: Back_Front_Shiny_Female,
    back_default: string,
    back_female: string | null,
    back_shiny: string,
    back_shiny_female: string | null,
    front_default: string,
    front_female: string | null,
    front_shiny: string,
    front_shiny_female: string | null,
}

interface Dream_World {
    front_default: string,
    front_female: null | string
}

interface Front_Shiny_Female {
    front_default: string,
    front_female: null | string,
    front_shiny: string,
    front_shiny_female: null | string,
}

interface Official_Artwork {
    front_default: string,
}

interface Other {
    dream_world: Dream_World,
    home: Front_Shiny_Female,
    'official-artwork': Official_Artwork
}

interface GenerationI {
    'red-blue': Back_Front,
    yellow: Back_Front,
}

interface GenerationII {
    crystal: Back_Front_Shiny,
    gold: Back_Front_Shiny,
    silver: Back_Front_Shiny,
}

interface GenerationIII {
    emerald: Front,
    'firered-leafgreen': Back_Front_Shiny,
    'ruby-sapphire': Back_Front_Shiny,
}

interface GenerationIV {
    'diamond-pearl': Back_Front_Shiny_Female,
    'heartgold-soulsilver': Back_Front_Shiny_Female,
    platinum: Back_Front_Shiny_Female
}

interface GenerationV {
    'black-white': Back_Front_Animated,
}

interface GenerationV {
    'black-white': Back_Front_Animated,
}

interface GenerationVI {
    'omegaruby-alphasapphire': Front_Shiny_Female,
    'x-y': Front_Shiny_Female
}

interface GenerationVII {
    icons: Front_Female,
    'ultra-sun-ultra-moon': Front_Shiny_Female
}

interface GenerationVIII {
    icons: Front_Female,
}

interface Versions { // FIXME
    'generation-i': GenerationI,
    'generation-ii': GenerationII,
    'generation-iii': GenerationIII,
    'generation-iv': GenerationIV,
    'generation-v': GenerationV,
    'generation-vi': GenerationVI,
    'generation-vii': GenerationVII,
    'generation-viii': GenerationVIII,
}

export interface Sprite {
    back_default: string,
    back_female: null | string,
    back_shiny: string,
    back_shiny_female: null | string,
    front_default: string,
    front_female: null | string,
    front_shiny: string,
    front_shiny_female: null | string,
    other: Other,
    versions: Versions
}