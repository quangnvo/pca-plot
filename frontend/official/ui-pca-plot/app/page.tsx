"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";



import DataTable from "@/components/DataTable";
import UploadCSVButton from "@/components/UploadCSVButton";
import ScreeButton from "@/components/ScreeButton";
import ScreePlot from "@/components/ScreePlot";
import PCAButton from "@/components/PCAButton";
import PCAPlot from "@/components/PCAPlot";



export default function Home() {
  const { csvData } = useAppSelector((state) => state.plotReducer)

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

  return (
    <div className='container my-4 flex flex-col gap-5'>

      <div className="flex gap-2 py-3 sticky top-1 z-10 bg-opacity-50 backdrop-filter backdrop-blur bg-white">
        {/* <Input
          type='file'
          accept='.csv'
          onChange={handleCSVFileUpload}
          className="w-1/3"
        /> */}

        <UploadCSVButton />
        <ScreeButton />
        <PCAButton />
      </div>

      <ScreePlot />
      <PCAPlot />

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
