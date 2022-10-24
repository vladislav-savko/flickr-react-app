import '../AllPhotosets/index.scss'

export const PhotosetsSkeleton = () => {
    return (
        <div className="all-photosets"> {
            [...Array(9)].map((object, index) => {
                return (
                    <div className="all-photosets__item" key={index}></div>
                )
            })}
        </div>
    )
}