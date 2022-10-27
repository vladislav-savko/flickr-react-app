import "./index.scss"
import { useEffect, useState, useRef } from "react"
import { flickrAPI } from "../../middleware/api/flickrAPI"
import PagonationPhotosets from "./PaginationPhotosets"
import AllPhotosets from "./AllPhotosets"
import { useNavigate } from "react-router-dom"
import { PhotosetsSkeleton } from "./Skeleton"
import { ColorRing } from "react-loader-spinner"

const User = (ctx) => {
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")))
    const [photosetsInfo, setPhotosetsInfo] = useState(JSON.parse(localStorage.getItem("photosetsInfo")))

    const [loading, setLoading] = useState(false)
    const [photosetsOffset, setPhotosetsOffset] = useState(null)
    const [openedPhotosetId, setOpenedPhotosetId] = useState(ctx.params.photosetId)

    const [page, setPage] = useState(ctx.params.page)
    const [countPages, setCountPages] = useState(0)

    const [searchOpened, setSearchOpened] = useState(false)
    const [filterOpened, setFilterOpened] = useState(false)
    const [customSelectOpened, setCustomSelectOpened] = useState(false)

    const [filter, setFilter] = useState(JSON.parse(ctx.params.filter))

    const [preloaderVisible, setPreloaderVisible] = useState(true)

    const inputSearchRef = useRef(null)
    const inputFilterPhotosetNameRef = useRef("")
    const inputFilterSortRef = useRef(0)

    const sortObject = {
        0: "Sort by default",
        1: "Sort by name",
    }

    const navigate = useNavigate()

    useEffect (() => {
        let params = ctx.params

        if (userInfo && userInfo.userId == params.userId) {
            getPhotosetsInfo()
        } else {
            getPhotosetsInfo(params.userId)
        }

        if (page != params.page) {
            setPage(params.page)
        }

        if (filter != JSON.parse(params.filter)) {
            setFilter(JSON.parse(params.filter))
        }

        if (openedPhotosetId != params.photosetId) {
            setOpenedPhotosetId(params.photosetId)
        }

        if (!(userInfo && userInfo.userId == params.userId) || 
        (page != params.page) || 
        (filter.sort != JSON.parse(params.filter).sort || filter.photosetName != JSON.parse(params.filter).photosetName)) {
            setPreloaderVisible(true)
            setLoading(false)
        }

    }, [ctx.params])

    useEffect (() => {
        if (photosetsInfo) {
            localStorage.setItem("photosetsInfo", JSON.stringify(photosetsInfo))
            localStorage.setItem("userInfo", JSON.stringify(userInfo))

            getPhotosetsOffset(filter)
        }
    }, [photosetsInfo, userInfo])

    useEffect (() => {
        if (photosetsOffset) {
            setLoading(true)
            setPreloaderVisible(false)
        }
    }, [photosetsOffset])

    const getPhotosetsInfo = async (userId = userInfo.userId) => {
        await flickrAPI().getPhotosets(userId).then((response) => {
            if (response.stat == "ok") {
                setPhotosetsInfo({
                    countPhotosets: response.photosets.total,
                    photoset: response.photosets.photoset,
                })   
    
                if (response.photosets.total)
                {        
                    setUserInfo({
                        userName: response.photosets.photoset[0].username,
                        userId: response.photosets.photoset[0].owner,
                    }) 
                }
            }
        })    
    }

    const getPhotosetsOffset = (filterOff) => {
        let beginSlice = (page - 1) * 9
        let endSlice = beginSlice + 9

        let filterPhotosetArray = Object.assign({}, photosetsInfo)

        if (filterOff) {
            switch(filterOff.sort) {
                case "0": {
                    filterPhotosetArray.photoset = filterPhotosetArray.photoset.sort((firstItem, secondItem) => { 
                        return secondItem.count_views - firstItem.count_views
                    })
                } break
                
                case "1": {
                    filterPhotosetArray.photoset = filterPhotosetArray.photoset.sort((firstItem, secondItem) => { 
                        if (firstItem.title._content > secondItem.title._content) {
                            return 1
                        } else {
                            return -1
                        }
                    })
                } break
                
                default: {
                    filterPhotosetArray.photoset = filterPhotosetArray.photoset.sort((firstItem, secondItem) => { 
                        return secondItem.count_views - firstItem.count_views
                    })
                } break
            }

            if (filterOff.photosetName) {
                filterPhotosetArray.photoset = filterPhotosetArray.photoset.filter((photoset) => photoset.title._content.includes(filterOff.photosetName))
                filterPhotosetArray.countPhotosets = filterPhotosetArray.photoset.length
            } 
        }

        let slicePhotosetArray = filterPhotosetArray.photoset.slice(beginSlice, endSlice)

        setCountPages(Math.ceil(filterPhotosetArray.countPhotosets / 9))
        filterPhotosetArray.countPhotosets = filterPhotosetArray.photoset.length

        slicePhotosetArray.map((photoset) => {
            let date = new Date(photoset.date_create * 1000)
            let shortDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`

            photoset.date_create = shortDate.toString()
        })

        setPhotosetsOffset(slicePhotosetArray) 
    }

    const getUserInfo = async () => {
        let name = inputSearchRef.current.value

        if (name) {
            await flickrAPI().getUser(name).then((response) => {
                if (response.stat == "ok") {
                    setUserInfo({
                        userName: name,
                        userId: response.user.id,
                    })

                    navigate(`/${response.user.id}/1/${JSON.stringify(filter)}`)
                } 
            })

            inputSearchRef.current.value = ""
        }
    }

    const handleSearchClick = (event) => {
        event.preventDefault()
        let inputSearchDOMElement = document.getElementById("userName")

        if (!searchOpened) {
            inputSearchDOMElement.classList.add("input--search--focus")
            setSearchOpened(true)
        } else {
            getUserInfo()

            inputSearchDOMElement.classList.remove("input--search--focus")
            setSearchOpened(false)
        }
    }

    const handleFilterClick = (event) => {
        let filterContentDOMElement = document.getElementById('formFilter')

        if (!filterOpened) {
            filterContentDOMElement.classList.add("photosets__filter-content--active")
            setFilterOpened(true)
        } else {
            filterContentDOMElement.classList.remove("photosets__filter-content--active")
            setFilterOpened(false)
        }
    }

    const handleSelectClick = (event) => {
        let customSelectDOMElement = document.getElementById("filterSortFake")
        let selectListDOMElement = customSelectDOMElement.children[1]

        if (!customSelectOpened) {
            customSelectDOMElement.classList.add("select-custom--active")
            selectListDOMElement.classList.add("select-custom__list--active")
            setCustomSelectOpened(true)
        } else {
            customSelectDOMElement.classList.remove("select-custom--active")
            selectListDOMElement.classList.remove("select-custom__list--active")
            setCustomSelectOpened(false)
        }
    }

    const handleSelectOptionClick = (event, sort) => {
        event.preventDefault()
        let customSelectDOMElement = document.getElementById('filterSortFake')
        let customSelectTextDOMElement = customSelectDOMElement.children[0]
        
        let selectDOMElement = document.getElementById("filterSort")

        let selectOptionDOMElement = selectDOMElement.children[sort]

        selectOptionDOMElement.selected = true
        customSelectTextDOMElement.innerHTML = sortObject[sort]
    }

    const handleSubmitFilter = (event) => {
        event.preventDefault()

        let filter_t = {
            sort: inputFilterSortRef.current.value,
            photosetName: inputFilterPhotosetNameRef.current.value,
        }

        navigate(`/${userInfo.userId}/1/${JSON.stringify(filter_t)}`)
    }

    return(
        <div className="photosets">
            <div className="photosets__header">
                <div className="photosets__user">
                    <span className="photosets__user-name">{userInfo ? userInfo.userName : "User Name"}</span>
                </div>
                <div className="photosets__find">
                    <form className="photosets__find-form">
                        <input 
                            type="text" 
                            name="userName"
                            id="userName"
                            className="input input--search" 
                            placeholder="Enter user name" 
                            ref={inputSearchRef}
                        />
                        <button className="button button--search" type="submit" onClick={(event) => handleSearchClick(event)}/>
                    </form>
                </div>
            </div>
            <div className="photosets__header-sec">
                <div className="photosets__header-title">
                    <span className="photosets__header-title-text">Photosets</span>
                </div>
                <div className="photosets__filter">
                    <button className="button button--filter" onClick={(event) => handleFilterClick(event)}/>
                </div>
                <form className="photosets__filter-content" id="formFilter">
                    <input 
                        type="text"
                        name="filterName"
                        id="filterName"
                        className="input input--base" 
                        placeholder="Enter photoset name"   
                        ref={inputFilterPhotosetNameRef}
                    />

                    <select 
                        name="filterSort"
                        id="filterSort"
                        className="select"
                        ref={inputFilterSortRef}
                    >
                        <option value={0}>default</option>
                        <option value={1}>by name</option>
                    </select>

                    <div className="select-custom" id="filterSortFake" onClick={(event) => handleSelectClick(event)}>
                        <div className="select-custom__selected">
                            Sort by default
                        </div>
                        <div className="select-custom__list">
                            <button className="button select-custom__button" onClick={(event) => handleSelectOptionClick(event, 0)}>Sort by default</button>
                            <button className="button select-custom__button" onClick={(event) => handleSelectOptionClick(event, 1)}>Sort by name</button>
                        </div>
                    </div>

                    <button className="button button--base ml-a" type="submit" onClick={(event) => handleSubmitFilter(event)}>Accept</button>
                </form>
            </div>
            {
                loading ? 
                    <AllPhotosets photosetsOffset={photosetsOffset} openedPhotosetId={openedPhotosetId} userInfo={userInfo} filter={filter} page={page}/> : 
                    <>
                        <PhotosetsSkeleton />
                        <ColorRing 
                            visible={preloaderVisible} 
                            wrapperClass="photosets__progressBar"
                            colors={['#222222', '#222222', '#222222', '#222222','#222222']}
                        />
                    </>
            }
            {
                <PagonationPhotosets page={page} countPages={countPages} userId={ctx.params.userId} filter={filter}/>
            }
        </div>
    )
}

export default User