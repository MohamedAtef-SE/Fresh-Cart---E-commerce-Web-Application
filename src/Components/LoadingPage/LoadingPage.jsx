import { RotatingTriangles } from "react-loader-spinner";



export default function LoadingPage() {




    return (
        <div className="d-flex position-absolute top-0 start-0 justify-content-center align-items-center vh-100 w-100 bg-main">
            <RotatingTriangles
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="rotating-triangles-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}