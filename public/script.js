// script.js
document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  const widthInput = document.getElementById("width");
  const heightInput = document.getElementById("height");
  const sizeInput = document.getElementById("size");
  const compressBtn = document.getElementById("compressBtn");
  const downloadLink = document.getElementById("downloadLink");
  const compressedImage = document.getElementById("compressedImage");

  fileInput.addEventListener("change", handleFileUpload);
  compressBtn.addEventListener("click", handleCompression);
  widthInput.addEventListener("change", handleDimensionChange);
  heightInput.addEventListener("change", handleDimensionChange);

  function handleDimensionChange() {
    const originalWidth = parseInt(widthInput.value);
    const originalHeight = parseInt(heightInput.value);

    if (isNaN(originalWidth) || isNaN(originalHeight)) {
      return;
    }

    if (this.id === "width") {
      const newHeight = Math.round(
        (originalHeight / originalWidth) * parseInt(this.value)
      );
      heightInput.value = newHeight;
    } else if (this.id === "height") {
      const newWidth = Math.round(
        (originalWidth / originalHeight) * parseInt(this.value)
      );
      widthInput.value = newWidth;
    }
  }

  function handleFileUpload() {
    const file = fileInput.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        widthInput.value = img.width;
        heightInput.value = img.height;
        sizeInput.value = `${(file.size / 1024).toFixed(2)}`;
      };
    }
  }

  function handleCompression() {
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    // console.log(sizeInput.value);

    if (widthInput.value && heightInput.value && sizeInput.value) {
      formData.append("width", widthInput.value);
      formData.append("height", heightInput.value);
      formData.append("size", sizeInput.value);
    } else {
      return alert("Please provide width and height and size.");
    }

    fetch("/compress", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        //  view image
        compressedImage.src = downloadUrl;
        compressedImage.style.maxWidth = "100%";
        compressedImage.style.display = "block";

        // download image

        downloadLink.href = downloadUrl;
        downloadLink.style.display = "block";
      })
      .catch((error) => console.error("Error compressing image:", error));
  }
});
