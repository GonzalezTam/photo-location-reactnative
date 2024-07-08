import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Photo, PhotoState } from "../../types/PhotoInterface";

const initialState: PhotoState = {
  photos: [],
};

const photoSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    addPhoto: (state, action: PayloadAction<Photo>) => {
      state.photos.push(action.payload);
    },
    deletePhoto: (state, action: PayloadAction<string>) => {
      state.photos = state.photos.filter(
        (photo) => photo.uuid !== action.payload,
      );
    },
  },
});

export const { addPhoto, deletePhoto } = photoSlice.actions;
export default photoSlice.reducer;
