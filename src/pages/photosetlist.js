import Photosets from '../components/Photosets'
import { useParams } from 'react-router-dom'

const PhotosetList = () => {
    const paramPageNumber = parseInt(useParams().number)

    return (
        <Photosets page={paramPageNumber > 0 ? paramPageNumber : 1}/>
    )
}

export default PhotosetList