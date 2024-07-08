export interface Photo {
  uuid: string;
  uri: string;
  location: { latitude: number; longitude: number };
}

export interface PhotoState {
  photos: Photo[];
}
