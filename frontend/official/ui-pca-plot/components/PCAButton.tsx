"use client"

import { Button } from './ui/button'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setPCAPlotData } from '../redux/features/plotSlice'

const PCAButton = () => {
    const dispatch = useAppDispatch()
    const { csvData } = useAppSelector((state) => state.plotReducer)

    const generatePCAPlot = async () => {
        try {
            const response = await axios.post(
                `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/generate_pca`,
                csvData
            );
            dispatch(setPCAPlotData(response.data));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Button onClick={generatePCAPlot}>
            Generate PCA plot
        </Button>
    )
}

export default PCAButton
