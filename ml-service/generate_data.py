import pandas as pd
import numpy as np


ROWS = 300


def calculate_priority(case_age_days, crime_severity, is_undertrial, victim_vulnerable):
    age_score = min((case_age_days / 365) * 30, 30)
    severity_score = crime_severity * 8
    undertrial_bonus = 20 if is_undertrial == 1 else 0
    vulnerable_bonus = 15 if victim_vulnerable == 1 else 0

    total = age_score + severity_score + undertrial_bonus + vulnerable_bonus
    return min(int(total), 100)

data = {
    "case_age_days": np.random.randint(1, 1001, ROWS),
    "crime_severity": np.random.randint(1, 6, ROWS),
    "is_undertrial": np.random.randint(0, 2, ROWS),
    "victim_vulnerable": np.random.randint(0, 2, ROWS),
}

df = pd.DataFrame(data)

df["priority_score"] = df.apply(
    lambda row: calculate_priority(
        row["case_age_days"],
        row["crime_severity"],
        row["is_undertrial"],
        row["victim_vulnerable"],
    ),
    axis=1,
)

df.to_csv("cases_data.csv", index=False)

print("cases_data.csv generated with", len(df), "rows")
    



