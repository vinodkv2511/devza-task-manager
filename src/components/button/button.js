import './button.scss';


// TODO- Implement primary and text only styles
const Button = ({onClick, label, isDanger}) => {
    return (
        <button className={`button secondary ${isDanger && 'danger'}`} onClick={onClick}>{label}</button>
    )
}

export default Button;
