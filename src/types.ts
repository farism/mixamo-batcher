export enum MessageType {
  Init,
  PrimaryUpdated,
  ProductsFetched,
  ProductFetched,
  SetAccessToken,
  StreamFetched,
  ViewProduct,
  FetchNextPage,
  Export,
  Download,
}

export type Message =
  | {
      type: MessageType.Init
      payload?: any
    }
  | {
      type: MessageType.PrimaryUpdated
      payload: any
    }
  | {
      type: MessageType.ProductFetched
      payload: Product
    }
  | {
      type: MessageType.ProductsFetched
      payload: string[] // array of product ids, used to locate correct thumbnail to click on
    }
  | {
      type: MessageType.SetAccessToken
      payload: string // the access token
    }
  | {
      type: MessageType.StreamFetched
      payload: Stream
    }
  | {
      type: MessageType.ViewProduct
      payload: Product
    }
  | {
      type: MessageType.Export
      payload: ExportFile
    }
  | {
      type: MessageType.Download
      payload: Pack
    }
  | {
      type: MessageType.FetchNextPage
      payload: string // the search query
    }

export interface Preferences {
  format: 'fbx7_2019' | 'fbx7_2019_ascii' | 'fbx7_unity' | 'fbx7_2014' | 'fbx6' | 'dae_mixamo'
  fps: '24' | '30' | '60'
  reducekf: '0' | '1' | '2'
  skin: 'true' | 'false'
}

export interface Project {
  id: string
  name: string
  preferences: Preferences
  inplace: boolean
  packs: Record<string, Pack>
}

export interface Pack {
  id: string
  name: string
  character: Character
  products: PackProduct[]
}

export interface Character {
  id: string
  name: string
}

export interface GmsHash {
  'model-id': number
  mirror: boolean
  trim: [number, number]
  inplace: boolean
  'arm-space': number
  params: [string, number][]
}

export interface GmsHashStream extends Omit<GmsHash, 'params'> {
  params: string
}

export interface Product {
  id: string
  type: string
  description: string
  category: string
  character_type: string
  name: string
  motion_id: string
  details: {
    supports_inplace: boolean
    loopable: boolean
    default_frame_length: number
    duration: number
    gms_hash: GmsHash
  }
  source: string
}

export interface PackProduct extends Product {
  projectOverride: boolean
  preferences: Preferences
}

export interface Stream {
  character_id: string
  gms_hash: GmsHashStream[]
}

export interface ExportProductRequest {
  character_id: string
  product_name: string
  preferences: Preferences
  gms_hash: GmsHashStream[]
  type: 'Motion'
}

export interface ExportProductResponse {
  job_result?: string
  job_type: string
  job_uuid: string
  message: string
  status: string
  type: string
  uuid: string
}

export interface Active {
  projectId?: string | null
  packId?: string | null
  productId?: string | null
}

export interface ExportFile {
  version: number
  projects: Record<string, Project>
}
