import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// APIs
import { fetchTasks, postTaskUpdate, postTaskDelete, postTaskCreate } from "../../apis/tasks";
import { fetchUsers } from "../../apis/users";

// Components
import TaskCard from "../../components/taskCard/taskCard";

//Assets
import './tasks.scss';
import DroppablePane from '../../components/droppablePane/droppablePane';
import axios from 'axios';
import Modal from '../../components/modal/modal';
import Button from '../../components/button/button';
import BlockingLoader from '../../components/blockingLoader/blockingLoader';
import moment from 'moment';
import TaskForm from '../../components/taskForm/taskForm';

const Tasks = () => {

    const [ isPaneMode, setIsPaneMode] = useState(false);
    const [ tasks, setTasks ] = useState([]);
    const [ users, setUsers ] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [createError, setCreateError] = useState('');

    const [ tasksUpdating, setTasksUpdating ] = useState({});
    const [ tasksUpdateErrors, setTasksUpdateErrors ] = useState({});

    const [ modalMode, setModalMode ] = useState(null); // can have create, edit or delete as values
    const [ activeTask, setActiveTask ] = useState(null); // Task being edited or deleted

    const [ searchKeyword, setSearchKeyword ] = useState('');
    const [ priorityFilter, setPriorityFilter ] = useState('');
    const [ dateFilter, setDateFilter ] = useState('');
    
    useEffect( () => {
        let cancelTokenTasks = axios.CancelToken.source();
        let cancelTokenUsers = axios.CancelToken.source();
        loadData(cancelTokenTasks, cancelTokenUsers);

        return () => {
            cancelTokenTasks.cancel();
            cancelTokenUsers.cancel();
        }
    }, [])

    const loadData = async (cancelTokenTasks, cancelTokenUsers) => {
        try {
            setIsLoading(true);
            let tasksProm = fetchTasks(cancelTokenTasks);
            let usersProm = fetchUsers(cancelTokenUsers);

            let [tasksResp, usersResp] = await Promise.all([tasksProm, usersProm]);
            setTasks(tasksResp?.data?.tasks);
            setUsers(usersResp?.data?.users);
            setError('');
            setIsLoading(false);
        } catch (e) {
            if(axios.isCancel(e)) {
                return;
            }
            setError(e.message);
            setIsLoading(false);
        } 
    } 

    const updateTask = async (data) => {
        try {
            setTasksUpdating({...tasksUpdating, [data.id]: true});
            let dataToPost = {...data, taskid: data.id}
            let updateResp = await postTaskUpdate(dataToPost);
            console.log(updateResp);
            setTasksUpdating({...tasksUpdating, [data.id]: false});
            setTasksUpdateErrors({...tasksUpdateErrors, [data.id]: ''});
        } catch (e) {
            if(axios.isCancel(e)) {
                return;
            }
            setTasksUpdateErrors({...tasksUpdateErrors, [data.id]: e.message});
            setTasksUpdating({...tasksUpdating, [data.id]: false});
        } 
    }

    const createTask = async (data) => {
        try {
            setIsLoading(true);
            let dataToPost = {...data, taskid: data.id}
            let resp = await postTaskCreate(dataToPost);
            setIsLoading(false);
            setCreateError('');
            return resp?.data.taskid;
        } catch (e) {
            if(axios.isCancel(e)) {
                return;
            }
            setIsLoading(false);
            setCreateError(e.message);
        } 
    }

    const handleDrop = (priority, item) => {
        let newTasks = tasks.map( task => {
            if(item.id === task.id) {
                let newTask = {...task, priority: `${priority}`};
                updateTask(newTask);
                return newTask;
            } else {
                return {...task};
            }
        });
        
        setTasks(newTasks);
    }

    const handleEditClick = (task) => {
        setModalMode('edit');
        setActiveTask(task);
    } 

    const handleNewTaskClick = () => {
        setModalMode('create');
        setActiveTask({});
    }

    const handleDeleteClick = (task) => {
        setModalMode('delete');
        setActiveTask(task);
    }

    const handleModalClose = () => {
        setModalMode(null);
        setActiveTask(null);
    }

    const submitDelete = async () => {
        try {
            setIsLoading(true);
            await postTaskDelete({taskid: activeTask.id});
            // Update task list on delete success
            const newTasks = [...tasks];
            const taskIndex = newTasks.findIndex(task => task.id === activeTask.id);
            newTasks.splice(taskIndex, 1);
            setTasks(newTasks);
            setIsLoading(false);
            handleModalClose();
        } catch (error) {
            //Toast.. 
            alert(`Failed to delete\n${error.message}`)
            setIsLoading(false);
        }
    }

    const filterTasksBySearch = (tasks, searchKeyword) => {
        return tasks.filter(task => task.message?.toLowerCase().includes(searchKeyword?.toLowerCase()));
    }

    const filterTasksByPriority = (tasks, priority) => {
        if(!priority){
            return tasks;
        }
        return tasks.filter( task => Number(task.priority) === Number(priority))
    }

    const filterTasksByDate = (tasks, date) => {
        if(!date){
            return tasks;
        }
        return tasks.filter( task => moment(task.due_date).isSame(date, 'date') )
    }

    const handleTaskFormSubmit = async (data) => {
        if(modalMode === 'edit') {
            let newTasks = [...tasks];
            let taskIndex = newTasks.findIndex( task => task.id === data.taskid);
            newTasks.splice(taskIndex, 1, { ...newTasks[taskIndex], ...data })
            setTasks(newTasks);
            handleModalClose();
            updateTask(data);
        } else {
            let taskid = await createTask(data);
            if(createError){
                alert(`Error creating task!\n${createError}`);
                setCreateError('');
            } else {
                setTasks([
                    {
                        ...data,
                        id:taskid,
                        taskid: taskid,
                        assigned_name: users.find(user => user.id === data.assigned_to)?.name
                    },
                    ...tasks
                ]);
                handleModalClose();
            }
        }
    }

    const renderTasks = (tasks) => {
        const usersMap = {};
        users?.forEach(user => {
            usersMap[user.id] = {...user}
        });

        if(!tasks) {
            return null;
        }

        return tasks?.map( task => <TaskCard 
                key={`${task.id}`} 
                task={task} 
                user={usersMap[task.assigned_to]} 
                isUpdating={tasksUpdating[task.id]} 
                updateError={tasksUpdateErrors[task.id]}
                onEdit={()=>{handleEditClick(task)}}
                onDelete={()=>{handleDeleteClick(task)}}

            />
                )
    }

    const renderPanes = (tasks) => {

        return (
            <div className="panes-container">
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>Low</p>
                    <DroppablePane className={'pane'} onDrop={(item) => handleDrop(1, item)}>
                        {renderTasks(filterTasksByPriority(tasks, 1))}
                    </DroppablePane>
                </div>
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>Medium</p>
                    <DroppablePane  className={'pane'} onDrop={(item) => handleDrop(2, item)}>
                        {renderTasks(filterTasksByPriority(tasks, 2))}
                    </DroppablePane>
                </div>
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>High</p>
                    <DroppablePane  className={'pane'} onDrop={(item) => handleDrop(3, item)}>
                        {renderTasks(filterTasksByPriority(tasks, 3))}
                    </DroppablePane>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        let filteredTasks = filterTasksBySearch(tasks, searchKeyword);
        filteredTasks = filterTasksByPriority(filteredTasks, priorityFilter);
        filteredTasks = filterTasksByDate(filteredTasks, dateFilter);
        if( isPaneMode ) {
            return renderPanes(filteredTasks)
        } else {
            return renderTasks(filteredTasks);
        }
    }

    const renderTaskForm = () => {
        return <TaskForm
            isEdit = {modalMode === 'edit'}
            task = {activeTask}
            users = {users}
            onSubmit = {handleTaskFormSubmit}
        />
    }

    const renderDeleteConfirmation = () => {
        return (
            <div className={'modal-content-container'}>
                <p className={"modal-head"}>Delete?</p>
                <p className={'modal-content-text'}>Do you really want to delete {activeTask.id}</p>
                <div className={'buttons-container'}>
                    <Button label={'CANCEL'} onClick={handleModalClose}/>
                    <Button label={'DELETE'} isDanger={true} onClick={submitDelete}/>
                </div>
            </div>
        )
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='page tasks-page'>
                <div className='head-row'>
                    <h2 className="app-title">Task Manager</h2>
                    <Button className={'toggle-pane-mode'} onClick={handleNewTaskClick} label={'+ Create New Task'}/>
                    <select 
                        className={'input'} 
                        onChange={ e => setPriorityFilter(e.target.value)} 
                        value={priorityFilter}
                    >
                        <option value={''}>All Priorities</option>
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                    </select>
                    <input 
                        type={'date'}  
                        className="input" 
                        onChange={(e) => setDateFilter(e.target.value)}
                        value={dateFilter}
                    />
                    <input 
                        type={'text'} 
                        placeholder={'Search'} 
                        className="input" 
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        value={searchKeyword}
                    />
                    <Button className={'toggle-pane-mode'} onClick={()=>{setIsPaneMode(!isPaneMode)}} label={isPaneMode ? 'List View' : 'Pane View'}/>
                </div>
                <div className={`content-row tasks-content-container ${isPaneMode ? 'pane' : 'list'}`}>
                    {
                        error
                        ? <p> { error } </p>
                        : renderContent()
                    }
                </div>
                {
                    modalMode &&
                    <Modal
                        onClose={handleModalClose}
                        shouldCloseOnOutsideClick={true}
                    >
                        <Button label={'+'} className="modal-close-button" onClick={handleModalClose}/>
                        {
                            modalMode === 'delete'
                            ? renderDeleteConfirmation()
                            : renderTaskForm()
                        }
                    </Modal>
                }
                {
                    isLoading && <BlockingLoader />
                }
            </div>
        </DndProvider>
    )
}

export default Tasks;
