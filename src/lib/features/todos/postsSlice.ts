import { createSlice } from "@reduxjs/toolkit"

const initialState: any = {
  status: false
}

const postsSlice = createSlice({
    name: 'User',
    initialState: initialState,
    reducers: {
      Login: (state) => {
        state.status = true  
      },
      Logout :(state)=>{
        state.status = false 
        
      }
    }
})

export const { Login, Logout} = postsSlice.actions;
export default postsSlice.reducer;