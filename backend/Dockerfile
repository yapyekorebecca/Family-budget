FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Collect static files (SECRET_KEY only needed for this step)
RUN SECRET_KEY=build-only-key python manage.py collectstatic --no-input

# Expose default port
EXPOSE 8000

# Start: migrate then serve
CMD ["sh", "-c", "python manage.py migrate --no-input && exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 60"]
