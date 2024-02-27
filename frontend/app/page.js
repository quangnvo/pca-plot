// This "use client" is IMPORTANT and need to put on the top of the file, as it is used to tell the Next.js that this file is used in the client side, not in the server side. 
// If not put "use client", then the Next.js will think that this file is used in the server side, as the server side is the default.
// Because in the following code, we use the "useState", "useRef", etc. which are the React hooks, and they are used in the client side, not in the server side.
// A server component cannot use React hooks like useState, useEffect, etc. This is because a server component is rendered once on the server and doesn't re-render. On the other hand, a client component is a normal React component with access to hooks and re-renders as the user interacts, clicks the buttons, changes the color, etc. with the app.
"use client"

// The useState, useRef are used to create the state and reference to the DOM element
import { useState, useRef } from 'react';

// The Plot from the react-plotly.js library is used to render the plot
import Plot from 'react-plotly.js';

// The Papa is used to parse the csv file
import Papa from 'papaparse';

// The axios is used to send the HTTP request to the backend
import axios from 'axios';

// The button, input, table, etc. used for the UI
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  Select,
  Input as InputAntd,
  Dropdown as DropdownAntd
} from 'antd';

// The icons used in the UI
import { Plus } from 'lucide-react';
import { SearchOutlined } from '@ant-design/icons';

// The Highlighter is used to highlight the searched text in the table
import Highlighter from 'react-highlight-words';




export default function Home() {

  // Define the backend port
  const BACKEND_PORT = 8080

  /*####################
  # The following code is used to only about setup INITIAL VARIABLES
  ####################*/

  // We have "csvData", "setCsvData" ; "pcaPlotData", "setPcaPlotData" ;  etc.

  // The "setSomething" function is used to update the "something"
  // For example, at the beginning, something = "123", then setSomething("abcdef") will update something, then something = "abcdef"

  // The "useState" function is a React hook function that is used to create the combo of "something" and "setSomething"
  // The purpose of using "useState" is that it is used to "trigger the re-render of the UI" when the "something is updated"

  // For example, at the beginning, screePlotData = null, then nothing on the screen yet, then we call API to calculate the scree plot data, then we need to store the data get from API to the screePlotData and render it to the screen.
  // If we just assign the screePlotData = "data_from_API", it will not re-render the UI, so the scree plot will not be shown on the screen.
  // So we need to use "useState()"

  const [csvData, setCsvData] = useState([]);
  const [screePlotData, setScreePlotData] = useState(null);
  const [pcaPlotData, setPcaPlotData] = useState(null);
  const [pcaPlot3DData, setPcaPlot3DData] = useState(null);
  const [loadingsTableData, setLoadingsTableData] = useState([]);
  const [topFiveContributorsTableData, setTopFiveContributorsTableData] = useState([]);

  // The following variables are used to control the visibility of the things, like the bulb light switch on and off.
  // For example, if isScreePlotVisible = true, then the scree plot will be visible, if isScreePlotVisible = false, then the scree plot will be invisible
  // This is controlled by the buttons in the BUTTONS section below
  const [isScreePlotVisible, setIsScreePlotVisible] = useState(false);
  const [isLoadingsTableVisible, setIsLoadingsTableVisible] = useState(false);
  const [isTopFiveContributorsTableVisible, setIsTopFiveContributorsTableVisible] = useState(false);
  const [isPCA2DVisible, setIsPCA2DVisible] = useState(false);
  const [isPCA3DVisible, setIsPCA3DVisible] = useState(false);

  // The name of the PCA 2D and PCA 3D, just used for naming the title of the buttons
  const namePCA2D = "PCA 2D";
  const namePCA3D = "PCA 3D";

  // The "defaultColor" is used to set the default color of the group
  const defaultColor = "#272E3F";

  // The id for the file input, used to reset the file input value to null
  const inputFileId = "fileInput";

  const acceptFileTypes = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

  /*####################
  # End of the code for INITIAL VARIABLES
  ####################*/



  /*####################
  # The following code is only about FUNCTIONS, such as clearUploadedFile, generateScreePlot, generatePCAPlot, etc.
  ####################*/

  /*####################
  # FUNCTIONS --- Handle file upload
  ####################*/
  const handleFileUpload = (e) => {
    // The e.target.files[0] is used to get the first file, as the user can upload multiple files at once, but in this case, we only allow the user to upload one file at once
    const file = e.target.files[0];
    // Then, checking if the file is a csv file or the txt file
    // If .csv or .txt file, then continue
    if (file.type === 'text/csv' || file.type === 'text/plain') {
      // Using PapaParse, a library used for parsing, to parse the file
      Papa.parse(file, {
        header: true,
        // The "skipEmptyLines: true" is important, because if we don't use it, then the empty lines in the csv file will be parsed as an empty object, and it will cause the error when we try to render the table
        skipEmptyLines: true,
        complete: (results) => {
          // Then set the parsed data to the csvData
          setCsvData(results.data);
        },
      });
    }
  };
  /*####################
  # End of the code for FUNCTIONS --- Handle file upload
  ####################*/


  /*####################
  # FUNCTIONS --- Clear the uploaded file
  ####################*/
  const clearUploadedFile = () => {
    // Clear the csvData state to make it back to empty array
    setCsvData([]);
    // Reset the file input value to null, this is important because if we don't reset the file input value to null, then the user can't upload the same file again after they uploaded it once
    document.getElementById(inputFileId).value = null;
  }
  /*####################
  # End of the code for FUNCTIONS --- Clear the uploaded file 
  ####################*/


  /*####################
  # FUNCTIONS --- Generate random data
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
  # End of the code for FUNCTIONS --- Generate random data
  ####################*/


  /*####################
  # FUNCTIONS --- Generate Scree plot
  ####################*/
  const generateScreePlot = async () => {
    // if (!isScreePlotVisible) ==> if the scree plot is not visible, meaning there isn't scree plot on the screen yet, then we will call the API to generate the scree plot data
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
    // Then we will toggle the visibility of the scree plot. If it's visible, then we will make it invisible, and vice versa
    setIsScreePlotVisible(!isScreePlotVisible);
  }
  /*####################
  # End of the code for FUNCTIONS --- Generate Scree plot
  ####################*/


  /*####################
  # FUNCTIONS --- Generate PCA plot 2D
  ####################*/
  const generatePCAPlot = async () => {
    try {
      const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_pca`, csvData);
      console.log("🚀🚀🚀 data for 2D plot", response.data)
      setPcaPlotData(response.data);

      // Extract the names of the sample replicates in the PCA plot, such as "H2O_30m_A", "H2O_30m-B", "H2O_30m-C", "PNA79_30m_A", "PNA79_30m_B", "PNA79_30m_C", etc.
      const names = []
      response.data.data.forEach((eachItem, index) => {
        names.push({
          name: eachItem.name,
          groupId: ""
        })
      })
      console.log("🚀🚀🚀 names", names)
      setNameOfSamples(names);

      // This is used to reset the color groups
      setColorGroups([
        {
          groupId: "1",
          name: "Group 1",
          colorCode: defaultColor,
          sampleNames: []
        },
        {
          groupId: "2",
          name: "Group 2",
          colorCode: defaultColor,
          sampleNames: []
        },
      ]);

      // This is used to reset the group options that are required to use in the antd library <Select> component
      setGroupOptions([
        {
          label: "Group 1",
          value: `1, ${defaultColor}`
        },
        {
          label: "Group 2",
          value: `2, ${defaultColor}`
        },
      ]);

    } catch (error) {
      console.error(error);
    }
  }
  /*####################
  # End of the code for FUNCTIONS --- Generate PCA plot 2D
  ####################*/


  /*####################
  # FUNCTIONS --- Generate PCA plot 3D
  ####################*/
  const generatePCAPlot3D = async () => {
    try {
      const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_pca_3d`, csvData);
      console.log("🚀🚀🚀 data for 3D plot", response.data)
      setPcaPlot3DData(response.data);

      // Extract the names of the sample replicates in the PCA plot, such as "H2O_30m_A", "H2O_30m-B", "H2O_30m-C", "PNA79_30m_A", "PNA79_30m_B", "PNA79_30m_C", etc.
      const names = []
      response.data.data.forEach((eachItem, index) => {
        names.push({
          name: eachItem.name,
          groupId: ""
        })
      })
      console.log("🚀🚀🚀 names", names)
      setNameOfSamples(names);

      // This is used to reset the color groups
      setColorGroups([
        {
          groupId: "1",
          name: "Group 1",
          colorCode: defaultColor,
          sampleNames: []
        },
        {
          groupId: "2",
          name: "Group 2",
          colorCode: defaultColor,
          sampleNames: []
        },
      ]);

      // This is used to reset the group options that are required to use in the antd library <Select> component
      setGroupOptions([
        {
          label: "Group 1",
          value: `1, ${defaultColor}`
        },
        {
          label: "Group 2",
          value: `2, ${defaultColor}`
        },
      ]);

    } catch (error) {
      console.error(error);
    }
  }
  /*####################
  # End of the code for FUNCTIONS --- Generate PCA plot 3D
  ####################*/


  /*####################
  # FUNCTIONS --- Generate Loadings table
  ####################*/
  const generateLoadingsTable = async () => {
    if (!isLoadingsTableVisible) {
      try {
        const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_loadings_table`, csvData);
        setLoadingsTableData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    setIsLoadingsTableVisible(!isLoadingsTableVisible);
  }
  /*####################
  # End of the code for FUNCTIONS --- Generate Loadings table
  ####################*/

  /*####################
  # FUNCTIONS --- Generate Top 5 contributors table
  ####################*/
  const generateTopFiveContributors = async () => {
    if (!isTopFiveContributorsTableVisible) {
      try {
        const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_top_five_contributors`, csvData);
        setTopFiveContributorsTableData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    setIsTopFiveContributorsTableVisible(!isTopFiveContributorsTableVisible);
  }
  /*####################
  # End of the code for FUNCTIONS --- Generate Top 5 contributors table
  ####################*/

  /*####################
  # End of the code for FUNCTIONS 
  ####################*/



  /*####################
  # The following code is only about function used to render BUTTONS, such as renderButtonUploadFile, renderButtonClearUploadedFile, etc.
  ####################*/

  /*####################
  # BUTTONS --- Render button to generate random data
  ####################*/
  const renderButtonGenerateRandomData = () => {
    return (
      <Button onClick={generateRandomData} >
        Random data
      </Button>
    )
  }
  /*####################
  # End of the code for BUTTONS --- Render button to generate random data
  ####################*/


  /*####################
  # BUTTONS --- Render button to upload file
  ####################*/
  const renderButtonUploadFile = () => {
    return (
      <Input
        // The "id" is used to select the file input by using the document.getElementById(inputFileId), then we can reset the file input value to null
        id={inputFileId}
        type='file'
        accept={acceptFileTypes}
        onChange={handleFileUpload}
      />
    )
  }
  /*####################
  # End of the code for BUTTONS --- Render button to upload file
  ####################*/


  /*####################
  # BUTTONS --- Render button to clear the uploaded file
  ####################*/
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
  /*####################
  # End of the code for BUTTONS --- Render button to clear the uploaded file
  ####################*/


  /*####################
  # BUTTONS --- Render button to generate Screen plot
  ####################*/
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
  /*####################
  # End of the code for BUTTONS --- Render button to generate Screen plot
  ####################*/


  /*####################
  # BUTTONS --- Render button to generate PCA plot
  ####################*/
  const renderButtonPCAPlot = () => {
    if (isPCA2DVisible) {
      return (
        <Button variant="default" >
          {namePCA2D}
        </Button>
      )
    } else if (isPCA3DVisible) {
      return (
        <Button variant="default">
          {namePCA3D}
        </Button>
      )
    } else {
      return (
        <Button variant="outline">
          PCA plot
        </Button>
      )
    }
  }
  /*####################
  # End of the code for BUTTONS --- Render button to generate PCA plot
  ####################*/

  /*####################
  # BUTTONS --- Render button to generate Loadings table
  ####################*/
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
  /*####################
  # End of the code for BUTTONS --- Render button to generate Loadings table
  ####################*/


  /*####################
  # BUTTONS --- Render button to generate Top 5 contributors table
  ####################*/
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
  /*###################
  # End of the code for BUTTONS --- Render button to generate Top 5 contributors table
  ####################*/

  /*####################
  # End of the code for BUTTONS
  ####################*/



  /*####################
  # The following code is only about function used to render PLOTS, such as renderScreePlot, renderPCAPlot, etc.
  ####################*/

  /*####################
  # PLOTS --- Render Scree plot
  ####################*/
  const renderScreePlot = () => {
    if (isScreePlotVisible) {
      if (screePlotData) {
        return (
          <div className='mb-10'>
            <div className='text-3xl font-bold mb-4'>
              Scree plot
            </div>
            <div className='p-3 border border-gray-200 rounded-lg'>
              <Plot
                useResizeHandler
                style={{ width: "100%", height: "500px" }}
                data={screePlotData.data}
                layout={screePlotData.layout}
              />
            </div>
          </div>
        )
      }
    }
  }
  /*####################
  # End of the code for PLOTS --- Render Scree plot
  ####################*/

  /*####################
  # PLOTS --- Render PCA plot 2D and 3D
  ####################*/
  // The "pcaOptions" is the required format to use in the antd library <DropdownAntd> component
  // This one is used to show the PCA plot selection dropdown for user hover, like "PCA 2D" and "PCA 3D"
  const pcaOptions = [
    // PCA 2D button
    {
      key: '1',
      label: (
        <p>
          {namePCA2D}
        </p>
      ),
      onClick: () => {
        // Now user clicks on the PCA 2D, then we will check the current visibility of the PCA 2D and PCA 3D, then we will update the visibility of the PCA 2D and PCA 3D
        // Click on the PCA 2D button --> if PCA 2D plot and PCA 3D plot not show yet --> then show PCA 2D plot
        if (isPCA2DVisible == false && isPCA3DVisible == false) {
          generatePCAPlot();
          setIsPCA2DVisible(true);
        }
        // Click on the PCA 2D button --> if PCA 2D plot is showing and PCA 3D plot not show --> then hide PCA 2D plot
        if (isPCA2DVisible == true && isPCA3DVisible == false) {
          setIsPCA2DVisible(false);
        }
        // Click on the PCA 2D button --> if PCA 2D plot not show and PCA 3D plot is showing --> then hide PCA 3D plot and show PCA 2D plot
        if (isPCA2DVisible == false && isPCA3DVisible == true) {
          generatePCAPlot();
          setIsPCA2DVisible(true);
          setIsPCA3DVisible(false);
        }
      }
    },
    // PCA 3D button
    {
      key: '2',
      label: (
        <p>
          {namePCA3D}
        </p>
      ),
      onClick: () => {
        // Click on the PCA 3D button --> if PCA 2D plot and PCA 3D plot not show yet --> then show PCA 3D plot
        if (isPCA2DVisible == false && isPCA3DVisible == false) {
          generatePCAPlot3D();
          setIsPCA3DVisible(true);
        }
        // Click on the PCA 3D button --> if PCA 2D plot is showing and PCA 3D plot not show --> then hide PCA 2D plot and show PCA 3D plot
        if (isPCA2DVisible == true && isPCA3DVisible == false) {
          generatePCAPlot3D();
          setIsPCA2DVisible(false);
          setIsPCA3DVisible(true);
        }
        // Click on the PCA 3D button --> if PCA 2D plot not show and PCA 3D plot is showing --> then hide PCA 3D plot
        if (isPCA2DVisible == false && isPCA3DVisible == true) {
          setIsPCA3DVisible(false);
        }
      }
    },
  ];

  const renderPCAPlotGeneral = (isPCA2DVisible, isPCA3DVisible) => {
    if (isPCA2DVisible) {
      if (pcaPlotData) {
        return (
          <>
            <div className='text-3xl font-bold mb-4'>
              PCA-2D plot
            </div>
            <div className='border border-gray-200 rounded-lg overflow-hidden'>
              <Plot
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                data={pcaPlotData.data}
                layout={pcaPlotData.layout}
                // key={Math.random()} is very important here, because it will force the Plot to re-render when the data is changed. 
                // Otherwise, the Plot will not re-render, so the color of the samples on the plot will not be updated.
                key={Math.random()}
              />
            </div>
          </>
        )
      }
    } else if (isPCA3DVisible) {
      if (pcaPlot3DData) {
        return (
          <>
            <div className='text-3xl font-bold mb-4'>
              PCA-3D plot
            </div>
            <div className='border border-gray-200 rounded-lg overflow-hidden'>
              <Plot
                useResizeHandler
                style={{ width: "100%", height: "700px" }}
                data={pcaPlot3DData.data}
                layout={pcaPlot3DData.layout}
                key={Math.random()}
              />
            </div>
          </>
        )
      }
    } else {
      return null;
    }
  }
  /*####################
  # End of the code for PLOTS --- Render PCA plot 2D and 3D
  ####################*/

  /*####################
  # End of the code for PLOTS
  ####################*/



  /*####################
  # The following code is only about function used to render TABLE, such as renderDataTable, renderLoadingsTable, etc.
  ####################*/

  /*####################
  # TABLE --- Searching Dropdown
  * The following code is used to render the searching dropdown, which can be used in any table
  ####################*/

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
          width: 150,
          // The fixed: 'left' is used to freeze a column, and because now we are inside the condition of (index === 0), so the first column is frozen 
          fixed: 'left',
        };
      }
      // Check if the column data is numeric
      else if (!isNaN(csvData[0][nameOfEachColumn])) {
        // If the column data is numeric, then we will add the sorter to the column, so that the user can click on the column header to sort the data
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
      <>
        <div className='text-3xl font-bold'>
          Data table
        </div>
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
      </>
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
    // If isLoadingsTableVisible = false, then the loadings table will not be shown, so we will return null
    if (!isLoadingsTableVisible) {
      return null;
    }
    // If no data in the loadings table, then we will return null
    if (loadingsTableData.length === 0) {
      return null;
    }
    // If there is data in the loadings table, then we will render the table
    return (
      <div className='mb-10'>
        <div className='text-3xl font-bold mb-4'>
          Loadings table
        </div>
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
      </div>
    )
  }
  /*####################
  # End of the code for TABLE --- Loadings Table
  ####################*/

  /*####################
  # TABLE --- Top Five Contributors Table
  # The following code is only about the Top Five Contributors Table, which is the table that shows the top 5 contributors to the principal components
  ####################*/
  const dataForTopFiveContributorsTable = topFiveContributorsTableData.map((eachRow, index) => ({
    key: index,
    ...eachRow,
  }));

  const columnForTopFiveContributorsTable = topFiveContributorsTableData.length > 0
    ? [
      // The first column is the Principal component, the name "Principal component" should match exactly with the name in the backend file generateTopFiveContributors.py
      {
        title: "Principal component",
        dataIndex: "Principal component",
        key: "Principal component",
        width: 100,
        ...renderSearchingDropdown("Principal component"),
      },
      ...Object.keys(topFiveContributorsTableData[0]).filter(nameOfEachColumn => nameOfEachColumn !== "Principal component").map((nameOfEachColumn) => {
        let column = {
          title: nameOfEachColumn,
          dataIndex: nameOfEachColumn,
          key: nameOfEachColumn,
          width: 100,
        };
        // The name "Gene" should match exactly with the name in the backend file generateTopFiveContributors.py
        if (nameOfEachColumn === "Gene") {
          column = {
            ...column,
            ...renderSearchingDropdown(nameOfEachColumn),
          };
        }
        return column;
      })
    ]
    : [];


  // Render the top five contributors table
  const renderTopFiveContributorsTable = () => {
    if (!isTopFiveContributorsTableVisible) {
      return null;
    }
    return (
      <div className='mb-10'>
        <div className='text-3xl font-bold mb-4'>
          Top 5 contributors table
        </div>
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
      </div>
    )
  }
  /*####################
  # End of the code for TABLE --- Top Five Contributors Table
  ####################*/

  /*####################
  # End of the code for TABLE
  ####################*/



  /*####################
  # The following code is only about COLORS, such as changing color of the points in the PCA plot, changing color of the groups, etc.
  ####################*/

  /*####################
  # COLORS --- Setup variables
  ####################*/

  // The "nameOfSamples" is an array of objects, each object has the format
  // {
  //    name: "H2O_30m_A",
  //    groupId: ""
  // }
  const [nameOfSamples, setNameOfSamples]
    = useState([]);


  // The "colorGroups" is an array of objects, and it is used to store the color of the groups, like "Group 1" which color , "Group 2" which color, etc.
  // The "sampleNames" in the "colorGroups" is an array of strings, and it is used to store the names of the samples that belong to which group, like "H2O_30m_A", "H2O_30m_B", "H2O_30m_C", etc. For example, if user choose "Group 1" for "H2O_30m_A", then "H2O_30m_A" will be added to the "sampleNames" array of "Group 1".
  const [colorGroups, setColorGroups] = useState([
    {
      groupId: "1",
      name: "Group 1",
      colorCode: defaultColor,
      sampleNames: []
    },
    {
      groupId: "2",
      name: "Group 2",
      colorCode: "#FFFF00",
      sampleNames: []
    },
  ]);


  // This "groupOptions" is the required format to use in the antd library <Select> component
  // This one is used to render the Group selection dropdown for user to select, like "H2O_30m_A" - "Group 1", "H2O_30m_B" - "Group 1", etc.
  const [groupOptions, setGroupOptions] = useState([
    {
      label: "Group 1",
      value: "1, #272E3F"
    },
    {
      label: "Group 2",
      value: "2, #272E3F"
    },
  ]);

  /*####################
  # End of the code for COLORS --- Setup variables
  ####################*/


  /*####################
  # COLORS --- Functions
  ####################*/

  // The function "handleChangeColorInPlot2D" is used to change the color of the sample in the 2D PCA plot
  const handleChangeColorInPlot2D = (sampleName, colorCode) => {
    const newPcaPlotData = { ...pcaPlotData }
    const index = newPcaPlotData.data.findIndex(sample => sample.name === sampleName);
    if (index !== -1) {
      newPcaPlotData.data[index].marker.color = colorCode;
    }
    setPcaPlotData(newPcaPlotData);
  }

  // The function "handleChangeColorInPlot3D" is used to change the color of the sample in the 3D PCA plot
  const handleChangeColorInPlot3D = (sampleName, colorCode) => {
    const newPcaPlotData = { ...pcaPlot3DData }
    const index = newPcaPlotData.data.findIndex(sample => sample.name === sampleName);
    if (index !== -1) {
      newPcaPlotData.data[index].marker.color = colorCode;
    }
    setPcaPlot3DData(newPcaPlotData);
  }



  // The function "handleChangeGroupForEachSample" is call when user click on the which color group belong to each sample. For example, "H2O_30m_A" - user chooses "Group 1", "H2O_30m_B" - user chooses "Group 1", etc.
  const handleChangeGroupForEachSample = (sampleName, value) => {

    // Because at the above, we set the "value" of the each object in the groupOptions to be "1, #272E3F", "2, #FFFF00", etc.
    // So here, we will split the "value" to get the "groupId" and "colorCode", like groupId = "1", colorCode = defaultColor, etc.
    let [groupId, colorCode] = value.split(", ");

    // Copy the colorGroups array to a new array.
    // Copying old array to new array is a step in update the state, as we should not update the state directly. We should update the state by using the "setColorGroups" function
    // If we update the state directly, then the UI will not be re-rendered, so the color of the samples on the plot will not be updated.
    const newColorGroups = [...colorGroups];

    // Find the index of the group in the array, like if user choose "Group 1" for "H2O_30m_A", then we will find where is the "Group 1" in the array newColorGroups, then later we will add "H2O_30m_A" to the "sampleNames" array of "Group 1"
    const indexOfColorGroup = newColorGroups.findIndex(group => group.groupId === groupId);

    // If the group is found in the array
    if (indexOfColorGroup !== -1) {
      // Then we will add the sample to the "sampleNames" array of the group
      newColorGroups[indexOfColorGroup].sampleNames.push(sampleName);
    }

    // Then we will update the state with the new array
    // Now the "sampleNames" array of the group is updated, like "H2O_30m_A" is already added to the "sampleNames" array of "Group 1" 
    setColorGroups(newColorGroups);

    if (isPCA2DVisible) {
      handleChangeColorInPlot2D(sampleName, colorCode);
    } else if (isPCA3DVisible) {
      handleChangeColorInPlot3D(sampleName, colorCode);
    }
  }

  // The function "handleChangeGroupColorInPlot2D" is used to change the color of the group in the 2D PCA plot
  const handleChangeGroupColorInPlot2D = (groupIndex, newColor) => {
    const newPcaPlotData = { ...pcaPlotData }
    colorGroups[groupIndex].sampleNames.forEach((sampleName, index) => {
      const indexOfItem = newPcaPlotData.data.findIndex(sample => sample.name === sampleName);
      if (indexOfItem !== -1) {
        newPcaPlotData.data[indexOfItem].marker.color = newColor;
      }
    })
    setPcaPlotData(newPcaPlotData);
  }

  // The function "handleChangeGroupColorInPlot3D" is used to change the color of the group in the 3D PCA plot
  const handleChangeGroupColorInPlot3D = (groupIndex, newColor) => {
    const newPcaPlotData = { ...pcaPlot3DData }
    colorGroups[groupIndex].sampleNames.forEach((sampleName, index) => {
      const indexOfItem = newPcaPlotData.data.findIndex(sample => sample.name === sampleName);
      if (indexOfItem !== -1) {
        newPcaPlotData.data[indexOfItem].marker.color = newColor;
      }
    })
    setPcaPlot3DData(newPcaPlotData);
  }


  // This function is used to handle the color change of the group, when user changes the color of the group, like Group 1 which color, Group 2 which color, etc.
  const handleColorOfGroupChange = (indexOfTheGroup, newColor) => {

    // Set the new color to the colorGroups array
    const newColorGroups = [...colorGroups];
    newColorGroups[indexOfTheGroup].colorCode = newColor;
    setColorGroups(newColorGroups);


    // Update the color of the samples in the PCA plot
    if (isPCA2DVisible) {
      handleChangeGroupColorInPlot2D(indexOfTheGroup, newColor);
    } else if (isPCA3DVisible) {
      handleChangeGroupColorInPlot3D(indexOfTheGroup, newColor);
    }

    // Update the groupOptions, this is used to update the color of the group in the dropdown, like "Group 1 - which color", "Group 2 - which color", etc.
    // The groupOptions is the required format to use in the antd library <Select> component
    const newOptions = [...groupOptions];
    newOptions[indexOfTheGroup].value = `${newColorGroups[indexOfTheGroup].groupId}, ${newColor}`;
    setGroupOptions(newOptions);
  };

  // Add group color function
  const addGroupColor = () => {
    // Add the new group to the colorGroups array
    const newColorGroups = [...colorGroups];
    const newColorGroup = {
      groupId: (newColorGroups.length + 1).toString(),
      name: `Group ${newColorGroups.length + 1}`,
      colorCode: defaultColor,
      sampleNames: []
    }
    newColorGroups.push(newColorGroup);
    setColorGroups(newColorGroups);

    // Add the new group to the groupOptions array
    const newGroupOptions = [...groupOptions];
    const newGroupOption = {
      label: newColorGroup.name,
      value: `${newColorGroup.groupId}, ${newColorGroup.colorCode}`
    }
    newGroupOptions.push(newGroupOption);
    setGroupOptions(newGroupOptions);
  }

  /*####################
  # End of the code for COLORS --- Functions
  ####################*/


  /*####################
  # COLORS --- Render
  ####################*/
  const renderColorSection = () => {
    if (!isPCA2DVisible && !isPCA3DVisible) {
      return null;
    }
    if (pcaPlotData || pcaPlot3DData) {
      return (
        <div>
          {/* This will render groups, like "Group 1 - which color", "Group 2 - which color", etc. */}
          <div className='grid grid-cols-5 gap-4 items-center'>
            {colorGroups.map((eachColorGroup, indexOfEachColorGroup) => (
              <div
                key={indexOfEachColorGroup}
                className='flex gap-2 items-center'
              >
                <div className='w-[75px]'>
                  <span>{eachColorGroup.name}</span>
                </div>

                {/* The input here is the place that users can choose the color they want */}
                <div>
                  <Input
                    type="color"
                    className='cursor-pointer w-32 h-10 rounded-md border border-gray-300'
                    value={eachColorGroup.colorCode}
                    // So when the user changes the color, we will call the "handleColorOfGroupChange" function to update the color of the group
                    onChange={(e) => handleColorOfGroupChange(indexOfEachColorGroup, e.target.value)}
                  />
                </div>

              </div>
            ))}
            {/* Button Add Group, to add the group of color */}
            <Button
              variant="secondary"
              size="icon"
              onClick={addGroupColor}
            >
              <Plus />
            </Button>
          </div>
        </div>
      );
    }
  }

  const renderSampleNamesWithGroupChoice = (isPCA2DVisible, isPCA3DVisible) => {
    if (!isPCA2DVisible && !isPCA3DVisible) {
      return null;
    }
    if (pcaPlotData) {
      return (
        <div className='grid grid-cols-3 gap-x-6 gap-y-3 my-7'>
          {nameOfSamples.map((sample, index) => {
            return <div
              key={index}
              className='grid grid-cols-2 items-center'
            >
              <p>{sample.name}</p>

              <Select
                onChange={(value) =>
                  handleChangeGroupForEachSample(sample.name, value)
                }
                className='w-3/5'
                options={groupOptions}
              />
            </div>
          })}
        </div>
      )
    } else if (pcaPlot3DData) {
      return (
        <div className='grid grid-cols-3 gap-x-6 gap-y-3 my-7'>
          {nameOfSamples.map((sample, index) => {
            return <div
              key={index}
              className='grid grid-cols-2 items-center'
            >
              <p>{sample.name}</p>

              <Select
                onChange={(value) =>
                  handleChangeGroupForEachSample(sample.name, value)
                }
                className='w-3/5'
                options={groupOptions}
              />
            </div>
          })}
        </div>
      )
    }

    // REMOVEEEEEEEEEEEE
    // if (pcaPlotData || pcaPlot3DData) {
    //   return (
    //     <div className='grid grid-cols-3 gap-x-6 gap-y-3 my-7'>
    //       {nameOfSamples.map((sample, index) => {
    //         return <div
    //           key={index}
    //           className='grid grid-cols-2 items-center'
    //         >
    //           <p>{sample.name}</p>

    //           <Select
    //             onChange={(value) =>
    //               handleChangeGroupForEachSample(sample.name, value)
    //             }
    //             className='w-3/5'
    //             options={groupOptions}
    //           />
    //         </div>
    //       })}
    //     </div>
    //   )
    // }
    // REMOVEEEEEEEEEEEE

  }
  /*####################
  # End of the code for COLORS --- Render
  ####################*/

  /*####################
  # End of the code for COLORS
  ####################*/



  /*####################
  # The following code is only about the NUMBER OF SAMPLES
  ####################*/
  console.log("csvData: ", csvData)
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
  /*####################
  # End of the code for the NUMBER OF SAMPLES
  ####################*/



  /*####################
  # The following code is to render the FINAL UI of the page
  ####################*/
  return (
    <div className='container my-4 flex flex-col gap-5'>

      <div>
        <h1 className='font-bold mb-4'>
          Things
        </h1>
        <ul className="list-disc list-inside">
          <li className='text-red-500'>Add color changer for scree plot</li>
          <li className='text-red-500'>Fix bug color group when switching between PCA 2D and 3D</li>
          <li className='text-red-500'>Add color badge for top 5 contributors table</li>
        </ul>
      </div>


      <div className="flex py-3 justify-between sticky top-1 z-10 bg-opacity-50 backdrop-filter backdrop-blur bg-white">
        <div className='flex gap-2'>
          {renderButtonUploadFile()}
          {renderButtonClearUploadedFile()}
        </div>

        <div className='flex gap-2'>
          {renderButtonGenerateScreePlot()}

          <DropdownAntd
            menu={{
              items: pcaOptions,
            }}
            placement="bottomLeft"
            arrow
          >
            {renderButtonPCAPlot()}
          </DropdownAntd>


          {renderButtonGenerateLoadingsTable()}
          {renderButtonGenerateTopFiveContributorsTable()}
        </div>
      </div>

      {renderNumberSamples()}
      {renderDataTable()}

      {renderScreePlot()}

      {renderPCAPlotGeneral(isPCA2DVisible, isPCA3DVisible)}
      {renderColorSection()}
      {renderSampleNamesWithGroupChoice(isPCA2DVisible, isPCA3DVisible)}

      {renderLoadingsTable()}
      {renderTopFiveContributorsTable()}

    </div>
  );
  /*####################
  # End of the code to render the final UI of the page
  ####################*/
}
