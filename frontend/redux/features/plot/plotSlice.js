"use client"

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    colorGroupsForPCAPlot: [
        {
            groupId: "1",
            colorCode: "#ffffff",
            names: []
        },
        {
            groupId: "2",
            colorCode: "##272E3F",
            names: []
        }
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
            groupId: "1"
        },
        {
            name: "PNA79_30m_B",
            groupId: "1"
        },
        {
            name: "PNA79_30m_C",
            groupId: "1"
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

    },
});

export const { } = plotSlice.actions;

export default plotSlice.reducer;