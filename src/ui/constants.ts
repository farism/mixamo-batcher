import { nanoid } from 'nanoid'
import { Download, Pack, PackProduct, Project } from '../types'

export function defaultProject(): Project {
  return {
    id: nanoid(),
    name: '',
    inplace: false,
    download: defaultDownload()
  }
}

export function defaultPack(): Pack {
  return {
    id: nanoid(),
    projectId: nanoid(),
    name: '',
    character: {
      id: nanoid(),
      name: ''
    },
    products: [],
  }
}

export function defaultPackProduct(): PackProduct {
  return {id: 'c9c818ab-b96c-11e4-a802-0aaa78deedf9',
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
    download: defaultDownload()
  }
}

export function defaultDownload(): Download {
  return {
    format: 'fbx7_2019',
    skin: 'true',
    fps: '30',
    reducekf: '0',
  }
}