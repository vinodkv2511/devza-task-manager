import './taskCard.scss';
import moment from 'moment';


const TaskCard = ({ task }) => {
    return (
        <div className={'task-card'}>
            <div className={'user-details'}>

            </div>
            <div className={'task-details'}>
                <div className={'inline-details'}>
                    <p className={'task-id'}> {task.id} </p>
                    <p className={'asignee-name'}>{task.assigned_name}</p>
                </div>
                <p className={'task-message'}> {task.message} </p>
                <p className={'task-date created'}> {moment(task.created_on).format('DD-MM-YYYY')} </p>
                <p className={'task-date due'}> {moment(task.due_date).format('DD-MM-YYYY')} </p>
            </div>
        </div>
    )
}

export default TaskCard;
