from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # 👈 importar CORS

app = Flask(__name__)
CORS(app)  # 👈 habilitar CORS para todas las rutas

# Respuestas predefinidas
RESPUESTAS = {
    "hola": "¡Hola! Soy tu asistente virtual, ¿en qué puedo ayudarte?",
    "productos": "Tenemos filtros, cobertores, luces LED, faros, balatas, cámaras LED, manijas, trabagas, bujías y autorradios.",
    "sistema": "Este sistema te permite consultar productos, ver inventario y mucho más.",
    "gracias": "¡De nada! Estoy para ayudarte.",
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "").lower()
    response = RESPUESTAS.get(user_message, "Lo siento, no entendí tu pregunta. ¿Puedes repetirla?")
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
