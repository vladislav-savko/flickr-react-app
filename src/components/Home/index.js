import "./index.scss"
import { useRef, useEffect, useState } from "react"
import { flickrAPI } from "../../middleware/api/flickrAPI"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const inputUserNameRef = useRef(null)
    const [userInfo, setUserInfo] = useState(null)
    const navigation = useNavigate()
    
    useEffect(() => {
        if (userInfo) {
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            navigation(`/${userInfo.userId}`)
        }
    }, [userInfo])

    const onSubmitHomeForm = (event) => {
        event.preventDefault()
        getUserInfo()
    }

    const getUserInfo = async () => {
        let name = inputUserNameRef.current.value

        await flickrAPI().getUser(name).then((response) => {
            setUserInfo({
                userName: name,
                userId: response.user.id,
            })
        })
    }

    return (
        <div className="home" onSubmit={(event) => onSubmitHomeForm(event)}>
            <span className="home__title">To access, please...</span>
            <form className="home__form">
                <input 
                    type="text" 
                    name="userName" 
                    className="input input__base" 
                    placeholder="Enter user name"
                    ref={inputUserNameRef}
                />

                <button className="button button--base" type="submit">
                    get
                </button>
            </form>
        </div>
    )
}

export default Home