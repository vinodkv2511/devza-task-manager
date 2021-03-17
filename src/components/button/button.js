import './button.scss';


// TODO- Implement primary and text only styles
const Button = ({onClick, label, isDanger, className}) => {
    return (
        <button className={`button secondary ${isDanger && 'danger'} ${className}`} onClick={onClick}>{label}</button>
    )
}

export default Button;
