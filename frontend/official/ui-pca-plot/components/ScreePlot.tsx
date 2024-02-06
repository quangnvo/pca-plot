import React from 'react'
import { useAppSelector } from "@/redux/hooks";
import Plot from 'react-plotly.js';


const ScreePlot = () => {

    const { screePlotData } = useAppSelector<any>((state) => state.plotReducer);

    console.log("screePlotData ne aaaaaaa", screePlotData)

    return (
        <div>
            {screePlotData && screePlotData.data ? (
                <div className='p-3 border border-gray-200 rounded-lg'>
                    {/* <Plot
                        useResizeHandler
                        style={{ width: "100%", height: "100%" }}
                        data={screePlotData.data}
                        layout={screePlotData.layout}
                    /> */}
                    <Plot
                        useResizeHandler
                        style={{ width: "100%", height: "100%" }}
                        data={screePlotData.data}
                        layout={screePlotData.layout}
                    />
                </div>
            ) : null}
        </div>
    )
}

export default ScreePlot