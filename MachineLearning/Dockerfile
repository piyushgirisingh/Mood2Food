# Base image
FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Copy files into container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

#expose port
EXPOSE 10000

CMD ["flask", "run", "--host=0.0.0.0", "--port=10000"]