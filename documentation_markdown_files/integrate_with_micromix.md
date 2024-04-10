# PCA Generator

- [Home](/README.md)
- [Features](features.md)
- [Infrastructure](infrastructure.md)
- [Install for dev](install_for_dev.md)
- [Install for production](install_for_production.md)
- 🌟 **[Integrate with Micromix](integrate_with_micromix.md)**
- [How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)

## Integrate with Micromix

When integrated into Micromix, the application operates within an `<iframe>` tag. It retrieves a `config` number from the Micromix URL. The `config` number is then used to access the Micromix MongoDB. The data corresponding to the `config` number is fetched and loaded into the application for further use.

The github repo of Micromix can be found here: https://github.com/BarquistLab/Micromix

The steps for integrating PCA into Micromix:

![Static Badge](https://img.shields.io/badge/Step_1-Create_PCA.py_file_in_the_backend_"plugins"_folder_of_Micromix-blue)

In Micromix, at `Website` folder, go to `backend` folder, then go to `plugins` folder, then create a file named `PCA.py`

At here, for example, if you run your PCA at `http://localhost:3333/`, then the `upload_url` will be `http://localhost:3333/`

```python
##############################
# This is the "PCA.py" file
##############################

def main(parameters):
    # -----------------
    # The URL that Micromix needs to connect to 
    # This is the single place where the app's IP address or domain name is hard coded
    # -----------------
    upload_url = "http://localhost:3333/"

    # -----------------
    # This line of code appends the unique session ID to the url so the application can pull the correct data from MongoDB - this also aid in adding the visualisation into an iframe within the site
    # -----------------
    return upload_url+'?config='+str(parameters["db_entry_id"])
```

<p>&nbsp;</p>

![Static Badge](https://img.shields.io/badge/Step_2-Create_plugin_in_the_"plugin.json"_file-blue)

In the `Website` folder, at the `plugins.json` file, create the plugin for PCA. For example:

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
        // #############################
        // # Adding the PCA plugin
        // #############################
        {
            // The "_id" here is just an example
            "_id": "khds8fohoduskfi7syf12",
            "desc": "2D and 3D PCA",
            "image_url": "the_link_of_PCA_logo",
            // This name needs to be same with the name of the file "PCA.py"
            // So in the previous step, if you name the file as "aaaaa.py", then at here, the "name" needs to be "aaaaa"
            "name": "PCA"
        }
        // #############################
        // # End of adding the PCA plugin
        // #############################
    ]
```
