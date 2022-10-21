import { useEffect, useState } from "react"
import "./index.scss"
import "./photo-slider.scss"
import { flickrAPI, createImageURL } from "../../../middleware/api/flickrAPI"

const AllPhotos = ( {photosetId} ) => {
    const [photoList, setPhotoList] = useState(null)
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")))
    const [loading, setLoading] = useState(false)
    const [photoSlider, setPhotoSlider] = useState(null)
    const [photoViewIndex, setPhotoViewIndex] = useState(0)

    useEffect (() => {
        getPhotos()
    }, [photosetId])

    useEffect (() => {
        if (photoList) {
            setLoading(true)
            setPhotoSlider(document.querySelector("#photoSlider"))
        }
    }, [photoList])

    const getPhotos = async () => {
        await flickrAPI().getPhotos(userInfo.userId, photosetId).then((response) => {
            setPhotoList({
                photos: response.photoset.photo,
            })
        })
    }

    const handlePhotoClick = (indexPhoto) => {
        photoSlider.showModal()
        setPhotoViewIndex(indexPhoto)
        viewPhoto(indexPhoto)
    }

    const handlePhotoBackClick = (indexView) => {
        setPhotoViewIndex(indexView)
        viewPhoto(indexView)
    }

    const handlePhotoNextClick = (indexView) => {
        setPhotoViewIndex(indexView)
        viewPhoto(indexView)
    }

    const handlePhotoExitClick = () => {
        photoSlider.close()
    }

    const viewPhoto = (indexPhoto) => {
        let imageBox = photoSlider.querySelector(".photo-slider__content-image")
        let controlBack = photoSlider.querySelector(".photo-slider__control-back")
        let controlNext = photoSlider.querySelector(".photo-slider__control-next")

        let photo = photoList.photos[indexPhoto]

        let photoServer = photo.server
        let photoSecret = photo.secret
        let photoId = photo.id

        imageBox.setAttribute("src", createImageURL(photoServer, photoSecret, photoId))

        if (indexPhoto == photoList.photos.length - 1) {
            controlNext.style.display = "none"
        }
        else {
            controlNext.style.display = "block"
        }

        if (indexPhoto == 0) {
            controlBack.style.display = "none"
        }
        else {
            controlBack.style.display = "block"
        }
    }

    return (
        <div className="all-photos"> {
            loading &&
            photoList.photos.map((photo, indexPhoto) => {
                return (
                    <div className="all-photos__item" key={photo.id} onClick={() => handlePhotoClick(indexPhoto)}>
                        <div className="all-photos__item-image" style={{ background: `url(${createImageURL(photo.server, photo.secret, photo.id)})` }} />

                        <div className="all-photos__item-title">
                            {photo.title}
                        </div>
                    </div>
                )
            })} 
            <dialog id="photoSlider" className="photo-slider">
                <div className="photo-slider__content">
                    <img className="photo-slider__content-image" />
                </div>
                <div className="photo-slider__control">
                    <button className="photo-slider__control-exit" onClick={() => handlePhotoExitClick()}/>
                    <button className="photo-slider__control-back" onClick={() => handlePhotoBackClick(photoViewIndex - 1)}/>
                    <button className="photo-slider__control-next" onClick={() => handlePhotoNextClick(photoViewIndex + 1)}/>
                </div>
            </dialog>
        </div>
    )
}

export default AllPhotos