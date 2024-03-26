
# PCA Generator

Welcome to the PCA Plot Generator 👋!

This application is designed to simplify the process of generating Principal Component Analysis (PCA) plots, scree plot, and loadings table.

[Infrastructure](infrastructure.md##infrastructure)


- [Description](#description)
- [Features](#features)
- [Infrastructure](#infrastructure)
- [Installation](#installation)


## Description

This application is designed to function both as a standalone tool and as a plugin within the Micromix (http://micromix.helmholtz-hiri.de/). Detailed instructions for installation and independent operation can be found in the section below.

When integrated into Micromix, the application operates within an `<iframe>` tag. It retrieves a `config` number from the Micromix URL, which it then uses to access the Micromix MongoDB. The data corresponding to the `config` number is fetched and loaded into the application for further use.


## Features

- **PCA Plot Generation in 2D and 3D**: Visualize the 2D or 3D of PCA plot.
- **Scree Plot Generation**: Determine the number of principal components to retain in your analysis. This plot displays the proportion of total variance in the data for each principal component.
- **Loadings Table Generation**: To see which variables contribute how much to each principal component with loadings table.
- **Top 5 Contributors**: Identify the top 5 contributors to each principal component. 


## Infrastructure

- **Frontend:** Next.js - a React framework
- **Backend:** Flask - a Python framework

The structure of the folders is as following:
```bash
pca-plot
├── backend 
│   ├── app.py ⭐ 
│   ├── generatePCA.py ⭐
│   ├── generatePCA3D.py ⭐
│   ├── generateScreePlot.py ⭐
│   ├── generateLoadingsTable.py ⭐
│   ├── generateTopFiveContributors.py ⭐
│   └── getDataFromDB.py ⭐
│     
├── database
│   ├── test_data_1.csv
│   ├── test_data_2.csv
│   └── test_data_3.csv
│   
└── frontend
    ├── app
    │   ├── page.js ⭐
    │   ├── layout.js
    │   ├── globals.css
    │   └── favicon.ico
    ├── components
    │   ├── button.jsx
    │   ├── card.jsx
    │   ├── checkbox.jsx
    │   └── input.jsx
    ├── lib
    │   └── utils.js
    ├── public
    │   ├── next.svg
    │   ├── vercel.svg
    │   ├── tour-loadings-table.png 
    │   ├── tour-pca-2d.png 
    │   ├── tour-scree-plot.png 
    │   └── tour-top-5-contributor-table.png 
    ├── tailwind.config.js
    ├── package.json
    └── etc.
```

Files that are marked with the star (⭐) are the important files.

- For **backend** folder, the **app.py** file is the main file, it is the backbone of backend. 
- For **frontend** folder, the **page.js** file is the main file.
- For **database** folder, it just contains some sample csv files for testing. 
## Installation

![Static Badge](https://img.shields.io/badge/Step_1-Download_or_clone_the_project-blue)

Download the project at https://github.com/quangnvo/pca-plot

OR

Clone the project as following command:  

``` bash
git clone https://github.com/quangnvo/pca-plot.git
```

![Static Badge](https://img.shields.io/badge/Step_2-Install_frontend-blue)

The frontend require **node** with version at least 18.17.1.

So after downloading or cloning the project, check your node version.

For ubuntu user, the following commands are used to install node (in the case that you don't have node yet):

```bash
sudo apt update
sudo apt install nodejs
node -v
```
Then, go to the folder **frontend**

→ run `npm i` to install all the libraries

→ then `npm run dev` to run the application

→ then you can go to http://localhost:3333/ to see the application, as the frontend is set to run on port 3333.  

``` bash
cd frontend/
npm i
npm run dev
```




![Static Badge](https://img.shields.io/badge/Step_3-Install_backend-blue)

Firstly, ensure that Python is installed in your system. To check that, run the following command: 

``` bash
python3  --version
```

If python3 is not installed yet, install it by the following commands:

```bash
sudo apt update
sudo apt install python3 -y
```

Then check the `pip` 
``` bash
pip --version

OR

pip3 --version
```

Then run `sudo apt-get install python3.8-venv` to allow virtual env

→ go to backend folder: `cd pca-plot/backend/`

→ create python virtual environment: `python3 -m venv venv`

→ enter the environment: `source venv/bin/activate`

→ install the required python libraries: `pip install -r requirements.txt`

→ launch flask server: `python3 app.py`

```bash
sudo apt-get install python3.8-venv

cd pca-plot/backend/

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

python3 app.py
```