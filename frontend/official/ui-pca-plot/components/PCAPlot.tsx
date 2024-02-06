import React from 'react'
import { useAppSelector } from "@/redux/hooks";
import Plot from 'react-plotly.js';

const PCAPlot = () => {

    const { pcaPlotData } = useAppSelector<any>((state) => state.plotReducer);

    console.log("pcaPlotData ne aaaaaaa", pcaPlotData)
    console.log("pcaPlotData.data ne aaaaaaa", pcaPlotData.data)

    return (
        <div>
            {pcaPlotData && pcaPlotData.data ? <div>
                aaaaaaaa111
            </div> : null}
            {pcaPlotData && pcaPlotData.data ?
                <div className='p-3 border border-gray-200 rounded-lg'>
                    <Plot
                        useResizeHandler
                        style={{ width: "100%", height: "100%" }}
                        data={pcaPlotData.data}
                        layout={pcaPlotData.layout}
                    />
                </div> : null}
        </div>
    )
}

export default PCAPlot