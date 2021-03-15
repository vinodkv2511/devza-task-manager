import moment from 'moment';

import './taskCard.scss';

import userPlaceholder from '../../assets/images/user.png';

const TaskCard = ({ task, user }) => {
    return (
        <div className={'task-card'}>
            <div className={'user-details'}>
                <img src={user?.picture || userPlaceholder} className={'user-image'} />
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
