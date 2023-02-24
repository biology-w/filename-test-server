const downloadDom = document.querySelector("#download");
downloadDom.addEventListener("click", () => {
  file({
    url: `/download`,
    responseType: "arraybuffer",
  });
});

async function file(config) {
  const response = await axios.request(config);
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const contentDisposition = response.headers["content-disposition"];
  console.log(contentDisposition);
//   const filenameDes = "filename*=UTF-8''";
  const filenameDes = "filename=";
  const rawFilename = contentDisposition.substr(
    contentDisposition.indexOf(filenameDes) + filenameDes.length
  );
  const fileName = decodeURIComponent(rawFilename);
  console.log(fileName);
  downloadFile(url, fileName);
  window.setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 3000);
}

function downloadFile(url, fileName, isPreview = false) {
  const link = document.createElement("a");
  if (isPreview) {
    link.target = "_blank";
  } else {
    link.download = fileName;
  }
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
