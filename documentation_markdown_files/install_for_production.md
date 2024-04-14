# PCA Generator

- [Home](/README.md)
- [Features](features.md)
- [Infrastructure](infrastructure.md)
- [Install for dev](install_for_dev.md)
- 🌟 **[Install for production](install_for_production.md)**
- [Integration with Micromix](integrate_with_micromix.md)
- [How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)

## Install for production

### 1. General information

This production code section is intended to be used to integrate with [Micromix](http://micromix.helmholtz-hiri.de/), an existing web-based platform designed for visualizing bacterial functional genomic data.

### 2. Steps to install for production

![Static Badge](https://img.shields.io/badge/Step_1-Download_or_clone_the_project-blue)

Download the project at https://github.com/quangnvo/pca-plot

OR

Clone the project as following command:

```bash
git clone https://github.com/quangnvo/pca-plot.git
```

<p>&nbsp;</p>

![Static Badge](https://img.shields.io/badge/Step_2-Frontend_build-blue)

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
# Generate a folder that contains the HTML/CSS/JS files
# The generated folder is the folder named "out"
# -----------------
npm run build

```
After running `npm run build`, the generated index.html, css and javascript files can be deployed on any web server that can serve HTML/CSS/JS static assets. 

If you use **Nginx**, refer to this link to see the configuration: 
https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#deploying 

<p>&nbsp;</p>

❗❗❗ ----- Notice -----  ❗❗❗
The steps need completing: 
- Linking up IP address to Micromix
- Adding the app’s IP address to MongoDB within Micromix so requests can be sent and received
- The Nginx and Gunicorn config - Regan will populate
❗❗❗ ----- End of Notice -----  ❗❗❗

