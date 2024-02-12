"use client"

import { useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table } from 'antd';


export default function Home() {

  /*####################
  # Define the backend port
  ####################*/
  const BACKEND_PORT = 8080

  /*####################
  # Setup initial variables
  # We have "csvData", "setCsvData" ; "plotData", "setPlotData" ;  etc.
  # The "setSomething" function is used to update the "something" 
  # For example, at the beginning, something = "123", then setSomething("abcdef") will update something, then something = "abcdef"
  # The "useState" function is a React hook function that is used to create the combo of "something" and "setSomething"
  ####################*/
  const [csvData, setCsvData] = useState([]);
  const [plotData, setPlotData] = useState(null);
  const [screePlotData, setScreePlotData] = useState(null);
  const [loadingsPlotData, setLoadingsPlotData] = useState(null)

  /*####################
  # Generate random data function
  ####################*/
  const generateRandomData = async () => {
    try {
      // Send a GET request to the backend to generate random data
      // then backend will return the random data
      // then put the random generated data to the "csvData" by using "setCsvData"
      const response = await axios.get(`http://localhost:${BACKEND_PORT}/api/generate_data`);
      setCsvData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  /*####################
  # Generate Scree plot function
  ####################*/
  const generateScreePlot = async () => {
    try {
      // Send a POST request with the "csvData" to the backend
      // then backend will return the scree plot data
      // then put the scree plot data to the "screePlotData" by using "setScreePlotData"
      const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_scree_plot`, csvData);
      setScreePlotData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  /*####################
  # Generate PCA plot function
  ####################*/
  const generatePCAPlot = async () => {
    try {
      const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_pca`, csvData);
      setPlotData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  /*####################
  # Generate Loadings plot
  ####################*/
  const generateLoadingsPlot = async () => {
    try {
      const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_loadings_plot`, csvData);
      setPlotData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  /*####################
  # Handle file upload function
  ####################*/
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    // Checking if the file is a csv file or the txt file
    // If .csv or .txt file, then continue
    if (file.type === 'text/csv' || file.type === 'text/plain') {
      // Using PapaParse, a library used for parsing, to parse the file
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // Then set the parsed data to the csvData
          setCsvData(results.data);
        },
      });
    }
  };

  /*####################
  # Convert the data from the csv file that user uploaded to the format required by Ant Design Table
  # The Ant Design Table belongs to the library "antd" which is used for the UI. Link: https://ant.design/components/table
  # In the following code, two things are done:
  # 1. Convert csvData to the tableDataForAntdTable format required by Ant Design Table
  # 2. Set the columns for the Ant Design Table
  ####################*/

  const tableDataForAntdTable = csvData.map((eachRow, index) => ({
    key: index,
    ...eachRow,
  }));

  const columnsForAntdTable = csvData.length > 0 ? Object.keys(csvData[0]).map(key => ({
    title: key,
    dataIndex: key,
    key: key,
    width: 150,
  })) : [];


  /*####################
  # Return the UI
  ####################*/
  return (
    <div className='container my-4 flex flex-col gap-5'>

      <div className="flex py-3 justify-between sticky top-1 z-10 bg-opacity-50 backdrop-filter backdrop-blur bg-white">
        <div className='flex gap-2'>

          {/* Button generate random data */}
          <Button onClick={generateRandomData} >
            Generate random data
          </Button>

          {/* Button upload file */}
          <Input
            type='file'
            accept='.csv,.txt'
            onChange={handleFileUpload}
          />
        </div>

        <div className='flex gap-2'>
          {/* Button generate scree plot */}
          <Button onClick={generateScreePlot} >
            Generate Scree plot
          </Button>

          {/* Button generate PCA plot */}
          <Button onClick={generatePCAPlot}>
            Generate PCA plot
          </Button>

          {/* Button generate PCA plot */}
          <Button onClick={generateLoadingsPlot}>
            Generate Loadings plot
          </Button>
        </div>
      </div>

      {/* Scree plot */}
      {/* 
        - The {something && (plot)} means that if "something" is not null, then (plot) will be rendered 
        - At the beginning, screePlotData is null, so (plot) is not rendered
        - After a user clicks the "Generate scree plot" button, then screePlotData will have value, then (plot) will be rendered
      */}
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

      {/* Loadings plot */}
      <div>
        {loadingsPlotData && (
          <div className='p-3 border border-gray-200 rounded-lg'>
            <Plot
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
              data={loadingsPlotData.data}
              layout={loadingsPlotData.layout}
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

      {/* Table */}
      <Table
        columns={columnsForAntdTable}
        dataSource={tableDataForAntdTable}
        scroll={{
          x: 1500,
        }}
        sticky={{
          offsetHeader: 64,
        }}
      />

    </div>
  );
}
