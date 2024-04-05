from flask import Flask, request

app = Flask(__name__)

@app.route("/hello")
def hello_world():
    name = request.args.get('name', 'UNKNOWN')
    print("Request for hello from " + name)
    return f"<p>Hello, {name}!</p>"
