import { useEffect } from "react";
import { connect } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"

const RequiredAuth = ({ user , children }) => {
    const navigate = useNavigate();
    const loggedInUser = localStorage.getItem("user");


    useEffect(()=>{

        if (!loggedInUser) {
            navigate("/", { replace: true }); // login page
            return;
        }
    },[loggedInUser]);

    return children;
    // return <Outlet/>
}

const mapStateToProps = (state) =>{

    return{
        user : state.userState.user
    }
}

export default connect(mapStateToProps)(RequiredAuth)
