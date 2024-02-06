"use client";

import { useAppSelector } from "@/redux/hooks";
import DataTable from "@/components/DataTable";
import UploadCSVButton from "@/components/UploadCSVButton";
import ScreeButton from "@/components/ScreeButton";
import ScreePlot from "@/components/ScreePlot";
import PCAButton from "@/components/PCAButton";
import PCAPlot from "@/components/PCAPlot";


export default function Home() {
  const { csvData } = useAppSelector((state) => state.plotReducer)

  return (
    <div className='container my-4 flex flex-col gap-5'>

      <div className="flex gap-2 py-3 sticky top-1 z-10 bg-opacity-50 backdrop-filter backdrop-blur bg-white">
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
