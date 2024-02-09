"use client"

import { useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table } from 'antd';


export default function Home() {

  const PORT = 8080
  const [randomData, setRandomData] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [plotData, setPlotData] = useState(null);
  const [screePlotData, setScreePlotData] = useState(null);

  const generateRandomData = async () => {
    try {
      const response = await axios.get(`http://localhost:${PORT}/api/generate_data`);
      console.log("data random neeeeeeee", response.data)
      setCsvData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const generatePCAPlot = async () => {
    try {
      const response = await axios.post(`http://localhost:${PORT}/api/generate_pca`, csvData);
      setPlotData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const generateScreePlot = async () => {
    try {
      const response = await axios.post(`http://localhost:${PORT}/api/generate_scree_plot`, csvData);
      setScreePlotData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file.type === 'text/csv' || file.type === 'text/plain') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
        },
      });
    }
  };

  // Convert csvData to the format required by Ant Design Table
  const tableData = csvData.map((eachRow, index) => ({
    key: index,
    ...eachRow,
  }));
  console.log("tableData aaaaaaa", tableData)

  // Create columns dynamically based on csvData
  const columns = csvData.length > 0 ? Object.keys(csvData[0]).map(key => ({
    title: key,
    dataIndex: key,
    key: key,
    width: 150,
  })) : [];

  return (
    <div className='container my-4 flex flex-col gap-5'>

      <div className="flex gap-2 py-3 sticky top-1 z-10 bg-opacity-50 backdrop-filter backdrop-blur bg-white">
        <Button onClick={generateRandomData} >
          Generate random data
        </Button>

        <Input
          type='file'
          accept='.csv,.txt'
          onChange={handleFileUpload}
          className="w-1/3"
        />

        <Button onClick={generateScreePlot} >
          Generate scree plot
        </Button>

        <Button onClick={generatePCAPlot}>
          Generate PCA plot
        </Button>
      </div>


      {/* Scree plot */}
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

      {/* PCA plot */}
      <div>
        {plotData && (
          <div className='p-3 border border-gray-200 rounded-lg'>
            <Plot
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
              data={plotData.data}
              layout={plotData.layout}
            />
          </div>
        )}
      </div>

      {/* Number of samples */}
      <div>
        <p>
          Number of samples: <strong>{csvData ? csvData.length : "0"}</strong>
        </p>
      </div>

      {/* Antd table */}
      <Table
        columns={columns}
        dataSource={tableData}
        scroll={{
          x: 1500,
        }}
        // antd site header height
        sticky={{
          offsetHeader: 64,
        }}
      />

    </div>
  );
}
