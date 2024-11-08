#!/bin/bash

# Array of Swagger JSON file URLs
SWAGGER_URLS=(
    "http://localhost:3002/swagger/json"
)

# Destination folder for the generated types
OUTPUT_DIR="./src/api"

# Name of the output file for the generated types
OUTPUT_FILE="apiTypes.ts"

# Loop through each URL and generate the types
for SWAGGER_URL in "${SWAGGER_URLS[@]}"; do
    echo "Downloading Swagger file from $SWAGGER_URL..."
    
    # Download the Swagger JSON file
    curl -o swagger.json "$SWAGGER_URL"
    
    # Check if the download was successful
    if [ $? -eq 0 ]; then
        echo "Swagger file successfully downloaded from $SWAGGER_URL."
        
        # Extract the service name from the info.title field in the Swagger file
        SERVICE_NAME=$(jq -r '.info.title' swagger.json)

        # If there's no title, generate a fallback name based on the URL
        if [ -z "$SERVICE_NAME" ]; then
            echo "Unable to extract the title from the Swagger file for $SWAGGER_URL. Using fallback name."

            # Extract the host from the URL (without the protocol http:// or https:// and without the port)
            DOMAIN=$(echo "$SWAGGER_URL" | sed -E 's|https?://([^:/]+).*|\1|')

            # Use the domain (without the port) as the service name
            SERVICE_NAME="${DOMAIN}"
        fi

        # Create a specific folder for each service if it doesn't exist already
        mkdir -p "$OUTPUT_DIR/$SERVICE_NAME"
        
        # Generate the TypeScript types from the downloaded Swagger JSON file
        echo "Generating TypeScript types for $SERVICE_NAME..."
        npx swagger-typescript-api -p ./swagger.json -o "$OUTPUT_DIR/$SERVICE_NAME" -n "$OUTPUT_FILE"
        
        # Clean up the temporary Swagger file
        rm swagger.json
    else
        echo "Error retrieving the Swagger file from $SWAGGER_URL. Please check the URL."
        exit 1
    fi
done
