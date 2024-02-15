"use client"

import { configureStore } from '@reduxjs/toolkit'
import plotReducer from "./features/plot/plotSlice"

export const store = configureStore({
    reducer: {
        plotReducer,
    },
})