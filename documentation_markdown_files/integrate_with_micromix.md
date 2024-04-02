# PCA Generator

- [Home](/README.md)
- [Features](features.md)
- [Infrastructure](infrastructure.md)
- [Install for dev](install_for_dev.md)
- [Install for production](install_for_production.md)
- **[Integrate with Micromix](integrate_with_micromix.md)**
- [How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)

## Integrate with Micromix

The github repo of Micromix can be found here: https://github.com/BarquistLab/Micromix

The steps for integrating PCA into Micromix:

1. In Micromix , at `Website` folder, go to `backend` folder, then go to `plugins` folder, then create a file named `PCA.py`

2. In the `Website` folder, at the `plugins.json` file, create the plugin for PCA. For example:

```jsonc
{
    "plugins": [
        {
            "_id": "5f984ac1b478a2c8653ed827",
            "desc": "Clustered heatmap by the Ma'ayan Laboratory",
            "image_url": "https://raw.githubusercontent.com/BarquistLab/Micromix/main/Website/backend/plugins/clustergrammer.svg",
            "name": "Clustergrammer"
        },
        {
            "_id": "khds8fohoduskfi7syf99",
            "desc": "2D and 3D heatmap",
            "image_url": "https://raw.githubusercontent.com/BarquistLab/Micromix/main/Website/backend/plugins/heatmap_hiri_logo.svg",
            "name": "Heatmap"
        },
        {
            // The "_id" here is just an example
            "_id": "khds8fohoduskfi7syf12",
            "desc": "2D and 3D PCA",
            "image_url": "the_link_of_PCA_logo",
            // This name needs to be same with the name of the file "PCA.py"
            // So in the previous step, if you name the file as "aaaaa.py", then at here, the "name" needs to be "aaaaa"
            "name": "PCA"
        }
    ]
```
