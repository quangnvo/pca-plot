"use client"

import { Button } from "./ui/button"
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setScreePlotData } from '../redux/features/plotSlice'


const ScreeButton = () => {
    const dispatch = useAppDispatch()
    const { csvData } = useAppSelector((state) => state.plotReducer)

    const generateScreePlot = async () => {
        try {
            const response = await axios.post(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/generate_scree_plot`, csvData);
            dispatch(setScreePlotData(response.data))
            console.log("type of csvData", typeof csvData)
            console.log("type of response.data", typeof response.data)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Button onClick={generateScreePlot} >
            Generate scree plot
        </Button>
    )
}

export default ScreeButton