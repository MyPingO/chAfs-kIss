from backend.app import app

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=25565)