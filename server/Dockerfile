FROM python:3.9.5

WORKDIR /backend

RUN pip install --no-cache-dir -U pip

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD gunicorn -b 0.0.0.0:5000 run
