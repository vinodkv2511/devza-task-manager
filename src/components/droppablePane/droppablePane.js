import { useDrop } from 'react-dnd'
import { DRAGGABLE_TYPES } from '../../constants';

import './droppablePane.scss';

const DroppablePane = ({ className, children, onDrop }) => {
    const [{ isOver }, droppablePane] = useDrop(() => ({
        accept: DRAGGABLE_TYPES.TASK,
        drop: () => onDrop && onDrop(),
        collect: monitor => ({
          isOver: !!monitor.isOver(),
        }),
      }), [])

    return (
        <div className={`droppable-pane ${className} ${isOver && 'dropping'}`} ref={droppablePane} >
            {children}
        </div>
    )
}

export default DroppablePane;
