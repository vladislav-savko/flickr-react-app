import "./index.scss"
import "./photo-slider.scss"
import { useEffect, useMemo, useState } from "react"
import { flickrAPI, createImageURL } from "../../../middleware/api/flickrAPI"
import { ColorRing } from "react-loader-spinner"

const AllPhotos = ( {photosetId} ) => {
    const [photoList, setPhotoList] = useState(null)
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")))
    const [loading, setLoading] = useState(false)
    const [photoSlider, setPhotoSlider] = useState(null)
    const [photoViewIndex, setPhotoViewIndex] = useState(0)

    const [photoListOffset, setPhotoListOffset] = useState(null)
    const [preloaderVisible, setPreloaderVisible] = useState(true)

    const [countRenderPhotos, setCountRenderPhotos] = useState(10)

    useEffect (() => {
        getPhotos()
    }, [photosetId])

    useEffect (() => {
        if (photoList) {    
            setPhotoSlider(document.getElementById("photoSlider"))
            getPhotosOffset()
        }
    }, [photoList])

    useEffect (() => {
        if (photoListOffset) {
            setLoading(true)
            setPreloaderVisible(false)

            if (photoListOffset.photos.length < photoList.photos.length) {
                setCountRenderPhotos(countRenderPhotos + 15)
                window.addEventListener("scroll", handleScroll)
            } 
        }
    }, [photoListOffset])   

    const getPhotos = async () => {
        await flickrAPI().getPhotos(userInfo.userId, photosetId).then((response) => {
            if (response.stat == "ok") {
                setPhotoList({
                    photos: response.photoset.photo,
                })
            }
        })
    }

    const getPhotosOffset = () => {
        setPreloaderVisible(true)

        window.removeEventListener("scroll", handleScroll)

        setTimeout(() => {
            setPhotoListOffset({
                photos: photoList.photos.slice(0, countRenderPhotos)
            })
        }, 2000)   
    }

    const handleScroll = () => {
        if (document.documentElement.scrollHeight - window.pageYOffset - document.documentElement.clientHeight < 200) {
            getPhotosOffset()
        }
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
        let imageBox = photoSlider.children[0].children[0]

        let controlBack = photoSlider.children[1].children[1]
        let controlNext = photoSlider.children[1].children[2]

        let photo = photoList.photos[indexPhoto]

        let photoServer = photo.server
        let photoSecret = photo.secret
        let photoId = photo.id

        imageBox.setAttribute("src", createImageURL(photoServer, photoSecret, photoId))

        if (indexPhoto == photoList.photos.length - 1) {
            controlNext.style.display = "none"
        } else {
            controlNext.style.display = "block"
        }

        if (indexPhoto == 0) {
            controlBack.style.display = "none"
        } else {
            controlBack.style.display = "block"
        }
    }

    return (
        <div className="all-photos"> {
            loading ?
            photoListOffset.photos.map((photo, indexPhoto) => {
                return (
                    <div className="all-photos__item" key={photo.id} onClick={() => handlePhotoClick(indexPhoto)}>
                        <div className="all-photos__item-image" style={{ background: `url(${createImageURL(photo.server, photo.secret, photo.id)})` }} />

                        <div className="all-photos__item-title">
                            {photo.title}
                        </div>
                    </div>
                )
            }) : null}
            {<ColorRing visible={preloaderVisible} wrapperClass="all-photos__progressBar"/>}
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