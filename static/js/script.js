const chatBox = document.getElementById("chatBox");
const input = document.getElementById("message");

let chatHistory = [];

/* =========================
   Quick Questions
========================= */

function fillQuestion(text) {

    input.value = text;
    input.focus();

}

/* =========================
   Scroll
========================= */

function scrollBottom() {

    chatBox.scrollTop = chatBox.scrollHeight;

}

/* =========================
   User Message
========================= */

function addUserMessage(text) {

    chatBox.insertAdjacentHTML("beforeend", `
        <div class="user-message">
            <div class="message">${text}</div>
            <div class="avatar">👤</div>
        </div>
    `);

    saveMessage("user", text);

    scrollBottom();

}

/* =========================
   Bot Message
========================= */

function addBotMessage() {

    chatBox.insertAdjacentHTML("beforeend", `
        <div class="bot-message">
            <div class="avatar">🤖</div>
            <div class="message bot-text"></div>
        </div>
    `);

    scrollBottom();

    const messages = document.querySelectorAll(".bot-text");

    return messages[messages.length - 1];

}

/* =========================
   Typing Animation
========================= */

async function typeMessage(element, text, speed = 18) {

    element.innerHTML = "";

    for (let i = 0; i < text.length; i++) {

        if (text[i] === "\n") {

            element.innerHTML += "<br>";

        } else {

            element.innerHTML += text[i];

        }

        scrollBottom();

        await new Promise(resolve => setTimeout(resolve, speed));

    }

}

/* =========================
   Thinking Indicator
========================= */

function showTypingIndicator() {

    chatBox.insertAdjacentHTML("beforeend", `
        <div class="bot-message typing-row">
            <div class="avatar">🤖</div>

            <div class="message">

                <div class="typing-indicator">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        </div>
    `);

    scrollBottom();

}

function removeTypingIndicator() {

    const typing = document.querySelector(".typing-row");

    if (typing) {

        typing.remove();

    }

}

/* =========================
   Save Messages
========================= */

function saveMessage(sender, text) {

    chatHistory.push({

        sender: sender,

        text: text

    });

    localStorage.setItem(

        "scholarAI_chat",

        JSON.stringify(chatHistory)

    );

}
/* =========================
   Send Message
========================= */

async function sendMessage() {

    const text = input.value.trim();

    if (!text) return;

    addUserMessage(text);

    input.value = "";

    input.focus();

    showTypingIndicator();

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: text

            })

        });

        const data = await response.json();

        removeTypingIndicator();

        const bot = addBotMessage();

        await typeMessage(bot, data.reply);

        saveMessage("bot", data.reply);

    } catch (error) {

        removeTypingIndicator();

        const bot = addBotMessage();

        await typeMessage(bot, "Sorry, something went wrong.");

    }

}

/* =========================
   Enter Key
========================= */

input.addEventListener("keydown", function (e) {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();

    }

});

/* =========================
   Clear Chat
========================= */

function clearChat() {

    if (!confirm("Clear this chat?")) return;

    localStorage.removeItem("scholarAI_chat");

    location.reload();

}

/* =========================
   New Chat
========================= */

function newChat() {

    clearChat();

}

/* =========================
   Dark Mode
========================= */

function toggleDarkMode() {

    document.body.classList.toggle("dark");

    localStorage.setItem(

        "scholarAI_dark",

        document.body.classList.contains("dark")

    );

}

if (localStorage.getItem("scholarAI_dark") === "true") {

    document.body.classList.add("dark");

}

/* =========================
   Chat History
========================= */

function toggleHistory() {

    const panel = document.getElementById("historyPanel");

    panel.style.display =
        panel.style.display === "block"
            ? "none"
            : "block";

}

function loadHistory() {

    const saved = localStorage.getItem("scholarAI_chat");

    if (!saved) return;

    chatHistory = JSON.parse(saved);

    const list = document.getElementById("historyList");

    list.innerHTML = "";

    chatHistory.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item.sender.toUpperCase() + ": " + item.text.substring(0, 40);

        list.appendChild(li);

    });

}

loadHistory();

/* =========================
   About
========================= */

function showAbout() {

    document.getElementById("aboutModal").style.display = "flex";

}

function closeAbout() {

    document.getElementById("aboutModal").style.display = "none";

}

window.onclick = function(event){

    const modal = document.getElementById("aboutModal");

    if(event.target === modal){

        modal.style.display = "none";

    }

};