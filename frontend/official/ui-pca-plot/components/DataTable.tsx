"use client"

import { Table } from 'antd';
import { useAppSelector } from "@/redux/hooks";

const DataTable = () => {

    const { csvData } = useAppSelector((state) => state.plotReducer)

    // Convert csvData to the format required by Ant Design Table
    const tableData = csvData.map((row: any, index: any) => ({
        key: index,
        ...row as any,
    }));

    // Create columns dynamically based on csvData
    const columns = csvData.length > 0 ? Object.keys(csvData[0]).map(key => ({
        title: key,
        dataIndex: key,
        key: key,
        width: 150,
    })) : [];

    return (
        <div>
            {csvData && csvData.length > 0 ?
                <Table
                    columns={columns}
                    dataSource={tableData}
                    scroll={{
                        x: 1500,
                    }}
                    // antd site header height
                    sticky={{
                        offsetHeader: 64,
                    }}
                /> : null}
        </div>
    )
}

export default DataTable