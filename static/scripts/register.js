const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function(event){

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(name === "" || email === "" || password === ""){

        alert("Please fill all fields");
        return;

    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch("/api/register/", {

        method: "POST",

        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },

        body: formData

    });

    const data = await response.json();

    if(data.status === "success"){

        alert("Account Created Successfully");

        window.location.href = "/api/loginpage/";

    }

    else{

        alert(data.message);

    }

});


function getCookie(name){

    let cookieValue = null;

    if(document.cookie && document.cookie !== ""){

        const cookies = document.cookie.split(";");

        for(let i = 0; i < cookies.length; i++){

            const cookie = cookies[i].trim();

            if(cookie.substring(0, name.length + 1) === (name + "=")){

                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );

                break;

            }

        }

    }

    return cookieValue;

}