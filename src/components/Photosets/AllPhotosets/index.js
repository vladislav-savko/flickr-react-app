import './index.scss'
import { createImageURL } from '../../../middleware/api/flickrAPI'
import { useEffect, useState } from 'react'
import AllPhotos from '../AllPhotos'

const AllPhotosets = ( {photosetsOffset} ) => {
    const [photosetOpened, setPhotosetOpened] = useState(false)
    const [idPhotosetOpened, setIdPhotosetOpened] = useState(0)
    const [openedPhotosetDOMItem, setOpenedPhotosetDOMItem] = useState(null)
    
    const handlePhotosetClick = (event, photosetId) => {
        setOpenedPhotosetDOMItem(event.target)
        setIdPhotosetOpened(photosetId)
        setPhotosetOpened(true)
    }

    useEffect (() => {
        if (openedPhotosetDOMItem) {
            openedPhotosetDOMItem.classList.add('all-photosets__item--open')
            openedPhotosetDOMItem.querySelector('.all-photosets__control').style.display = 'block'
        }
    }, [openedPhotosetDOMItem])

    const handleControlBackClick = (event) => {
        event.stopPropagation ()

        setPhotosetOpened(false)

        openedPhotosetDOMItem.classList.remove('all-photosets__item--open')
        openedPhotosetDOMItem.querySelector('.all-photosets__control').style.display = 'none'

        setOpenedPhotosetDOMItem(null)
    }

    return (
        <div className="all-photosets"> {
            photosetsOffset.map((photoset) => {
                return (
                    <div className="all-photosets__item" key={photoset.id} 
                        onClick={(event) => handlePhotosetClick(event, photoset.id)}
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
            })}

            {
                photosetOpened &&
                <AllPhotos photosetId={idPhotosetOpened}/>
            }
            </div>
    )
}

export default AllPhotosets