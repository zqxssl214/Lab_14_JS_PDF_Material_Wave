class ResumeApp {
    constructor() {
      this.resume = document.getElementById('resume');
      this.downloadBtn = document.getElementById('downloadBtn');
      this.editableElements = document.querySelectorAll('.editable');
      this.init();
    }
  
    init() {
      this.loadSavedData();
      this.setupEditableListeners();
      this.setupDownloadButton();
      this.setupRippleEffect();
      setInterval(() => this.saveData(), 30000);
    }
  
    loadSavedData() {
      try {
        const saved = localStorage.getItem('resumeData');
        if (saved) {
          const data = JSON.parse(saved);
          this.editableElements.forEach(el => {
            const field = el.getAttribute('data-field');
            if (field && data[field]) el.textContent = data[field];
          });
        }
      } catch (e) {}
    }
  
    saveData() {
      const data = {};
      this.editableElements.forEach(el => {
        const field = el.getAttribute('data-field');
        if (field) data[field] = el.textContent.trim();
      });
      localStorage.setItem('resumeData', JSON.stringify(data));
    }
  
    setupEditableListeners() {
      this.editableElements.forEach(el => {
        el.addEventListener('focus', () => el.classList.add('editing'));
        el.addEventListener('blur', () => {
          el.classList.remove('editing');
          el.style.transform = 'scale(1.02)';
          el.style.transition = 'transform 0.2s';
          setTimeout(() => el.style.transform = 'scale(1)', 200);
          this.saveData();
        });
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            el.blur();
          }
        });
        let timer;
        el.addEventListener('input', () => {
          clearTimeout(timer);
          timer = setTimeout(() => this.saveData(), 1000);
        });
      });
    }
  
    setupDownloadButton() {
      this.downloadBtn.addEventListener('click', () => this.downloadPDF());
    }
  
    downloadPDF() {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert('Разрешите всплывающие окна для скачивания PDF');
        return;
      }
  
      const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>Резюме</title>
        <link rel="stylesheet" href="/css/style.css">
        <style>body{background:white;padding:20px}.download-btn{display:none!important}.editable{border:none!important;padding:0!important;background:none!important}.resume-section{overflow:visible}@media print{@page{margin:15mm;size:A4}body{margin:0}.container{max-width:100%!important;padding:0}}</style>
      </head><body><div class="container"><div class="resume">${this.resume.innerHTML}</div></div></body></html>`;
  
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.onafterprint = () => printWindow.close();
        }, 500);
      };
    }
  
    setupRippleEffect() {
      document.addEventListener('click', e => {
        const target = e.target.closest('.material-wave');
        if (!target) return;
  
        target.querySelectorAll('.ripple').forEach(r => r.remove());
  
        const circle = document.createElement('span');
        const size = Math.max(target.clientWidth, target.clientHeight);
        const rect = target.getBoundingClientRect();
  
        circle.style.width = circle.style.height = `${size}px`;
        circle.style.left = `${e.clientX - rect.left - size/2}px`;
        circle.style.top = `${e.clientY - rect.top - size/2}px`;
        circle.classList.add('ripple');
        target.appendChild(circle);
        circle.addEventListener('animationend', () => circle.remove());
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => new ResumeApp());