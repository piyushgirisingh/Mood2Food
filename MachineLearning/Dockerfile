FROM python:3.10

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

ENV PORT=10000
EXPOSE $PORT

CMD ["flask", "run", "--host=0.0.0.0", "--port=$PORT"]