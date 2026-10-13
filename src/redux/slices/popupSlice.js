import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
    name: 'popup',
    initialState: {
        isPopupVisible : ''
    },
    reducers: {
        setIsPopupVisible: (state, {payload}) => {
            state.isPopupVisible = payload
        }
    }
})

export const {setIsPopupVisible} = popupSlice.actions
export const selectIsPopupVisble = (state) => state?.popup?.isPopupVisible

export default popupSlice.reducer