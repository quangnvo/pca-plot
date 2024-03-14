// This "use client" is IMPORTANT and need to put on the top of the file, as it is used to run the file in the client side, not in the server side. 
// If we don't put "use client" at here, then it will think that this file is used in the server side, as the server side is the default.
// Because in the following code, we use the "useState", "useRef", etc. which are the React hooks, and they are used in the client side, not in the server side, so we need to put "use client" here.
// A server component cannot use React hooks like useState, useEffect, etc. This is because a server component is rendered once on the server and doesn't re-render. On the other hand, a client component is a normal React component with access to hooks and re-renders as the user interacts, clicks the buttons, changes the color, etc. with the app.
"use client"

// The useState, useRef are used to create the state and reference to the DOM element
import { useState, useRef, useEffect } from 'react';

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
  Dropdown as DropdownAntd,
  Tour,
} from 'antd';

// The icons used in the UI
import {
  Plus,
  Rocket,
  Trash,
  BarChartBig,
  ScatterChart,
  Table as TableIcon,
  Upload,
  Download,
  Trash2,
} from 'lucide-react';
import { SearchOutlined } from '@ant-design/icons';

// The Highlighter is used to highlight the searched text in the table
import Highlighter from 'react-highlight-words';

// The sweetalert2 is used to show the alert message, like the alert message when the user didn't upload the file yet
import Swal from 'sweetalert2'

// The react-csv library is used to download the table as a csv file
import { CSVLink } from 'react-csv';

// This useSearchParams is used to get the query parameters from the URL, like the "123123" in the URL "http://localhost:3000/?config=123123"
import { useSearchParams } from "next/navigation"


export default function Home() {

  // Define the backend port
  const BACKEND_PORT = 7000

  /*####################
  # GET THE CONFIG NUMBER FROM THE URL
  ####################*/
  // Create the searchParams object, which can be used to extract the query parameters from the URL
  const searchParams = useSearchParams()
  // Get the config number from the URL
  // ==> for example, the URL "http://localhost:3000/?config=123123" has the config number is "123123"
  const configNumber = searchParams.get("config")
  // Create the object that contains the config number, this is used to send the config number to the backend
  // The configNumberObject has the format like this:
  // configNumberObject = {
  //   config: "123123"
  // }
  const configNumberObject = {
    config: configNumber
  }
  /*####################
  # End of GET THE CONFIG NUMBER FROM THE URL
  ####################*/

  /*####################
  # The following code is used to only about setup INITIAL VARIABLES
  ####################*/

  // We have "csvData", "setCsvData" ; "pcaPlotData", "setPcaPlotData" ;  etc.

  // The "setSomething" function is used to update the "something"
  // For example, at the beginning, something = "123", then setSomething("abcdef") will update something, then something = "abcdef"

  // The "useState" function is a React hook function that is used to create the combo of "something" and "setSomething"
  // The purpose of using "useState" is that it is used to "trigger the re-render of the UI" when the "something is updated"

  // For example, at the beginning, screePlotData = null, then nothing on the screen yet,
  // ==> then we call API to calculate the scree plot data
  // ==> then we need to store the data get from API to the screePlotData and render it to the screen.
  // If we just assign the screePlotData = "data_from_API", it will not re-render the UI, so the scree plot will not be shown on the screen.
  // So we need to use "useState()"
  const [csvData, setCsvData] = useState([]);
  const [screePlotData, setScreePlotData] = useState(null);
  const [pcaPlotData, setPcaPlotData] = useState(null);
  const [pcaPlot3DData, setPcaPlot3DData] = useState(null);
  const [loadingsTableData, setLoadingsTableData] = useState([]);
  const [topFiveContributorsTableData, setTopFiveContributorsTableData] = useState([]);
  const [topFiveContributorsPlotData, setTopFiveContributorsPlotData] = useState(null);

  // The following variables are used to control the visibility of the things, like the bulb light switch on and off.
  // For example, if isScreePlotVisible = true, then the scree plot will be visible, if isScreePlotVisible = false, then the scree plot will be invisible
  // This is controlled by the buttons in the BUTTONS section below
  const [isScreePlotVisible, setIsScreePlotVisible] = useState(false);
  const [isLoadingsTableVisible, setIsLoadingsTableVisible] = useState(false);
  const [isTopFiveContributorsTableVisible, setIsTopFiveContributorsTableVisible] = useState(false);
  const [isPCA2DVisible, setIsPCA2DVisible] = useState(false);
  const [isPCA3DVisible, setIsPCA3DVisible] = useState(false);

  // The name of uploaded file, used to show the name of the uploaded file on the screen
  const [uploadedFileName, setUploadedFileName] = useState("");

  // This "isNavbarMobileOpen" is used to control the visibility of the mobile navbar when user use a smaller screen, like the mobile screen
  const [isNavbarMobileOpen, setIsNavbarMobileOpen] = useState(false)

  // The name of the PCA 2D and PCA 3D, just used for naming the title of the buttons
  const namePCA2D = "PCA 2D";
  const namePCA3D = "PCA 3D";

  // The "defaultColor" is used to set the default color of the group
  const defaultColor = "#272E3F";

  // The id for the file input, which will be used later to reset the file input value to null
  // The reason we need to reset the file input value to null is that if we don't reset the file input value to null, then the user can't upload the same file again after they uploaded it once
  const inputFileId = "fileInput";

  // The acceptFileTypes is used to allow the user to upload the file with the following types, like .csv, .xlsx, .xls
  const acceptFileTypes = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

  // The styles for the buttons, sections, etc.
  const spaceBetweenSections = "mb-[75px]";
  const spaceBetweenColorSectionAndPlot = "mt-[15px]";
  const styleForSectionHeading = "mb-[15px] text-2xl md:text-3xl font-bold"
  const styleForButton = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
  const sizeOfIcon = "20px"

  // Variables for the "tour"
  const [isTourOpen, setIsTourOpen] = useState(false);
  // This refTourStep1, refTourStep2, etc. are used to tell the "Tour" that this is the target of which step
  const refTourStep1 = useRef(null);
  const refTourStep2 = useRef(null);
  const refTourStep3 = useRef(null);
  const refTourStep4 = useRef(null);
  const refTourStep5 = useRef(null);
  const refTourStep6 = useRef(null);

  const tourSteps = [
    // Tour step 1
    {
      // Setup target for the step
      target: () => refTourStep1.current,
      title: 'Upload file',
      description: <div>
        <p>
          Upload your file here.
        </p>
      </div>,
    },
    // Tour step 2
    {
      target: () => refTourStep2.current,
      title: 'Scree plot',
      description: <div>
        <ul className='list-disc list-inside'>
          <li>
            A scree plot in PCA is a chart that shows the eigenvalues (variances) of each principal component in descending order.
          </li>
          <li>
            It helps identify the optimal number of principal components by locating the point where the decrease in eigenvalues becomes less significant, often called the “elbow” point.
          </li>
        </ul>
      </div>,
      cover: (
        <img
          alt="scree plot"
          src='tour-scree-plot.png'
        />
      ),
    },
    // Tour step 3
    {
      target: () => refTourStep3.current,
      title: 'PCA plot',
      description: <div>
        <ul className='list-disc list-inside'>
          <li>
            A PCA plot is useful in multivariate analysis that helps to understand the interrelationships among a set of variables.
          </li>
          <li>
            It allows us to identify patterns and trends in the data, and to observe the overall spread of the data in terms of the principal components.
          </li>
          <li>
            The principal components are linear combinations of the original variables, constructed in such a way that they are uncorrelated and capture the maximum possible information.
          </li>
        </ul>
      </div>,
      cover: (
        <img
          alt="pca plot"
          src='tour-pca-2d.png'
        />
      ),
    },
    // Tour step 4
    {
      target: () => refTourStep4.current,
      title: 'Loadings table',
      description: <div>
        <ul className='list-disc list-inside'>
          <li>
            In PCA, a loadings table shows the contribution of each original variable to each principal component.
          </li>
          <li>
            The larger the absolute value (positive or negative) of a loading, the stronger the influence of the corresponding variable on the respective component.
          </li>
        </ul>
      </div>,
      cover: (
        <img
          alt="loadings table"
          src='tour-loadings-table.png'
        />
      ),
    },
    // Tour step 5
    {
      target: () => refTourStep5.current,
      title: 'Top 5 contributors',
      description: <div>
        <ul className='list-disc list-inside'>
          <li>
            The top-5-contributors table typically lists the five variables that contribute the most to each principal component.
          </li>
          <li>
            The contribution of a variable is determined by its loading, with larger absolute values indicating stronger contributions.
          </li>
        </ul>
      </div>,
      cover: (
        <img
          alt="top 5 contributors table"
          src='tour-top-5-contributors-table.png'
        />
      ),
    },
    // Tour step 6
    {
      target: () => refTourStep6.current,
      title: 'Clear',
      description: <div>
        <p>
          Clear all the plots and tables.
        </p>
      </div>,
    },
  ];

  /*####################
  # End of INITIAL VARIABLES
  ####################*/



  /*####################
  # The following code is only about FUNCTIONS, such as clearUploadedFile, generateScreePlot, generatePCAPlot, etc.
  ####################*/

  /*####################
  # FUNCTIONS --- useEffect
  ####################*/
  // useEffect(() => {...}, []);: This is a React Hook that runs the function provided as the first argument after the component has rendered. The second argument is an array of dependencies. If any of the dependencies change, the function will run again. In this case, the array [] is empty, which means the function will only run once after the component appears on the screen.
  useEffect(() => {
    const fetchDataFromDB = async () => {
      try {
        const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/getDataFromDB`, configNumberObject);
        setCsvData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchDataFromDB();
    // The array [] is empty, which means the function will only run once after the component appears on the screen

    // aaaaaaaaaaaaaaa
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavbarMobileOpen(false)
    );
    // aaaaaaaaaaaaaaa
  }, []);
  /*####################
  # End of FUNCTIONS --- useEffect
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
        // The "skipEmptyLines: true" is IMPORTANT, because if we don't use it, then the empty lines in the csv file will be parsed as an empty object, and it will cause the error when we try to render the table
        skipEmptyLines: true,
        complete: (results) => {
          // Then set the parsed data to the csvData
          setCsvData(results.data);
        },
      });
      setUploadedFileName(e.target.files[0].name)
    }
  };
  /*####################
  # End of FUNCTIONS --- Handle file upload
  ####################*/


  /*####################
  # FUNCTIONS --- Clear the uploaded file
  ####################*/
  const clearUploadedFile = () => {
    if (csvData.length === 0) {
      return;
    }
    // The real all actions to clear the uploaded file and reset the UI are in this "showAlertForClear" function, so check the "showAlertForClear" function below for more details
    showAlertForClear();
  }
  /*####################
  # End of FUNCTIONS --- Clear the uploaded file 
  ####################*/


  /*####################
   # FUNCTIONS --- Show alert message
   ####################*/
  // This function is like a template for showing the alert message, which is used in the "isFileUploaded" function
  const showAlert = (title, message, icon) => {
    Swal.fire({
      title: title,
      text: message,
      icon: icon,
      showConfirmButton: false,
      showCancelButton: true,
      // cancelButtonColor: '#272E3F',
    })
  }
  /*####################
  # End of FUNCTIONS --- Show alert message
  ####################*/


  /*####################
  # FUNCTIONS --- Check if the file is uploaded
  ####################*/
  // This function is used to check if the file is uploaded, if not, then show the alert message and return false
  // For example, if the user clicks on the "Generate Scree plot" button, then we need to check if the file is uploaded, if not, then show the alert message and return false
  const isFileUploaded = () => {
    if (csvData.length > 0) {
      return true;
    } else {
      showAlert(
        // The title of the alert
        "Oops...",
        // The message of the alert 
        "Please upload the file first",
        // The icon of the alert, can be "success", "error", "warning", "info", "question"
        "error"
      );
      return false;
    }
  }
  /*####################
  # End of FUNCTIONS --- Check if the file is uploaded
  ####################*/


  /*####################
  # FUNCTIONS --- Show alert message with options, like with "Yes" button, "No" button
  ####################*/
  const showAlertForClear = () => {
    Swal.fire({
      title: "Do you want to clear all?",
      icon: "warning",
      confirmButtonColor: '#272E3F',
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      // If the user clicks on the "Yes" button, then we will clear the csvData, and reset the file input value to null
      if (result.isConfirmed) {
        // Clear the csvData state to make it back to empty array
        setCsvData([]);
        // Reset the file input value to null, this is important because if we don't reset the file input value to null, then the user can't upload the same file again after they uploaded it once
        document.getElementById(inputFileId).value = null;
        // Then we will hide the scree plot, PCA plot, loadings table, top 5 contributors table on the screen by setting the visibility to "false"
        setIsScreePlotVisible(false);
        setIsLoadingsTableVisible(false);
        setIsTopFiveContributorsTableVisible(false);
        setIsPCA2DVisible(false);
        setIsPCA3DVisible(false);
        // Then show the alert message to tell the user that everything is cleared
        Swal.fire({
          title: "Cleared!",
          icon: "success",
          showConfirmButton: false,
          // The timer is used to auto close the alert
          timer: 1500,
        });
      }
    });
  }
  /*####################
  # End of FUNCTIONS --- Show alert message with options
  ####################*/


  /*####################
  # FUNCTIONS --- Generate Scree plot
  ####################*/
  // The "generateScreePlot" function will generate the things like following:
  // {
  //    data: [
  //      .....
  //    ],
  //    layout: {
  //      .....
  //    }
  // }
  // To see what is "....." for detail, check the "generateScreePlot.py" file in the "backend" folder
  // This format will be use in the "Plot" component from the "react-plotly.js" library
  // So the <Plot> will be used like this:
  // <Plot
  //    data={screePlotData.data}
  //    layout={screePlotData.layout}
  // />
  // In which "screePlotData.data" is the "data" from backend, and "screePlotData.layout" is the "layout" from backend.
  // ==> so check the "generateScreePlot.py" file in the "backend" folder for more details of "data" and "layout"
  const generateScreePlot = async () => {
    // Check if the file is uploaded or not
    // ==> if not, then show the alert message to tell the user to upload the file first, then return
    if (!isFileUploaded()) {
      return;
    }
    // if (!isScreePlotVisible) ==> if the scree plot is not visible, meaning there isn't scree plot on the screen yet, then we will call the API to generate the scree plot data
    if (!isScreePlotVisible) {
      try {
        // Send a POST request with the "csvData" to the backend
        // ==> then backend will return the scree plot data
        // ==> then put the scree plot data to the "screePlotData" by using "setScreePlotData"
        const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_scree_plot`, csvData);
        setScreePlotData(response.data);
        // Reset the color of the scree plot
        setColorForScreePlot(defaultColor);
      } catch (error) {
        console.error(error);
      }
    }
    // ==> Then we will toggle the visibility of the scree plot. If it's visible, then we will make it invisible, and vice versa
    setIsScreePlotVisible(!isScreePlotVisible);
  }
  /*####################
  # End of FUNCTIONS --- Generate Scree plot
  ####################*/


  /*####################
  # FUNCTIONS --- Generate PCA plot 2D
  ####################*/
  const generatePCAPlot = async () => {
    // Check if the file is uploaded or not
    if (!isFileUploaded()) {
      return;
    }
    try {
      const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_pca`, csvData);
      setPcaPlotData(response.data);

      // Extract the names of the sample replicates in the PCA plot and put them into the "names" array
      // The names are like "H2O_30m_A", "H2O_30m-B", "H2O_30m-C", "PNA79_30m_A", "PNA79_30m_B", "PNA79_30m_C", etc.
      const names = []
      response.data.data.forEach((eachItem, index) => {
        names.push({
          name: eachItem.name,
          groupId: ""
        })
      })
      // Then set the "names" array to the "nameOfSamples" state by using "setNameOfSamples" function
      setNameOfSamples(names);
      // This setColorGroups is used to reset the color groups
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
      // This setGroupOptions is used to reset the group options that are required to use in the antd library <Select> component
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
  # End of FUNCTIONS --- Generate PCA plot 2D
  ####################*/


  /*####################
  # FUNCTIONS --- Generate PCA plot 3D
  ####################*/
  // The flow of the "generatePCAPlot3D" function is similar to the "generatePCAPlot" function
  const generatePCAPlot3D = async () => {
    if (!isFileUploaded()) {
      return;
    }
    try {
      const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_pca_3d`, csvData);
      setPcaPlot3DData(response.data);

      const names = []
      response.data.data.forEach((eachItem, index) => {
        names.push({
          name: eachItem.name,
          groupId: ""
        })
      })
      setNameOfSamples(names);

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
  # End of FUNCTIONS --- Generate PCA plot 3D
  ####################*/


  /*####################
  # FUNCTIONS --- Generate Loadings table
  ####################*/
  // The flow of the "generateLoadingsTable" function is similar to the "generateScreePlot" function
  const generateLoadingsTable = async () => {
    if (!isFileUploaded()) {
      return;
    }
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
  # End of FUNCTIONS --- Generate Loadings table
  ####################*/


  /*####################
  # FUNCTIONS --- Generate Top 5 contributors table
  ####################*/
  // The flow of the "generateTopFiveContributors" function is similar to the "generateScreePlot" function
  const generateTopFiveContributors = async () => {
    if (!isFileUploaded()) {
      return;
    }
    if (!isTopFiveContributorsTableVisible) {
      try {
        const response = await axios.post(`http://localhost:${BACKEND_PORT}/api/generate_top_five_contributors`, csvData);
        console.log("!!!!!!!! response.data", response.data)
        setTopFiveContributorsTableData(response.data.top_five_contributors);
        // The "loadingsPlotCoordinates" and "layout" are from the backend file "generateTopFiveContributors.py"
        setTopFiveContributorsPlotData({
          data: response.data.loadingsPlotCoordinates,
          layout: response.data.layout
        });

        // Set the color for the top 5 contributors plot  
        const ColorDataFromBackend = response.data.loadingsPlotCoordinates.map(item => ({
          pcName: item.x[0],
          colorCode: item.marker.color
        }));

        const uniqueColorForTopFiveContributorsPlot = ColorDataFromBackend.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.pcName === item.pcName
          ))
        );

        setColorForTopFiveContributorsPlot(uniqueColorForTopFiveContributorsPlot);
      } catch (error) {
        console.error(error);
      }
    }
    setIsTopFiveContributorsTableVisible(!isTopFiveContributorsTableVisible);
  }
  /*####################
  # End of FUNCTIONS --- Generate Top 5 contributors table
  ####################*/

  /*####################
  # End of FUNCTIONS 
  ####################*/



  /*####################
  # The following code is only about function used to render BUTTONS, such as renderButtonUploadFile, renderButtonClearUploadedFile, etc.
  ####################*/

  /*####################
  # BUTTONS --- Render button to upload file
  ####################*/
  const renderButtonUploadFile = () => {
    return (
      <div>
        <Input
          id={inputFileId}
          type='file'
          accept={acceptFileTypes}
          onChange={handleFileUpload}
          // The "hidden" is used to hide the file input, then we will use the label to trigger the file input instead
          className='hidden'
        />

        <label
          // The "htmlFor" must be the same as the "id" of the file input, then when we click on the label, it will trigger the file input
          htmlFor={inputFileId}
          className={`${styleForButton}`}
          // The ref={refTourStep1} is used to tell the tour that this is the target of the first step, the "Tour" is like the tutorial for the user
          ref={refTourStep1}
        >
          <Upload className='mr-2' size={sizeOfIcon} /> Upload file
        </label>
      </div>
    )
  }
  /*####################
  # End of BUTTONS --- Render button to upload file
  ####################*/


  /*####################
  # BUTTONS --- Render button to clear the uploaded file
  ####################*/
  const renderButtonClearUploadedFile = () => {
    return (
      <Button
        variant="outline"
        onClick={clearUploadedFile}
        ref={refTourStep6}
      >
        <Trash className='mr-2' size={sizeOfIcon} /> Clear
      </Button>
    )
  }
  /*####################
  # End of BUTTONS --- Render button to clear the uploaded file
  ####################*/


  /*####################
  # BUTTONS --- Render button to generate Screen plot
  ####################*/
  const renderButtonGenerateScreePlot = () => {
    return (
      <Button
        onClick={generateScreePlot}
        variant={isScreePlotVisible ? "default" : "outline"}
        ref={refTourStep2}
      >
        <BarChartBig className='mr-2' size={sizeOfIcon} /> Scree plot
      </Button>
    )
  }
  /*####################
  # End of BUTTONS --- Render button to generate Screen plot
  ####################*/


  /*####################
  # BUTTONS --- Render button to generate PCA plot
  ####################*/
  // The "pcaOptions" is the required format to use in the antd library <DropdownAntd> component
  // This one is used to show the PCA plot selection dropdown when user hovers to the "PCA plot" button, so it will show the "PCA 2D" and "PCA 3D" options
  // The "pcaOptions" will be used at very bottom of this file, in the "return" section, in the "DropdownAntd" component
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
        // Check if the file is uploaded, if not, then show the alert message and return
        if (!isFileUploaded()) {
          return;
        }
        // Set the selected groups to empty object, this is used to reset the selected groups
        setSelectedGroups({});
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
        // Set the selected groups to empty object, this is used to reset the selected groups
        setSelectedGroups({});
        // Check if the file is uploaded, if not, then show the alert message and return
        if (!isFileUploaded()) {
          return;
        }
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

  // The "renderButtonPCAPlot" function here is used to render the button "PCA Plot" or "PCA 2D" or "PCA 3D" based on the current visibility of the PCA 2D and PCA 3D
  // The "renderButtonPCAPlot" function is NOT related to the "pcaOptions" above
  // The "renderButtonPCAPlot" function is also used in at very bottom of this file, in the "return" section, in the "DropdownAntd" component
  const renderButtonPCAPlot = () => {
    // If the PCA 2D plot is visible, then show the button with the name "PCA 2D"
    if (isPCA2DVisible) {
      return (
        <Button variant="default">
          <ScatterChart className='mr-2' size={sizeOfIcon} /> {namePCA2D}
        </Button>
      )
      // If the PCA 3D plot is visible, then show the button with the name "PCA 3D"
    } else if (isPCA3DVisible) {
      return (
        <Button variant="default">
          <ScatterChart className='mr-2' size={sizeOfIcon} /> {namePCA3D}
        </Button>
      )
      // If the PCA 2D and PCA 3D plot are not visible, then show the button with the name "PCA plot"
    } else {
      return (
        <Button
          variant="outline"
          ref={refTourStep3}
        >
          <ScatterChart className='mr-2' size={sizeOfIcon} /> PCA plot
        </Button>
      )
    }
  }
  /*####################
  # End of BUTTONS --- Render button to generate PCA plot
  ####################*/


  /*####################
  # BUTTONS --- Render button to generate Loadings table
  ####################*/
  const renderButtonGenerateLoadingsTable = () => {
    return (
      <Button
        onClick={generateLoadingsTable}
        variant={isLoadingsTableVisible ? "default" : "outline"}
        ref={refTourStep4}
      >
        <TableIcon className='mr-2' size={sizeOfIcon} /> Loadings table
      </Button>
    )
  }
  /*####################
  # End of BUTTONS --- Render button to generate Loadings table
  ####################*/


  /*####################
  # BUTTONS --- Render button to generate Top 5 contributors table
  ####################*/
  const renderButtonGenerateTopFiveContributorsTable = () => {
    return (
      <Button
        onClick={generateTopFiveContributors}
        variant={isTopFiveContributorsTableVisible ? "default" : "outline"}
        ref={refTourStep5}
      >
        <TableIcon className='mr-2' size={sizeOfIcon} /> Top 5 contributors
      </Button>
    )
  }
  /*###################
  # End of BUTTONS --- Render button to generate Top 5 contributors table
  ####################*/


  /*####################
  # BUTTONS --- Render button download file
  ####################*/
  const renderButtonDownloadFile = (dataWillBeDownloaded, nameOfDownloadedFile) => {
    return (
      <CSVLink
        data={dataWillBeDownloaded}
        filename={nameOfDownloadedFile}
        className={`${styleForButton}`}
      >
        <Download className='mr-2' size={sizeOfIcon} /> Download file
      </CSVLink>
    )
  }
  /*####################
  # End of BUTTONS --- Render button download file
  ####################*/

  /*####################
  # End of BUTTONS
  ####################*/



  /*####################
  # The following code is only about function used to render PLOTS, such as renderScreePlot, renderPCAPlot, etc.
  ####################*/

  /*####################
  # PLOTS --- Render Scree plot
  ####################*/
  const renderScreePlot = () => {
    // If the scree plot is visible, then continue 
    if (isScreePlotVisible) {
      // If the screePlotData is not null, then continue to render the scree plot
      if (screePlotData) {
        return (
          <div className={`${spaceBetweenSections}`}>
            <p className={`${styleForSectionHeading}`}>
              Scree plot
            </p>
            <div className='p-3 border border-gray-200 rounded-lg'>
              {/* The <Plot/> component at here is from the react-plotly.js library */}
              <Plot
                useResizeHandler
                style={{ width: "100%", height: "500px" }}
                data={screePlotData.data}
                layout={screePlotData.layout}
                // key={Math.random()} is very IMPORTANT here, because it will force the Plot to re-render when the data is changed. 
                // Otherwise, the Plot will not re-render, so the color on the plot will not be updated.
                key={Math.random()}
              />
            </div>
            {/* This is the color choosing section for the scree plot */}
            {/* The code for COLORS is very below, so need to scrolling down to see the "renderColorSectionForScreePlot()" function */}
            <div className={`${spaceBetweenColorSectionAndPlot}`}>
              {renderColorSectionForScreePlot()}
            </div>
          </div>
        )
      }
    }
  }
  /*####################
  # End of PLOTS --- Render Scree plot
  ####################*/


  /*####################
  # PLOTS --- Render PCA plot 2D and 3D
  ####################*/
  const renderPCAPlotGeneral = (isPCA2DVisible, isPCA3DVisible) => {
    // If the PCA 2D plot is visible, then continue
    if (isPCA2DVisible) {
      // If the pcaPlotData is not null, then continue to render the PCA 2D plot
      if (pcaPlotData) {
        return (
          <div className={`${spaceBetweenSections}`} >
            <p className={`${styleForSectionHeading}`}>
              PCA-2D plot
            </p>
            <div className='border border-gray-200 rounded-lg overflow-hidden'>
              <Plot
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                data={pcaPlotData.data}
                layout={pcaPlotData.layout}
                // key={Math.random()} is very IMPORTANT here, because it will force the Plot to re-render when the data is changed. 
                // Otherwise, the Plot will not re-render, so the color of the samples on the plot will not be updated.
                key={Math.random()}
              />
            </div>
            {/* This is the color choosing section for the PCA 2D plot */}
            {/* The code for COLORS section is very below, so check the "renderColorSection" and "renderSampleNamesWithGroupChoice" at the nearly bottom of the file */}
            <div className={`${spaceBetweenColorSectionAndPlot}`}>
              {renderColorSection()}
              {renderSampleNamesWithGroupChoice(isPCA2DVisible, isPCA3DVisible)}
            </div>
          </div>
        )
      }
    } else if (isPCA3DVisible) {
      if (pcaPlot3DData) {
        return (
          <div className={`${spaceBetweenSections}`} >
            <p className={`${styleForSectionHeading}`}>
              PCA-3D plot
            </p>
            <div className='border border-gray-200 rounded-lg overflow-hidden'>
              <Plot
                useResizeHandler
                style={{ width: "100%", height: "700px" }}
                data={pcaPlot3DData.data}
                layout={pcaPlot3DData.layout}
                // key={Math.random()} is very IMPORTANT here, because it will force the Plot to re-render when the data is changed. 
                // Otherwise, the Plot will not re-render, so the color of the samples on the plot will not be updated.
                key={Math.random()}
              />
            </div>
            <div className={`${spaceBetweenColorSectionAndPlot}`}>
              {renderColorSection()}
              {renderSampleNamesWithGroupChoice(isPCA2DVisible, isPCA3DVisible)}
            </div>
          </div>
        )
      }
    } else {
      return null;
    }
  }
  /*####################
  # End of PLOTS --- Render PCA plot 2D and 3D
  ####################*/


  /*####################
  # PLOTS --- Render Top 5 contributors Plot
  ####################*/
  const renderTopFiveContributorsPlot = () => {
    // If the topFiveContributorsPlotData is not null, then continue to render the top 5 contributors plot
    if (topFiveContributorsPlotData) {
      return (
        <div className={`${spaceBetweenSections}`} >
          <p className={`${styleForSectionHeading}`}>
            Top 5 contributors plot
          </p>
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <Plot
              useResizeHandler
              style={{ width: "100%", height: "500px" }}
              data={topFiveContributorsPlotData.data}
              layout={topFiveContributorsPlotData.layout}
              // key={Math.random()} is very IMPORTANT here, because it will force the Plot to re-render when the data is changed. 
              // Otherwise, the Plot will not re-render, so the color of the samples on the plot will not be updated.
              key={Math.random()}
            />
          </div>

          {/* Color selection for the Top 5 contributors plot */}
          {colorForTopFiveContributorsPlot.length > 0 && (
            <div className={`${spaceBetweenColorSectionAndPlot}`}>
              {renderColorSectionForTopFiveContributorsPlot()}
            </div>
          )}
        </div>
      )
    }
  }

  /*####################
  # End of PLOTS --- Render Top 5 contributors Plot
  ####################*/

  /*####################
  # End of PLOTS
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
    // The confirm() is a predefined function from the antd library, it's used to confirm the search
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // The function handleReset is used to reset the search, meaning that it will clear the search input 
  const handleReset = (clearFilters) => {
    // The clearFilters() is a predefined function from the antd library, it's used to
    clearFilters();
    setSearchText('');
  };

  // The function renderSearchingDropdown is used to render the search input in the table
  const renderSearchingDropdown = (nameOfColumn) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        className='p-3'
        // The onKeyDown={(e) => e.stopPropagation()} is used in React. 
        // The "onKeyDown" event is fired when a user is pressing a key (on the keyboard).
        // ==> The "stopPropagation" is used when a key is pressed down, this code prevents the "onKeyDown" event from bubbling up to parent elements.
        // ==> This can be useful in scenarios where we don’ t want parent elements to react to the key press event. For example, if we have a modal and we don’t want a key press in the modal to trigger events in the background page, we could use this code.
        // ==> In this case, just to make sure that the event is not propagated to the parent element, we use this "onKeyDown".
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Input area */}
        <InputAntd
          className='w-full'
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

    // The "record" is the data of the table
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
  # End of TABLE --- Searching Dropdown
  ####################*/


  /*####################
  # TABLE --- Data Table
  # The following code is only about the Data Table, which is the table that shows the data from the csv file that user uploaded
  ####################*/
  // Firstly, we convert the data from the csv file that user uploaded to the format required by "Ant Design" (antd). The Ant Design Table belongs to the library "antd" which is used for the UI. Link: https://ant.design/components/table
  // Usually, the data required by antd table is the "data" and the "columns"

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
      <div className={`${spaceBetweenSections}`} >
        <div className='flex justify-between'>
          {/* Title of the table */}
          <p className={`${styleForSectionHeading}`}>
            Data table
          </p>

          {/* Button download file */}
          {renderButtonDownloadFile(csvData, "dataTable.csv")}

        </div>
        {/* The table */}
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
      </div>
    )
  }
  /*####################
  # End of TABLE --- Data Table
  ####################*/


  /*####################
  # TABLE --- Loadings Table
  # The following code is only about the Loadings Table, which is the table that shows which genes contribute how much to the principal components
  ####################*/
  // The flow of "TABLE --- Loadings Table" is similar to the "TABLE --- Data Table" above
  const dataForLoadingsTable = loadingsTableData.map((eachRow, index) => ({
    key: index,
    ...eachRow,
  }));

  const columnForLoadingsTable = loadingsTableData.length > 0
    ? Object.keys(loadingsTableData[0])
      .sort((a, b) => a.includes("PC") - b.includes("PC"))
      .map((nameOfEachColumn) => {
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
      <div className={`${spaceBetweenSections}`} >
        <div className='flex justify-between'>
          {/* Title of the table */}
          <p className={`${styleForSectionHeading}`}>
            Loadings table
          </p>

          {/* Button download file */}
          {renderButtonDownloadFile(loadingsTableData, "loadingsTable.csv")}

        </div>
        {/* The table */}
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
  # End of TABLE --- Loadings Table
  ####################*/


  /*####################
  # TABLE --- Top Five Contributors Table
  # The following code is only about the Top Five Contributors Table, which is the table that shows the top 5 contributors to the principal components
  ####################*/
  // The flow of "TABLE --- Top Five Contributors Table" is similar to the "TABLE --- Data Table" above
  const dataForTopFiveContributorsTable = topFiveContributorsTableData.map((eachRow, index) => ({
    key: index,
    ...eachRow,
  }));

  const columnForTopFiveContributorsTable = topFiveContributorsTableData.length > 0
    ? [
      // First column
      ...Object.keys(topFiveContributorsTableData[0]).filter(nameOfEachColumn => nameOfEachColumn !== "Principal component" && nameOfEachColumn !== "Loadings").map((nameOfEachColumn) => {
        let column = {
          title: nameOfEachColumn,
          dataIndex: nameOfEachColumn,
          key: nameOfEachColumn,
          width: 100,
          ...renderSearchingDropdown(nameOfEachColumn),
        };
        return column;
      }),
      // "Loadings" column
      ...Object.keys(topFiveContributorsTableData[0]).filter(nameOfEachColumn => nameOfEachColumn === "Loadings").map((nameOfEachColumn) => {
        let column = {
          title: nameOfEachColumn,
          dataIndex: nameOfEachColumn,
          key: nameOfEachColumn,
          width: 100,
          sorter: (a, b) => a[nameOfEachColumn] - b[nameOfEachColumn],
        };
        return column;
      }),
      // "Principal component" column
      ...Object.keys(topFiveContributorsTableData[0]).filter(nameOfEachColumn => nameOfEachColumn === "Principal component").map((nameOfEachColumn) => {
        let column = {
          title: nameOfEachColumn,
          dataIndex: nameOfEachColumn,
          key: nameOfEachColumn,
          width: 100,
          ...renderSearchingDropdown(nameOfEachColumn),
        };
        return column;
      })
    ]
    : [];


  // Render the top five contributors table
  const renderTopFiveContributorsTable = () => {
    if (!isTopFiveContributorsTableVisible) {
      return null;
    }
    if (topFiveContributorsTableData.length === 0) {
      return null;
    }
    return (
      <div className={`${spaceBetweenSections}`} >
        <div className='flex justify-between'>
          {/* Title of the table */}
          <p className={`${styleForSectionHeading}`}>
            Top 5 contributors
          </p>

          {/* Button download file */}
          {renderButtonDownloadFile(topFiveContributorsTableData, "topFiveContributors.csv")}

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
  # End of TABLE --- Top Five Contributors Table
  ####################*/

  /*####################
  # End of TABLE
  ####################*/



  /*####################
  # The following code is only about COLORS, such as changing color of the points in the PCA plot, changing color of the groups, etc.
  ####################*/

  /*####################
  # COLORS --- Setup variables
  ####################*/

  /*####################
  # COLORS --- Setup variables --- For PCA 2D and PCA 3D
  ####################*/
  // The "nameOfSamples" is an array of objects, each object in the array will have the format like this later:
  // nameOfSamples = [
  //    {
  //      name: "H2O_30m_A",
  //      groupId: ""
  //    },
  //    {
  //      name: "H2O_30m_B",
  //      groupId: ""
  //    },
  // ]
  const [nameOfSamples, setNameOfSamples]
    = useState([]);

  // The "colorGroups" is an array of objects, and it is used to store the color of the groups
  // The "sampleNames" in the "colorGroups" is an array of strings, and it is used to store the names of the samples that belong to which group, like "H2O_30m_A", "H2O_30m_B", "H2O_30m_C", etc.
  // For example, if user chooses "Group 1" for "H2O_30m_A"
  // ==> then "H2O_30m_A" will be added to the "sampleNames" array of "Group 1".
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
      colorCode: defaultColor,
      sampleNames: []
    },
  ]);

  // This "groupOptions" is the required format to use in the antd library <Select> component
  // This one is used to render the Group selection dropdown for user to select, when user click on the button next to the name of the sample in the PCA plot, it will show the dropdown for user to choose the group for the sample
  // In this case, instead of having this format:
  // {
  //   label: "Group 1",
  //   groupId: "1",
  //   colorCode: defaultColor
  // }
  // We have this format:
  // {
  //   label: "Group 1",
  //   value: "1, defaultColor"
  // }
  // ==> because the "antd library" <Select> component only accepts 02 properties "label" and "value"
  // ==> so we do the workaround to combine the "groupId" and "colorCode" into 01 string, which is "value"
  // ==> so we will split the string to get the "groupId" and "colorCode" later
  const [groupOptions, setGroupOptions] = useState([
    {
      label: "Group 1",
      value: `1, ${defaultColor}`
    },
    {
      label: "Group 2",
      value: `2, ${defaultColor}`
    },
  ]);

  // The purpose for this "selectedGroups" is to link with the "resetAll" function
  // ==> so when user clicks on the "Reset all" button
  // ==> then the selected group for each sample will be reset to ""
  // ==> and the color of the samples on the plot will be reset to the default color
  // ==> and also the "sampleNames" array of the group will be reset to empty array.
  const [selectedGroups, setSelectedGroups] = useState({});

  // The "colorForTopFiveContributorsPlot" is used to store the color of the top 5 contributors plot
  const [colorForTopFiveContributorsPlot, setColorForTopFiveContributorsPlot] = useState([]);
  /*####################
  # End of COLORS --- Setup variables --- For PCA 2D and PCA 3D
  ####################*/


  /*####################
  # COLORS --- Setup variables --- For Scree plot
  ####################*/
  const [colorForScreePlot, setColorForScreePlot] = useState(defaultColor);
  /*####################
  # End of COLORS --- Setup variables --- For Scree plot
  ####################*/

  /*####################
  # End of COLORS --- Setup variables
  ####################*/


  /*####################
  # COLORS --- Functions
  ####################*/

  /*####################
  # COLORS --- Functions --- Change color for PCA 2D and PCA 3D
  ####################*/

  /*####################
  # COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleChangeGroupForEachSample
  ####################*/
  // The function "handleChangeGroupForEachSample" is call when user click on the which color group belong to each sample.
  // For example:
  // "H2O_30m_A" - user chooses "Group 1"
  // "H2O_30m_B" - user chooses "Group 1"
  const handleChangeGroupForEachSample = (sampleName, value) => {
    // Because at the above, we set the "value" of the each object in the "groupOptions" to be "1, defaultColor", "2, defaultColor"
    // So here, we will split the "value" to get the "groupId" and "colorCode", like groupId = "1", colorCode = defaultColor
    let [groupId, colorCode] = value.split(", ");

    // The flow of the code here is similar to the "handleChangeColorInPlot2D" and "handleChangeColorInPlot3D", so the flow will be explained in details at here
    // ==> Then at the "handleChangeColorInPlot2D" and "handleChangeColorInPlot3D" functions, we can see the comments at here again

    // Firstly, we copy the "colorGroups" array to a new array.
    // Copying old array to new array is a step in update the state, as we should not update the state directly
    // ==> we should update the state by using the "setColorGroups" function
    // If we update the state directly, then the screen WILL NOT be re-rendered
    // ==> so the color of the samples on the plot will not be updated.
    const newColorGroups = [...colorGroups];

    // Then, we find the index of the group in the array, like if user chooses "Group 1" for "H2O_30m_A"
    // ==> then we will find where is the "Group 1" in the array newColorGroups
    // ==> then we will add "H2O_30m_A" to the "sampleNames" array of "Group 1"
    const indexOfColorGroup = newColorGroups.findIndex(group => group.groupId === groupId);

    // If the group is found in the array
    if (indexOfColorGroup !== -1) {
      // ==> then we will add the sample to the "sampleNames" array of the group
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
  /*####################
  # End of COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleChangeGroupForEachSample
  ####################*/


  /*####################
  # COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleChangeColorInPlot2D
  ####################*/
  // The function "handleChangeColorInPlot2D" is used to change the color of the sample in the 2D PCA plot
  const handleChangeColorInPlot2D = (sampleName, colorCode) => {
    // The flow of the code here is similar to the "handleChangeGroupForEachSample" function, so check the comments in the "handleChangeGroupForEachSample" function for more details
    const newPcaPlotData = { ...pcaPlotData }
    const index = newPcaPlotData.data.findIndex(sample => sample.name === sampleName);
    if (index !== -1) {
      newPcaPlotData.data[index].marker.color = colorCode;
    }
    setPcaPlotData(newPcaPlotData);
  }
  /*####################
  # End of COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleChangeColorInPlot2D
  ####################*/


  /*####################
  # COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleChangeColorInPlot3D
  ####################*/
  // The function "handleChangeColorInPlot3D" is used to change the color of the sample in the 3D PCA plot
  const handleChangeColorInPlot3D = (sampleName, colorCode) => {
    // The flow of the code here is similar to the "handleChangeGroupForEachSample" function, so check the comments in the "handleChangeGroupForEachSample" function for more details
    const newPcaPlotData = { ...pcaPlot3DData }
    const index = newPcaPlotData.data.findIndex(sample => sample.name === sampleName);
    if (index !== -1) {
      newPcaPlotData.data[index].marker.color = colorCode;
    }
    setPcaPlot3DData(newPcaPlotData);
  }
  /*####################
  # End of COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleChangeColorInPlot3D
  ####################*/


  /*####################
  # COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleChangeGroupColorInPlot2D
  ####################*/
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
  /*####################
  # End of COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleChangeGroupColorInPlot2D
  ####################*/


  /*####################
  # COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleChangeGroupColorInPlot3D
  ####################*/
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
  /*####################
  # End of COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleChangeGroupColorInPlot3D
  ####################*/


  /*####################
  # COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleColorOfGroupChange
  ####################*/
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
  /*####################
  # End of COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- handleColorOfGroupChange
  ####################*/


  /*####################
  # COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- addGroupColor
  ####################*/
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
  # End of COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- addGroupColor
  ####################*/


  /*####################
  # COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- resetAll
  ####################*/
  const resetAll = () => {
    Swal.fire({
      title: "Do you want to reset all colors back to the default?",
      icon: "warning",
      confirmButtonColor: '#272E3F',
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      // If the user clicks on the "Yes" button, then we will reset all color back to the default
      if (result.isConfirmed) {
        // Change the color of the samples in the PCA plot back to the default color
        const newColorGroups = [...colorGroups];
        newColorGroups.forEach((eachGroup, indexOfEachGroup) => {
          eachGroup.colorCode = defaultColor;
          eachGroup.sampleNames.forEach((sampleName, indexOfSampleName) => {
            if (isPCA2DVisible) {
              handleChangeColorInPlot2D(sampleName, defaultColor);
            } else if (isPCA3DVisible) {
              handleChangeColorInPlot3D(sampleName, defaultColor);
            }
          })
        })
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
        // Make the groupOptions back to the default, which means set them back to have 2 groups, and the color of each group is the default color
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
        // Reset the selected groups to empty object, so like "H2O_30m_A" - "", "H2O_30m_B" - "", etc.
        setSelectedGroups({});
        // Then show the alert message to tell the user that everything is done
        Swal.fire({
          title: "Done!",
          icon: "success",
          showConfirmButton: false,
          // The timer is used to auto close the alert
          timer: 1500,
        });
      }
    });
  }
  /*####################
  # End of COLORS --- Functions --- Change color for PCA 2D and PCA 3D --- resetAll
  ####################*/

  /*####################
   # End of COLORS --- Functions --- Change color for PCA 2D and PCA 3D
   ####################*/


  /*####################
  # COLORS --- Functions --- Change color for Scree plot
  ####################*/
  // The function "changeColorForScreePlot" flow is similar to the "handleChangeGroupForEachSample" function above, so check the comments in the "handleChangeGroupForEachSample" function for more details
  const changeColorForScreePlot = (newColor) => {
    const newScreePlotData = { ...screePlotData }
    newScreePlotData.data[0].marker.color = newColor;
    setScreePlotData(newScreePlotData);
    setColorForScreePlot(newColor);
  }
  /*####################
  # End of COLORS --- Functions --- Change color for Scree plot
  ####################*/


  /*####################
  # COLORS --- Functions --- Change color for Top 5 contributors plot
  ####################*/
  const changeColorForTopFiveContributorPlot = (newColor, pcName) => {
    // Change the color on the "selecting color bar"
    const newColorForTopFiveContributorsPlot = [...colorForTopFiveContributorsPlot];
    const indexOfPcName = newColorForTopFiveContributorsPlot.findIndex(item => item.pcName === pcName);
    newColorForTopFiveContributorsPlot[indexOfPcName].colorCode = newColor;
    setColorForTopFiveContributorsPlot(newColorForTopFiveContributorsPlot);
    // Change color on the top 5 contributors plot
    const newTopFiveContributorsPlotData = topFiveContributorsPlotData.data.map(item => {
      if (item.x[0] === pcName) {
        return {
          ...item,
          marker: {
            ...item.marker,
            color: newColor
          }
        };
      } else {
        return item;
      }
    });

    // Update the state with the new data
    setTopFiveContributorsPlotData({
      ...topFiveContributorsPlotData,
      data: newTopFiveContributorsPlotData
    });
  };


  /*####################
  # End of COLORS --- Functions --- Change color for Top 5 contributors plot
  ####################*/


  /*####################
  # End of COLORS --- Functions
  ####################*/


  /*####################
  # COLORS --- Render
  ####################*/

  /*####################
  # COLORS --- Render --- Color section for PCA 2D and PCA 3D
  ####################*/

  /*####################
  # COLORS --- Render --- Color section for PCA 2D and PCA 3D --- renderColorSection
  ####################*/
  const renderColorSection = () => {
    // If the PCA 2D and PCA 3D are not visible, then we will return null
    if (!isPCA2DVisible && !isPCA3DVisible) {
      return null;
    }
    // If there is data in the PCA plot 2D or 3D, then we will render the color section
    if (pcaPlotData || pcaPlot3DData) {
      return (
        <div>
          {/* This will render groups, like "Group 1 - which color", "Group 2 - which color", etc. */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 items-center'>
            {colorGroups.map((eachColorGroup, indexOfEachColorGroup) => (
              <div
                key={indexOfEachColorGroup}
                className='flex gap-2 items-center'
              >
                {/* Name of the group, like "Group 1", "Group 2", "Group 3", etc. */}
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

            <div className='flex items-center gap-2'>
              {/* Button "Add Group", to add the group of color */}
              <Button
                variant="secondary"
                size="icon"
                onClick={addGroupColor}
              >
                <Plus />
              </Button>
              {/* End of Button "Add Group*/}

              {/* Button "Reset all" */}
              <Button
                variant="outline"
                onClick={resetAll}
              >
                Reset all
              </Button>
              {/* End of Button "Reset all" */}
            </div>

          </div>
        </div>
      );
    }
  }
  /*####################
  # End of COLORS --- Render --- Color section for PCA 2D and PCA 3D --- renderColorSection
  ####################*/


  /*####################
  # COLORS --- Render --- Color section for PCA 2D and PCA 3D --- renderSampleNamesWithGroupChoice
  ####################*/
  const renderSampleNamesWithGroupChoice = (isPCA2DVisible, isPCA3DVisible) => {
    if (!isPCA2DVisible && !isPCA3DVisible) {
      return null;
    }
    if (pcaPlotData || pcaPlot3DData) {
      return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mt-5'>
          {nameOfSamples.map((sample, index) => {
            return <div
              key={index}
              className='grid grid-cols-2 items-center'
            >
              <p>{sample.name}</p>
              <Select
                value={selectedGroups[sample.name]}
                onChange={(value) => {
                  handleChangeGroupForEachSample(sample.name, value);
                  setSelectedGroups(prevState => ({ ...prevState, [sample.name]: value }));
                }}
                className='md:w-3/5'
                options={groupOptions}
              />
            </div>
          })}
        </div>
      )
    }
  }
  /*####################
  # End of COLORS --- Render --- Color section for PCA 2D and PCA 3D --- renderSampleNamesWithGroupChoice
  ####################*/

  /*####################
  # End of COLORS --- Render --- Color section for PCA 2D and PCA 3D
  ####################*/


  /*####################
  # COLORS --- Render --- Color section for Scree plot
  ####################*/
  const renderColorSectionForScreePlot = () => {
    if (!isScreePlotVisible) {
      return null;
    }
    if (screePlotData) {
      return (
        <div className='flex gap-2 items-center'>
          <span>Color for Scree plot</span>
          <Input
            type="color"
            className='cursor-pointer w-32 h-10 rounded-md border border-gray-300'
            value={colorForScreePlot}
            onChange={(e) => changeColorForScreePlot(e.target.value)}
          />
        </div>
      )
    }
  }
  /*####################
  # End of COLORS --- Render --- Color section for Scree plot
  ####################*/

  /*####################
  # COLORS --- Render --- Color section Top 5 contributors plot
  ####################*/
  const renderColorSectionForTopFiveContributorsPlot = () => {
    return <div className='grid grid-cols-2 md:grid-cols-5 gap-2'>
      {colorForTopFiveContributorsPlot.map((eachItem, index) => {
        return <div
          key={index}
          className='flex gap-2 items-center'
        >
          <span>{eachItem.pcName}</span>
          <Input
            type="color"
            className='cursor-pointer w-32 h-10 rounded-md border border-gray-300'
            value={eachItem.colorCode}
            onChange={(e) => changeColorForTopFiveContributorPlot(e.target.value, eachItem.pcName)}
          />
        </div>
      })}
    </div>
  }
  /*####################
  # End of COLORS --- Render --- Color section Top 5 contributors plot
  ####################*/

  /*####################
  # End of COLORS --- Render
  ####################*/

  /*####################
  # End of COLORS
  ####################*/



  /*####################
  # The following code is only about the FILE INFORMATION, such as the file name, the number of samples, etc.
  ####################*/
  const renderFileInformation = () => {
    if (csvData.length === 0) {
      return null;
    }
    return (
      <div className='my-5'>
        {/* Render file name */}
        {uploadedFileName && (
          <p>
            File name: <span className='font-semibold'>{uploadedFileName}</span>
          </p>
        )}
        {/* Render number of samples */}
        <p>
          Number of samples:  <span className='font-semibold'>{csvData ? csvData.length : "0"}</span>
        </p>
      </div>
    )
  }
  /*####################
  # End of the FILE INFORMATION
  ####################*/

  console.log("!!! colorForTopFiveContributorsPlot", colorForTopFiveContributorsPlot)

  /*####################
  # The following code is to render the FINAL UI of the page
  ####################*/
  return (
    <div className='container mt-4 flex flex-col'>


      {/* NAVBAR */}
      <div className="flex py-3 justify-between sticky top-1 z-10 bg-opacity-50 backdrop-filter backdrop-blur bg-white">
        {/* NAVBAR --- Left side */}


        <div className='hidden'>
          <Button
            variant="outline"
            onClick={() => setIsTourOpen(true)}
            className='invisible'
          >
            <Rocket className='mr-2' size={sizeOfIcon} /> Begin a tour
          </Button>

          <div className="invisible scroll-m-20 text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-yellow-300 font-outline">
              PCA Generator
            </span>
          </div>
        </div>
        {/* End of NAVBAR --- Left side */}

        {/* NAVBAR --- Right side */}
        <div className="hidden lg:flex lg:gap-2 lg:justify-end">
          {renderButtonUploadFile()}
          {renderButtonGenerateScreePlot()}

          {/* Render Button PCA 2D and 3D */}
          {/* At here we put the DropdownAntd, which is a Dropdown component from antd library, it will take the "pcaOptions" as the things will show up when user clicks */}
          {/* The "pcaOptions" is the "PCA 2D" and "PCA 3D" */}
          <DropdownAntd
            menu={{
              items: pcaOptions,
            }}
            placement="bottomLeft"
            arrow
          >
            {renderButtonPCAPlot()}
          </DropdownAntd>
          {/* End of Render Button PCA 2D and 3D */}

          {renderButtonGenerateLoadingsTable()}
          {renderButtonGenerateTopFiveContributorsTable()}
          {renderButtonClearUploadedFile()}
        </div>
        {/* End of NAVBAR --- Right side */}

        {/* Icon Hamburger */}
        {/* For when user use the mobile screen */}
        <button
          className="h-6 w-6 text-inherit lg:hidden dark:text-white"
          onClick={() => { setIsNavbarMobileOpen(!isNavbarMobileOpen) }}
        >
          {isNavbarMobileOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* NAVBAR --- on mobile --- PUT THIS OUTSIDE THE NAV)*/}
      {isNavbarMobileOpen && (
        <div className="flex flex-col gap-5 p-5 border border-gray-900 rounded-xl">
          {renderButtonUploadFile()}
          {renderButtonGenerateScreePlot()}

          {/* Render Button PCA 2D and 3D */}
          {/* At here we put the DropdownAntd, which is a Dropdown component from antd library, it will take the "pcaOptions" as the things will show up when user clicks */}
          {/* The "pcaOptions" is the "PCA 2D" and "PCA 3D" */}
          <DropdownAntd
            menu={{
              items: pcaOptions,
            }}
            placement="bottomLeft"
            arrow
          >
            {renderButtonPCAPlot()}
          </DropdownAntd>
          {/* End of Render Button PCA 2D and 3D */}

          {renderButtonGenerateLoadingsTable()}
          {renderButtonGenerateTopFiveContributorsTable()}
          {renderButtonClearUploadedFile()}
        </div>
      )}
      {/* End of NAVBAR --- on mobile --- PUT THIS OUTSIDE THE NAV)*/}
      {/* End of NAVBAR */}

      {/*  */}
      <div className='mt-16'>
        {renderFileInformation()}
        {renderDataTable()}
        {renderScreePlot()}
        {renderPCAPlotGeneral(isPCA2DVisible, isPCA3DVisible)}
        {renderLoadingsTable()}
        {renderTopFiveContributorsTable()}
        {renderTopFiveContributorsPlot()}
      </div>

      {/* Tour */}
      {/* This is the "tour" as a tutorial for user, and this <Tour> should be put at the end */}
      {/* The "Tour" is hidden, until the user click the button "Begin a tour" */}
      {/* When user clicks the button "Begin a tour", the isTourOpen will change to be "true" */}
      <Tour
        steps={tourSteps}
        open={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
      {/* End of Tour */}
    </div>
  );
  /*####################
  # End of the code to render the final UI of the page
  ####################*/
}
