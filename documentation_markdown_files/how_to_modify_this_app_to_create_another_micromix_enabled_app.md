# PCA Generator

- [Home](/README.md)
- [Features](features.md)
- [Infrastructure](infrastructure.md)
- [Install for dev](install_for_dev.md)
- [Install for production](install_for_production.md)
- [Integrate with Micromix](integrate_with_micromix.md)
- 🌟 **[How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)**

## How to modify this app to create another Micromix enabled app

The PCA is built based on the [React Plotly.js](https://plotly.com/javascript/react/)

Basically, the plot will change when we change the `data` and `layout` in the `<Plot />` component. So you can modify the `data` and the `layout` to make different plots such as bar chart, line chart, scatter plot, etc.

More information about `data` and `layout` can be found here:
- General information: https://github.com/plotly/react-plotly.js?tab=readme-ov-file
- `data`: https://plotly.com/javascript/reference/
- `layout`: https://plotly.com/javascript/reference/#layout

