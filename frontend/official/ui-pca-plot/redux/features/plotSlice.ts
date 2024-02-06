import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type PlotState = {
	csvData: any
	screePlotData: any
	pcaPlotData: any
}

const initialState: PlotState = {
	csvData: [],
	screePlotData: {},
	pcaPlotData: {},
}

export const plot = createSlice({
	name: 'plot',
	initialState,
	reducers: {
		setCsvData: (state, action: PayloadAction<any>) => {
			state.csvData = action.payload
		},
		setScreePlotData: (state, action: PayloadAction<any>) => {
			console.log('đã vào setScreePlotData')
			state.screePlotData = action.payload
		},
		setPCAPlotData: (state, action: PayloadAction<any>) => {
			console.log('đã vào setPCAPlotData')
			state.pcaPlotData = action.payload
		},
	},
})

export const { setCsvData, setPCAPlotData, setScreePlotData } = plot.actions
export default plot.reducer
