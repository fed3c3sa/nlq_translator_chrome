# NLQ Translator Chrome Extension

A Chrome extension that translates natural language queries into Elasticsearch queries, helping users interact with Elasticsearch more intuitively.

## Features

- **Natural Language to Elasticsearch Query Translation**: Convert plain English questions into complex Elasticsearch queries
- **Query Fixing**: Troubleshoot and fix broken Elasticsearch queries
- **Query Improvement**: Enhance existing queries for better performance or functionality
- **Custom Mapping Support**: Configure with your specific Elasticsearch mappings
- **Secure API Key Storage**: Locally stored OpenAI API key for secure operation

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation
1. Download the latest release from the [Releases](https://https://github.com/fed3c3sa/nlq_translator_chrome) page
2. Unzip the downloaded file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" by toggling the switch in the top right corner
5. Click "Load unpacked" and select the unzipped extension directory
6. The extension icon should now appear in your browser toolbar

## Usage

### Initial Setup
1. Click on the NLQ Translator icon in your Chrome toolbar
2. Navigate to the "Settings" tab
3. Enter your OpenAI API key
4. (Optional) Add your Elasticsearch mapping in JSON format
5. Click "Save Settings" and check "Save settings for future use" to persist your configuration

### Translating Natural Language to Elasticsearch Queries
1. Navigate to the "Translate" tab
2. Enter your natural language question (e.g., "Find all documents about climate change published in the last year")
3. Click "Translate"
4. The generated Elasticsearch query will appear in the result section
5. Use the "Copy" button to copy the query to your clipboard

### Fixing Broken Queries
1. Navigate to the "Fix" tab
2. Paste the Elasticsearch query that needs fixing
3. (Optional) Add the error message you're receiving
4. Click "Fix Query"
5. The corrected query will appear in the result section

### Improving Existing Queries
1. Navigate to the "Improve" tab
2. Paste the Elasticsearch query you want to improve
3. Specify your improvement goal (e.g., "Add filters for better performance")
4. Click "Improve Query"
5. The enhanced query will appear in the result section

## Compatibility

This extension is designed to work with Elasticsearch deployments on elastic-cloud.com domains. It's compatible with:
- Chrome browser (version 88 and above)
- Elasticsearch 7.x and 8.x

## Development

### Prerequisites
- Node.js and npm

### Setup
1. Clone this repository
```
git clone https://github.com/yourusername/nlq-translator-chrome-extension.git
cd nlq-translator-chrome-extension
```

2. Install dependencies (if any)
```
npm install
```

3. Load the extension in Chrome for testing:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension directory

### Building
To create SVG icons from the source:
```
node create_icons.js
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- Uses Bootstrap for UI components
- Powered by OpenAI's API for natural language processing
