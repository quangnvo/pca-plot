# PCA Generator

- [Home](README.md)
- [Features](features.md)
- [Infrastructure](infrastructure.md)
- **[Install for dev](install_for_dev.md)**
- [Install for production](install_for_production.md)
- [Integrate with Micromix](integrate_with_micromix.md)
- [How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)

## Install for dev

![Static Badge](https://img.shields.io/badge/Step_1-Download_or_clone_the_project-blue)

Download the project at https://github.com/quangnvo/pca-plot

OR

Clone the project as following command:

```bash
git clone https://github.com/quangnvo/pca-plot.git
```

![Static Badge](https://img.shields.io/badge/Step_2-Install_and_run_backend-blue)

Firstly, open the terminal window, and ensure that Python is installed in your system by running the following command:

```bash
python3  --version
```

If python3 is not installed yet, install it by the following command:

```bash
sudo apt install python3 -y
```

Then check if there is `pip`. The `pip` is a package manager for python packages.

```bash
pip --version

OR

pip3 --version
```

Then run the following commands:

```bash
# -----------------
# Install the venv (virtual environment) module
# -----------------
sudo apt-get install python3.8-venv

# -----------------
# Go to the "backend" folder
# -----------------
cd pca-plot/backend/

# -----------------
# Create python virtual environment
# -----------------
python3 -m venv venv_whatevername

# -----------------
# Activate python virtual environment
# -----------------
source venv_whatevername/bin/activate

# -----------------
# Install all the python packages that are listed in the "requirement.txt" file
# -----------------
pip install -r requirements.txt


# -----------------
# Run the python flask server, which means run the backend
# -----------------
python3 app.py
```

After finishing, open another terminal window and do **step 3: Install and run frontend** on **a new terminal window**, without closing the terminal window of backend.

![Static Badge](https://img.shields.io/badge/Step_3-Install_and_run_frontend-blue)

The frontend requires **[nodejs](https://nodejs.org/en)** with version at least 18.17.1.

In case you don't have nodejs yet, run the following commands to install nodejs

```bash
# -----------------
# Install node
# -----------------
sudo apt install nodejs

# -----------------
# Check node version
# -----------------
node -v
```

Then, following the below commands:

```bash
# -----------------
# Go to "frontend" folder
# -----------------
cd frontend/

# -----------------
# Running "npm i" will install all packages in the "package.json" file in the folder "frontend".
# After installing, it will generate a folder called "node_modules" inside folder "frontend"
# -----------------
npm i

# -----------------
# Running "npm run dev" will run the application.
# The compiling process will start after you open the application on browser.
# Notice: Make sure to NOT CLOSE the "backend" window in Step 2, otherwise the app will not function.
# -----------------
npm run dev
```

Then you can go to http://localhost:3333/ to see the application, as the frontend is set to run on port 3333.
