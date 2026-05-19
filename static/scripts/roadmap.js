console.log("Roadmap Generator Loaded");

const generateBtn = document.querySelector('.generate-btn');

const roadmapSection =
    document.querySelector('.roadmap-section');

generateBtn.addEventListener('click', async () => {

    window.addEventListener("DOMContentLoaded", async () => {

    const response = await fetch(
        "/authentication/"
    );

    const data = await response.json();

    if(!data.authenticated){

        window.location.href = "/api/loginpage/";

    }

});

    fetch("/resume-generator/", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({

        message: "generate resume"

    })

})

.then(response => response.json())

.then(data => {

    console.log(data);

});

    const role =
        document.getElementById('roleInput').value;

    const duration =
        document.getElementById('durationInput').value;

    const currentEducation =
        document.getElementById('classInput').value;

    try{

        const response = await fetch("/roadmap-generator/", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                role: role,

                duration: duration,

                currentEducation: currentEducation

            })

        });

        // BACKEND RESPONSE

        const data = await response.json();

        // AI JSON

        const roadmap = JSON.parse(data.result);

        // CLEAR OLD CONTENT

        roadmapSection.innerHTML = "";

        // LOOP ALL PHASES

        roadmap.phases.forEach((phase) => {

            // CREATE SKILLS

            let skillsHTML = "";

            phase.skills.forEach((skill) => {

                skillsHTML += `
                    <div class="skill">
                        ${skill}
                    </div>
                `;

            });

            // CREATE LINKS

            let linksHTML = "";

            phase.reference_links.forEach((link) => {

                linksHTML += `
                    <a href="${link}"
                       target="_blank"
                       class="resource">

                        Resource Link

                    </a>
                `;

            });

            // APPEND ROADMAP CARD

            roadmapSection.innerHTML += `

                <div class="phase-card">

                    <div class="phase-top">

                        <div class="phase-title">

                            ${phase.phase_title}

                        </div>

                        <div class="phase-duration">

                            ${phase.duration}

                        </div>

                    </div>

                    <div class="skills">

                        ${skillsHTML}

                    </div>

                    <div class="project-box">

                        <h3>
                            Project Recommendation
                        </h3>

                        <p>

                            ${phase.project_recommendation}

                        </p>

                    </div>

                    <div class="resources">

                        ${linksHTML}

                    </div>

                </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

});



const printBtn = document.querySelector('.print-btn');

printBtn.addEventListener('click', () => {

    window.print();

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