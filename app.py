from flask import Flask, render_template, request, jsonify
from services.chatbot import get_answer
app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    message = data.get("message", "")

    reply = get_answer(message)

    return jsonify({
        "reply": reply
    })


if __name__ == "__main__":
    app.run(debug=True)