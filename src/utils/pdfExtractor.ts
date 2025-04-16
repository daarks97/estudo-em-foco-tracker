
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
const pdfjsWorker = '//cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extracts text from a PDF file
 * @param arquivo PDF file to extract text from
 * @returns Extracted text as a string
 */
export const extrairTextoDoPDF = async (arquivo: File): Promise<string> => {
  if (!arquivo) {
    return '';
  }

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(arquivo);
    
    fileReader.onload = async (event) => {
      try {
        // Ensure we're handling the result as an ArrayBuffer
        const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);
        const pdf = await pdfjs.getDocument(typedArray).promise;
        
        let fullText = '';
        
        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const textItems = textContent.items
            .filter(item => 'str' in item) // Filter only items that have the 'str' property
            .map(item => item.str); // Access str property directly
          fullText += textItems.join(' ') + '\n';
        }
        
        resolve(fullText);
      } catch (error) {
        console.error('Erro ao extrair texto do PDF:', error);
        reject(error);
      }
    };
    
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
