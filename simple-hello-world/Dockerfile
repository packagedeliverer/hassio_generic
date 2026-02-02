ARG BUILD_FROM
FROM $BUILD_FROM

# Install Node.js and npm
RUN apk add --no-cache \
    nodejs \
    npm

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY run.sh /
COPY server.js ./

# Make run script executable
RUN chmod a+x /run.sh

# Expose port
EXPOSE 3000

# Run the application
CMD ["/run.sh"]