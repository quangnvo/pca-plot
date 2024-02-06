"use client"
import { Input } from "@/components/ui/input"
import Papa from 'papaparse';
import { useAppDispatch } from "@/redux/hooks";
import { setCsvData } from "@/redux/features/plotSlice"

const UploadCSVButton = () => {
    const dispatch = useAppDispatch();

    const handleCSVFileUpload = (e: any) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: (results: any) => {
                dispatch(setCsvData(results.data))
            },
        });
    };

    return (
        <Input
            type='file'
            accept='.csv'
            onChange={handleCSVFileUpload}
            className="w-1/3"
        />
    )
}

export default UploadCSVButton