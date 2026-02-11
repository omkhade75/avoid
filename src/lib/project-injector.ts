import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Agent } from '@/contexts/AuthContext';

// Minimal embedded widget script template
const WIDGET_TEMPLATE = (agentId: string, agentName: string, primaryColor: string) => `
(function() {
  console.log("Initializing Agent Factory Widget for:", "${agentName}");
  
  // Create styles
  const style = document.createElement('style');
  style.textContent = \`
    #agent-factory-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #agent-factory-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${primaryColor};
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      animation: agent-pulse 2s infinite;
    }
    #agent-factory-button:hover {
      transform: scale(1.1);
    }
    #agent-factory-button svg {
      width: 30px;
      height: 30px;
      color: white;
    }
    @keyframes agent-pulse {
      0% { box-shadow: 0 0 0 0 rgba(255, 0, 150, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(255, 0, 150, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 0, 150, 0); }
    }
  \`;
  document.head.appendChild(style);

  // Create button
  const container = document.createElement('div');
  container.id = 'agent-factory-widget';
  
  const button = document.createElement('div');
  button.id = 'agent-factory-button';
  button.innerHTML = \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M4 9v2a8 8 0 0 0 16 0V9"/><path d="M2 13h2"/><path d="M20 13h2"/><path d="M12 22v-3"/><path d="M8 22h8"/></svg>\`;
  
  button.onclick = () => {
    alert("I am ${agentName}. Integration complete! Connect me to your backend api to start conversation.");
    // In a real implementation, this would open a chat modal or Vapi call interface
  };

  container.appendChild(button);
  document.body.appendChild(container);
})();
`;

export const integrateAgentToProject = async (file: File, agent: Agent) => {
    try {
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(file);

        // 1. Add agent widget script
        const widgetScript = WIDGET_TEMPLATE(agent.id, agent.name, "#db2777");
        zip.file("agent-widget.js", widgetScript);

        // 2. Inject script into index.html
        let htmlFile = loadedZip.file("index.html");
        if (!htmlFile) {
            // Try inside standard folders like public/ or src/ if root index.html is missing
            const files = Object.keys(loadedZip.files);
            const indexHtmlPath = files.find(path => path.endsWith('index.html'));
            if (indexHtmlPath) {
                htmlFile = loadedZip.file(indexHtmlPath);
            }
        }

        if (htmlFile) {
            let content = await htmlFile.async("string");

            if (!content.includes("agent-widget.js")) {
                // Inject just before </body>
                if (content.includes("</body>")) {
                    content = content.replace("</body>", `<script src="./agent-widget.js"></script>\n  </body>`);
                } else {
                    // If no body tag, append to end
                    content += `\n<script src="./agent-widget.js"></script>`;
                }

                // Update the file in the zip
                zip.file(htmlFile.name, content); // Use original path name
            }
        } else {
            console.warn("No index.html found. Creating one.");
            zip.file("index.html", `<!DOCTYPE html>
<html>
<head><title>My Project with AI</title></head>
<body>
  <h1>Welcome to your AI-integrated project!</h1>
  <script src="./agent-widget.js"></script>
</body>
</html>`);
        }

        // 3. Generate and download new zip
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, `${agent.name.replace(/\s+/g, '_')}_integrated_project.zip`);
        return true;

    } catch (error) {
        console.error("Failed to integrate agent:", error);
        throw error;
    }
};
