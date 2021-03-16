import './modal.scss';

const Modal = ({ children, onClose, shouldCloseOnOutsideClick }) => {

    const handleOutSideClick = (e) => {
        if(shouldCloseOnOutsideClick && onClose) {
            onClose();
        }
    }

    return (
        <div className={'modal'} onClick={handleOutSideClick}> 
            <div className={'modal-inner'} onClick={(e)=>{e.stopPropagation();}}>
                {children}

            </div>
        </div>
    )
}

export default Modal;
