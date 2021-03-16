import './droppablePane.scss';

const DroppablePane = ({ onDrop, onDragOver, className, children }) => {

    const handleDrop = (e) => {
        onDrop && onDrop(e);
    }

    const handleDragOver = (e) => {
        onDragOver && onDragOver(e)
    }

    return (
        <div className={`droppable-pane ${className}`}  onDrop={handleDrop} onDragOver={handleDragOver} >
            {children}
        </div>
    )
}

export default DroppablePane;
