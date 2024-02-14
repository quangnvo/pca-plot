"use client"

import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table } from 'antd';
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"


export default function Home() {

  /*####################
  # Define the backend port
  ####################*/
  const BACKEND_PORT = 8080

  /*####################
  # Setup initial variables
  # We have "csvData", "setCsvData" ; "pcaPlotData", "setPcaPlotData" ;  etc.
  # The "setSomething" function is used to update the "something" 
  # For example, at the beginning, something = "123", then setSomething("abcdef") will update something, then something = "abcdef"
  # The "useState" function is a React hook function that is used to create the combo of "something" and "setSomething"
  ####################*/
  const [csvData, setCsvData] = useState([]);
  const [screePlotData, setScreePlotData] = useState(null);
  const [pcaPlotData, setPcaPlotData] = useState(null);
  const [loadingsPlotData, setLoadingsPlotData] = useState(null)
  const [color, setColor] = useState("#fa8072");

  const initialColorGroup = [
    {
      group: "Group 1",
      colorCode: "#1f77b4",
      names: []
    },
    {
      group: "Group 2",
      colorCode: "#ff7f0e",
      names: []
    },
  ];

  const [colorGroup, setColorGroup] = useState(initialColorGroup);







  const addGroup = () => {
    setColorGroup([
      ...colorGroup,
      {
        group: `Group ${colorGroup.length + 1}`,
        colorCode: "#000000",
        names: []
      }
    ]);
  };

  const removeGroup = (index) => {
    const newColorGroup = [...colorGroup];
    newColorGroup.splice(index, 1);
    setColorGroup(newColorGroup);
  };



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
      setPcaPlotData(response.data);
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
      setPcaPlotData(response.data);
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

  console.log('tableDataForAntdTable', tableDataForAntdTable)
  console.log('columnsForAntdTable', columnsForAntdTable)
  console.log("🚀🚀🚀 pca plot data", pcaPlotData)

  const renderButtonGenerateRandomData = () => {
    return (
      <Button onClick={generateRandomData} >
        Generate random data
      </Button>
    )
  }

  const renderButtonUploadFile = () => {
    return (
      <Input
        type='file'
        accept='.csv,.txt'
        onChange={handleFileUpload}
      />
    )
  }

  const renderButtonGenerateScreePlot = () => {
    return (
      <Button onClick={generateScreePlot} >
        Generate Scree plot
      </Button>
    )
  }

  const renderButtonGeneratePCAPlot = () => {
    return (
      <Button onClick={generatePCAPlot}>
        Generate PCA plot
      </Button>
    )
  }

  const renderButtonGenerateLoadingsPlot = () => {
    return (
      <Button onClick={generateLoadingsPlot}>
        Generate Loadings plot
      </Button>
    )
  }

  const renderScreePlot = () => {
    if (screePlotData) {
      return (
        <div className='p-3 border border-gray-200 rounded-lg'>
          <Plot
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
            data={screePlotData.data}
            layout={screePlotData.layout}
          />
        </div>
      )
    }
  }

  const renderPCAPlot = () => {
    if (pcaPlotData) {
      return (
        <div className='p-3 border border-gray-200 rounded-lg'>
          <Plot
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
            data={pcaPlotData.data}
            layout={pcaPlotData.layout}
          />
        </div>
      )
    }
  }

  const renderColorCards = () => {
    if (pcaPlotData) {
      return (
        <div className='grid grid-cols-12 gap-3'>
          {colorGroup.map((group, index) => (
            <Card key={index} className="col-span-3 p-5">
              <div className='flex justify-between gap-2 mb-5'>

                <Input
                  type="color"
                  value={group.colorCode}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />

                <Button
                  onClick={() => removeGroup(index)}
                  variant="secondary"
                >
                  Remove
                </Button>
              </div>

              <div className="overflow-auto h-64">
                {pcaPlotData.data.map((item, index) => (
                  <div key={index} className={`flex items-center space-x-2 mb-2`}>
                    <Checkbox id={`checkbox-${index}`} />
                    <label
                      htmlFor={`checkbox-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )
    }
  }


  const renderNumberSamples = () => {
    return (
      <p>
        Number of samples: <strong>{csvData ? csvData.length : "0"}</strong>
      </p>
    )
  }

  const renderDataTable = () => {
    return (
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
    )
  }

  /*####################
  # Return the UI
  ####################*/
  return (
    <div className='container my-4 flex flex-col gap-5'>

      <div className="flex py-3 justify-between sticky top-1 z-10 bg-opacity-50 backdrop-filter backdrop-blur bg-white">
        <div className='flex gap-2'>
          {renderButtonGenerateRandomData()}
          {renderButtonUploadFile()}
        </div>

        <div className='flex gap-2'>
          {renderButtonGenerateScreePlot()}
          {renderButtonGeneratePCAPlot()}
          {renderButtonGenerateLoadingsPlot()}
        </div>
      </div>

      {renderScreePlot()}
      {renderColorCards()}
      <button onClick={addGroup}>Add Group</button>
      {renderPCAPlot()}

      {renderNumberSamples()}
      {renderDataTable()}
    </div>
  );
}
