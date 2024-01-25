import pandas as pd
from sklearn import datasets

iris = datasets.load_iris()

df = pd.DataFrame(
    iris.data,
    columns=iris.feature_names
)

df['target'] = iris.target

# Map targets to target names
target_names = {
    0: 'setosa',
    1: 'versicolor',
    2: 'virginica'
}

df['target_names'] = df['target'].map(target_names)
print(df.head(10))
