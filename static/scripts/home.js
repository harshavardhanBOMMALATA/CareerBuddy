window.addEventListener("DOMContentLoaded", async () => {

    const months = [];

    const currentDate = new Date();

    for(let i = 3; i >= 0; i--){

        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        );

        const monthName = date.toLocaleString(
            "default",
            {
                month: "short"
            }
        );

        months.push(monthName);

    }

    const response = await fetch(

        "/progress-stats/",

        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                months: months

            })

        }

    );

    const data = await response.json();

    const ctx = document
        .getElementById("progressChart")
        .getContext("2d");

    new Chart(ctx, {

        type: 'line',

        data: {

            labels: months,

            datasets: [{

                label: 'Progress',

                data: data.values,

                borderColor:'#4f46e5',

                backgroundColor:
                    'rgba(79,70,229,0.1)',

                tension:0.4,

                fill:true

            }]

        },

        options: {

            responsive:true,

            maintainAspectRatio:false,

            plugins:{
                legend:{
                    display:false
                }
            },

            scales:{
                y:{
                    beginAtZero:true,
                    ticks:{
                        stepSize:1
                    }
                }
            }

        }

    });

});










window.addEventListener("DOMContentLoaded", () => {

    const historyList = document.getElementById("historyList");
    console.log("Fetching activity data...");

    fetch("/activity/")

    .then(response => response.json())

    .then(data => {

        if(data.activities.length === 0){

            return;

        }

        historyList.innerHTML = "";

        data.activities.forEach(activity => {

            historyList.innerHTML += `

                <div class="history-item">

                    <h4>${activity.feature_name}</h4>

                    <p>${activity.text}</p>
                    
                    <div style="font-size:13px;color:#5b4bff;
                    font-weight:600;
                    text-align:right;
                    margin-top:10px;"
                    >${activity.created_at}
                    </div>

                </div>

            `;

        });

    });

});




window.addEventListener("DOMContentLoaded", () => {
     console.log("Fetching dashboard stats...");

    fetch("/dashboard-stats/")

    .then(response => response.json())

    .then(data => {

        const values = document.querySelectorAll(".value");

        values[0].innerText = data.resume_analyzed;

        values[1].innerText = data.roadmaps_created;

        values[2].innerText = data.interviews_prepared;

        values[3].innerText = data.average_ats_score + "%";

    });

});





window.addEventListener("DOMContentLoaded", async () => {

    const response = await fetch(
        "/authentication/"
    );

    const data = await response.json();

    if(!data.authenticated){

        window.location.href = "/api/loginpage/";

    }

});




async function logout(){

    const response = await fetch(
        "/api/logout/"
    );

    const data = await response.json();

    alert(data.message);

    window.location.href =
        "/api/loginpage/";

}


function toggleProfileMenu(){

    const menu =
        document.getElementById("profileMenu");

    if(menu.style.display === "block"){

        menu.style.display = "none";

    }

    else{

        menu.style.display = "block";

    }

}