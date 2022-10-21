import "./index.scss"
import { useEffect, useState, useMemo } from "react"
import { flickrAPI } from "../../middleware/api/flickrAPI"
import PagonationPhotosets from "./PaginationPhotosets"
import AllPhotosets from "./AllPhotosets"

const Photosets = (param) => {
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")))
    const [photosetsInfo, setPhotosetsInfo] = useState(JSON.parse(localStorage.getItem("photosetsInfo")))
    const [loading, setLoading] = useState(false)
    const [photosetsOffset, setPhotosetsOffset] = useState(null)
    const [page, setPage] = useState(param.page)
    const [countPages, setCountPages] = useState(0)

    useEffect (() => {
        if (photosetsInfo) {
            localStorage.setItem("photosetsInfo", JSON.stringify(photosetsInfo))

            setPhotosetsOffset(getPhotosetsOffset())
            setCountPages(Math.ceil(photosetsInfo.countPhotosets / 9))
        }
    }, [photosetsInfo])

    useEffect (() => {
        if (photosetsOffset) {
            setLoading(true)
        }
    }, [photosetsOffset])

    useEffect (() => {
        getPhotosetsInfo()
    }, [param.page])

    const getPhotosetsInfo = async () => {
        await flickrAPI().getPhotosets(userInfo.userId).then((response) => {
            setPhotosetsInfo({
                countPhotosets: response.photosets.total,
                photoset: response.photosets.photoset,
            })    
        })    
    }

    const getPhotosetsOffset = () => {
        let beginSlice = (page - 1) * 9
        let endSlice = beginSlice + 9
        let slicePhotosetArray = photosetsInfo.photoset.slice(beginSlice, endSlice)

        slicePhotosetArray.map((photoset) => {
            let date = new Date(photoset.date_create * 1000)
            let shortDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`

            photoset.date_create = shortDate.toString()
        })

        return slicePhotosetArray
    }

    return(
        <div className="photosets">
            <div className="photosets__header">
                <div className="photosets__user">
                    <span className="photosets__user-name">{userInfo.userName}</span>
                </div>
                <div className="photosets__find">
                    <form className="photosets__find-form">
                        <input type="text" className="input input__search" placeholder="Enter user name"/>
                        <button className="button button--search" type="submit"></button>
                    </form>
                </div>
            </div>
            <div className="photosets__header-sec">
                <div className="photosets__header-title">
                    <span className="photosets__header-title-text">Photosets</span>
                </div>
                <div className="photosets__filter">

                </div>
            </div>
            {
                loading &&
                <AllPhotosets photosetsOffset={photosetsOffset}/>
            }
            {
                loading &&
                <PagonationPhotosets page={page} countPages={countPages} setPage={setPage}/>
            }
        </div>
    )
}

export default Photosets