import './index.scss'
import { useNavigate } from 'react-router-dom'

const PagonationPhotosets = ( {page, countPages, setPage} ) => {
    const navigate = useNavigate()

    const handlePageClick = (indexPage) => {
        navigate(`/photosets/${indexPage}`)
        setPage(indexPage)
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