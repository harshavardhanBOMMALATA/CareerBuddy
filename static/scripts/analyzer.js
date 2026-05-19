console.log("Resume Analyzer Loaded");

// FILE INPUT

const uploadBtn = document.querySelector(".upload-btn");
const fileName = document.getElementById("fileName");
const fileInput = document.getElementById("fileInput");
const waiting = document.getElementById("waiting");

// OPEN FILE SELECTOR

uploadBtn.addEventListener("click", () => {
    window.addEventListener("DOMContentLoaded", async () => {

    const response = await fetch(
        "/authentication/"
    );

    const data = await response.json();

    if(!data.authenticated){

        window.location.href = "/api/loginpage/";

    }
});
    fileInput.click();
});

// FILE SELECT

fileInput.addEventListener("change", () => {

    if(fileInput.files.length > 0){

        fileName.innerText = fileInput.files[0].name;
        waiting.innerText = "File ready for analysis";

    }

});

const analyzeBtn = document.querySelector(".analyze-btn");

analyzeBtn.addEventListener("click", async () => {

    if(fileInput.files.length === 0){

        alert("Please upload resume");
        return;

    }

    // GET ROLE INPUT

    const roleInput = document.querySelector(".role-box input");

    let role = roleInput.value.trim();

    if(role === ""){

        role = "Software Engineer";

    }

    const formData = new FormData();

    formData.append("resume", fileInput.files[0]);
    formData.append("role", role);

    const response = await fetch("/analyze-resume/", {

        method: "POST",
        body: formData

    });

    const data = await response.json();

    // CONVERT AI RESPONSE TO JSON

    const result = JSON.parse(data.result);

    console.log(result);

    // ATS SCORE

const atsElement = document.getElementById("atsScore");

atsElement.innerText = result.ats_score + "%";

const circle = document.querySelector(".circle");

const score = result.ats_score;

let color = "#22c55e";

// COLOR CONDITIONS

if(score < 80 && score >= 60){

    color = "#f59e0b";

}
else if(score < 60){

    color = "#ef4444";

}

// DYNAMIC CIRCLE FILL

circle.style.background =
    `conic-gradient(
        ${color} ${score}%,
        #e5e7eb ${score}%
    )`;

    // SKILLS

    const skillsContainer =
        document.getElementById("skillsContainer");

    skillsContainer.innerHTML = "";

    result.skills.forEach(skill => {

        skillsContainer.innerHTML +=
            `<div class="skill">${skill}</div>`;

    });

    // MISSING KEYWORDS

    const keywordsContainer =
        document.getElementById("keywordsContainer");

    keywordsContainer.innerHTML = "";

    result.missing_keywords.forEach(keyword => {

        keywordsContainer.innerHTML +=
            `<div class="keyword">${keyword}</div>`;

    });

    // STRENGTHS

    const strengthsContainer =
        document.getElementById("strengthsContainer");

    strengthsContainer.innerHTML = "";

    result.strengths.forEach(point => {

        strengthsContainer.innerHTML +=
            `<li>${point}</li>`;

    });

    // SUGGESTIONS

    const suggestionsContainer =
        document.getElementById("suggestionsContainer");

    suggestionsContainer.innerHTML = "";

    result.suggestions.forEach(point => {

        suggestionsContainer.innerHTML +=
            `<li>${point}</li>`;

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