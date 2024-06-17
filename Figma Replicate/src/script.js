function Enviar() {
  
    const form = document.getElementById("form1");
    const formData = new FormData(form);
  
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
}