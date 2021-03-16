import moment from 'moment';
import { useDrag } from 'react-dnd'

import './taskCard.scss';

import userPlaceholder from '../../assets/images/user.png';
import { PRIORITY, DRAGGABLE_TYPES } from '../../constants';


const TaskCard = ({ task, user }) => {

    const [{isDragging}, taskDrag] = useDrag(() => ({
        type: DRAGGABLE_TYPES.TASK,
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      }))

    return (
        <div className={`task-card ${isDragging ? 'dragging' : ''}`} ref={taskDrag}>
            <div className={'user-details'}>
                <img src={user?.picture || userPlaceholder} className={'user-image'} alt={'user'}/>
            </div>
            <div className={'task-details'}>
                <div className={'inline-details'}>
                    <p className={'task-id'}> {task.id} </p>
                    <p className={'asignee-name'}>{task.assigned_name}</p>
                </div>
                <p className={`task-priority ${PRIORITY[task.priority]}`}>{PRIORITY[task.priority]}</p>
                <p className={'task-message'}> {task.message} </p>
                <p className={'task-date created'}> {moment(task.created_on).format('DD-MM-YYYY')} </p>
                <p className={'task-date due'}> {moment(task.due_date).format('DD-MM-YYYY')} </p>
            </div>
        </div>
    )
}

export default TaskCard;
