# --------------------------------
#
# 🚀 Created by Quang, 2024
# ✉️ For any inquiries, suggestions, or discussions related to this work, feel free to reach out to me at: voquang.usth@gmail.com
#
# --------------------------------

#########################
# This "app.py" file is the main file that runs the Flask server
# It is responsible registering the blueprints to connect the API endpoints from other files
#########################

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

# The port number is set to 7000
# It could be changed to any other port number
# ==> if change the port number at here, see the frontend code to make sure the port number is matched. The frontend code is located at "frontend/page.js"
# ==> in te file "page.js", the variable for the backend port is "BACKEND_PORT"
PORT = 7000


@app.route('/')
def home():
    return f"Flask server is running on port {PORT}!"

# The blueprints are registered here. The term is "register", but it's just simply the connection between the API endpoints and the Flask server
# The blueprints are the API endpoints. So instead of writing all the code in this "app.py" file, we separate the code into different files and then register them here
app.register_blueprint(getDataFromDB.bp)
app.register_blueprint(generateScreePlot.bp)
app.register_blueprint(generatePCA.bp)
app.register_blueprint(generatePCA3D.bp)
app.register_blueprint(generateLoadingsTable.bp)
app.register_blueprint(generateTopFiveContributors.bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
