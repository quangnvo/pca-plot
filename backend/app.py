# --------------------------------
#
# 🚀 Created by Quang, 2024
# ✉️ For any inquiries, suggestions, or discussions related to this work, feel free to contact me at: voquang.usth@gmail.com
#
# --------------------------------


#########################
#
# ⭐⭐⭐
# This "app.py" file is the main file that runs the backend Flask server
# It is responsible as a backbone to connect the API endpoints from other files in the folder "backend"
# After read this file, for easier to have an overview look, you can read the file "generatePCA.py" first, then read other files in the folder "backend" later
# ⭐⭐⭐
#
#########################

# Import the API endpoints from other files in the folder "backend"
import generateLoadingsTable
import generatePCA
import generatePCA3D
import generateScreePlot
import generateTopFiveContributors
import getDataFromDB

# Import the Flask and CORS libraries
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# The port number is set to 7000
# It could be changed to any other port number
# ==> if change the port number at here, see the frontend code to make sure the port number is matched. The frontend code is located at "frontend/page.js"
# ==> in the file "page.js" in "frontend" folder, the variable for the backend port is named "BACKEND_PORT"
PORT = 7000


@app.route('/')
def home():
    return f"Flask server is running on port {PORT}!"

# The "register_blueprint()" function is used to connect the API endpoints from other files in the folder "backend"
# So instead of writing everything in this "app.py" file, we separate the code into different files and then put them here
app.register_blueprint(getDataFromDB.bp)
app.register_blueprint(generateScreePlot.bp)
app.register_blueprint(generatePCA.bp)
app.register_blueprint(generatePCA3D.bp)
app.register_blueprint(generateLoadingsTable.bp)
app.register_blueprint(generateTopFiveContributors.bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
