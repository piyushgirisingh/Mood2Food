# Base image
FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Copy files into container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set default command to run your script
CMD ["python", "atemp_script.py"]