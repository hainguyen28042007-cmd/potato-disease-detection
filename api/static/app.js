const input = document.querySelector("#image-input");
const dropArea = document.querySelector("#drop-area");
const preview = document.querySelector("#preview");
const previewImage = document.querySelector("#preview-image");
const previewName = document.querySelector("#preview-name");
const previewSize = document.querySelector("#preview-size");
const analyzeButton = document.querySelector("#analyze-button");
const errorMessage = document.querySelector("#error-message");
const result = document.querySelector("#result");
let selectedFile = null;
let previewUrl = null;

const classLabels = {
  Potato___Early_blight: "Bệnh đốm lá sớm",
  Potato___Late_blight: "Bệnh mốc sương",
  Potato___healthy: "Lá khỏe mạnh",
};

function setError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.toggle("hidden", !message);
}

function chooseFile(file) {
  setError("");
  result.classList.add("hidden");

  if (!file) return;
  if (!["image/jpeg", "image/png", "image/bmp"].includes(file.type)) {
    selectedFile = null;
    preview.classList.add("hidden");
    analyzeButton.disabled = true;
    setError("Định dạng ảnh chưa được hỗ trợ. Vui lòng chọn JPG, PNG hoặc BMP.");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    selectedFile = null;
    preview.classList.add("hidden");
    analyzeButton.disabled = true;
    setError("Ảnh vượt quá 10 MB. Vui lòng chọn ảnh nhỏ hơn.");
    return;
  }

  selectedFile = file;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  previewImage.src = previewUrl;
  previewName.textContent = file.name;
  previewSize.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  preview.classList.remove("hidden");
  analyzeButton.disabled = false;
}

input.addEventListener("change", () => chooseFile(input.files[0]));

document.querySelector("#remove-image").addEventListener("click", () => {
  selectedFile = null;
  input.value = "";
  preview.classList.add("hidden");
  result.classList.add("hidden");
  analyzeButton.disabled = true;
  setError("");
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
});

for (const eventName of ["dragenter", "dragover"]) {
  dropArea.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropArea.classList.add("dragging");
  });
}
for (const eventName of ["dragleave", "drop"]) {
  dropArea.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragging");
  });
}
dropArea.addEventListener("drop", (event) => chooseFile(event.dataTransfer.files[0]));

analyzeButton.addEventListener("click", async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append("file", selectedFile);
  analyzeButton.disabled = true;
  analyzeButton.classList.add("loading");
  analyzeButton.querySelector(".button-label").textContent = "Đang phân tích...";
  setError("");
  result.classList.add("hidden");

  try {
    const response = await fetch("/predict", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(typeof data.detail === "string" ? data.detail : "Không thể phân tích ảnh.");
    }

    const confidence = Math.round(data.confidence * 100);
    document.querySelector("#result-title").textContent =
      classLabels[data.predicted_class] || data.predicted_class;
    document.querySelector("#result-badge").textContent = `${confidence}% tin cậy`;
    document.querySelector("#confidence-value").textContent = `${confidence}%`;
    document.querySelector("#confidence-bar").style.width = `${confidence}%`;
    result.classList.remove("hidden");
  } catch (error) {
    setError(error.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại.");
  } finally {
    analyzeButton.disabled = !selectedFile;
    analyzeButton.classList.remove("loading");
    analyzeButton.querySelector(".button-label").textContent = "Phân tích ảnh";
  }
});
