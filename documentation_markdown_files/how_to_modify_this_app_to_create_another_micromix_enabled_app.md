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

The PCA plot is built based on the **[React Plotly.js](https://plotly.com/javascript/react/)**. In detail, the `<Plot/>` component of React Plotly.js is used to rendered the plot in frontend. 

Basically, the `<Plot/>` component has the following format:

```javascript
<Plot
    data={...}
    layout={...}
/>
```

So the `<Plot/>` component has 2 main properties, which are:
- **`data`** 

AND 

- **`layout`**

In our PCA Generator app, the `{...}` things in the `data` and `layout` are the things that we calculate and generate from backend, then frontend will get them and use them in the `<Plot/>` component.

<p>&nbsp;</p>

![Static Badge](https://img.shields.io/badge/Point_2-Examples_of_using_<Plot>_component-blue)

The following `<Plot/>` will generate a **bar chart**

```javascript
<Plot
    {/* ########################## */}
    {/* ####      "data"      #### */}
    {/* ########################## */}
    data={[
        {
            type: 'bar',
            x: ["Bar_1", "Bar_2", "Bar_3", "Bar_4", "Bar_5"],
            y: [6, 12, 7, 9, 5],
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
        width: 400,
        height: 600,
        title: {
            text: 'Bar chart',
            font: {
                size: 24,
                color: 'black',
            },
        }
    }}
/>
```

<img alt="bar_chart" src="/documentation_images/md__how_to_modify_app__1.png" width="50%" height="50%">


The following `<Plot/>` will generate a **line chart**

```javascript
<Plot
    {/* ########################## */}
    {/* ####      "data"      #### */}
    {/* ########################## */}
    data={[
        {
            type: 'scatter',
            mode: 'lines',
            x: ["Point_1", "Point_2", "Point_3", "Point_4", "Point_5", "Point_6", "Point_7", "Point_8", "Point_9", "Point_10"],
            y: [1, 3, 5, 6, 5, 5, 9, 10, 11, 11],
            marker: {
              color: "blue",
            },
          },
    ]},
    {/* ########################## */}
    {/* ####     "layout"     #### */}
    {/* ########################## */}
    layout={{
        width: 1000,
        height: 600,
        title: {
            text: 'Line chart',
            font: {
                size: 24,
                color: 'black',
            },
        }
    }}
/>
```
<img alt="line_chart" src="/documentation_images/md__how_to_modify_app__2.png" width="70%" height="70%">

<p>&nbsp;</p>

![Static Badge](https://img.shields.io/badge/Point_3-How_to_modify_this_app-blue)

The plot will change when we change the `data` and `layout` in the `<Plot/>` component. 

So you can modify the `data` and the `layout` to make different plots such as bar chart, line chart, scatter plot, etc.

As an example, you can read: 
- The function `generateScreePlot()` in `/frontend/app/page.js` to see the way frontend sends request to backend

AND 

- The file `generateScreePlot.py` in `/backend/generatePCA.py` to see the way backend calculates, generates `data` and `layout` to return back to frontend  

So the `data` and `layout` can be modified in the backend python files depending on what types of chart that you want to generate. 

<p>&nbsp;</p>

![Static Badge](https://img.shields.io/badge/Point_4-Reference-blue)

More information about `data` and `layout` of `<Plot/>` component can be found here:

- General information: https://github.com/plotly/react-plotly.js?tab=readme-ov-file
- `data`: https://plotly.com/javascript/reference/
- `layout`: https://plotly.com/javascript/reference/#layout
