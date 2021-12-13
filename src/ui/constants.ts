import { nanoid } from 'nanoid'
import { Preferences, Pack, PackProduct, Project, Character } from '../types'

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

export const exportRequestData = {
  gms_hash: [
    {
      'model-id': 102450901,
      mirror: false,
      trim: [0, 100],
      overdrive: 0,
      params: '0,0',
      'arm-space': 0,
      inplace: false,
    },
  ],
  preferences: {
    format: 'fbx7_2019',
    skin: 'true',
    fps: '30',
    reducekf: '0',
  },
  character_id: 'efb06b46-a470-49b2-b7da-a06755d4dba7',
  type: 'Motion',
  product_name: 'Shoved Reaction With Spin',
}
