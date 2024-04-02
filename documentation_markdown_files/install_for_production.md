# PCA Generator

- [Home](/README.md)
- [Features](features.md)
- [Infrastructure](infrastructure.md)
- [Install for dev](install_for_dev.md)
- **[Install for production](install_for_production.md)**
- [Integrate with Micromix](integrate_with_micromix.md)
- [How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)

## Install for production

![Static Badge](https://img.shields.io/badge/Frontend-blue)

Run the following commands:

```bash
# -----------------
# Go to "frontend" folder
# -----------------
cd frontend/

# -----------------
# Generate a folder that contains the HTML/CSS/JS files
# The generated folder is "out" folder
# -----------------
npm run build

```
After running `npm run build`, the generated index.html, css and javascript files can be deployed on any web server that can serve HTML/CSS/JS static assets. 

If you use **Nginx**, refer to this link to see the configuration: 
https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#deploying 
