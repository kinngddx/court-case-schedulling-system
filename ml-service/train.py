
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib


# //data load kro
df = pd.read_csv("cases_data.csv")

X = df[
    ["case_age_days", "crime_severity", "is_undertrial", "victim_vulnerable"]
]
y = df["priority_score"]


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)
model.fit(X_train, y_train)

joblib.dump(model, "priority_model.pkl")

print("Model trained and saved as priority_model.pkl")
