/*#################################
#
# 🚀 Created by Quang, 2024
# ✉️ For any inquiries, suggestions, or discussions related to this work, feel free to contact me at: voquang.usth@gmail.com
#
#################################*/


/*####################
# 1️⃣ USING "use client"
####################*/
// In NextJS (a React framework), as a default, a file will run on the "server side", not on the "client side".
// This "use client" is IMPORTANT and need to put on the top of the file in NextJS , as it is used to run the file in the "client side", not in the "server side". 
// Because in this "page.js" file, we use the "useState", "useEffect", etc. which are the React hooks, and they are running in the "client side", not in the "server side", so we need to put "use client" here. 
// A client component is a React component that can be re-rendered when users interact, click the buttons, change the color, etc. with the app.
"use client"
/*####################
# 1️⃣ End of USING "use client"
####################*/


/*####################
# 2️⃣ IMPORT
####################*/
// The Loading component
import Loading from "./loading";

// The useState, useRef are used to create the state and reference to the DOM element
import { useState, useRef, useEffect, Suspense } from 'react';

// The "dynamic" is used to import the "Plot" component from the "react-plotly.js" library below
import dynamic from "next/dynamic";

// The "Plot" from the react-plotly.js library is used to render the plot
// Instead of importing like this: " import Plot from 'react-plotly.js', we use the "dynamic" function from NextJS to import the "Plot" component
// ==> because the "Plot" component is used in the client side, not in the server side, so we need to use the "dynamic" function to import it
// So " const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) " is just another way to import the "Plot" component
// If we use "import Plot from 'react-plotly.js'", it will cause the error when running "npm run build"
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

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
  Tour,
  // At here, we change the name from "Input" to "InputAntd", "Dropdown" to "DropdownAntd" because to avoid the conflict with the same name "Input" and "Dropdown" imported from the @/components/ui/ 
  Input as InputAntd,
  Dropdown as DropdownAntd,
} from 'antd';


// The icons from 'lucide-react' library
import {
  Plus,
  Rocket,
  Trash,
  BarChartBig,
  ScatterChart,
  Upload,
  Download,
  // At here, we change the name from "Table" to "TableIcon" because to avoid the conflict with the same name "Table" imported from "antd" library
  Table as TableIcon,
} from 'lucide-react';
import { SearchOutlined } from '@ant-design/icons';

// The Highlighter is used to highlight the searched text in the table
import Highlighter from 'react-highlight-words';

// The sweetalert2 is used to show the alert message, like the alert message when the user didn't upload the file yet
import Swal from 'sweetalert2'

// The react-csv library is used to download the table as a csv file
import { CSVLink } from 'react-csv';

// This useSearchParams is used to get the query parameters from the URL
import { useSearchParams } from "next/navigation"
/*####################
# 2️⃣ End of IMPORT
####################*/


/*####################
# 3️⃣ COVER THE PAGE WITH LOADING COMPONENT
####################*/
export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      {/* <HomeContent /> is the component below, where we assign variables, write functions, render buttons, plots, etc. in there */}
      <HomeContent />
    </Suspense>
  );
}
/*####################
# 3️⃣ End of COVER THE PAGE WITH LOADING COMPONENT
####################*/


/*####################
# 4️⃣ HOMECONTENT COMPONENT
# This is the main component that contains all the variables, functions, buttons, plots, tables, etc.
####################*/
function HomeContent() {
  // Define the backend url and port
  const BACKEND_PORT = 7000
  const BACKEND_URL = `http://localhost:${BACKEND_PORT}`


  /*#####################################
  ######     INITIAL VARIABLES     ######
  #####################################*/

  // Below, we have "csvData", "setCsvData" ; "pcaPlotData", "setPcaPlotData" ;  etc.

  // The "setSomething" function is used to update the "something"
  // For example, at the beginning, if something = "123", then setSomething("abcdef") will update something, then something = "abcdef"

  // The "useState" function is a React hook function that is used to create the combo of "something" and "setSomething"
  // The purpose of using "useState" is that it is used to "trigger the re-render of the UI" when the "something is updated"

  // For example, at the beginning, screePlotData = null, then nothing on the screen yet,
  // ==> then when user clicks on the "Scree plot" button, it will call API to calculate the scree plot data
  // ==> then we need to store the data received from API to the "screePlotData" and render it to the screen.
  // If we just simply assign the screePlotData = "some_data_received_after_calling_from_API", it will not re-render the UI, so the scree plot will not be shown on the screen.
  // ==> so we need to use setScreePlotData("some_data_received_after_calling_from_API") to update the screePlotData, then the UI will be re-rendered, and the scree plot will be shown on the screen.
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
  // This is controlled by the buttons in the BUTTONS section below (very below)
  const [isScreePlotVisible, setIsScreePlotVisible] = useState(false);
  const [isPCA2DVisible, setIsPCA2DVisible] = useState(false);
  const [isPCA3DVisible, setIsPCA3DVisible] = useState(false);
  const [isLoadingsTableVisible, setIsLoadingsTableVisible] = useState(false);
  const [isTopFiveContributorsTableVisible, setIsTopFiveContributorsTableVisible] = useState(false);
  const [isTopFiveContributorsPlotVisible, setIsTopFiveContributorsPlotVisible] = useState(false);

  // This is the name of uploaded file, it will be used to show the name of the uploaded file on the screen
  // This is just for uploaded file, but the MicroMix already has the data, so this can be IGNORED
  const [uploadedFileName, setUploadedFileName] = useState("");

  // The number of samples
  // The number of samples will be calculated in the "useEffect" part, so check the "useEffect" part below 
  const [numberOfSamples, setNumberOfSamples] = useState(0);

  // The name of the PCA 2D and PCA 3D, just used for naming the title of the buttons
  const namePCA2D = "PCA 2D";
  const namePCA3D = "PCA 3D";

  // The "defaultColor" is used to set the default color on the plots, like the scree plot, PCA plot, etc.
  // The hexcode for many color can be found at https://htmlcolorcodes.com/
  const defaultColor = "#272E3F";

  // The id for the file input, which will be used later to reset the file input value to null
  // The reason we need to reset the file input value to null is that if we don't reset the file input value to null, then the user can't upload the same file again after they uploaded it once
  // This is just for uploaded file function, but the MicroMix already has the data, so this can be IGNORED
  const inputFileId = "fileInput";
  // The acceptFileTypes is used to allow the user to upload the file with the following types, like .csv, .xlsx, .xls
  // This is just for uploaded file function, but the MicroMix already has the data, so this can be IGNORED
  const acceptFileTypes = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

  // The styles for the buttons, sections, etc.
  const sizeOfIcon = "20px"
  const spaceBetweenSections = "mb-[75px]";
  const spaceBetweenColorSectionAndPlot = "mt-[15px]";
  const styleForSectionHeading = "mb-[15px] text-2xl md:text-3xl font-bold"
  const styleForButton = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"

  // Variables for the "Begin a Tour" button
  // The "isTourOpen" is used to control the visibility of the tour
  // The "setIsTourOpen" is used to update the "isTourOpen"
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
    // ==> This is a popup that will show up when the user clicks on the "Begin a Tour" button
    // ==> It has a structure with: target, title, description, cover
    // ==> The "target" is used to tell the "Tour" that this is the target of the first step
    // ==> The "title" is the title of popup
    // ==> The "description" is the description of the popup
    // ==> The "cover" is the image that will be shown on the popup
    {
      target: () => refTourStep1.current,
      title: 'Upload file',
      description: <div>
        <p>
          Upload your file here.
        </p>
      </div>,
    },
    // Tour step 2
    // ==> similar to the Tour step 1
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
    // ==> similar to the Tour step 1
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
    // ==> similar to the Tour step 1
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
    // ==> similar to the Tour step 1
    {
      target: () => refTourStep5.current,
      title: 'Top 5 contributors',
      description: <div>
        <ul className='list-disc list-inside'>
          <li>
            The top-5-contributors typically lists the five variables that contribute the most to each principal component.
          </li>
          <li>
            The contribution of a variable is determined by its loading, with larger absolute values indicating stronger contributions.
          </li>
        </ul>
      </div>,
      cover: <div>
        <img
          alt="top 5 contributors table"
          src='tour-top-5-contributors-table.png'
        />
        <img
          alt="top 5 contributors plot"
          src='tour-top-5-contributors-plot.png'
        />
      </div>,
    },
    // Tour step 6
    // ==> similar to the Tour step 1
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
  /*############################################
  ######     End of INITIAL VARIABLES     ######
  #############################################*/



  /*#############################
  ######     FUNCTIONS     ######
  #############################*/

  /*####################
  # FUNCTIONS --- Check if a string is a number
  ####################*/
  // This "isNumber" function is used to check if a string is a number or not
  // The "value.replace(/\./g, '').replace(',', '.')" is used to replace all dot (.) in the string with nothing, and then replacing all commas (,) with dots (.).
  // ==> This is done in order to handle cases where numbers are written with commas as decimal separators
  // ==> for example: "1452.11" => this is number; "1452,11" => this is also number.
  // parseFloat(value) is used to convert the modified string to a float number.
  // !isNaN(parseFloat(value)) checks if the result of parseFloat is not a NaN (Not a Number) value
  // ==> If the string can be converted to a number, parseFloat will return that number and isNaN will return false.
  // ==> so parseFloat(value) will return a number, and isNaN(parseFloat(value)) will return false
  // ==> so !isNaN(parseFloat(value)) will return true
  // For example, if value = "152,2"
  // ==> value.replace(/\./g, '').replace(',', '.') will return "152.2"
  // ==> parseFloat(value) will return 152.2
  // ==> isNaN(parseFloat(value)) will return false
  // ==> !isNaN(parseFloat(value)) will return true
  // ==> so finally, 152,2 is a number
  // isFinite(value) checks if the converted number is a finite number.
  const isNumber = (value) => {
    // If the value is not a string, then convert it to a string
    if (typeof value !== 'string') {
      value = value.toString();
    }
    value = value.replace(/\./g, '').replace(',', '.');
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  // The following are the test cases for the "isNumber" function:
  // console.log("123", isNumber("123"))                      // ===> true
  // console.log("123.123", isNumber("123.123"))              // ===> true
  // console.log("123,123", isNumber("123,123"))              // ===> true
  // console.log("123.123.123", isNumber("123.123.123"))      // ===> false
  // console.log("123,123,123", isNumber("123,123,123"))      // ===> false
  // console.log("123abc", isNumber("123abc"))                // ===> false
  // console.log("abc", isNumber("abc"))                      // ===> false
  // console.log("abc123", isNumber("abc123"))                // ===> false
  /*####################
  # End of FUNCTIONS --- Check if a string is a number
  ####################*/


  /*####################
  # FUNCTIONS --- Count number of samples
  ####################*/
  // This "countNumberOfSamples" function is used to count the number of samples in the data
  // The "data" is the data that is got from the MongoDB
  // So the idea is to check the first row of the data
  // ==> then check each item in the first row, if it is a number, then count++; if it is not a number, then skip (like "H2O_30m_A" => not a number, so skip)
  // ==> finally, the "count" will be the number of samples
  // Then set the "count" to the "numberOfSamples" state by using "setNumberOfSamples" function
  // So the "numberOfSamples" will be used to show the number of samples on the screen
  // The place where "numberOfSamples" is used can be found at the function "renderFileInformation" at very below
  const countNumberOfSamples = (data) => {
    const firstRow = data[0];
    let count = 0;
    for (const key in firstRow) {
      if (isNumber(firstRow[key])) {
        count++;
      }
    }
    setNumberOfSamples(count);
  }
  /*####################
  # End of FUNCTIONS --- Check number of samples
  ####################*/

  /*####################
  # GET THE CONFIG NUMBER FROM THE URL
  ####################*/
  // This is used to get the config number from the URL, then send it to the backend to get the data from the MongoDB
  // This is done when the page is loaded inside the MicroMix page
  // This part is linked with the "useEffect" part below, so when read the "useEffect" part below, come back to this part to see the flow of the code
  // By using "useSearchParams", we create the "searchParams" object, which can be used to extract the query parameters from the URL
  const searchParams = useSearchParams()
  // Then we get the config number from the URL by using "searchParams.get("config")"
  // It can be "searchParams.get("aaaaa")", "searchParams.get("bbbbb")", etc. depending on the query parameters name in the URL
  // ==> for example, the URL is "http://localhost:3000/?aaaaa=123123", then searchParams.get("aaaaa") will return "123123"
  const configNumber = searchParams.get("config")
  /*####################
  # End of GET THE CONFIG NUMBER FROM THE URL
  ####################*/


  /*####################
  # FUNCTIONS --- useEffect
  ####################*/
  // useEffect(() => {...}, []);: This is a React Hook that runs the function provided as the first argument after the component has rendered.
  // The second argument of useEffect is an array of dependencies.
  // If any of the dependencies change, the function will run again.
  // In this case, the array[] is empty, which means the function will only run once after the component appears on the screen.
  useEffect(() => {
    // Create the object "configNumberObject" that contains the config number, the purpose is to send this object to the backend to get the data from the MongoDB
    // While reading at here, read the file "getDataFromDB.py" in the "backend" folder to see the flow of the code in the backend
    // The "configNumberObject" will have the format like this:
    // configNumberObject = {
    //   config: "123123"
    // }
    const configNumberObject = {
      config: configNumber
    }

    /*####################
    # FUNCTIONS --- useEffect --- fetchDataFromDB
    ####################*/
    // Create the function "fetchDataFromDB" to get the data from the MongoDB
    const fetchDataFromDB = async () => {
      try {
        // At here we send a POST request to the backend to get the data from the MongoDB, with the config number.
        // While reading at here, read the file "getDataFromDB.py" in the "backend" folder to see the flow of the code in the backend
        const responseFromMongoDB = await axios.post(`${BACKEND_URL}/api/getDataFromDB`, configNumberObject);
        // After getting the data from the MongoDB, we count the number of samples and update the csvData
        countNumberOfSamples(responseFromMongoDB.data);
        setCsvData(responseFromMongoDB.data);

        // So from here to the end of the "fetchDataFromDB" function, the purpose of the code is to generate the PCA plot data and load it to the screen to make it as a default thing appearing on the screen when user clicks on the PCA plugin
        // At here, we call the API to generate the PCA plot data
        // While reading at here, read the file "generatePCAPlot.py" in the "backend" folder to see the flow of the code in the backend
        const responseFromGeneratePCAPlot = await axios.post(`${BACKEND_URL}/api/generate_pca`, responseFromMongoDB.data);
        // After having the PCA plot data, we set the PCA plot data to the "pcaPlotData" state by using "setPcaPlotData" function
        setPcaPlotData(responseFromGeneratePCAPlot.data);

        // Then, we extract the names of the sample replicates in the PCA plot and put them into the "names" array
        // The names are like "H2O_30m_A", "H2O_30m-B", "H2O_30m-C", "PNA79_30m_A", "PNA79_30m_B", "PNA79_30m_C", etc.
        // The purpose of this is used for the "color groups" and "group options" in the PCA plot
        const names = []
        responseFromGeneratePCAPlot.data.data.forEach((eachItem, index) => {
          names.push({
            name: eachItem.name,
            groupId: ""
          })
        })
        // Then set the "names" array to the "nameOfSamples" state by using "setNameOfSamples" function
        // This is for COLORS
        setNameOfSamples(names);
        // This setColorGroups is used to reset the color groups
        // This is for COLORS
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
        // This is for COLORS
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

        // Then we set the visibility of the PCA 2D plot to true, to make it appear on the screen as a default when the user clicks the PCA plugin
        setIsPCA2DVisible(true);
      } catch (error) {
        console.error(error);
      }
    };
    /*####################
    # End of FUNCTIONS --- useEffect --- fetchDataFromDB
    ####################*/

    // Call the "fetchDataFromDB" function to get the data from the MongoDB
    fetchDataFromDB();

    // The array [] is empty, which means the function will only run once after the component appears on the screen
  }, []);
  /*####################
  # End of FUNCTIONS --- useEffect
  ####################*/


  /*####################
  # FUNCTIONS --- Handle file upload
  # This refers to the uploaded file, but the MicroMix already has the data, so this can be IGNORED
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
          // Then check the number of samples
          countNumberOfSamples(results.data);
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
  # This refers to the uploaded file, but the MicroMix already has the data, so this can be IGNORED
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
  // This function is like a template for showing the alert message, which is used in the "isFileUploadedOrIsHavingData" function below
  const showAlert = (title, message, icon) => {
    Swal.fire({
      title: title,
      text: message,
      icon: icon,
      showConfirmButton: false,
      showCancelButton: true,
    })
  }
  /*####################
  # End of FUNCTIONS --- Show alert message
  ####################*/


  /*####################
  # FUNCTIONS --- Check if the file is uploaded
  # This refers to the uploaded file, but the MicroMix already has the data, so this can be IGNORED
  ####################*/
  // This function is used to check if the file is uploaded, if not, then show the alert message and return false
  // For example, if the user clicks on the "Generate Scree plot" button, then we need to check if the file is uploaded, if not, then show the alert message and return false
  const isFileUploadedOrIsHavingData = () => {
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
  # FUNCTIONS --- Show alert message for Clear button
  # This relates to the uploaded file also, but the MicroMix already has the data, so this can be IGNORED
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
        // Reset the file input value to null, this is important because if we don't reset the file input value to null, the user can't upload the same file again after they uploaded it once
        document.getElementById(inputFileId).value = null;
        // Then we will hide the scree plot, PCA plot, loadings table, top 5 contributors table on the screen by setting the visibility to "false"
        setIsScreePlotVisible(false);
        setIsPCA2DVisible(false);
        setIsPCA3DVisible(false);
        setIsLoadingsTableVisible(false);
        setIsTopFiveContributorsTableVisible(false);
        setIsTopFiveContributorsPlotVisible(false);
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
  // While reading at here, read the "generateScreePlot.py" file in the "backend" folder to see the flow of the code in the backend
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
  // This format will be used in the "Plot" component from the "react-plotly.js" library
  // So the <Plot> will be used like this:
  // <Plot
  //    data={screePlotData.data}
  //    layout={screePlotData.layout}
  // />
  // In which "screePlotData.data" is the "data" from backend, and "screePlotData.layout" is the "layout" from backend.
  // ==> so check the "generateScreePlot.py" file in the "backend" folder for more details of "data" and "layout"
  const generateScreePlot = async () => {
    // Check if the file is uploaded or data having or not 
    // ==> if not, then show the alert message to tell the user to upload the file first, then return
    if (!isFileUploadedOrIsHavingData()) {
      return;
    }
    // if (!isScreePlotVisible) ==> if the scree plot is not visible
    // ==> meaning there isn't scree plot on the screen yet
    // ==> then we will call the API to generate the scree plot data
    // ==> read the "generateScreePlot.py" file in the "backend" folder to see the flow of the code in the backend
    if (!isScreePlotVisible) {
      try {
        // Send a POST request with the "csvData" to the backend
        // ==> then backend will return the scree plot data
        // ==> then put the scree plot data to the "screePlotData" by using "setScreePlotData"
        const response = await axios.post(`${BACKEND_URL}/api/generate_scree_plot`, csvData);
        // Update the scree plot data
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
    if (!isFileUploadedOrIsHavingData()) {
      return;
    }
    try {
      // Send a POST request with the "csvData" to the backend
      // ==> then backend will return the PCA plot data
      // ==> then put the PCA plot data to the "pcaPlotData" by using "setPcaPlotData"
      // read the "generatePCAPlot.py" file in the "backend" folder to see the flow of the code in the backend
      const response = await axios.post(`${BACKEND_URL}/api/generate_pca`, csvData);
      setPcaPlotData(response.data);

      // From here to the end of the "generatePCAPlot" function, the purpose of the code is related to COLORS in the PCA plot
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
  // The flow of the "generatePCAPlot3D" function is same to the "generatePCAPlot" function above
  // For backend, read the "generatePCAPlot3D.py" file in the "backend" folder to see the flow of the code in the backend
  const generatePCAPlot3D = async () => {
    if (!isFileUploadedOrIsHavingData()) {
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/api/generate_pca_3d`, csvData);
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
  // The flow of the "generateLoadingsTable" function is same to the "generateScreePlot" function
  // For backend, read the "generateLoadingsTable.py" file in the "backend" folder to see the flow of the code in the backend
  const generateLoadingsTable = async () => {
    if (!isFileUploadedOrIsHavingData()) {
      return;
    }
    if (!isLoadingsTableVisible) {
      try {
        // At here, read the "generateLoadingsTable.py" file in the "backend" folder to see the flow of the code in the backend
        const response = await axios.post(`${BACKEND_URL}/api/generate_loadings_table`, csvData);
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
  // Read the "generateTopFiveContributors.py" file in the "backend" folder to see the flow of the code in the backend
  const generateTopFiveContributors = async () => {
    if (!isFileUploadedOrIsHavingData()) {
      return;
    }
    // if (!isTopFiveContributorsTableVisible) ==> if the top 5 contributors table is not visible yet, then we will call the API to generate the top 5 contributors table
    if (!isTopFiveContributorsTableVisible) {
      try {
        // Read the "generateTopFiveContributors.py" file in the "backend" folder to see the flow of the code in the backend
        const response = await axios.post(`${BACKEND_URL}/api/generate_top_five_contributors`, csvData);
        // After getting the top 5 contributors table data, we set the top 5 contributors table data to the "topFiveContributorsTableData" state by using "setTopFiveContributorsTableData" function
        setTopFiveContributorsTableData(response.data.top_five_contributors);
        // The "loadingsPlotCoordinates" and "layout" are from the backend file "generateTopFiveContributors.py", so read the "generateTopFiveContributors.py" file in the "backend" folder to see in details what is return from the backend
        // In brief, there are 3 fields in the response.data from the backend:
        // {
        //    "top_five_contributors",   ==> this one for the top 5 contributors TABLE
        //    "loadingsPlotCoordinates", ==> this one for the top 5 contributors PLOT
        //    "layout"                   ==> this one for the top 5 contributors PLOT
        // }
        setTopFiveContributorsPlotData({
          data: response.data.loadingsPlotCoordinates,
          layout: response.data.layout
        });

        // From here to the end of the "generateTopFiveContributors" function, the purpose of the code is related to COLORS in the top 5 contributors plot
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
    // Then we will toggle the visibility of the top 5 contributors table and top 5 contributors plot
    setIsTopFiveContributorsTableVisible(!isTopFiveContributorsTableVisible);
    setIsTopFiveContributorsPlotVisible(!isTopFiveContributorsPlotVisible);
  }
  /*####################
  # End of FUNCTIONS --- Generate Top 5 contributors table
  ####################*/

  /*####################################
  ######     End of FUNCTIONS     ######
  ####################################*/


  /*###########################
  ######     BUTTONS     ######
  ###########################*/

  /*####################
  # BUTTONS --- Render button to upload file
  # This refers to the uploaded file, but the MicroMix already has the data, so this can be IGNORED
  ####################*/
  const renderButtonUploadFile = () => {
    return (
      <div>
        <Input
          // The "inputField" is declared above
          id={inputFileId}
          type='file'
          // The "acceptFileTypes" is declared above
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
  # This refers to the uploaded file, but the MicroMix already has the data, so this can be IGNORED
  ####################*/
  const renderButtonClearUploadedFile = () => {
    return (
      <Button
        variant="outline"
        onClick={clearUploadedFile}
        // The "refTourStep6" is used to tell the tour that this is the target of the sixth step
        // This relate to the button "Begin a tour"
        // Check the VARIABLE section above to see the "tourSteps" variable
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
  # BUTTONS --- Render button to generate Scree plot
  ####################*/
  const renderButtonGenerateScreePlot = () => {
    return (
      <Button
        // When user click on the button "Scree plot", then we will call the "generateScreePlot" function
        // ==> so check the function "generateScreePlot" above for more details
        // When check the "generateScreePlot" function, check the "generateScreePlot.py" file in the "backend" folder to see the flow of the code in the backend as well
        onClick={generateScreePlot}
        // This variant is used to show the different style of the button
        // So if the scree plot is visible, then we will show the button with the default style, which means the button is filled with dark blue color
        // If the scree plot is not visible, then we will show the button with the outline style, which means the button is just a white button
        variant={isScreePlotVisible ? "default" : "outline"}
        ref={refTourStep2}
      >
        <BarChartBig className='mr-2' size={sizeOfIcon} /> Scree plot
      </Button>
    )
  }
  /*####################
  # End of BUTTONS --- Render button to generate Scree plot
  ####################*/


  /*####################
  # BUTTONS --- Render button to generate PCA plot
  ####################*/
  // The "pcaOptions" is the required format to use in the antd library <DropdownAntd> component
  // This one is used to show the PCA plot selection dropdown when user hovers to the "PCA plot" button, so it will show the "PCA 2D" and "PCA 3D" options when user hovers
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
      // "onClick" here is trigger when user clicks on the "PCA 2D" button
      onClick: () => {
        // Check if the file is uploaded or having data
        // If not, then show the alert message and return
        if (!isFileUploadedOrIsHavingData()) {
          return;
        }
        // Set the selected groups to empty object, this is used to reset the selected groups
        // This is for COLORS
        setSelectedGroups({});
        // Now user clicks on the PCA 2D, then we will check the current visibility of the PCA 2D and PCA 3D, then we will update the visibility of the PCA 2D and PCA 3D
        // We have different cases below:
        // Case 1: Click on the PCA 2D button --> if PCA 2D plot and PCA 3D plot not show yet --> then show PCA 2D plot
        if (isPCA2DVisible == false && isPCA3DVisible == false) {
          generatePCAPlot();
          setIsPCA2DVisible(true);
        }
        // Case 2: Click on the PCA 2D button --> if PCA 2D plot is showing and PCA 3D plot not show --> then hide PCA 2D plot
        if (isPCA2DVisible == true && isPCA3DVisible == false) {
          setIsPCA2DVisible(false);
        }
        // Case 3: Click on the PCA 2D button --> if PCA 2D plot not show and PCA 3D plot is showing --> then hide PCA 3D plot and show PCA 2D plot
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
        // This is for COLORS
        setSelectedGroups({});
        // Check if the file is uploaded, if not, then show the alert message and return
        if (!isFileUploadedOrIsHavingData()) {
          return;
        }
        // Similar to PCA 2D button above, we also have different cases below:
        // Case 1: Click on the PCA 3D button --> if PCA 2D plot and PCA 3D plot not show yet --> then show PCA 3D plot
        if (isPCA2DVisible == false && isPCA3DVisible == false) {
          generatePCAPlot3D();
          setIsPCA3DVisible(true);
        }
        // Case 2: Click on the PCA 3D button --> if PCA 2D plot is showing and PCA 3D plot not show --> then hide PCA 2D plot and show PCA 3D plot
        if (isPCA2DVisible == true && isPCA3DVisible == false) {
          generatePCAPlot3D();
          setIsPCA2DVisible(false);
          setIsPCA3DVisible(true);
        }
        // Case 3: Click on the PCA 3D button --> if PCA 2D plot not show and PCA 3D plot is showing --> then hide PCA 3D plot
        if (isPCA2DVisible == false && isPCA3DVisible == true) {
          setIsPCA3DVisible(false);
        }
      }
    },
  ];

  // The "renderButtonPCAPlot" function here is used to render the button "PCA Plot" or "PCA 2D" or "PCA 3D" based on the current visibility of the PCA 2D and PCA 3D
  // The "renderButtonPCAPlot" function is NOT related to the "pcaOptions" above
  // The "renderButtonPCAPlot" function is also used in at very bottom of this file, in the "return" section, in the "DropdownAntd" component
  // ==> so check the "DropdownAntd" component at very bottom of this file to see the "pcaOptions" and "renderButtonPCAPlot" in the "DropdownAntd" component
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
  // The flow of the "renderButtonGenerateLoadingsTable" function is same to the "renderButtonGenerateScreePlot" function
  const renderButtonGenerateLoadingsTable = () => {
    return (
      <Button
        // When user click on the button "Loadings table", then we will call the "generateLoadingsTable" function
        // ==> so check the function "generateLoadingsTable" above for more details
        // When check the "generateLoadingsTable" function, check the "generateLoadingsTable.py" file in the "backend" folder to see the flow of the code in the backend as well
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
  // The flow of the "renderButtonGenerateTopFiveContributorsTable" function is same to the "renderButtonGenerateScreePlot" function
  const renderButtonGenerateTopFiveContributorsTable = () => {
    return (
      <Button
        // When user click on the button "Top 5 contributors", then we will call the "generateTopFiveContributors" function
        // ==> so check the function "generateTopFiveContributors" above for more details
        // When check the "generateTopFiveContributors" function, check the "generateTopFiveContributors.py" file in the "backend" folder to see the flow of the code in the backend as well
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
  # BUTTONS --- renderButtonBeginATour
  ####################*/
  const renderButtonBeginATour = () => {
    return (
      <Button
        variant="outline"
        // When user click on the button "Begin a tour", then we will call the "setIsTourOpen" function to set the "isTourOpen" state to "true" to open the tour
        onClick={() => setIsTourOpen(true)}
      >
        <Rocket className='mr-2' size={sizeOfIcon} /> Begin a tour
      </Button>
    )
  }
  /*####################
  # End of BUTTONS --- renderButtonBeginATour
  ####################*/

  /*##################################
  ######     End of BUTTONS     ######
  ##################################*/



  /*#############################
  ######       PLOTS       ######
  #############################*/

  /*####################
  # PLOTS --- Render Scree plot
  ####################*/
  const renderScreePlot = () => {
    // If the scree plot is visible, then continue 
    if (isScreePlotVisible) {
      // If the screePlotData is not null, which means it has data, then we continue to render the scree plot
      if (screePlotData) {
        return (
          <div className={`${spaceBetweenSections}`}>
            <p className={`${styleForSectionHeading}`}>
              Scree plot
            </p>
            <div className='p-3 border border-gray-200 rounded-lg'>
              {/* The <Plot/> component at here is from the react-plotly.js library */}
              {/* The "height" in the Plot can be set as px or % ; If set as %, it is proportional to the parent <div> component */}
              <Plot
                // The "useResizeHandler" is used to make the plot responsive, so when the window is smaller or bigger, the plot will be smaller or bigger as well
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
            <div
              className='border border-gray-200 rounded-lg overflow-hidden flex justify-center items-center pb-10'
              style={{ height: "500px" }}
            >
              <Plot
                useResizeHandler
                // The height 100% is proportional to the height of the parent element
                style={{ width: "80%", height: "100%" }}
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
              {renderSampleNamesWithGroupChoice()}
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
    // The flow of the "renderTopFiveContributorsPlot" function is same to the "renderScreePlot" function
    if (!isTopFiveContributorsTableVisible) {
      return null;
    }
    // If the topFiveContributorsPlotData is not null, which means it has data, then continue to render the top 5 contributors plot
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

  /*####################################
  ######       End of PLOTS       ######
  ####################################*/



  /*#############################
  ######       TABLE       ######
  #############################*/

  /*####################
  # TABLE --- Searching Dropdown Feature
  * The following code is used to render the searching dropdown feature, which can be used in any table
  ####################*/
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  // The function handleSearch is used to search the data in a column of the table
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

        <div className="flex gap-2 justify-end mt-2">

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
      // The "Highlighter" is from the "react-highlight-words" library
      // This is used to highlight the searched text in the table
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
  # End of TABLE --- Searching Dropdown Feature
  ####################*/


  /*####################
  # TABLE --- Data Table
  # The following code is only about the Data Table, which is the table that shows the data from the csv file that user uploaded or the data from the MongoDB
  ####################*/
  // Firstly, we convert the data from the csv file that user uploaded or the data from the MongoDB to the format required by "antd" library
  // Usually, the data required by antd table is the "data" and the "columns"
  // So here we have the "dataForCsvTable" and the "columnForCsvTable"

  // Prepare step for rendering the data table
  // Convert csvData to the "dataForCsvTable" format required by "antd"
  // At here, we just simply add the "key" to each row, so that the "antd" library can know which row is which
  const dataForCsvTable = csvData.map((eachRow, index) => ({
    key: index,
    ...eachRow,
  }));

  // Prepare step for rendering the data table
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
          // If it's the first column, then we will add the searching dropdown to the column
          ...renderSearchingDropdown(nameOfEachColumn),
          width: 150,
          // The fixed: 'left' is used to freeze a column, and because now we are inside the condition of (index === 0), so the first column is frozen 
          fixed: 'left',
        };
      }
        // So if it's not the first column, and the column data is not numeric, then we will add the sorting dropdown to the column
      else if (!isNaN(csvData[0][nameOfEachColumn])) {
        column = {
          ...column,
          // If the column data is numeric, then we will add the sorter to the column, so that the user can click on the column header to sort the data
          sorter: (a, b) => a[nameOfEachColumn] - b[nameOfEachColumn],
        };
      }
      return column;
    })
    : [];

  // Render the data table
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
          // The "columns" is the columns of the table, in which we put the "columnForCsvTable" here
          columns={columnForCsvTable}
          // The "dataSource" is the data of the table, in which we put the "dataForCsvTable" here
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
  // It also requires the "data" and the "columns" to render the table
  // So here we prepare the "dataForLoadingsTable" and the "columnForLoadingsTable"

  // Prepare step for rendering the loadings table
  const dataForLoadingsTable = loadingsTableData.map((eachRow, index) => ({
    key: index,
    ...eachRow,
  }));

  // Prepare step for rendering the loadings table
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

  // Render the loadings table
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

  /*####################################
  ######       End of TABLE       ######
  ####################################*/



  /*##############################
  ######       COLORS       ######
  ##############################*/

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
  // The function "handleChangeGroupForEachSample" is called when user clicks on the which color group belonging to each sample.
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
  // The function "resetAll" is used to reset all color back to the default
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
  # COLORS --- Functions --- Change color for Top 5 contributors plot --- changeColorForTopFiveContributorPlot
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
  # End of COLORS --- Functions --- Change color for Top 5 contributors plot --- changeColorForTopFiveContributorPlot
  ####################*/

  /*####################
  # COLORS --- Functions --- Change color for Top 5 contributors plot --- resetAllForTopFiveContributorsPlot
  ####################*/
  const resetAllForTopFiveContributorsPlot = () => {
    Swal.fire({
      title: "Do you want to reset all colors back to the default?",
      icon: "warning",
      confirmButtonColor: '#272E3F',
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const newColorForTopFiveContributorsPlot = colorForTopFiveContributorsPlot.map(item => {
          return {
            ...item,
            colorCode: defaultColor
          }
        });
        setColorForTopFiveContributorsPlot(newColorForTopFiveContributorsPlot);
        const newTopFiveContributorsPlotData = topFiveContributorsPlotData.data.map(item => {
          return {
            ...item,
            marker: {
              ...item.marker,
              color: defaultColor
            }
          };
        });
        setTopFiveContributorsPlotData({
          ...topFiveContributorsPlotData,
          data: newTopFiveContributorsPlotData
        });
        Swal.fire({
          title: "Done!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }
  /*####################
  # End of COLORS --- Functions --- Change color for Top 5 contributors plot --- resetAllForTopFiveContributorsPlot
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
  const renderSampleNamesWithGroupChoice = () => {
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

      {/* Button Reset All for top 5 contributors plot */}
      <Button
        variant="outline"
        onClick={resetAllForTopFiveContributorsPlot}
      >
        Reset all
      </Button>
      {/* End of Button Reset All for top 5 contributors plot */}
    </div>
  }
  /*####################
  # End of COLORS --- Render --- Color section Top 5 contributors plot
  ####################*/

  /*####################
  # End of COLORS --- Render
  ####################*/

  /*#####################################
  ######       End of COLORS       ######
  #####################################*/



  /*########################################
  ######       FILE INFORMATION       ######
  ########################################*/
  // The following code is only about the FILE INFORMATION, such as the file name, the number of samples, etc.
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
          Number of samples:  <span className='font-semibold'>{csvData ? numberOfSamples : "0"}</span>
        </p>
        {/* Render number of genes */}
        <p>
          Number of genes:  <span className='font-semibold'>{csvData ? csvData.length : "0"}</span>
        </p>
      </div>
    )
  }
  /*###############################################
  ######       End of FILE INFORMATION       ######
  ###############################################*/



  /*###############################
  ######      FINAL UI       ######
  ###############################*/
  // The following code is to render the FINAL UI of the page
  return (
    <div className='container mt-4 flex flex-col'>

      {/* NAVBAR */}
      <div className="flex py-3 justify-between sticky top-1 z-10 bg-opacity-50 backdrop-filter backdrop-blur bg-white">
        {/* NAVBAR --- Left side */}
        <div>
          {renderButtonBeginATour()}
        </div>
        {/* End of NAVBAR --- Left side */}

        {/* NAVBAR --- Right side */}
        {/* For rendering all buttons */}
        <div className="flex gap-2 justify-end">
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
      </div>
      {/* End of NAVBAR */}

      {/* RENDER EVERYTHING HERE */}
      <div className='mt-16'>
        {renderFileInformation()}
        {renderDataTable()}
        {renderScreePlot()}
        {renderPCAPlotGeneral(isPCA2DVisible, isPCA3DVisible)}
        {renderLoadingsTable()}
        {renderTopFiveContributorsTable()}
        {renderTopFiveContributorsPlot()}
      </div>
      {/* End of RENDER EVERYTHING HERE */}

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
  /*######################################
  ######      End of FINAL UI       ######
  ######################################*/
}
/*####################
# 4️⃣ End of HOMECONTENT COMPONENT
####################*/