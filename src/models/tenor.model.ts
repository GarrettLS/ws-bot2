export interface IMedia {
  url: string;
}

export interface IMediaKind {
  gif: IMedia;
}

export interface IGif {
  id: string;
  media: IMediaKind[];
}

export interface ITenorResponse {
  results: IGif[];
}
