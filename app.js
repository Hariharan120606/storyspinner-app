import React, { useState } from "react";

// Use the global azblob object from the window object
const ContainerClient = window.azblob && window.azblob.ContainerClient;
if (!ContainerClient) {
  console.error("azblob is not defined. Please ensure the script tag is added to index.html.");
}

// Your updated SAS URL for the "uploads" container
const containerSASUrl = "https://storyspinnerstorage.blob.core.windows.net/uploads?sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-03-28T22:40:19Z&st=2025-03-28T14:40:19Z&spr=https,http&sig=9i3QwFHFHroSPomSCxBTGuNhiqtX%2BP5CcqADBVXXBPk%3D";

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    setUploading(true);
    try {
      // Create a ContainerClient using your SAS URL
      const containerClient = new ContainerClient(containerSASUrl);
      // Create a BlockBlobClient for the file with its name
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      // Upload the file from the browser
      await blockBlobClient.uploadBrowserData(file);
      // Construct the file URL: remove the SAS query, then append the file name
      const fileURL = containerSASUrl.split('?')[0] + '/' + file.name;
      setDownloadURL(fileURL);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed! Check the console for details.");
    }
    setUploading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>File Upload to Azure Blob Storage</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={uploading} style={{ marginLeft: "10px" }}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {downloadURL && (
        <div style={{ marginTop: "20px" }}>
          <p>File uploaded successfully!</p>
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            Download File
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
