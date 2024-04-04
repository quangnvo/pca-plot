# PCA Generator

- [Home](/README.md)
- [Features](features.md)
- [Infrastructure](infrastructure.md)
- [Install for dev](install_for_dev.md)
- [Install for production](install_for_production.md)
- [Integrate with Micromix](integrate_with_micromix.md)
- 🌟 **[How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)**

## How to modify this app to create another Micromix enabled app

![Static Badge](https://img.shields.io/badge/Point_1-Background-blue)

The PCA plot is built based on the [React Plotly.js](https://plotly.com/javascript/react/)

In detail, in frontend, the <Plot> component of React Plotly.js is used to rendered the plot. Basically, the <Plot> component has the following format:

```javascript
<Plot
    data={...}
    layout={...}
/>
```

So the <Plot> component has 2 main properties, which are `data` and `layout`.
In this PCA Generator app, the `{...}` things in the `data` and `layout` are the things that we calculate and generate from backend, then push to frontend and use at frontend.

![Static Badge](https://img.shields.io/badge/Point_2-Examples_of_using_<Plot>_component-blue)

```javascript
 <Plot
    {/* ########################## */}
    {/* ####      "data"      #### */}
    {/* ########################## */}
    data={[
        {
            type: 'bar',
            x: ["Bar_1", "Bar_2"],
            y: [11, 25],
            marker: {
              color: "orange",
              line: {
                color: "black",
                width: 2,
              },
            },
        },
    ]},
    {/* ########################## */}
    {/* ####     "layout"     #### */}
    {/* ########################## */}
    layout={{
        width: 700,
        height: 900,
        title: {
            text: 'Bar chart',
            font: {
                size: 30,
                color: 'black',
            },
        }
    }}
/>
```

![bar_chart](/documentation_images/md__how_to_modify_app__1.png)

![Static Badge](https://img.shields.io/badge/Point_3-How_to_modify_this_app-blue)
The plot will change when we change the `data` and `layout` in the `<Plot />` component. So you can modify the `data` and the `layout` to make different plots such as bar chart, line chart, scatter plot, etc.

![Static Badge](https://img.shields.io/badge/Point_4-Reference-blue)

More information about `data` and `layout` can be found here:
- General information: https://github.com/plotly/react-plotly.js?tab=readme-ov-file
- `data`: https://plotly.com/javascript/reference/
- `layout`: https://plotly.com/javascript/reference/#layout

````
