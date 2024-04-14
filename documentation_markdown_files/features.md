# PCA Generator

- [Home](/README.md)
- 🌟 **[Features](features.md)**
- [Infrastructure](infrastructure.md)
- [Install for dev](install_for_dev.md)
- [Install for production](install_for_production.md)
- [Integrate with Micromix](integrate_with_micromix.md)
- [How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)

## Features

### 1. Tool bar

![tool_bar](/documentation_images/md__tool_bar.png)

- `Begin a tour`: This button will start a brief walkthrough, guiding you through the functionalities of each button.
- `Upload file`: Use this to upload your file.
- `Scree plot`: A scree plot in PCA is a chart that shows the eigenvalues (variances) of each principal component in descending order. It helps identify the optimal number of principal components by locating the point where the decrease in eigenvalues becomes less significant, often called the “elbow” point.
- `PCA plot`: PCA is a statistical technique used in data analysis for reducing the dimensionality of large datasets. The way PCA does this is by transforming the original variables into a new set of variables, which are called the Principal Components (PC). These PC are ordered so that the first few retain most of the variability in all of the original variables.
- `Loadings table`: In PCA, a loadings table shows the contribution of each original variable to each principal component. The larger the absolute value (positive or negative) of a loading, the stronger the influence of the corresponding variable on the respective component.
- `Top 5 contributors`: The top-5-contributors typically lists the five variables that contribute the most to each principal component. The contribution of a variable is determined by its loading, with larger absolute values indicating stronger contributions.
- `Clear`: Clear all the plots and tables.

<p>&nbsp;</p>

### 2. Examples

![Static Badge](https://img.shields.io/badge/Feature-Scree_Plot_Generation-blue)

Determine the number of principal components to retain in your analysis. This plot displays the proportion of total variance in the data for each principal component.

![scree_plot](/documentation_images/md__scree_plot.png)

<p>&nbsp;</p>

![Static Badge](https://img.shields.io/badge/Feature-PCA_Plot_Generation_in_2D_and_3D-blue)

Visualize the 2D or 3D of PCA plot.

![pca_2d](/documentation_images/md__pca_plot_2d.png)
![pca_3d](/documentation_images/md__pca_plot_3d.png)

<p>&nbsp;</p>

![Static Badge](https://img.shields.io/badge/Feature-Loadings_Table_Generation-blue)

To see which variables contribute how much to each principal component with loadings table.

![loadings_table](/documentation_images/md__loadings_table.png)

<p>&nbsp;</p>

![Static Badge](https://img.shields.io/badge/Feature-Top_5_Contributors-blue)

Identify the top 5 contributors to each principal component.

![top_5_contributors_table](/documentation_images/md__top_5_contributors_table.png)

![top_5_contributors_plot](/documentation_images/md__top_5_contributors_plot.png)

![top_5_contributors_plot_zoom](/documentation_images/md__top_5_contributors_plot_zoom_view.png)
