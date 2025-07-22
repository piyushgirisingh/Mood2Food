# Start from Python base image
FROM python:3.10

# Set working directory
WORKDIR /app

# Copy your project files into the container
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=10000

# Expose the port
EXPOSE 10000

# Run the Flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=10000"]