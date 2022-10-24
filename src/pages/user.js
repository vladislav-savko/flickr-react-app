import Photosets from '../components/Photosets'
import { useParams } from 'react-router-dom'

const User = () => {
    const paramUserName = useParams().user
    const paramPageNumber = parseInt(useParams().number)
    const paramFilter = useParams().filter
    const paramPhotoset = useParams().photoset

    const params = {
        userId: paramUserName,
        page: paramPageNumber > 0 ? paramPageNumber : 1,
        filter: paramFilter ? paramFilter : JSON.stringify({sort: 0, photosetName: ""}),
        photosetId: paramPhotoset ? paramPhotoset : null,
    }

    return (
        <Photosets params={params}/>
    )
}

export default User