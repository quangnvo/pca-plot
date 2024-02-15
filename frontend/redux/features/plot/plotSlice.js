"use client"

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    colorGroupsForPCAPlot: [
        {
            groupId: "1",
            colorCode: "#000000",
            names: []
        },
        {
            groupId: "2",
            colorCode: "#ffffff",
            names: []
        }
    ],
    nameOfSamplesInPCAPlot: [
        {
            name: "Sample 1",
            groupId: "1"
        },
        {
            name: "Sample 2",
            groupId: "1"
        }
    ],
}

export const plotSlice = createSlice({
    name: 'plot',
    initialState,
    reducers: {

    },
});

export const { } = plotSlice.actions;

export default plotSlice.reducer;