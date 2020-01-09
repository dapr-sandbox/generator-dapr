FROM python:3.7.1-alpine3.8
COPY . /app
WORKDIR /app
RUN pip install flask flask_cors requests
EXPOSE 5000
ENTRYPOINT ["python"]
CMD ["app.py"]