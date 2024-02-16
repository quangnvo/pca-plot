"use client"

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    colorGroupsForPCAPlot: [
        {
            groupId: "1",
            colorCode: "#272E3F",
            names: []
        },
        {
            groupId: "2",
            colorCode: "#FFFF00",
            names: []
        },
    ],
    nameOfSamplesInPCAPlot: [
        {
            name: "H2O_30m_A",
            groupId: "1"
        },
        {
            name: "H2O_30m_B",
            groupId: "1"
        },
        {
            name: "H2O_30m_C",
            groupId: "1"
        },
        {
            name: "PNA79_30m_A",
            groupId: "2"
        },
        {
            name: "PNA79_30m_B",
            groupId: "2"
        },
        {
            name: "PNA79_30m_C",
            groupId: "2"
        },
        {
            name: "PNAscr_30m_A",
            groupId: "1"
        },
        {
            name: "PNAscr_30m_B",
            groupId: "1"
        },
        {
            name: "PNAscr_30m_C",
            groupId: "1"
        },
        {
            name: "H2O_16h_A",
            groupId: "1"
        },
        {
            name: "H2O_16h_B",
            groupId: "1"
        },
        {
            name: "H2O_16h_C",
            groupId: "1"
        },
        {
            name: "PNA79_16h_A",
            groupId: "1"
        },
        {
            name: "PNA79_16h_B",
            groupId: "1"
        },
        {
            name: "PNA79_16h_C",
            groupId: "1"
        },
        {
            name: "PNAscr_16h_A",
            groupId: "1"
        },
        {
            name: "PNAscr_16h_B",
            groupId: "1"
        },
        {
            name: "PNAscr_16h_C",
            groupId: "1"
        }
    ],
}

export const plotSlice = createSlice({
    name: 'plot',
    initialState,
    reducers: {
        updateColorGroup: (state, action) => {
            const { groupId, names } = action.payload;

            // Find the group in the 'colorGroupsForPCAPlot' array
            const group = state.colorGroupsForPCAPlot.find(group => group.groupId === groupId);

            // If the group was found...
            if (group) {
                // Update the 'names' array of the group
                group.names = names;
            }
        },
    },
});

export const { updateColorGroup } = plotSlice.actions;

export default plotSlice.reducer;