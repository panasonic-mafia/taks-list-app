import React, { useState } from "react";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { baseUrl } from './config';
import { Box } from '@mui/system';
import './TaskTable.css';

function TaskDialog(props) {

    const {isDialogOpen, onClose, submitFunction, row, handleInputChange, isEdit} = props;

    return (
        <Dialog open={isDialogOpen}>
                <DialogTitle>{isEdit ? 'Update task' : 'Add task'}</DialogTitle>
                <form onSubmit={submitFunction}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="User name"
                            type="text"
                            fullWidth
                            value={row.user}
                            onChange={(e)=>handleInputChange('user',e.target.value)}
                            required
                            disabled={isEdit}
                        />
                        <TextField
                            margin="dense"
                            label="Email address"
                            type="email"
                            fullWidth
                            value={row.email}
                            onChange={(e)=>handleInputChange('email', e.target.value)}
                            required
                            disabled={isEdit}
                        />
                        <TextField
                            margin="dense"
                            label="Task Description"
                            type="text"
                            style={{height: '200px'}}
                            multiline
                            rows={5}
                            fullWidth
                            value={row.description}
                            onChange={(e)=>handleInputChange('description', e.target.value)}
                            required
                        />
                        <FormControlLabel 
                            disabled={!isEdit} 
                            control={<Checkbox />} 
                            label="Completed" 
                            checked={row.completed}
                            onChange={(e)=>handleInputChange('completed', e.target.checked)}
                            />
                    </DialogContent>
                    <DialogActions>
                        <Button type='submit'>
                            Submit
                        </Button>
                        <Button onClick={onClose}>
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
    )
}

function TaskTable({ isUserSignedIn }) {
    const [rows, setRows] = useState([]);
    const [newTask, setNewTask] = useState({user: '', email: '', description: '', completed: false});
    const [editedTask, setEditedTask] = useState({_id:'', user: '', email: '', description: '', completed: false});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    React.useEffect(() => {
        fetchTasks();
      }, []);

    const columns = [
        {field: "actions", headerName: 'Actions', width: 100, renderCell: (cellValues) => {
            return (
              <Button
                disabled={!isUserSignedIn}
                variant="contained"
                color="primary"
                onClick={(event) => {
                    handleEditDialog(event, cellValues);
                }}
              >
                Edit
              </Button>
            );
          }
        },
        { field: "user", headerName: 'User', width: 100 },
        { field: "email", headerName: 'Email', width: 250 },
        { field: "description", headerName: 'Desctiption', width: 700, renderCell: (cellValues) => {
            return (
                <Box sx={{
                    maxHeight: 'inherit', 
                    width: '100%', 
                    whiteSpace: 'initial', 
                    lineheight: '16px',
                    textAlign: 'left'}}>
                    {cellValues.value}
                </Box>
            )
        } },
        { field: "completed", headerName: 'Done', width: 100 }
    ]

    async function fetchTasks() {
        const response = await fetch(`${baseUrl}/tasks`, {
            method: "GET",
            headers: {"Content-Type": "application/json",}
        })   
        if (!response.ok) {
            const message = `An error has occured ${response.status}`;
            throw new Error(message)
        }
        const tasks = await response.json()
        setRows(tasks.data)
    }

    const handleAddDialog = () => {
        setIsDialogOpen(true);
    }
    
    const handleAdd = (e) => {
        e.preventDefault();
        async function postTask() {
            const response = await fetch(`${baseUrl}/task`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newTask)
            })
            if (!response.ok) {
                const message = `An error has occured ${response.status}`;
                alert(message);
                throw new Error(message)
            }
            const out = await response.json()
            alert('New task successfully added.');
            setIsDialogOpen(false);
            setNewTask({user: '', email: '', description: '', completed: false});
            await fetchTasks();
        }
        postTask();
    }

    const handleEditDialog = (e, cellValues) => {
        e.preventDefault();
        setIsDialogOpen(true)
        setIsEdit(true)
        setEditedTask({
            _id: cellValues.row._id,
            user: cellValues.row.user, 
            email: cellValues.row.email, 
            description: cellValues.row.description, 
            completed: cellValues.row.completed
        })

    }

    const handleEdit = (e) => {
        e.preventDefault();
        async function postTask() {
            const response = await fetch(`${baseUrl}/task/${editedTask._id}`, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    user: editedTask.user, 
                    email: editedTask.email,
                    description: editedTask.description, 
                    completed: editedTask.completed
                })
            })
            if (!response.ok) {
                const message = `An error has occured ${response.status}`;
                alert(message);
                throw new Error(message)
            }
            alert('Task was successfully updated.');
            setIsDialogOpen(false);
            setEditedTask({_id:'', user: '', email: '', description: '', completed: false});
            await fetchTasks();
            setIsEdit(false)
        }
        postTask();
    }

    const handleInputChange = (key, value) => {
        if (isEdit) {
            setEditedTask({
                ...editedTask,
                [key]: value
            })
        } else {
            setNewTask({
                ...newTask,
                [key]: value
            })
        }
    }

    const handleDialogOnClose = () => {
            setIsDialogOpen(false)
            setIsEdit(false)
    }

    return (
        <React.Fragment>
            <Button onClick={handleAddDialog}>
                <AddBoxIcon onClick={handleAddDialog} />
                ADD TASK
            </Button>
            <div style={{height: 500, width: '100%'}}>
                <DataGrid 
                    columns={columns} 
                    rows={rows} 
                    getRowId={(row) => row._id}
                    rowHeight={150}
                    pageSize={3}
                    rowsPerPageOptions={[3]}
                />
            </div>
            {isEdit ? (
                <TaskDialog 
                isDialogOpen={isDialogOpen}
                submitFunction={handleEdit} 
                row={editedTask}
                handleInputChange={handleInputChange}
                onClose={handleDialogOnClose}
                isEdit={isEdit}
                />
                
            ) : (
                <TaskDialog 
                isDialogOpen={isDialogOpen}
                submitFunction={handleAdd} 
                row={newTask}
                handleInputChange={handleInputChange}
                onClose={handleDialogOnClose}
                isEdit={isEdit}
                /> 
            )}
        </React.Fragment> 
    )
}

export default TaskTable;
