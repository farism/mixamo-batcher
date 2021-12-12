export enum MessageType {
  Init,
  PrimaryUpdated,
  ProductsFetched,
  ProductFetched,
  ScreenCapture,
  SetAccessToken,
  SetSearchQuery,
  StreamFetched,
  ViewProduct,
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
      type: MessageType.ScreenCapture
      payload?: any
    }
  | {
      type: MessageType.SetAccessToken
      payload: string
    }
  | {
      type: MessageType.SetSearchQuery
      payload: string
    }
  | {
      type: MessageType.StreamFetched
      payload: Stream
    }
  | {
      type: MessageType.ViewProduct
      payload: Product
    }

export interface Project {
  id: string
  name: string
  download: Download
  inplace: boolean
}

export interface Pack {
  id: string
  projectId: string
  name: string
  character: Character
  products: PackProduct[]
}

export interface Character {
  id: string
  name: string
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
    gms_hash: {
      'model-id': number
      mirror: boolean
      trim: [number, number]
      inplace: boolean
      'arm-space': number
      params: Array<[string, number]>
    }
  }
  source: string
}

export interface Download {
  format: 'fbx7_2019' | 'fbx7_2019_ascii' | 'fbx7_unity' | 'fbx7_2014' | 'fbx6' | 'dae_mixamo'
  fps: '24' | '30' | '60'
  reducekf: '0' | '1' | '2'
  skin: 'true' | 'false'
}

export interface PackProduct extends Product {
  download: Download
}

export interface Stream {
  character_id: string
  gms_hash: Array<{
    'model-id': number
    mirror: boolean
    trim: [number, number]
    inplace: boolean
    'arm-space': number
    params: string
  }>
}

export interface ExportResponse {
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
}
