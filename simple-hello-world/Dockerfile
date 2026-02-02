ARG BUILD_FROM
FROM $BUILD_FROM

# Install Python and required packages
RUN apk add --no-cache \
    python3 \
    py3-pip

# Set working directory
WORKDIR /app

# Copy application files
COPY run.sh /
COPY app.py /app/

# Make run script executable
RUN chmod a+x /run.sh

# Expose port
EXPOSE 8080

# Run the application
CMD ["/run.sh"]
