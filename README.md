# PCA Generator

Welcome to the PCA Plot Generator 👋!

This application is designed to simplify the process of generating Principal Component Analysis (PCA) plots, scree plot, and loadings table.

The application can be used as:
- **a standalone tool** 

    OR 

- **a plugin in Micromix** (http://micromix.helmholtz-hiri.de/). 

Detailed instructions for installation and independent operation can be found in the section below.

When integrated into Micromix, the application operates within an `<iframe>` tag. It retrieves a `config` number from the Micromix URL. The `config` number is then used to access the Micromix MongoDB. The data corresponding to the `config` number is fetched and loaded into the application for further use.

## Contents

- [Features](features.md)
- [Infrastructure](infrastructure.md)
- [Install for dev](install_for_dev.md)
- [Install for production](install_for_production.md)
- [Integrate with Micromix](integrate_with_micromix.md)
- [How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)
