"use client"

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    colorAAA: "#11111",
    colorGroup: [
        {
            group: "Group 1",
            colorCode: "#FFFF00",
            names: []
        },
        {
            group: "Group 2",
            colorCode: "#272E3F",
            names: []
        },
    ],
}

export const plotSlice = createSlice({
    name: 'plot',
    initialState,
    reducers: {
        setColor: (state, action) => {
            state.color = action.payload;
        },
        setColorGroup: (state, action) => {
            state.colorGroup = action.payload;
        },
        addGroup: (state) => {
            state.colorGroup.push({
                group: `Group ${state.colorGroup.length + 1}`,
                colorCode: "#000000",
                names: []
            });
        },
        removeGroup: (state, action) => {
            state.colorGroup.splice(action.payload, 1);
        },
    },
});

export const { setColor, setColorGroup, addGroup, removeGroup } = plotSlice.actions;

export default plotSlice.reducer;