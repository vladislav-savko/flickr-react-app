import './index.scss'
import { useNavigate } from 'react-router-dom'

const PagonationPhotosets = ( {page, countPages, userId, filter} ) => {
    const navigate = useNavigate()

    const handlePageClick = (indexPage) => {
        navigate(`/${userId}/${indexPage}/${JSON.stringify(filter)}`)
    }

    return (
        <div className="pagination"> {   
            [...Array(countPages)].map((object, indexPage) => {
                return (
                    <div key={indexPage} className={page == ++indexPage ? "pagination__item pagination__item--active" : "pagination__item"} onClick={() => handlePageClick(indexPage)}>
                        {indexPage}
                    </div>
                )
            })
        } </div>
    )
}

export default PagonationPhotosets