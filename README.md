# eCertGen

**eCertGen** is a lightweight web application designed to simplify the process of generating electronic certificates. Built using HTML, CSS, and JavaScript, it allows users to upload a list of recipient names and generate certificates automatically with a customizable template.

## ✨ Features

- ✅ Bulk certificate generation from a CSV file
- 🎨 Customizable certificate background (JPG format)
- 🖱️ User-friendly interface with drag-and-drop support
- 💻 Runs entirely in the browser (no server required)
- 📦 Download all certificates as images

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mooyi07/eCertGen.git
cd eCertGen
```

### 2. Open in Browser

Open the `index.html` file directly in your web browser.

> No build tools or installation required.

## 📄 Usage

1. **Prepare Your CSV File**  
   The file should contain a column of names like this:

   ```csv
   Name
   Alice Johnson
   Bob Smith
   Charlie Brown
   ```

2. **Customize Your Certificate Template**  
   Replace `sample_cert.jpg` with your own certificate design.  
   Make sure the dimensions match your desired layout.

3. **Generate Certificates**  
   - Upload your CSV file.
   - Click the **Generate Certificates** button.
   - Download each certificate individually or use a batch download extension.

## 🗂 Project Structure

```
eCertGen/
├── index.html         # Main app UI
├── styles.css         # Application styles
├── script.js          # Logic for generation
├── sample.csv         # Sample data file
├── sample_cert.jpg    # Default certificate background
└── logo.png           # App logo (optional)
```

## 📌 Notes

- This app works fully offline.
- All data is processed locally — no information is uploaded to a server.

## 🤝 Contributing

Feel free to fork this repository and submit a pull request! Contributions, bug reports, and feature suggestions are welcome.

## 📄 License

This project is licensed under the MIT License.
