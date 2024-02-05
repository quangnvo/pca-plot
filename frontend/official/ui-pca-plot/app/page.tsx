"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useState } from 'react';

import Plot from 'react-plotly.js';
import axios from 'axios';
import Papa from 'papaparse';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table } from 'antd';

import DataTable from "@/components/DataTable";
import ScreeButton from "@/components/ScreeButton";
import ScreePlot from "@/components/ScreePlot";
import PCAButton from "@/components/PCAButton";
import PCAPlot from "@/components/PCAPlot";

import { setCsvData } from "@/redux/features/plotSlice"


export default function Home() {
  const dispatch = useAppDispatch();
  const { csvData, pcaPlotData } = useAppSelector((state) => state.plotReducer)

  const PORT = 8080
  const [randomData, setRandomData] = useState<any>(null);
  const [plotData, setPlotData] = useState<any>(null);
  const [screePlotData, setScreePlotData] = useState<any>(null);


  const handleCSVFileUpload = (e: any) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results: any) => {
        dispatch(setCsvData(results.data))
      },
    });
  };


  // const generatePCAPlot = async () => {
  //   try {
  //     const response = await axios.post(`http://localhost:${PORT}/api/generate_pca`, csvData);
  //     setPlotData(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // const generateScreePlot = async () => {
  //   try {
  //     const response = await axios.post(`http://localhost:${PORT}/api/generate_scree_plot`, csvData);
  //     setScreePlotData(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }



  // Convert csvData to the format required by Ant Design Table
  // const tableData = csvData.map((row, index) => ({
  //   key: index,
  //   ...row as any,
  // }));

  // Create columns dynamically based on csvData
  // const columns = csvData.length > 0 ? Object.keys(csvData[0]).map(key => ({
  //   title: key,
  //   dataIndex: key,
  //   key: key,
  //   width: 150,
  // })) : [];

  return (
    <div className='container my-4 flex flex-col gap-5'>

      <div className="flex gap-2 py-3 sticky top-1 z-10 bg-opacity-50 backdrop-filter backdrop-blur bg-white">
        {/* Button upload CSV file */}
        <Input
          type='file'
          accept='.csv'
          onChange={handleCSVFileUpload}
          className="w-1/3"
        />

        {/* Button generate scree plot */}
        {/* <Button onClick={generateScreePlot} >
          Generate scree plot
        </Button> */}
        <ScreeButton />
        <PCAButton />
      </div>

      <ScreePlot />
      <PCAPlot />

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

      {/* Number of samples */}
      <div>
        <p>
          Number of samples in CSV file: <strong>{csvData && csvData.length > 0 ? csvData.length : "0"}</strong>
        </p>
      </div>

      <DataTable />
    </div>
  );
}
