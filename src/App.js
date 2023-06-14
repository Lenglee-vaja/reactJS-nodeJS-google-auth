
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import "./App.css";
import { useState } from 'react';
//import Tasks from "./components/Tasks";
import axios from "axios";

function App() {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  const auth = getAuth();

  const [authorizedUser, setAuthorizedUser] = useState(
    false || sessionStorage.getItem("accessToken")
  );

  // function signInwithGoogle() {
  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       const user = result.user;
        
  //       if (user) {
  //         user.getIdToken().then((idToken) => {
  //           // set access token in session storage
  //           sessionStorage.setItem("accessToken", idToken);
  //           setAuthorizedUser(true);
            
  //           // Send the idToken to the backend
  //           axios
  //             .post("http://localhost:3007/api/auth/google-login", { idToken })
  //             .then((response) => {
  //               console.log(response);
  //             })
  //             .catch((error) => {
  //               // Handle error response from the backend
  //               console.log(error);
  //             });
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
  function signInwithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
  
        if (user) {
          user.getIdToken().then((idToken) => {
            // set access token in session storage
            sessionStorage.setItem("accessToken", idToken);
            setAuthorizedUser(true);
  
            // Send the idToken to the backend using axios
            const url = 'http://localhost:8080/home';
            const headers = { 'Content-Type': 'application/json' };
            const data = {
              query: `
                mutation Mutation($data: IdToken) {
                  signInWithGoogle(data: $data) {
                    accessToken
                  }
                }
              `,
              variables: {
                data: {
                  idToken: idToken,
                },
              },
            };
  
            axios.post(url, data, { headers })
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                // Handle error response from the backend
                console.log(error);
              });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function logoutUser() {
    signOut(auth)
      .then(() => {
        // clear session storage
        sessionStorage.clear();
        setAuthorizedUser(false);
        alert('Logged Out Successfully');
      })
      .catch((error) => {
        alert(error);
      });
  }

  return (
    <div className="App">
      {authorizedUser ? (
        <>
          <p>Authorized user</p>
          <h1>Tasks</h1>
          {/* <Tasks token={sessionStorage.getItem("accessToken")} /> */}
          <button onClick={logoutUser}>Logout Button</button>
        </>
      ) : (
        <>
          <button onClick={signInwithGoogle}>SignWithGoogle</button>
        </>
      )}
    </div>
  );
}

export default App;
