import spinnerSvg from '../../assets/images/Rolling-1s-200px.svg';
import './blockingLoader.scss';


const BlockingLoader = () => {

    return (
        <div className="blocking-loader-outer">
            <img src={spinnerSvg} alt={'spinner'} className="spinner"/>
        </div>
    )
}

export default BlockingLoader;
