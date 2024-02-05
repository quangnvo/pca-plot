import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import plotReducer from './features/plotSlice'

export const store = configureStore({
	reducer: {
		counterReducer,
		plotReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
