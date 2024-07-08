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
  },
});

export const { addPhoto } = photoSlice.actions;
export default photoSlice.reducer;
