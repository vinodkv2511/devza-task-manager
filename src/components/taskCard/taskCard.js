import moment from 'moment';
import { useDrag } from 'react-dnd'

import './taskCard.scss';

import userPlaceholder from '../../assets/images/user.png';
import spinnerSvg from '../../assets/images/Rolling-1s-200px.svg';
import warningSvg from '../../assets/images/exclamation-triangle.svg';
import { PRIORITY, DRAGGABLE_TYPES } from '../../constants';
import Button from '../button/button';


const TaskCard = ({ task, user, isUpdating, updateError, onEdit, onDelete }) => {

    const [{isDragging}, taskDrag] = useDrag(() => ({
        type: DRAGGABLE_TYPES.TASK,
        item: {...task},
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
                <div className={'buttons-container'}>
                    <Button onClick={onEdit} label={'EDIT'}/>
                    <Button onClick={onDelete} label={'DELETE'} isDanger={true}/>
                </div>
            </div>
            {
                isUpdating
                ? <img className="card-status-icon-small" src={spinnerSvg} alt='spinner' title={`Please wait. Saving your changes!`}/>
                : updateError 
                    ? <img className="card-status-icon-small" src={warningSvg} alt={'error'} title={`${updateError}\nPlease refresh the page to see saved state`}/>
                    : null
            }
        </div>
    )
}

export default TaskCard;
