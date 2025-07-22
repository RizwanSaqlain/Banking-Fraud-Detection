from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler

def extract_features(df):
    if len(df) < 2:
        # Not enough data to compute velocity/acceleration
        return pd.DataFrame([{
            'mean_velocity': 0,
            'std_velocity': 0,
            'mean_acceleration': 0,
            'std_acceleration': 0,
            'total_duration': df['time_ms'].iloc[-1] if len(df) > 0 else 0,
            'num_points': len(df)
        }])

    x = df['x'].values
    y = df['y'].values
    t = df['time_ms'].values

    dx = pd.Series(x).diff().fillna(0)
    dy = pd.Series(y).diff().fillna(0)
    dt = pd.Series(t).diff().replace(0, 1).fillna(1)  # Avoid division by zero

    velocity = ((dx ** 2 + dy ** 2) ** 0.5) / dt
    acceleration = velocity.diff().fillna(0) / dt

    # Replace any NaN values with 0 before calculating stats
    velocity = velocity.replace([float('inf'), float('-inf')], 0).fillna(0)
    acceleration = acceleration.replace([float('inf'), float('-inf')], 0).fillna(0)

    features = {
        'mean_velocity': velocity.mean(),
        'std_velocity': velocity.std(),
        'mean_acceleration': acceleration.mean(),
        'std_acceleration': acceleration.std(),
        'total_duration': df['time_ms'].iloc[-1],
        'num_points': len(df)
    }
    return pd.DataFrame([features])

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# Load Isolation Forest model
model = joblib.load('isolation_forest.pkl')
fraudModel = joblib.load("RandomForestFraudModel2.pkl")


@app.route('/analyze-mouse', methods=['POST'])
def analyze_mouse():
    try:
        movements = request.get_json()
        
        if not movements or not isinstance(movements, list):
            return jsonify({'error': 'Invalid or empty movement data'}), 400

        df = pd.DataFrame(movements)
        if not {'x', 'y', 'time_ms'}.issubset(df.columns):
            return jsonify({'error': 'Missing required fields'}), 400

        features = extract_features(df)

        # Predict anomaly
        anomaly_score = model.decision_function(features)[0]
        is_anomaly = int(model.predict(features)[0] == -1)

        return jsonify({
            'anomaly_score': float(anomaly_score),
            'is_anomaly': bool(is_anomaly)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/predict-fraud", methods=["POST"])
def predict_fraud():
    data = request.get_json()
    print(data)

    input_features = pd.DataFrame([{
        'type': data['type'],
        'amount': data['amount'],
        'oldbalanceOrg': data['oldbalanceOrig'],
        'newbalanceOrig': data['newbalanceOrig'],
        'oldbalanceDest': data['oldbalanceDest'],
        'newbalanceDest': data['newbalanceDest']
    }])

    probability = fraudModel.predict(input_features)[0] # Probability of fraud
    result = "FRAUD" if probability > 0.95 else "NOT FRAUD"

    print(f"Prediction: {result}, Probability: {probability}")
    return jsonify({"prediction": result, "probability": float(probability)})


anomolyModel = joblib.load('anomaly_detection_model.pkl')
label_encoders = joblib.load('label_encoders.pkl')


@app.route('/predict_anomaly_detection', methods=['POST'])
def predict_anomaly_detection():
    data = request.get_json()
    df = pd.DataFrame([data]) if isinstance(data, dict) else pd.DataFrame(data)
    
    # Drop unnecessary columns if present
    drop_cols = [col for col in ['user_id', 'timestamp', 'anomaly_type'] if col in df.columns]
    df_inf = df.drop(columns=drop_cols)
    
    # Encode categorical variables
    categorical_cols = ['ip_class', 'country_code', 'network_type']
    for col in categorical_cols:
        if col in df_inf.columns:
            le = label_encoders[col]
            df_inf[col] = le.transform(df_inf[col])
    
    # Normalize numerical features
    scaler = StandardScaler()
    X_inf = scaler.fit_transform(df_inf.drop(columns=['is_anomaly']) if 'is_anomaly' in df_inf.columns else df_inf)
    
    # Predict
    y_pred = anomolyModel.predict(X_inf)
    y_proba = anomolyModel.predict_proba(X_inf)[:, 1]
    
    result = []
    for i in range(len(y_pred)):
        res = {
            'predicted_is_anomaly': int(y_pred[i]),
            'anomaly_probability': float(y_proba[i])
        }
        if 'is_anomaly' in df.columns:
            res['is_anomaly'] = int(df.iloc[i]['is_anomaly'])
        result.append(res)
    
    return jsonify(result)



if __name__ == '__main__':
    app.run(port=5001,debug=True)