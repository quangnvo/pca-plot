import time

import pandas as pd
import plotly
import plotly.express as px
from flask import Flask

app = Flask(__name__)


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/api/test_plot')
def plot_test():
    df = pd.DataFrame({
        "Fruit": ["Apples", "Oranges", "Bananas", "Apples", "Oranges", "Bananas"],
        "Amount": [4, 1, 2, 2, 4, 5],
        "City": ["SF", "SF", "SF", "Montreal", "Montreal", "Montreal"]
    })
    fig = px.bar(df, x="Fruit", y="Amount", color="City", barmode="group")
    graphJSON = plotly.io.to_json(fig, pretty=True)
    return graphJSON


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
