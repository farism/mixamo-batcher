export enum MessageType {
  Init,
  OnCompleteUpdatePrimary,
  OnBeforeRequestProducts,
  OnCompleteRequestProducts,
  OnBeforeRequestProduct,
  OnCompleteRequestProduct,
  OnBeforeRequestStream,
  ScreenCapture,
  SetSearchQuery,
  ViewProduct,
}

export type Message =
  | {
      type: MessageType.Init
      payload?: any
    }
  | {
      type: MessageType.OnCompleteUpdatePrimary
      payload: chrome.webRequest.WebResponseCacheDetails
    }
  | {
      type: MessageType.OnBeforeRequestProducts
      payload: chrome.webRequest.WebRequestBodyDetails
    }
  | {
      type: MessageType.OnCompleteRequestProducts
      payload?: any
    }
  | {
      type: MessageType.OnBeforeRequestProduct
      payload: chrome.webRequest.WebRequestBodyDetails
    }
  | {
      type: MessageType.OnCompleteRequestProduct
      payload?: any
    }
  | {
      type: MessageType.SetSearchQuery
      payload: string
    }
  | {
      type: MessageType.ScreenCapture
      payload?: any
    }
  | {
      type: MessageType.OnBeforeRequestStream
      payload: Stream
    }
  | {
      type: MessageType.ViewProduct
      payload: Product
    }

export interface Project {
  id: string
  name: string
}

export interface Pack {
  id: string
  projectId: string
  name: string
  character: Character
  products: Product[]
}

export interface Character {
  id: string
  name: string
}

export interface ProductSimple {
  category: string
  character_type: string
  description: string
  id: string
  motion_id: string
  name: string
  source: string
  thumbnail: string
  thumbnail_animated: string
  type: string
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
  thumbnail: string
  thumbnail_animated: string
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
  project?: Project
  pack?: Pack
}
