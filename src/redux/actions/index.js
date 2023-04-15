import { auth, db, provider, storage } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import * as actions from "./actions";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";



export function signInAPI() {
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then((payload) => {
        
        dispatch(actions.setUser(payload.user));
        localStorage.setItem("user", payload.user.accessToken);

      })
      .catch((error) => alert(error.message));
  };
}

export function getUserAuth() {
  // to change user account which stored in Redux that was Logged in to website to store it again in redux user state 
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(actions.setUser(user));
      }
    });
  };
  
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(actions.setUser(null));
        localStorage.clear();

      })
      .catch((error) => alert(error.message));
  };
}

export function postArticleAPI(payload) {
  return (dispatch) => {
    dispatch(actions.setLoading(true));

    /*
    ref : refereance for my storage , (storage , url) to store as it is in storage.
    uploadBytesResumable : upload  ( storageRef , data)

    collection (db, name of collection) for add column then 
    add rows by addDoc()


    */

    if (payload.image) {
      const storageRef = ref(storage, `images/${payload.image.name}`);
      const uploadRef = uploadBytesResumable(storageRef, payload.image);

      uploadRef.on(
        "state_changed",
        (snapshot) => {
          const progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          alert(error);
        },
        // to get link of image that i want to store this linke in database ( firestore )

        () => {
          getDownloadURL(uploadRef.snapshot.ref).then((downloadURl) => {

            const collRef = collection(db, "articles");
            addDoc(collRef, {
              actor: {
                description: payload.user.email,
                title: payload.user.displayName,
                date: payload.timestamp,
                image: payload.user.photoURL,
              },
              comments: 0,
              video: payload.video,
              description: payload.description,
              shareImg: downloadURl,
            });
          });
          dispatch(actions.setLoading(false));
        }
      );
    } else if (payload.video) {
      //just store link of video in store not storage
      const collRef = collection(db, "articles");
      addDoc(collRef, {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        comments: 0,
        video: payload.video,
        description: payload.description,
        shareImg: payload.image,
      });
      dispatch(actions.setLoading(false));
    } else {
      const collRef = collection(db, "articles");
      addDoc(collRef, {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        comments: 0,
        video: payload.video,
        description: payload.description,
        shareImg: payload.image,
      });
      dispatch(actions.setLoading(false));
    }
  };
}

export function getArticlesAPI() {
  return (dispatch) => {
    let payload;
    
    //query : (collection , )

    const collRef = collection(db, "articles");
    const orderedRef = query(collRef, orderBy("actor.date", "desc"));
    onSnapshot(orderedRef, (snapshot) => {
      payload = snapshot.docs.map((doc) => doc.data());
      dispatch(actions.getArticles(payload));
    });
  };
}




