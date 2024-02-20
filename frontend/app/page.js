"use client"

import { useState, useRef } from 'react';

import Plot from 'react-plotly.js';
import axios from 'axios';
import Papa from 'papaparse';

import { Table, Select, Input as InputAntd, Space } from 'antd';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { SearchOutlined } from '@ant-design/icons';

import Highlighter from 'react-highlight-words';

export default function Home() {

  /*####################
  # Define the backend port
  ####################*/
  const BACKEND_PORT = 8080

  /*####################
  # The following code is used to only setup INITIAL VARIABLES
  ####################*/
  // We have "csvData", "setCsvData" ; "pcaPlotData", "setPcaPlotData" ;  etc.
  // The "setSomething" function is used to update the "something"
  // For example, at the beginning, something = "123", then setSomething("abcdef") will update something, then something = "abcdef"
  // The "useState" function is a React hook function that is used to create the combo of "something" and "setSomething"
  // The "useState" is used to trigger the re-render of the UI when the "something" is updated
  const [csvData, setCsvData] = useState([]);
  const [screePlotData, setScreePlotData] = useState(null);
  const [pcaPlotData, setPcaPlotData] = useState(null);
  const [loadingsTableData, setLoadingsTableData] = useState([]);

  const [isScreePlotVisible, setIsScreePlotVisible] = useState(false);
  const [isPcaPlotVisible, setIsPcaPlotVisible] = useState(false);
  const [isLoadingsPlotVisible, setIsLoadingsPlotVisible] = useState(false);
  const [isLoadingsTableVisible, setIsLoadingsTableVisible] = useState(false);
  const [isTopFiveContributorsTableVisible, setIsTopFiveContributorsTableVisible] = useState(false);

  const [nameOfSamplesInPCAPlot, setNameOfSamplesInPCAPlot]
    = useState([]);
  const [colorGroupsOfPcaPlot, setColorGroupsOfPcaPlot] = useState([
    {
      groupId: "1",
      name: "Group 1",
      colorCode: "#272E3F",
      sampleNames: []
    },
    {
      groupId: "2",
      name: "Group 2",
      colorCode: "#FFFF00",
      sampleNames: []
    },
  ]);
  // This option is the required format to use <Select> of antd library
  const [options, setOptions] = useState([
    {
      label: "Group 1",
      value: "1, #272E3F"
    },
    {
      label: "Group 2",
      value: "2, #FFFF00"
    },
  ]);



  /*####################
# The following code is only about FILE UPLOAD
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
  # End of the code for FILE UPLOAD
  ####################*/



  /*####################
  # The following code is about FUNCTIONS FOR BUTTONS: generateRandomData, generateScreePlot, generatePCAPlot, etc.
  ####################*/

  // Clear the uploaded file
  const clearUploadedFile = () => {
    // Clear the csvData state
    setCsvData([]);
    // Reset the file input value to null, this is important because if we don't reset the file input value to null, then the user can't upload the same file again
    document.getElementById('fileInput').value = null;
  }

  //  Generate random data function
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

  // Generate Scree plot function
  const generateScreePlot = async () => {
    if (!isScreePlotVisible) {
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
    setIsScreePlotVisible(!isScreePlotVisible);
  }

  //  Generate PCA plot function
  const generatePCAPlot = async () => {
    if (!isPcaPlotVisible) {
      try {
        const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_pca`, csvData);
        setPcaPlotData(response.data);
        // Extract the names of the samples in the PCA plot
        const names = []
        response.data.data.forEach((eachItem, index) => {
          names.push({
            name: eachItem.name,
            groupId: ""
          })
        })
        setNameOfSamplesInPCAPlot(names);
      } catch (error) {
        console.error(error);
      }
    }
    setIsPcaPlotVisible(!isPcaPlotVisible);
  }

  // Generate Loadings plot
  const generateLoadingsPlot = async () => {
    try {
      const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_loadings_plot`, csvData);
      setPcaPlotData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Generate Loadings table
  const generateLoadingsTable = async () => {
    if (!isLoadingsTableVisible) {
      try {
        const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_loadings_table`, csvData);
        console.log("🚀🚀🚀 loading table data", response)
        setLoadingsTableData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    setIsLoadingsTableVisible(!isLoadingsTableVisible);
  }

  // Generate Top 5 contributors table
  const generateTopFiveContributors = async () => {
    if (!isTopFiveContributorsTableVisible) {
      try {
        const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_top_five_contributors`, csvData);
        console.log("🚀🚀🚀 top 5 contributor table data", response)
      } catch (error) {
        console.error(error);
      }
    }
    setIsTopFiveContributorsTableVisible(!isTopFiveContributorsTableVisible);
  }
  /*####################
  # End of the code for FUNCTIONS FOR BUTTONS
  ####################*/



  /*####################
  # The following code is only about function used to render BUTTONS, such as renderButtonGenerateRandomData, renderButtonUploadFile, etc.
  ####################*/
  const renderButtonGenerateRandomData = () => {
    return (
      <Button onClick={generateRandomData} >
        Random data
      </Button>
    )
  }

  const renderButtonUploadFile = () => {
    return (
      <Input
        // The id is used to select the file input by using the document.getElementById('fileInput'), then we can reset the file input value to null
        id='fileInput'
        type='file'
        accept='.csv,.txt'
        onChange={handleFileUpload}
      />
    )
  }

  const renderButtonClearUploadedFile = () => {
    return (
      <Button
        variant="outline"
        onClick={clearUploadedFile}
      >
        Clear
      </Button>
    )
  }

  const renderButtonGenerateScreePlot = () => {
    return (
      <Button
        onClick={generateScreePlot}
        variant={isScreePlotVisible ? "default" : "outline"}
      >
        Scree plot
      </Button>
    )
  }

  const renderButtonGeneratePCAPlot = () => {
    return (
      <Button
        onClick={generatePCAPlot}
        variant={isPcaPlotVisible ? "default" : "outline"}
      >
        PCA plot
      </Button>
    )
  }

  const renderButtonGenerateLoadingsPlot = () => {
    return (
      <Button
        onClick={generateLoadingsPlot}
        variant={isLoadingsPlotVisible ? "default" : "outline"}
      >
        Loadings plot
      </Button>
    )
  }

  const renderButtonGenerateLoadingsTable = () => {
    return (
      <Button
        onClick={generateLoadingsTable}
        variant={isLoadingsTableVisible ? "default" : "outline"}
      >
        Loadings table
      </Button>
    )
  }

  const renderButtonGenerateTopFiveContributorsTable = () => {
    return (
      <Button
        onClick={generateTopFiveContributors}
        variant={isTopFiveContributorsTableVisible ? "default" : "outline"}
      >
        Top 5 contributors
      </Button>
    )
  }
  /*####################
  # End of the code for BUTTONS
  ####################*/


  /*####################
  # The following code is only about function used to render PLOTS, such as renderScreePlot, renderPCAPlot, etc.
  ####################*/
  const renderScreePlot = () => {
    if (isScreePlotVisible) {
      if (screePlotData) {
        return (
          <div className='p-3 border border-gray-200 rounded-lg'>
            <Plot
              useResizeHandler
              style={{ width: "100%", height: "500px" }}
              data={screePlotData.data}
              layout={screePlotData.layout}
            />
          </div>
        )
      }
    }
  }

  const renderPCAPlot = () => {
    if (isPcaPlotVisible) {
      if (pcaPlotData) {
        return (
          <div className='p-3 border border-gray-200 rounded-lg'>
            <Plot
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
              data={pcaPlotData.data}
              layout={pcaPlotData.layout}
              // key={Math.random()} is very important here, because it will force the Plot to re-render when the data is changed. Otherwise, the Plot will not re-render, so the color of the samples on the plot will not be updated.
              key={Math.random()}
            />
          </div>
        )
      }
    }
  }
  /*####################
  # End of the code for PLOTS
  ####################*/


  /*####################
  # The following code is only about function used to render TABLE, such as renderDataTable, renderLoadingsTable, etc.
  ####################*/

  /*####################
  # TABLE --- Searching Dropdown
  ####################*/
  // The following code is used to render the searching dropdown, which can be used in any table
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  // The function handleSearch is used to search the data in the table
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // The function handleReset is used to reset the search, meaning that it will clear the search input
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  // The function renderSearchingDropdown is used to render the search input in the table
  const renderSearchingDropdown = (nameOfColumn) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        className='p-3'
        // The onKeyDown={(e) => e.stopPropagation()} is a piece of JavaScript code used in React. It’s an event handler for the "onKeyDown" event.
        // The "onKeyDown" event is fired when a user is pressing a key (on the keyboard).
        // In simpler terms, when a key is pressed down, this code prevents the "onKeyDown" event from bubbling up to parent elements. This can be useful in scenarios where we don’t want parent elements to react to the key press event. For example, if we have a modal and we don’t want a key press in the modal to trigger events in the background page, we could use this code.
        // In this case, just to make sure that the event is not propagated to the parent element, we use this "onKeyDown". 
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Input area */}
        <InputAntd
          className='mb-3 w-full'
          ref={searchInput}
          placeholder="Search ..."
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value
            ? [e.target.value]
            : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, nameOfColumn)}
        />

        <div className="flex gap-2 justify-end">

          {/* Button Search */}
          <Button
            type="link"
            variant="secondary"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(nameOfColumn);
            }}
          >
            Search
          </Button>

          {/* Button Clear */}
          <Button
            variant="secondary"
            onClick={() => clearFilters && handleReset(clearFilters)}
          >
            Clear
          </Button>
        </div>
      </div>
    ),

    // Filter icon
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),

    onFilter: (value, record) =>
      record[nameOfColumn].toString().toLowerCase().includes(value.toLowerCase()),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },

    render: (text) =>
      searchedColumn === nameOfColumn ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  /*####################
  # End of the code for TABLE --- Searching Dropdown
  ####################*/


  /*####################
  # TABLE --- Data Table
  # The following code is only about the Data Table, which is the table that shows the data from the csv file that user uploaded
  ####################*/
  // Convert the data from the csv file that user uploaded to the format required by "Ant Design" (antd). The Ant Design Table belongs to the library "antd" which is used for the UI. Link: https://ant.design/components/table

  // Convert csvData to the "dataForCsvTable" format required by antd
  const dataForCsvTable = csvData.map((eachRow, index) => ({
    key: index,
    ...eachRow,
  }));

  // Set the columns for the antd table
  const columnForCsvTable = csvData.length > 0
    ? Object.keys(csvData[0]).map((nameOfEachColumn, index) => {
      let column = {
        title: nameOfEachColumn,
        dataIndex: nameOfEachColumn,
        key: nameOfEachColumn,
        width: 150,
        sortDirections: ['descend', 'ascend'],
      }
      // Check if it's the first column
      if (index === 0) {
        column = {
          ...column,
          ...renderSearchingDropdown(nameOfEachColumn),
        };
      }
      // Check if the column data is numeric
      else if (!isNaN(csvData[0][nameOfEachColumn])) {
        column = {
          ...column,
          sorter: (a, b) => a[nameOfEachColumn] - b[nameOfEachColumn],
        };
      }
      return column;
    })
    : [];

  // Render the data table from the csv file that user uploaded
  const renderDataTable = () => {
    if (csvData.length === 0) {
      return null;
    }
    return (
      <Table
        columns={columnForCsvTable}
        dataSource={dataForCsvTable}
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
  # End of the code for TABLE --- Data Table
  ####################*/

  /*####################
  # TABLE --- Loadings Table
  # The following code is only about the Loadings Table, which is the table that shows which genes contribute how much to the principal components
  ####################*/
  const dataForLoadingsTable = loadingsTableData.map((eachRow, index) => ({
    key: index,
    ...eachRow,
  }));

  const columnForLoadingsTable = loadingsTableData.length > 0
    ? Object.keys(loadingsTableData[0]).map((nameOfEachColumn) => {
      let column = {
        title: nameOfEachColumn,
        dataIndex: nameOfEachColumn,
        key: nameOfEachColumn,
        width: 100,
        sortDirections: ['descend', 'ascend'],
      };
      if (!nameOfEachColumn.includes("PC")) {
        column = {
          ...column,
          ...renderSearchingDropdown(nameOfEachColumn),
        };
      } else {
        column = {
          ...column,
          sorter: (a, b) => a[nameOfEachColumn] - b[nameOfEachColumn],
        };
      }
      return column;
    })
    : [];

  // Render the loadings table to show that which features contribute how much to the principal components
  const renderLoadingsTable = () => {
    if (!isLoadingsTableVisible) {
      return null;
    }
    if (loadingsTableData.length === 0) {
      return null;
    }
    return (
      <Table
        columns={columnForLoadingsTable}
        dataSource={dataForLoadingsTable}
        scroll={{
          x: 1000,
        }}
        sticky={{
          offsetHeader: 64,
        }}
      />
    )
  }
  /*####################
  # End of the code for TABLE --- Loadings Table
  ####################*/

  /*####################
  # TABLE --- Top Five Contributors Table
  # The following code is only about the Top Five Contributors Table, which is the table that shows the top 5 contributors to the principal components
  ####################*/
  const dataForTopFiveContributorsTable = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    },
  ];

  const columnForTopFiveContributorsTable = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ...renderSearchingDropdown('name'),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 150,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      ...renderSearchingDropdown('address'),
    },
  ];

  // Render the top five contributors table
  const renderTopFiveContributorsTable = () => {
    if (!isTopFiveContributorsTableVisible) {
      return null;
    }
    return (
      <Table
        columns={columnForTopFiveContributorsTable}
        dataSource={dataForTopFiveContributorsTable}
        scroll={{
          x: 500,
        }}
        sticky={{
          offsetHeader: 64,
        }}
      />
    )
  }


  /*####################
  # End of the code for TABLE --- Top Five Contributors Table
  ####################*/


  /*####################
  # End of the code for TABLE
  ####################*/



  /*####################
  # The following code is only about COLORS, such as renderColorCardsForPCAPlot, handleColorChange, etc.
  ####################*/

  const handleColorGroupChange = (indexOfTheGroup, newColor) => {
    console.log("🚀🚀🚀 index", indexOfTheGroup)
    console.log("🚀🚀🚀 newColor", newColor)

    // Find the group in the colorGroupsOfPcaPlot array
    const newColorGroupsOfPcaPlot = [...colorGroupsOfPcaPlot];
    newColorGroupsOfPcaPlot[indexOfTheGroup].colorCode = newColor;
    setColorGroupsOfPcaPlot(newColorGroupsOfPcaPlot);

    console.log("🚀🚀🚀 colorGroupsOfPcaPlot sau khi change", colorGroupsOfPcaPlot)

    const newPcaPlotData = { ...pcaPlotData }
    console.log("🚀🚀🚀 newPcaPlotData", newPcaPlotData)

    // Find the samples in the pcaPlotData array
    newColorGroupsOfPcaPlot[indexOfTheGroup].sampleNames.forEach((sampleName, index) => {
      // If the sample is found in the array
      const indexOfItem = newPcaPlotData.data.findIndex(sample => sample.name === sampleName);
      if (indexOfItem !== -1) {
        // Update the color field of the sample
        newPcaPlotData.data[indexOfItem].marker.color = newColor;
      }
    })

    // Update the options 
    const newOptions = [...options];
    newOptions[indexOfTheGroup].value = `${newColorGroupsOfPcaPlot[indexOfTheGroup].groupId}, ${newColor}`;
    setOptions(newOptions);

  };


  const renderColorGroups = () => {
    if (!isPcaPlotVisible) {
      return null;
    }
    if (pcaPlotData) {
      return (
        <div>

          <Button variant="secondary" className="mb-8">
            Add group
          </Button>

          <div className='grid grid-cols-4 gap-4'>
            {colorGroupsOfPcaPlot.map((eachColorGroup, indexOfEachColorGroup) => (
              <div
                key={indexOfEachColorGroup}
                className='flex gap-4 items-center'
              >
                <h3>{eachColorGroup.name}</h3>
                <Input
                  type="color"
                  className='cursor-pointer w-1/3'
                  value={eachColorGroup.colorCode}
                  onChange={(e) => handleColorGroupChange(indexOfEachColorGroup, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  const handleSampleGroupChange = (sampleName, value) => {
    // Log the sample name and color code
    console.log("🚀🚀🚀 sampleName", sampleName)
    console.log("🚀🚀🚀 value", value)

    let [groupId, colorCode] = value.split(", ");

    console.log("🚀🚀🚀 groupId", groupId)

    // Update the colorGroupsOfPcaPlot state
    const newColorGroupsOfPcaPlot = [...colorGroupsOfPcaPlot];

    // Find the index of the group in the colorGroupsOfPcaPlot array
    const indexOfColorGroup = newColorGroupsOfPcaPlot.findIndex(group => group.groupId === groupId);

    // If the group is found in the array
    if (indexOfColorGroup !== -1) {
      // Update the sampleNames array of the group
      newColorGroupsOfPcaPlot[indexOfColorGroup].sampleNames.push(sampleName);
    }

    // Update the state with the new array
    setColorGroupsOfPcaPlot(newColorGroupsOfPcaPlot);


    console.log("🚀🚀🚀 colorGroupsOfPcaPlot sau khi select", colorGroupsOfPcaPlot)

    const newPcaPlotData = { ...pcaPlotData }
    console.log("🚀🚀🚀 newPcaPlotData", newPcaPlotData)

    // Find the index of the sample in the pcaPlotData array
    const index = newPcaPlotData.data.findIndex(sample => sample.name === sampleName);

    console.log("🚀🚀🚀 index", index)

    // If the sample is found in the array
    if (index !== -1) {
      // Update the color field of the sample
      newPcaPlotData.data[index].marker.color = colorCode;
    }

    console.log("🚀🚀🚀 newPcaPlotData", newPcaPlotData)

    // Update the state with the new array
    setPcaPlotData(newPcaPlotData);
  }


  const renderNameOfSamplesInPCAPlotWithGroupColorChoice = () => {
    if (!isPcaPlotVisible) {
      return null;
    }
    return (
      <div className='grid grid-cols-3 gap-x-6 gap-y-3 my-7'>
        {nameOfSamplesInPCAPlot.map((sample, index) => {
          return <div
            key={index}
            className='grid grid-cols-2 items-center'
          >
            <p>{sample.name}</p>

            <Select
              onChange={(value) => handleSampleGroupChange(sample.name, value)}
              className='w-3/5'
              options={options}
            />
          </div>
        })}
      </div>
    )
  }
  /*####################
  # End of the code for COLORS
  ####################*/


  // Render the number of samples
  const renderNumberSamples = () => {
    if (csvData.length === 0) {
      return null;
    }
    return (
      <p>
        Number of samples: <strong>{csvData ? csvData.length : "0"}</strong>
      </p>
    )
  }
  // End of the code for the number of samples

  /*####################
  # The following code is to render the final UI of the page
  ####################*/
  return (
    <div className='container my-4 flex flex-col gap-5'>

      <div className='mb-10'>
        <h1 className='font-bold mb-3'>Things</h1>
        <ul className='list-disc list-inside'>
          <li className='text-red-500'>Fix bug - group color of PCA plot</li>
          <li className='text-blue-500'>Task - Change state of the button when click- DONE</li>
          <li className='text-blue-500'>Task - Make vertical line in the PCA plot, over 80% cumulative - DONE</li>
          <li className='text-red-500'>Task - Add loadings plot</li>
          <li className='text-blue-500'>Task - Modify the UI of search button in loadings table - DONE</li>
          <li className='text-red-500'>Task - Add another table to show top 5 contributor </li>
          <li className='text-blue-500'>Task - Remove the title of plot and bring it out - DONE</li>
          <li className='text-blue-500'>Task - Add the search function to the first column of data table - DONE</li>
          <li className='text-blue-500'>Task - Add button remove file uploaded (to clear the data table) - DONE</li>
        </ul>
      </div>


      <div className="flex py-3 justify-between sticky top-1 z-10 bg-opacity-50 backdrop-filter backdrop-blur bg-white">
        <div className='flex gap-2'>
          {/* {renderButtonGenerateRandomData()} */}
          {renderButtonUploadFile()}
          {renderButtonClearUploadedFile()}
        </div>

        <div className='flex gap-2'>
          {renderButtonGenerateScreePlot()}
          {renderButtonGeneratePCAPlot()}
          {renderButtonGenerateLoadingsPlot()}
          {renderButtonGenerateLoadingsTable()}
          {renderButtonGenerateTopFiveContributorsTable()}
        </div>
      </div>

      {renderScreePlot()}

      {renderColorGroups()}
      {renderNameOfSamplesInPCAPlotWithGroupColorChoice()}
      {renderPCAPlot()}

      {renderTopFiveContributorsTable()}
      {renderLoadingsTable()}

      {renderNumberSamples()}
      {renderDataTable()}
    </div>
  );
  /*####################
  # End of the code to render the final UI of the page
  ####################*/
}
