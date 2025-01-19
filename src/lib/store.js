import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "./features/todos/postsSlice";

export const store = configureStore({
    reducer: {
        posts: postsSlice
    }
})