import React from 'react'
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import Plot from 'react-plotly.js';

const ScreePlot = () => {

    const { screePlotData } = useAppSelector<any>((state) => state.plotReducer);

    return (
        <div>
            {screePlotData && (
                <div className='p-3 border border-gray-200 rounded-lg'>
                    <Plot
                        useResizeHandler
                        style={{ width: "100%", height: "100%" }}
                        data={screePlotData.data}
                        layout={screePlotData.layout}
                    />
                </div>
            )}
        </div>
    )
}

export default ScreePlot