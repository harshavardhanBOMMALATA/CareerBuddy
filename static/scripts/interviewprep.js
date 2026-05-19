const startBtn =
    document.querySelector(".start-btn");

const stopBtn =
    document.querySelector(".stop-btn");

const timerText =
    document.getElementById("timerText");

const transcriptBox =
    document.getElementById("transcriptBox");

const questionText =
    document.getElementById("questionText");

let interviewStopped = false;

const roleInput =
    document.getElementById("roleInput");

const difficultyInput =
    document.getElementById("difficultyInput");

const typeInput =
    document.getElementById("typeInput");

const durationInput =
    document.getElementById("durationInput");

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

const recognition =
    new SpeechRecognition();

recognition.continuous = true;

recognition.interimResults = true;

recognition.lang = "en-US";

let questionGenerating = false;

let isListening = false;

let hasSpoken = false;

let warningCount = 0;

let warningTimer;

let silenceTimer;

let countdownInterval;

let totalSeconds = 0;

let conversationHistory = "";

function speakText(message){

    const speech =
        new SpeechSynthesisUtterance(message);

    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);

}

function updateTimer(){

    let minutes =
        Math.floor(totalSeconds / 60);

    let seconds =
        totalSeconds % 60;

    timerText.innerText =
        `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}

function resetInterview(){

    interviewStopped = true;

    recognition.stop();

    window.speechSynthesis.cancel();

    isListening = false;

    hasSpoken = false;

    warningCount = 0;

    questionGenerating = false;

    if(conversationHistory.trim() !== ""){
        generateFeedback();
    }

    conversationHistory = "";

    clearInterval(warningTimer);

    clearTimeout(silenceTimer);

    clearInterval(countdownInterval);

    timerText.innerText = "00:00";

    transcriptBox.innerText =
        "Your voice response will appear here...";

    questionText.innerText =
        "Interview Ended";

    console.log("Interview Reset");

}



async function generateQuestion(){

    if(interviewStopped) return;

    const response = await fetch(
        "/start-interview/",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json",
                "X-CSRFToken":csrftoken
            },

            body:JSON.stringify({

                role:
                    roleInput.value,

                difficulty:
                    difficultyInput.value,

                history:
                    conversationHistory

            })

        }
    );

    const data =
        await response.json();

    console.log(data.question);

    questionText.innerText =
        data.question;

    conversationHistory +=
        `\nAI: ${data.question}`;

    const speech =
        new SpeechSynthesisUtterance(
            data.question
        );

    speech.lang = "en-US";

    speech.onstart = () => {

        recognition.stop();

    };

    speech.onend = () => {

        if(interviewStopped) return;

        recognition.start();

    };

    window.speechSynthesis.speak(
        speech
    );

}




startBtn.onclick = async () => {

    if(isListening) return;

    console.log(
        "Role:",
        roleInput.value
    );

    console.log(
        "Difficulty:",
        difficultyInput.value
    );

    console.log(
        "Interview Type:",
        typeInput.value
    );

    console.log(
        "Duration:",
        durationInput.value
    );

    conversationHistory = "";

    totalSeconds =
        parseInt(durationInput.value) * 60;

    updateTimer();

    countdownInterval =
    setInterval(() => {

        totalSeconds--;

        updateTimer();

        if(totalSeconds <= 0){

            console.log(
                "Interview Time Completed"
            );

            resetInterview();

        }

    },1000);

    questionText.innerText =
        "Introduce yourself";

    speakText(
        "Introduce yourself"
    );

    conversationHistory +=
        "\nAI: Introduce yourself";

    try{

        await navigator.mediaDevices.getUserMedia({
            audio:true
        });

        recognition.start();

    }

    catch(error){

        console.log(error);

    }

};

stopBtn.onclick = () => {

    resetInterview();

};




recognition.onstart = () => {
    window.addEventListener("DOMContentLoaded", async () => {

    const response = await fetch(
        "/authentication/"
    );

    const data = await response.json();

    if(!data.authenticated){

        window.location.href = "/api/loginpage/";

    }

});

    if(interviewStopped) return;

    isListening = true;

    hasSpoken = false;

    clearInterval(warningTimer);

    console.log(
        "Interview Started"
    );

    warningTimer =
    setInterval(() => {

        if(interviewStopped){

            clearInterval(warningTimer);

            return;

        }

        if(!hasSpoken){

            warningCount++;

            console.log(
                "Warning:",
                warningCount
            );

            speakText(
                "Please speak something"
            );

            if(warningCount >= 4){

                console.log(
                    "No Response Interview Ended"
                );

                resetInterview();

                clearInterval(
                    warningTimer
                );

            }

        }

    },5000);

};




recognition.onresult = (event) => {

    hasSpoken = true;

    clearTimeout(silenceTimer);

    let transcript = "";

    for(
        let i = event.resultIndex;
        i < event.results.length;
        i++
    ){

        if(event.results[i].isFinal){

            transcript +=
                event.results[i][0].transcript;

        }

    }

    if(transcript.trim() !== ""){

        console.log(transcript);

        transcriptBox.innerText =
            transcript;

        conversationHistory +=
            `\nCandidate: ${transcript}`;

        silenceTimer =
        setTimeout(async () => {

            if(questionGenerating) return;

            questionGenerating = true;

            console.log(
                "User Stopped Speaking"
            );

            recognition.stop();

            await generateQuestion();

            recognition.start();

            questionGenerating = false;

        },7000);

    }

};



recognition.onend = () => {

    isListening = false;

    clearTimeout(silenceTimer);

    console.log(
        "Recognition Ended"
    );

};

recognition.onerror = (event) => {

    console.log(
        "Recognition Error:",
        event.error
    );

};





async function generateFeedback(){

    const response = await fetch(
        "/interview-feedback/",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json",
                "X-CSRFToken":csrftoken
            },

            body:JSON.stringify({

                history:
                    conversationHistory

            })

        }
    );

    const data =
        await response.json();

    document.getElementById(
        "confidenceScore"
    ).innerText =
        data.confidence + "%";

    document.getElementById(
        "communicationScore"
    ).innerText =
        data.communication + "%";

    document.getElementById(
        "technicalScore"
    ).innerText =
        data.technical + "%";

}


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