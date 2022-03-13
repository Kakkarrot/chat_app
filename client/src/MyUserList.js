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

    useEffect(() => {
        socket.emit("getUsers")
        socket.on("updateUsers", (data) => {
            setUsers(data)
        })
    }, [socket])

    return (
        <>
            <div className="chatHeader">
                <p>Current Users</p>
            </div>
            <TableVirtuoso
                style={{ height: 500, backgroundColor: "lightgrey"}}
                data={Object.entries(users).map((value) => {
                    return {name: value[1].nickName, color: value[1].color}
                })}
                components={{
                    Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
                    Table: (props) => <Table {...props} style={{ borderCollapse: 'separate' }} />,
                    TableHead: TableHead,
                    TableRow: TableRow,
                    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
                }}
                fixedHeaderContent={() => (
                    <TableRow>
                        <TableCell style={{ width: 400, background: 'lightgrey', textAlign: "center", fontWeight: "bold", borderWidth: "0.5rem"}}>
                            Nickname
                        </TableCell>
                        <TableCell style={{ width: 150, background: 'lightgrey', textAlign: "center", fontWeight: "bold", borderWidth: "0.5rem"}}>
                            Color
                        </TableCell>
                    </TableRow>
                )}
                itemContent={(index, user) => (
                    <>
                        <TableCell style={{ width: 400, background: 'lightgrey', textAlign: "center", borderWidth: "0.2rem"}}>
                            {user.name}
                        </TableCell>
                        <TableCell style={{ background: user.color, textAlign: "center", borderWidth: "0.2rem"}}>
                            {user.color}
                        </TableCell>
                    </>
                )}
            />
        </>
    )
}

export default MyUserList;