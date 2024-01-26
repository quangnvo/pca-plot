import generatePCA
import generateSampleData
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

PORT = 8080


@app.route('/')
def home():
    return f"Flask server is running on port {PORT}!"


app.register_blueprint(generateSampleData.bp)
app.register_blueprint(generatePCA.bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
