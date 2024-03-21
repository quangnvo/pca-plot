
# PCA Generator

Welcome to the PCA Plot Generator 👋!

This application is designed to simplify the process of generating Principal Component Analysis (PCA) plots, scree plots, and loadings tables.

## Features

- **PCA Plot Generation in 2D and 3D**: Visualize the 2D or 3D of PCA plot.
- **Scree Plot Generation**: Determine the number of principal components to retain in your analysis. This plot displays the proportion of total variance in the data for each principal component.
- **Loadings Table Generation**: To see which variables contribute how much to each principal component with loadings table.
- **Top 5 Contributors**: Identify the top 5 contributors to each principal component. 


## Infrastructure

- **Frontend:** Next.js
- **Backend:** Flask 

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
    │   ├── tour-loadings-table.png ⭐
    │   ├── tour-pca-2d.png ⭐
    │   ├── tour-scree-plot.png ⭐
    │   └── tour-top-5-contributor-table.png ⭐
    ├── tailwind.config.js
    ├── package.json
    └── etc.
```

Files that are marked with the star (⭐) are the important files.

- For **backend** folder, the **app.py** file is the main file, it is the backbone of backend. 
- For **frontend** folder, the **page.js** file is the main file.
- For **database** folder, it just contains the sample csv files for testing. 
## Installation

**1. Download or clone the project**

Download the project at https://github.com/quangnvo/pca-plot

OR

Clone the project as following command:  

``` bash
  git clone https://github.com/quangnvo/pca-plot.git
```

**2. Install frontend**

The frontend require **node** with version at least 18.17.1.

So after downloading or cloning the project, check your node version.

For ubuntu user, the following commands are used to install node (in the case that you don't have node yet):

```bash
sudo apt update
sudo apt install nodejs
node -v
```
Then, go to the folder **frontend**, run `npm i` to install all the libraries, then `npm run dev` to run the application. Then you can go to http://localhost:3333/ to see the application, as the frontend is set to run on port 3333.  

``` bash
  cd frontend/
  npm i
  npm run dev
```




**3. Install backend**
## API Reference 
The API Reference is for backend Flask. 

#### 1. Generate PCA 2D plot data


```http
/api/generate_pca
```

Method|        Return type     | Description   |
:-----|  :------- | :------------------------- |
POST  |  `object` | aaaa|



#### 2. Generate PCA 3D plot data


```http
/api/generate_pca_3d
```

Method|        Return type     | Description   |
:-----|  :------- | :------------------------- |
POST  |  `object` | bbbbb |