# PCA Generator

- [Home](/README.md)
- [Features](features.md)
- 🌟 **[Infrastructure](infrastructure.md)**
- [Install for dev](install_for_dev.md)
- [Install for production](install_for_production.md)
- [Integration with Micromix](integrate_with_micromix.md)
- [How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)

## Infrastructure

The structure of the folders is as following:

```bash
pca-plot
├── documentation_images
│
├── documentation_markdown_files
│
├── backend
│   ├── app.py ⭐
│   ├── generatePCA.py ⭐
│   ├── generatePCA3D.py ⭐
│   ├── generateScreePlot.py ⭐
│   ├── generateLoadingsTable.py ⭐
│   ├── generateTopFiveContributors.py ⭐
│   └── getDataFromDB.py ⭐
│
├── database_for_testing
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
    │   ├── tour-top-5-contributor-table.png
    │   └── tour-top-5-contributor-plot.png
    ├── tailwind.config.js
    ├── package.json
    └── etc.
```

Files that are marked with the star (⭐) are files that contain code for the application.

- For **backend** folder, the **app.py** file is the main file.
- For **frontend** folder, the **page.js** file is the main file.

In a typical web application, in order to run the application, both the frontend and backend need to be running and communicating with each other for the application to function properly.

- **Frontend**: This is the part of the application that users interact with directly. The frontend sends requests to the backend and displays the data it receives from backend. In this PCA application, it is built with [NextJS](https://nextjs.org/), a React framework. 

- **Backend**: This is the part of the application that runs on the server. It’s responsible for processing requests from the frontend, interacting with databases, and performing any necessary computations. The backend sends responses back to the frontend. In this In this PCA application, the backend is build with [Flask](https://flask.palletsprojects.com/en/3.0.x/), a Python framework.

Notice: if running with Micromix, [MongoDB](https://www.mongodb.com/) needs to be installed, as the data is accessed from there.