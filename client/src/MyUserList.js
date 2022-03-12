import React, {useEffect} from "react";
import { TableVirtuoso } from 'react-virtuoso'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'


function MyUserList({socket}) {
    const [users, setUsers] = React.useState([])

    // useEffect(() => {
    //     socket.on("updateUsers", (data) => {
    //         console.log(data)
    //         setUsers(data)
    //     })
    // }, [socket])

    return (
        <>
            <div className="chat-header">
                <p>Current Users</p>
            </div>
            <TableVirtuoso
                style={{ height: 400 }}
                data={[{name: "test", description: "test"},{name: "test2", description: "test2"}]}
                components={{
                    Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
                    Table: (props) => <Table {...props} style={{ borderCollapse: 'separate' }} />,
                    TableHead: TableHead,
                    TableRow: TableRow,
                    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
                }}
                fixedHeaderContent={() => (
                    <TableRow>
                        <TableCell style={{ width: 150, background: 'white' }}>
                            Name
                        </TableCell>
                        <TableCell style={{ background: 'white' }}>
                            Description
                        </TableCell>
                    </TableRow>
                )}
                itemContent={(index, user) => (
                    <>
                        <TableCell style={{ width: 150, background: 'white' }}>
                            {user.name}
                        </TableCell>
                        <TableCell style={{ background: 'white'  }}>
                            {user.description}
                        </TableCell>
                    </>
                )}
            />
        </>
    )
}

export default MyUserList;