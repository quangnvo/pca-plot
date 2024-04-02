# PCA Generator

- [Home](README.md)
- [Features](features.md)
- [Infrastructure](infrastructure.md)
- [Install for dev](install_for_dev.md)
- [Install for production](install_for_production.md)
- [Integrate with Micromix](integrate_with_micromix.md)
- **[How to modify this app to create another Micromix enabled app](how_to_modify_this_app_to_create_another_micromix_enabled_app.md)**

## How to modify this app to create another Micromix enabled app

Basically, the plot will change when we change the `data` and `layout` in the `<Plot />` component.

So you can modify the `data` and the `layout` to make different plots such as bar chart, 

The `<Plot />` component has the format as the following:

```javascript
<Plot
    data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]},
    layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }

```

Things that should change

Things should stay the same

Refer this link to React Plotly: https://plotly.com/javascript/react/
