console.log("Login JS Loaded");

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(email === "" || password === ""){

        alert("Please fill all fields");
        return;

    }

    const formData = new FormData(loginForm);

    try{

        const response = await fetch("/api/login/", {

            method: "POST",

            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },

            body: formData

        });

        const data = await response.json();

        if(data.status === "success"){

            alert("Login Successful");

            window.location.href = "/home/";

        }

        else{

            alert(data.message);

        }

    }

    catch(error){

        alert("Something went wrong");

    }

});


function getCookie(name){

    let cookieValue = null;

    if(document.cookie && document.cookie !== ""){

        const cookies = document.cookie.split(";");

        for(let cookie of cookies){

            cookie = cookie.trim();

            if(cookie.startsWith(name + "=")){

                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );

                break;

            }

        }

    }

    return cookieValue;

}


