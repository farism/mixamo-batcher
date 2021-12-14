import { nanoid } from 'nanoid'
import { Character, Pack, PackProduct, Preferences, Project } from '../types'

export function defaultProject(name: string = ''): Project {
  return {
    id: nanoid(),
    inplace: false,
    preferences: defaultPreferences(),
    packs: {},
    name,
  }
}

export function defaultPack(name: string, character: Character): Pack {
  return {
    id: nanoid(),
    name,
    character,
    products: [defaultPackProduct()],
  }
}

export function defaultPackProduct(): PackProduct {
  return {
    id: 'c9c818ab-b96c-11e4-a802-0aaa78deedf9',
    type: 'Motion',
    description: 'Standard T-Pose',
    category: '',
    character_type: 'human',
    name: 'T-Pose',
    motion_id: 'c9c818ab-b96c-11e4-a802-0aaa78deedf9',
    details: {
      supports_inplace: false,
      loopable: false,
      default_frame_length: 0,
      duration: 0,
      gms_hash: {
        'model-id': 115510901,
        mirror: false,
        trim: [0, 100],
        inplace: false,
        'arm-space': 0,
        params: [
          ['Posture', 1],
          ['Overdrive', 0],
        ],
      },
    },
    source: 'system',
    projectOverride: true,
    preferences: {
      ...defaultPreferences(),
      skin: 'true',
    },
  }
}

export function defaultPreferences(): Preferences {
  return {
    format: 'fbx7_2019',
    skin: 'false',
    fps: '30',
    reducekf: '0',
  }
}
