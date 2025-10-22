document.addEventListener('DOMContentLoaded', () => {
  const actionBtn = document.getElementById('actionBtn');
  const output = document.getElementById('output');

  if (!actionBtn || !output) return;

  actionBtn.addEventListener('click', () => {
    const now = new Date().toLocaleString();
    output.textContent = `按钮已点击: ${now}`;
  });
});


