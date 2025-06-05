document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnIframe").addEventListener("click", function () {
    window.location.reload();
  });

  const url = new URL(window.location.href);
  const queryStrings = url.searchParams;
  const r = queryStrings.get("r");

  if (r && r.length > 0) {
    const base64String = r;
    const decodedString = atob(base64String);

    document.getElementById("embedIframe").setAttribute("src", decodedString);
  }
});
