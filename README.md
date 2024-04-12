# PCA Generator

- 🌟 **[Home](/README.md)**
- [Features](/documentation_markdown_files/features.md)
- [Infrastructure](/documentation_markdown_files/infrastructure.md)
- [Install for dev](/documentation_markdown_files/install_for_dev.md)
- [Install for production](/documentation_markdown_files/install_for_production.md)
- [Integrate with Micromix](/documentation_markdown_files/integrate_with_micromix.md)
- [How to modify this app to create another Micromix enabled app](/documentation_markdown_files/how_to_modify_this_app_to_create_another_micromix_enabled_app.md)

## Home

Welcome to the PCA Plot Generator 👋!

This application is designed to simplify the process of generating Principal Component Analysis (PCA) plots, scree plot, and loadings table.

The application can be used as:

- **a standalone tool**

  OR

- **a plugin in Micromix** (http://micromix.helmholtz-hiri.de/).

Detailed instructions for installation and independent operation can be found in the section below.

When integrated into Micromix, the application operates within an `<iframe>` tag. It retrieves a `config` number from the Micromix URL. The `config` number is then used to access the Micromix MongoDB. The data corresponding to the `config` number is fetched and loaded into the application for further use.

<p>&nbsp;</p>

![Static Badge](https://img.shields.io/badge/Used_as-Standalone_tool-blue)


[![used_as_a_standalone_tool](/documentation_images/Used_as-Standalone_tool-blue.svg)](#)

[![used_as_a_standalone_tool](/documentation_images/Used_as-Standalone_tool-blue.svg)](#) {style="cursor: default;"}

<span style="cursor: default;">[![used_as_a_standalone_tool](/documentation_images/Used_as-Standalone_tool-blue.svg)](#)</span>

<a href="#" class="unclickable-image">![used_as_a_standalone_tool](/documentation_images/Used_as-Standalone_tool-blue.svg)</a>


<a href="#"><img alt="used_as_a_standalone_tool" src="/documentation_images/Used_as-Standalone_tool-blue.svg" style="pointer-events: none; cursor: default;"></a>


![standalone_tool](/documentation_images/flow__serve_as_standalone_tool.png)

<p>&nbsp;</p>

![Static Badge](https://img.shields.io/badge/Used_as-Plugin_in_Micromix-blue)


![plugin_in_micromix](/documentation_images/flow__serve_as_plugin_in_micromix.png)

