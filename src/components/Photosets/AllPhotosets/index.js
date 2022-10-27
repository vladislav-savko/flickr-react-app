import './index.scss'
import { createImageURL } from '../../../middleware/api/flickrAPI'
import { useEffect, useState } from 'react'
import AllPhotos from '../AllPhotos'
import { useNavigate } from 'react-router-dom'

const AllPhotosets = ( {photosetsOffset, openedPhotosetId, userInfo, filter, page} ) => {
    const [photosetOpened, setPhotosetOpened] = useState(false)
    const [idPhotosetOpened, setIdPhotosetOpened] = useState(0)
    const [openedPhotosetDOMItem, setOpenedPhotosetDOMItem] = useState(null)

    const navigate = useNavigate()
    
    const handlePhotosetClick = (photosetId) => {
        if (photosetId) {
            navigate(`/${userInfo.userId}/${page}/${JSON.stringify(filter)}/${photosetId}`)
        }
    }

    useEffect (() => {
        if (openedPhotosetDOMItem) {
            openedPhotosetDOMItem.classList.add('all-photosets__item--open')
            openedPhotosetDOMItem.children[2].style.display = 'block'
        }
    }, [openedPhotosetDOMItem])

    useEffect (() => {
        if (openedPhotosetId) {
            openPhotoset(openedPhotosetId)
        }
    }, [openedPhotosetId]) 

    const openPhotoset = (photosetId) => {
        setOpenedPhotosetDOMItem(document.getElementById(photosetId))
        setIdPhotosetOpened(photosetId)
        setPhotosetOpened(true)
    }

    const handleControlBackClick = (event) => {
        event.stopPropagation ()

        navigate(`/${userInfo.userId}/${page}/${JSON.stringify(filter)}`)

        setPhotosetOpened(false)

        openedPhotosetDOMItem.classList.remove('all-photosets__item--open')
        openedPhotosetDOMItem.children[2].style.display = 'none'

        setOpenedPhotosetDOMItem(null)
    }

    return (
        <div className="all-photosets"> {
            photosetsOffset.length ? 
            photosetsOffset.map((photoset) => {
                return (
                    <div className="all-photosets__item" key={photoset.id} id={photoset.id}
                        onClick={(event) => handlePhotosetClick(photoset.id)}
                        style={{ background: `url(${createImageURL(photoset.server, photoset.secret, photoset.primary)})` }}>
                        <div className="all-photosets__item-title">
                            <div className="all-photosets__item-text">{photoset.title._content}</div>
                            <div className="all-photosets__item-date">{photoset.date_create}</div>
                        </div>

                        <div className="all-photosets__item-info">
                            {photoset.count_views > 0 && (<div className="all-photosets__info-count-views">{photoset.count_views}</div>)}
                            {photoset.count_comments > 0 && (<div className="all-photosets__info-count-comments">{photoset.count_comments}</div>)}
                            {photoset.count_photos > 0 && (<div className="all-photosets__info-count-photos">{photoset.count_photos}</div>)}
                            {photoset.count_videos > 0 && (<div className="all-photosets__info-count-videos">{photoset.count_videos}</div>)}
                        </div>

                        <div className="all-photosets__control">
                            <div className="all-photosets__control-back" onClick={(event) => handleControlBackClick(event)}></div>
                            <div className="all-photosets__control-desc"></div>
                        </div>
                    </div>
                )
            }) : <span className='all-photosets__notFound'>No photosets found.</span> }

            {
                photosetOpened &&
                <AllPhotos photosetId={idPhotosetOpened}/>
            }
            </div>
    )
}

export default AllPhotosets