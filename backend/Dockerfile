FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --no-input

# Expose port (Railway sets $PORT at runtime)
EXPOSE 8000

# Run migrations then start Gunicorn
CMD sh -c "python manage.py migrate --no-input && gunicorn backend.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 60"
