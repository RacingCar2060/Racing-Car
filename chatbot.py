print("🤖 Hola, soy tu chatRcigcar")
print("Escribe 'salir' para terminar.\n")

while True:
    user = input("Tú: ")
    if user.lower() == "salir":
        print("Chatbot: ¡Adiós, gracias por hablar conmigo! 👋")
        break
    else:
        print("Chatbot: Entendí que dijiste:", user)
