// Popup.js - Main JavaScript for NLQ Translator Chrome Extension

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const translateButton = document.getElementById('translateButton');
    const fixButton = document.getElementById('fixButton');
    const improveButton = document.getElementById('improveButton');
    const saveSettingsButton = document.getElementById('saveSettingsButton');
    const copyButton = document.getElementById('copyButton');
    const apiKeyInput = document.getElementById('apiKey');
    const mappingJsonInput = document.getElementById('mappingJson');
    const saveSettingsCheckbox = document.getElementById('saveSettings');
    const resultQueryTextarea = document.getElementById('resultQuery');
    const statusMessage = document.getElementById('statusMessage');
    const naturalLanguageQueryInput = document.getElementById('naturalLanguageQuery');
    const queryToFixInput = document.getElementById('queryToFix');
    const errorMessageInput = document.getElementById('errorMessage');
    const queryToImproveInput = document.getElementById('queryToImprove');
    const improvementGoalInput = document.getElementById('improvementGoal');
    
    // Load all saved data
    loadAllData();
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Save active tab
            chrome.storage.sync.set({ activeTab: tabId });
        });
    });
    
    // Translate button click handler
    translateButton.addEventListener('click', function() {
        const naturalLanguageQuery = naturalLanguageQueryInput.value.trim();
        
        if (!naturalLanguageQuery) {
            showStatus('Please enter a natural language query', 'alert-danger');
            return;
        }
        
        // Get API key and mapping
        const apiKey = apiKeyInput.value.trim();
        let mapping = null;
        
        try {
            const mappingText = mappingJsonInput.value.trim();
            if (mappingText) {
                mapping = JSON.parse(mappingText);
            }
        } catch (error) {
            showStatus('Invalid mapping JSON: ' + error.message, 'alert-danger');
            return;
        }
        
        // Show loading status
        showStatus('Translating query...', 'alert-info');
        
        // Save the query for persistence
        saveInputData();
        
        // Call the translation API using the exact same prompting logic as the original package
        translateQueryWithOriginalLogic(naturalLanguageQuery, apiKey, mapping)
            .then(result => {
                resultQueryTextarea.value = JSON.stringify(result, null, 2);
                showStatus('Translation successful!', 'alert-success');
                
                // Save the result
                chrome.storage.sync.set({ lastResult: resultQueryTextarea.value });
            })
            .catch(error => {
                showStatus('Translation failed: ' + error.message, 'alert-danger');
            });
    });
    
    // Fix button click handler
    fixButton.addEventListener('click', function() {
        const queryToFix = queryToFixInput.value.trim();
        const errorMessage = errorMessageInput.value.trim();
        
        if (!queryToFix) {
            showStatus('Please enter a query to fix', 'alert-danger');
            return;
        }
        
        // Parse query
        let query;
        try {
            query = JSON.parse(queryToFix);
        } catch (error) {
            showStatus('Invalid query JSON: ' + error.message, 'alert-danger');
            return;
        }
        
        // Get API key and mapping
        const apiKey = apiKeyInput.value.trim();
        let mapping = null;
        
        try {
            const mappingText = mappingJsonInput.value.trim();
            if (mappingText) {
                mapping = JSON.parse(mappingText);
            }
        } catch (error) {
            showStatus('Invalid mapping JSON: ' + error.message, 'alert-danger');
            return;
        }
        
        // Show loading status
        showStatus('Fixing query...', 'alert-info');
        
        // Save the input data for persistence
        saveInputData();
        
        // Call the fix API using the exact same prompting logic as the original package
        fixQueryWithOriginalLogic(query, errorMessage, apiKey, mapping)
            .then(result => {
                resultQueryTextarea.value = JSON.stringify(result, null, 2);
                showStatus('Query fixed successfully!', 'alert-success');
                
                // Save the result
                chrome.storage.sync.set({ lastResult: resultQueryTextarea.value });
            })
            .catch(error => {
                showStatus('Query fix failed: ' + error.message, 'alert-danger');
            });
    });
    
    // Improve button click handler
    improveButton.addEventListener('click', function() {
        const queryToImprove = queryToImproveInput.value.trim();
        const improvementGoal = improvementGoalInput.value.trim();
        
        if (!queryToImprove) {
            showStatus('Please enter a query to improve', 'alert-danger');
            return;
        }
        
        // Parse query
        let query;
        try {
            query = JSON.parse(queryToImprove);
        } catch (error) {
            showStatus('Invalid query JSON: ' + error.message, 'alert-danger');
            return;
        }
        
        // Get API key and mapping
        const apiKey = apiKeyInput.value.trim();
        let mapping = null;
        
        try {
            const mappingText = mappingJsonInput.value.trim();
            if (mappingText) {
                mapping = JSON.parse(mappingText);
            }
        } catch (error) {
            showStatus('Invalid mapping JSON: ' + error.message, 'alert-danger');
            return;
        }
        
        // Show loading status
        showStatus('Improving query...', 'alert-info');
        
        // Save the input data for persistence
        saveInputData();
        
        // Call the improve API using the exact same prompting logic as the original package
        improveQueryWithOriginalLogic(query, improvementGoal, apiKey, mapping)
            .then(result => {
                resultQueryTextarea.value = JSON.stringify(result, null, 2);
                showStatus('Query improved successfully!', 'alert-success');
                
                // Save the result
                chrome.storage.sync.set({ lastResult: resultQueryTextarea.value });
            })
            .catch(error => {
                showStatus('Query improvement failed: ' + error.message, 'alert-danger');
            });
    });
    
    // Save settings button click handler
    saveSettingsButton.addEventListener('click', function() {
        const apiKey = apiKeyInput.value.trim();
        const mappingJson = mappingJsonInput.value.trim();
        const saveSettings = saveSettingsCheckbox.checked;
        
        // Validate mapping JSON if provided
        if (mappingJson) {
            try {
                JSON.parse(mappingJson);
            } catch (error) {
                showStatus('Invalid mapping JSON: ' + error.message, 'alert-danger');
                return;
            }
        }
        
        // Save settings if checkbox is checked
        if (saveSettings) {
            chrome.storage.sync.set({
                apiKey: apiKey,
                mappingJson: mappingJson,
                saveSettings: true
            }, function() {
                showStatus('Settings saved successfully!', 'alert-success');
            });
        } else {
            // Clear saved settings but keep the current session
            chrome.storage.sync.set({
                saveSettings: false
            }, function() {
                showStatus('Settings will not be saved for future sessions', 'alert-info');
            });
        }
    });
    
    // Copy button click handler
    copyButton.addEventListener('click', function() {
        resultQueryTextarea.select();
        document.execCommand('copy');
        
        // Show temporary success message
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
    });
    
    // Save input data whenever it changes
    naturalLanguageQueryInput.addEventListener('input', debounce(saveInputData, 500));
    queryToFixInput.addEventListener('input', debounce(saveInputData, 500));
    errorMessageInput.addEventListener('input', debounce(saveInputData, 500));
    queryToImproveInput.addEventListener('input', debounce(saveInputData, 500));
    improvementGoalInput.addEventListener('input', debounce(saveInputData, 500));
    
    // Load all saved data from Chrome storage
    function loadAllData() {
        chrome.storage.sync.get([
            'apiKey', 
            'mappingJson', 
            'saveSettings',
            'naturalLanguageQuery',
            'queryToFix',
            'errorMessage',
            'queryToImprove',
            'improvementGoal',
            'lastResult',
            'activeTab'
        ], function(result) {
            // Load settings
            if (result.apiKey) {
                apiKeyInput.value = result.apiKey;
            }
            
            if (result.mappingJson) {
                mappingJsonInput.value = result.mappingJson;
            }
            
            if (result.saveSettings !== undefined) {
                saveSettingsCheckbox.checked = result.saveSettings;
            }
            
            // Load input data
            if (result.naturalLanguageQuery) {
                naturalLanguageQueryInput.value = result.naturalLanguageQuery;
            }
            
            if (result.queryToFix) {
                queryToFixInput.value = result.queryToFix;
            }
            
            if (result.errorMessage) {
                errorMessageInput.value = result.errorMessage;
            }
            
            if (result.queryToImprove) {
                queryToImproveInput.value = result.queryToImprove;
            }
            
            if (result.improvementGoal) {
                improvementGoalInput.value = result.improvementGoal;
            }
            
            // Load last result
            if (result.lastResult) {
                resultQueryTextarea.value = result.lastResult;
            }
            
            // Set active tab
            if (result.activeTab) {
                // Find the button for this tab
                const tabButton = document.querySelector(`.tab-button[data-tab="${result.activeTab}"]`);
                if (tabButton) {
                    // Simulate a click on the button
                    tabButton.click();
                }
            }
        });
    }
    
    // Save input data to Chrome storage
    function saveInputData() {
        const data = {
            naturalLanguageQuery: naturalLanguageQueryInput.value,
            queryToFix: queryToFixInput.value,
            errorMessage: errorMessageInput.value,
            queryToImprove: queryToImproveInput.value,
            improvementGoal: improvementGoalInput.value
        };
        
        chrome.storage.sync.set(data);
    }
    
    // Show status message
    function showStatus(message, className) {
        statusMessage.textContent = message;
        statusMessage.className = 'alert ' + className;
        statusMessage.style.display = 'block';
        
        // Hide status after 5 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
    
    // Debounce function to limit how often a function is called
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // API Functions - Using the exact same prompting logic as the original Python package
    
    // Function to translate natural language to Elasticsearch query using OpenAI
    async function translateQueryWithOriginalLogic(naturalLanguage, apiKey, mapping) {
        // If no API key is provided, prompt the user
        if (!apiKey) {
            apiKey = prompt("Please enter your OpenAI API key:");
            if (!apiKey) {
                throw new Error("API key is required");
            }
            
            // Ask if user wants to save the API key
            if (confirm("Would you like to save this API key for future use?")) {
                apiKeyInput.value = apiKey;
                saveSettingsCheckbox.checked = true;
                chrome.storage.sync.set({ 
                    apiKey: apiKey,
                    saveSettings: true
                });
            }
        }
        
        // Construct the prompt exactly as in the original Python package
        const systemPrompt = `You are an expert in Elasticsearch query DSL. 
Your task is to translate natural language queries into Elasticsearch query DSL JSON.
Always respond with valid JSON only, no explanations or markdown.
The JSON should be a complete Elasticsearch query object with a "query" field at the root.`;

        const userPrompt = `Translate the following natural language query to Elasticsearch query DSL:
"${naturalLanguage}"

${mapping ? `Use the following Elasticsearch mapping for context:
${JSON.stringify(mapping, null, 2)}` : ''}`;

        // Call OpenAI API directly, just like the original package does
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.1
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Error calling OpenAI API");
            }
            
            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // Parse the response as JSON, handling potential markdown formatting
            try {
                return JSON.parse(content);
            } catch (e) {
                // Try to extract JSON from the response if it contains markdown
                const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/({[\s\S]*})/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[1]);
                }
                throw new Error("Could not parse response as JSON");
            }
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            throw error;
        }
    }
    
    // Function to fix Elasticsearch query using OpenAI
    async function fixQueryWithOriginalLogic(query, errorMessage, apiKey, mapping) {
        // If no API key is provided, prompt the user
        if (!apiKey) {
            apiKey = prompt("Please enter your OpenAI API key:");
            if (!apiKey) {
                throw new Error("API key is required");
            }
            
            // Ask if user wants to save the API key
            if (confirm("Would you like to save this API key for future use?")) {
                apiKeyInput.value = apiKey;
                saveSettingsCheckbox.checked = true;
                chrome.storage.sync.set({ 
                    apiKey: apiKey,
                    saveSettings: true
                });
            }
        }
        
        // Convert query to string if it's a dictionary
        const queryStr = JSON.stringify(query, null, 2);
        
        // Construct the prompt exactly as in the original Python package
        const systemPrompt = `You are an expert in Elasticsearch query DSL. 
Your task is to fix errors in Elasticsearch query DSL JSON.
Always respond with valid JSON only, no explanations or markdown.
The JSON should be a complete Elasticsearch query object with a "query" field at the root.`;

        const userPrompt = `Fix the following Elasticsearch query:
${queryStr}

${errorMessage ? `Error message: ${errorMessage}` : ''}

${mapping ? `Use the following Elasticsearch mapping for context:
${JSON.stringify(mapping, null, 2)}` : ''}`;

        // Call OpenAI API directly, just like the original package does
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.1
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Error calling OpenAI API");
            }
            
            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // Parse the response as JSON, handling potential markdown formatting
            try {
                return JSON.parse(content);
            } catch (e) {
                // Try to extract JSON from the response if it contains markdown
                const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/({[\s\S]*})/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[1]);
                }
                throw new Error("Could not parse response as JSON");
            }
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            throw error;
        }
    }
    
    // Function to improve Elasticsearch query using OpenAI
    async function improveQueryWithOriginalLogic(query, improvementGoal, apiKey, mapping) {
        // If no API key is provided, prompt the user
        if (!apiKey) {
            apiKey = prompt("Please enter your OpenAI API key:");
            if (!apiKey) {
                throw new Error("API key is required");
            }
            
            // Ask if user wants to save the API key
            if (confirm("Would you like to save this API key for future use?")) {
                apiKeyInput.value = apiKey;
                saveSettingsCheckbox.checked = true;
                chrome.storage.sync.set({ 
                    apiKey: apiKey,
                    saveSettings: true
                });
            }
        }
        
        // Convert query to string if it's a dictionary
        const queryStr = JSON.stringify(query, null, 2);
        
        // Construct the prompt exactly as in the original Python package
        const systemPrompt = `You are an expert in Elasticsearch query DSL. 
Your task is to improve Elasticsearch query DSL JSON for better performance or results.
Always respond with valid JSON only, no explanations or markdown.
The JSON should be a complete Elasticsearch query object with a "query" field at the root.`;

        const userPrompt = `Improve the following Elasticsearch query:
${queryStr}

${improvementGoal ? `Improvement goal: ${improvementGoal}` : ''}

${mapping ? `Use the following Elasticsearch mapping for context:
${JSON.stringify(mapping, null, 2)}` : ''}`;

        // Call OpenAI API directly, just like the original package does
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.1
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Error calling OpenAI API");
            }
            
            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // Parse the response as JSON, handling potential markdown formatting
            try {
                return JSON.parse(content);
            } catch (e) {
                // Try to extract JSON from the response if it contains markdown
                const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/({[\s\S]*})/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[1]);
                }
                throw new Error("Could not parse response as JSON");
            }
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            throw error;
        }
    }
});
