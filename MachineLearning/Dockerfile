FROM python:3.10

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

ENV PORT=10000
EXPOSE $PORT

CMD ["python", "app.py"]