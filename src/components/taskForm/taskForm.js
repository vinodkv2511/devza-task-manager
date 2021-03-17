import moment from "moment";
import { useEffect, useState } from "react";
import Button from "../button/button";

import './taskForm.scss';


const TaskForm = ({ task, onSubmit, users, isEdit }) => {

    const [ message, setMessage ] = useState('');
    const [ priority, setPriority ] = useState('');
    const [ dueDate, setDueDate ] = useState('');
    const [ assignedTo, setAssignedTo ] = useState('');

    useEffect( () => {
        if(isEdit) {
            setMessage(task.message || '');
            setPriority(task.priority || '');
            setDueDate( task.due_date ? moment(task.due_date).format('YYYY-MM-DD') : '');
            setAssignedTo(task.assigned_to || '');
        }
    }, [isEdit])

    const handleSubmit = (e) => {
        e && e.preventDefault();
        let data = {
            message,
            priority,
            due_date: dueDate,
            assigned_to: assignedTo
        }

        if(isEdit) {
            data.taskid = task.id;
            data.id = task.id;
        }

        onSubmit && onSubmit(data)
    }


    return (
        <div className="task-form-container">
            <form className="task-form" onSubmit={handleSubmit}>
                <p className="modal-head">{isEdit ? 'Edit' : 'Create'} Task</p>
                <label className="label">Task</label>
                <input
                    type={'text'}  
                    className="input" 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message"
                    value={message}
                    required={true}
                />

                <label className="label">Priority</label>
                <select 
                    className={'input'} 
                    onChange={ e => setPriority(e.target.value)} 
                    value={priority}
                >
                    <option value={''}>Select a priority</option>
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                </select>
                
                <label className="label">Due Date</label>
                <input 
                    type={'date'}  
                    className="input" 
                    onChange={(e) => setDueDate(e.target.value)}
                    value={dueDate}
                    placeholder={'due-date'}
                />
                
                <label className="label">Assigned To</label>
                <select 
                    className={'input'} 
                    onChange={ e => setAssignedTo(e.target.value)} 
                    value={assignedTo}
                >
                    <option value={''}>Select an user</option>
                    {
                        users?.map( user => {
                            return <option key={`${user.id}`} value={user.id}>{user.name}</option>
                        })
                    }
                </select>

                <Button label={'SUBMIT'} className={'submit-button'} onClick={handleSubmit} disabled={!message}/>
            </form>
        </div>
    )

}

export default TaskForm;
