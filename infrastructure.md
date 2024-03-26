# PCA Generator

- [Features](features.md)
- [Infrastructure](infrastructure.md##infrastructure)
- [Install for dev](install_for_dev.md)
- [Install for production](install_for_production.md)
- [Integrate with Micromix](integrate_with_micromix.md)
- [How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)

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
    │   ├── tour-top-5-contributor-table.png
    │   └── tour-top-5-contributor-plot.png
    ├── tailwind.config.js
    ├── package.json
    └── etc.
```

Files that are marked with the star (⭐) are the important files.

- For **backend** folder, the **app.py** file is the main file, it is the backbone of backend.
- For **frontend** folder, the **page.js** file is the main file.
- For **database** folder, it just contains some sample csv files for testing.
