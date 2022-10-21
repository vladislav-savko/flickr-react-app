import axios from "axios"

const api_key = "f6146b5aea320305af01030c6fc04c59"

const firstPartUrl = "https://www.flickr.com/services/rest/?method="
const lastPartUrl = "&format=json&nojsoncallback=1"
const apiString = `&api_key=${api_key}`

const methods = {
    findPeopeByUserName: "flickr.people.findByUsername",
    getPhotosetsList: "flickr.photosets.getList",
    getPhotosetsPhotos: "flickr.photosets.getPhotos",
    getPhotosContext: "flickr.photos.getContext",
    getPhotosSizes: "flickr.photos.getSizes",
    getPhotosetsInfo: "flickr.photosets.getInfo",
}

// https://www.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=f6146b5aea320305af01030c6fc04c59&username=Berduu&format=json&nojsoncallback=1
// https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=f6146b5aea320305af01030c6fc04c59&user_id=48600090482%40N01&page=22&per_page=5&format=json&nojsoncallback=1
// https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=f6146b5aea320305af01030c6fc04c59&photoset_id=72177720300693983&user_id=126064938%40N02&format=json&nojsoncallback=1
// https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=f6146b5aea320305af01030c6fc04c59&photo_id=52311103893&format=json&nojsoncallback=1

export const flickrAPI = () => {
    
    return {
        getUser: (userName) => 
            axios.get(`${firstPartUrl}${methods.findPeopeByUserName}${apiString}&username=${userName}${lastPartUrl}`)
                .then(response => { return response.data })
                .catch(error => { console.error("this is an amazing request", error) }),
        getPhotosets: (userId) =>
            axios.get(`${firstPartUrl}${methods.getPhotosetsList}${apiString}&user_id=${userId}${lastPartUrl}`)
                .then(response => { return response.data })
                .catch(error => { console.error("this is an amazing request", error) }),
        getPhotos: (userId, photoseId) =>
            axios.get(`${firstPartUrl}${methods.getPhotosetsPhotos}${apiString}&photoset_id=${photoseId}&user_id=${userId}${lastPartUrl}`)
                .then(response => { return response.data })
                .catch(error => { console.error("this is an amazing request", error) }),
    }
}

export const createImageURL = (server, secret, id) => {
    return `https://live.staticflickr.com//${server}/${id}_${secret}_b.jpg`
}