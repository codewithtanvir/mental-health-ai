# Mental Health AI - Production Deployment

FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt || echo "No requirements.txt found"

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/ || exit 1

# Run the application
CMD ["python", "server.py"]
