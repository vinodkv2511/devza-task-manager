import './button.scss';


// TODO- Implement primary and text only styles
const Button = ({onClick, label, isDanger, className, disabled}) => {
    return (
        <button
            className={`button secondary ${isDanger && 'danger'} ${className} ${disabled && 'disabled'}`} 
            onClick={() => { (!disabled && onClick) && onClick()} }
        >{label}</button>
    )
}

export default Button;
