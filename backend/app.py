import generateLoadingsTable
import generatePCA
import generatePCA3D
import generateScreePlot
import generateTopFiveContributors
import getDataFromDB
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PORT = 7000


@app.route('/')
def home():
    return f"Flask server is running on port {PORT}!"


app.register_blueprint(getDataFromDB.bp)
app.register_blueprint(generateScreePlot.bp)
app.register_blueprint(generatePCA.bp)
app.register_blueprint(generatePCA3D.bp)
app.register_blueprint(generateLoadingsTable.bp)
app.register_blueprint(generateTopFiveContributors.bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
