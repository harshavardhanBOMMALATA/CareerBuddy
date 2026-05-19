document
.querySelector(".generate-btn")
.onclick = () => {
    window.addEventListener("DOMContentLoaded", async () => {

    const response = await fetch(
        "/authentication/"
    );

    const data = await response.json();

    if(!data.authenticated){

        window.location.href = "/api/loginpage/";

    }

});

const oldResume =
document.querySelector(".resume-wrapper");

if(oldResume){

oldResume.remove();

}

function isFilled(value){

return value &&
value.trim() !== "";

}

/* PERSONAL */

const personalInputs =
document.querySelectorAll(
'.form-card:first-child input'
);

const name =
personalInputs[0].value;

const email =
personalInputs[1].value;

const phone =
personalInputs[2].value;

const linkedin =
personalInputs[3].value;

const github =
personalInputs[4].value;

/* SKILLS */

const skills =
document
.querySelectorAll("textarea")[0]
.value
.split(",");

/* LANGUAGES */

const languages =
document
.querySelectorAll("textarea")[1]
.value
.split(",");

/* EDUCATION */

let educationHTML = "";

document
.querySelectorAll(
"#educationContainer .sub-card"
)
.forEach(card => {

const inputs =
card.querySelectorAll("input");

if(
!isFilled(inputs[2].value)
){
return;
}

educationHTML += `

<div class="resume-item">

<div>

<h4>
${inputs[2].value}
</h4>

<p>
${inputs[3].value}
</p>

<p>
CGPA:
${inputs[4].value}
</p>

</div>

<span>
${inputs[0].value}
-
${inputs[1].value}
</span>

</div>

`;

});

/* PROJECTS */

let projectHTML = "";

document
.querySelectorAll(
"#projectContainer .sub-card"
)
.forEach(card => {

const inputs =
card.querySelectorAll("input");

const about =
card.querySelector("textarea");

if(
!isFilled(inputs[0].value)
){
return;
}

projectHTML += `

<div class="resume-item">

<div>

<h4>
${inputs[0].value}
</h4>

<p>
${about.value}
</p>

<p>
${inputs[3].value}
</p>

</div>

<span>
${inputs[1].value}
</span>

</div>

`;

});

/* EXPERIENCE */

let experienceHTML = "";

document
.querySelectorAll(
"#experienceContainer .sub-card"
)
.forEach(card => {

const inputs =
card.querySelectorAll("input");

const about =
card.querySelector("textarea");

if(
!isFilled(inputs[0].value)
){
return;
}

experienceHTML += `

<div class="resume-item">

<div>

<h4>
${inputs[0].value}
</h4>

<p>
${inputs[1].value}
</p>

<p>
${about.value}
</p>

</div>

<span>
${inputs[2].value}
-
${inputs[3].value}
</span>

</div>

`;

});

/* CERTIFICATIONS */

let certificationHTML = "";

document
.querySelectorAll(
"#certificationContainer .sub-card"
)
.forEach(card => {

const inputs =
card.querySelectorAll("input");

if(
!isFilled(inputs[0].value)
){
return;
}

certificationHTML += `

<div class="resume-item">

<div>

<h4>
${inputs[0].value}
</h4>

<p>
${inputs[1].value}
</p>

</div>

<span>
${inputs[2].value}
-
${inputs[3].value}
</span>

</div>

`;

});

/* ACHIEVEMENTS */

let achievementHTML = "";

document
.querySelectorAll(
"#achievementContainer .sub-card"
)
.forEach(card => {

const value =
card.querySelector("input").value;

if(
!isFilled(value)
){
return;
}

achievementHTML += `

<li>
${value}
</li>

`;

});

/* FINAL TEMPLATE */

document.body.insertAdjacentHTML(

"beforeend",

`

<div class="resume-wrapper">

<style>

.resume-wrapper{
    width:850px;
    margin:40px auto;
}

.resume-download{
    width:100%;
    padding:16px;
    border:none;
    border-radius:12px;
    background:#4f46e5;
    color:white;
    font-size:18px;
    cursor:pointer;
    margin-bottom:20px;
}

.resume-preview{
    width:100%;
    min-height:1120px;
    background:white;
    display:grid;
    grid-template-columns:260px 1fr;
    box-shadow:0 10px 40px rgba(0,0,0,0.1);
}

.resume-left{
    background:#f8fafc;
    padding:35px 25px;
    border-right:1px solid #e2e8f0;
}

.resume-right{
    padding:35px;
}

.resume-name{
    font-size:42px;
    font-weight:700;
    color:#0f172a;
    margin-bottom:5px;
}

.resume-role{
    color:#64748b;
    font-size:18px;
    margin-bottom:30px;
}

.resume-section{
    margin-bottom:28px;
}

.resume-section h3{
    font-size:18px;
    color:#0f172a;
    border-bottom:2px solid #cbd5e1;
    padding-bottom:8px;
    margin-bottom:15px;
    letter-spacing:1px;
}

.resume-section p,
.resume-section li,
.resume-section span,
.resume-section a{
    font-size:13px;
    color:#334155;
    line-height:1.7;
    text-decoration:none;
}

.resume-item{
    display:flex;
    justify-content:space-between;
    gap:20px;
    margin-bottom:18px;
}

.resume-item h4{
    font-size:15px;
    color:#111827;
    margin-bottom:4px;
}

.resume-skill{
    margin-bottom:8px;
}

@media print{

body *{
    visibility:hidden;
}

.resume-wrapper,
.resume-wrapper *{
    visibility:visible;
}

.resume-wrapper{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    margin:0;
}

.resume-download{
    display:none;
}

.resume-preview{
    box-shadow:none;
}

}

</style>

<button class="resume-download">

Download PDF

</button>

<div class="resume-preview">

<div class="resume-left">

${isFilled(phone) ||
isFilled(email)

? `

<div class="resume-section">

<h3>
CONTACT
</h3>

${isFilled(phone)
? `<p>${phone}</p>`
: ""}

${isFilled(email)
? `<p>${email}</p>`
: ""}

${isFilled(linkedin)
? `<p>${linkedin}</p>`
: ""}

${isFilled(github)
? `<p>${github}</p>`
: ""}

</div>

`

: ""}

${skills.length > 0

? `

<div class="resume-section">

<h3>
SKILLS
</h3>

${skills.map(skill => `

<div class="resume-skill">
• ${skill}
</div>

`).join("")}

</div>

`

: ""}

${languages.length > 0

? `

<div class="resume-section">

<h3>
LANGUAGES
</h3>

${languages.map(language => `

<div class="resume-skill">
• ${language}
</div>

`).join("")}

</div>

`

: ""}

</div>

<div class="resume-right">

<div class="resume-name">
${name}
</div>

<div class="resume-role">
Software Engineer
</div>

${experienceHTML

? `

<div class="resume-section">

<h3>
EXPERIENCE
</h3>

${experienceHTML}

</div>

`

: ""}

${projectHTML

? `

<div class="resume-section">

<h3>
PROJECTS
</h3>

${projectHTML}

</div>

`

: ""}

${educationHTML

? `

<div class="resume-section">

<h3>
EDUCATION
</h3>

${educationHTML}

</div>

`

: ""}

${certificationHTML

? `

<div class="resume-section">

<h3>
CERTIFICATIONS
</h3>

${certificationHTML}

</div>

`

: ""}

${achievementHTML

? `

<div class="resume-section">

<h3>
ACHIEVEMENTS
</h3>

<ul>

${achievementHTML}

</ul>

</div>

`

: ""}

</div>

</div>

</div>

`

);

/* DOWNLOAD */

document
.querySelector(".resume-download")
.onclick = () => {

window.print();

};

};










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